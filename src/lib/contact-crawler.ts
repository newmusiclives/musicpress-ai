import * as cheerio from "cheerio";
import { prisma } from "./prisma";

// ═══════════════════════════════════════════════════════════════════════════════
// Music Blog Contact Crawler Pipeline
// Discovers music blogs from directories, crawls their contact pages,
// extracts emails, classifies contacts, and imports into the database.
// ═══════════════════════════════════════════════════════════════════════════════

export interface CrawlResult {
  source: string;
  blogsDiscovered: number;
  emailsExtracted: number;
  contactsImported: number;
  errors: string[];
  contacts: DiscoveredContact[];
}

export interface DiscoveredContact {
  name: string;
  email: string;
  outlet: string;
  url: string;
  genre: string;
  region: string;
  type: string;
  beat: string;
  bio: string;
  source: string;
}

interface BlogEntry {
  name: string;
  url: string;
  description?: string;
  genre?: string;
  region?: string;
}

// ─── Email extraction ─────────────────────────────────────────────────────────

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const IGNORED_EMAIL_DOMAINS = [
  "example.com", "sentry.io", "wixpress.com", "w3.org",
  "schema.org", "wordpress.org", "wordpress.com", "gravatar.com",
  "google.com", "facebook.com", "twitter.com", "instagram.com",
  "cloudflare.com", "jsdelivr.net", "googleapis.com", "gstatic.com",
  "apple.com", "microsoft.com", "amazon.com", "youtube.com",
];

const IGNORED_EMAIL_PREFIXES = [
  "noreply", "no-reply", "donotreply", "mailer-daemon",
  "postmaster", "webmaster", "hostmaster", "admin@wordpress",
];

function extractEmails(html: string): string[] {
  const raw = html.match(EMAIL_REGEX) || [];
  const seen = new Set<string>();
  return raw.filter((email) => {
    const lower = email.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    // Filter out non-contact emails
    if (IGNORED_EMAIL_DOMAINS.some((d) => lower.endsWith(`@${d}`))) return false;
    if (IGNORED_EMAIL_PREFIXES.some((p) => lower.startsWith(p))) return false;
    // Filter out image/file extensions masquerading as emails
    if (/\.(png|jpg|jpeg|gif|svg|css|js|webp|ico)$/i.test(lower)) return false;
    return true;
  });
}

// ─── Fetch with timeout and rate limiting ─────────────────────────────────────

const FETCH_TIMEOUT = 12000;
const RATE_LIMIT_MS = 800; // Polite crawling

let lastFetchTime = 0;

async function politelyFetch(url: string): Promise<string | null> {
  const now = Date.now();
  const wait = RATE_LIMIT_MS - (now - lastFetchTime);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastFetchTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "MusicPressAI-ContactCrawler/1.0 (music PR platform; contact-discovery)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// ─── Genre classification via keywords ────────────────────────────────────────

const GENRE_KEYWORDS: Record<string, string[]> = {
  "Electronic": ["electronic", "edm", "synth", "techno", "house", "bass", "dubstep", "dnb", "drum and bass", "ambient", "downtempo"],
  "Hip Hop": ["hip hop", "hiphop", "hip-hop", "rap", "trap", "beats", "mc", "rhyme"],
  "Indie": ["indie", "independent", "diy", "underground"],
  "Rock": ["rock", "guitar", "punk", "grunge", "metal", "hardcore", "emo"],
  "Pop": ["pop", "mainstream", "chart", "top 40"],
  "Folk": ["folk", "acoustic", "singer-songwriter", "americana", "country", "bluegrass"],
  "R&B": ["r&b", "rnb", "soul", "funk", "neo-soul", "motown"],
  "Jazz": ["jazz", "swing", "bebop", "fusion"],
  "Lo-Fi": ["lo-fi", "lofi", "lo fi", "chillhop", "chill"],
  "World": ["world", "afrobeat", "latin", "reggae", "ska", "global"],
  "Classical": ["classical", "orchestral", "chamber", "opera"],
  "Experimental": ["experimental", "avant-garde", "noise", "art rock", "post-"],
};

function classifyGenre(text: string): string {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matches.push(genre);
    }
  }
  return matches.length > 0 ? matches.slice(0, 3).join(", ") : "All Genres";
}

function classifyRegion(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(uk|united kingdom|london|british|england|scotland|wales)\b/.test(lower)) return "UK";
  if (/\b(us|usa|united states|american|new york|los angeles|nashville|austin|chicago|brooklyn)\b/.test(lower)) return "US";
  if (/\b(canada|canadian|toronto|montreal|vancouver)\b/.test(lower)) return "CA";
  if (/\b(australia|australian|sydney|melbourne)\b/.test(lower)) return "AU";
  if (/\b(germany|german|berlin)\b/.test(lower)) return "DE";
  if (/\b(france|french|paris)\b/.test(lower)) return "FR";
  if (/\b(europe|european)\b/.test(lower)) return "EU";
  return "Global";
}

// ─── Contact page discovery ───────────────────────────────────────────────────

const CONTACT_PATHS = [
  "/contact", "/contact-us", "/about", "/about-us", "/submit",
  "/submit-music", "/submissions", "/press", "/music-submit",
  "/send-us-music", "/demo-submissions", "/contact-us/",
  "/about/contact", "/info", "/advertise",
];

async function findContactEmails(blogUrl: string): Promise<{ emails: string[]; bio: string }> {
  let baseUrl = blogUrl.replace(/\/$/, "");
  if (!baseUrl.startsWith("http")) baseUrl = "https://" + baseUrl;

  const allEmails: string[] = [];
  let bio = "";

  // First try the homepage
  const homepage = await politelyFetch(baseUrl);
  if (homepage) {
    allEmails.push(...extractEmails(homepage));
    // Try to get a description from meta tags
    const $ = cheerio.load(homepage);
    bio = $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") || "";
  }

  // Then try common contact page paths
  for (const path of CONTACT_PATHS) {
    const url = baseUrl + path;
    const html = await politelyFetch(url);
    if (html) {
      allEmails.push(...extractEmails(html));
      if (!bio) {
        const $ = cheerio.load(html);
        bio = $('meta[name="description"]').attr("content") ||
          $('meta[property="og:description"]').attr("content") || "";
      }
      // Don't need to try every path once we find emails
      if (allEmails.length >= 2) break;
    }
  }

  // Deduplicate
  const unique = [...new Set(allEmails.map((e) => e.toLowerCase()))];
  return { emails: unique, bio: bio.slice(0, 500) };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE CRAWLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. Feedspot Music Submission Blogs ───────────────────────────────────────

async function crawlFeedspot(): Promise<BlogEntry[]> {
  const urls = [
    "https://weblog.feedspot.com/music-submission-blogs/",
    "https://bloggers.feedspot.com/indie_music_blogs/",
    "https://bloggers.feedspot.com/electronic_music_blogs/",
    "https://bloggers.feedspot.com/hip_hop_blogs/",
  ];

  const blogs: BlogEntry[] = [];

  for (const url of urls) {
    const html = await politelyFetch(url);
    if (!html) continue;

    const $ = cheerio.load(html);

    // Feedspot lists blogs in structured blocks
    $(".tbl_blog_row, .feed-item, [class*='blog-item'], .rss-block").each((_, el) => {
      const $el = $(el);
      const name = $el.find("h2, h3, .tbl_blog_name, .feed-name, a[target='_blank']").first().text().trim();
      const link = $el.find("a[target='_blank']").first().attr("href") || "";
      const desc = $el.find(".tbl_blog_about, .feed-description, p").first().text().trim();

      if (name && link && !link.includes("feedspot.com")) {
        blogs.push({
          name: name.replace(/^\d+\.\s*/, ""),
          url: link,
          description: desc,
          genre: classifyGenre(name + " " + desc),
          region: classifyRegion(name + " " + desc),
        });
      }
    });

    // Also try parsing any structured list
    $("a[target='_blank']").each((_, el) => {
      const $a = $(el);
      const href = $a.attr("href") || "";
      const text = $a.text().trim();
      if (
        text.length > 3 &&
        href.startsWith("http") &&
        !href.includes("feedspot.com") &&
        !href.includes("facebook.com") &&
        !href.includes("twitter.com") &&
        !blogs.some((b) => b.url === href)
      ) {
        const parent = $a.parent().text().trim();
        blogs.push({
          name: text,
          url: href,
          description: parent.slice(0, 200),
          genre: classifyGenre(parent),
          region: classifyRegion(parent),
        });
      }
    });
  }

  return deduplicateBlogs(blogs);
}

// ─── 2. Hype Machine Blog Directory ──────────────────────────────────────────

async function crawlHypeMachine(): Promise<BlogEntry[]> {
  const html = await politelyFetch("https://hypem.com/sites");
  if (!html) return [];

  const $ = cheerio.load(html);
  const blogs: BlogEntry[] = [];

  // Hype Machine lists blogs with links and track counts
  $("a[href*='/site/']").each((_, el) => {
    const $a = $(el);
    const name = $a.text().trim();
    // The blog URL is usually in a sibling or nearby element
    const parentText = $a.parent().text().trim();

    if (name && name.length > 2) {
      blogs.push({
        name,
        url: "", // Will need to resolve from site pages
        description: parentText.slice(0, 200),
        genre: classifyGenre(parentText),
        region: classifyRegion(parentText),
      });
    }
  });

  // Try to find actual blog URLs from the page
  $("a[href^='http']").each((_, el) => {
    const $a = $(el);
    const href = $a.attr("href") || "";
    const text = $a.text().trim();
    if (
      href &&
      !href.includes("hypem.com") &&
      !href.includes("twitter.com") &&
      !href.includes("facebook.com") &&
      text.length > 2
    ) {
      const existing = blogs.find(
        (b) => b.name.toLowerCase() === text.toLowerCase()
      );
      if (existing && !existing.url) {
        existing.url = href;
      } else if (!blogs.some((b) => b.url === href)) {
        blogs.push({
          name: text,
          url: href,
          genre: "All Genres",
          region: "Global",
        });
      }
    }
  });

  return blogs.filter((b) => b.url);
}

// ─── 3. Curated blog lists from articles ──────────────────────────────────────

async function crawlBlogListArticles(): Promise<BlogEntry[]> {
  const urls = [
    "https://mastering.com/music-blogs/",
    "https://audiohype.io/resources/best-music-blogs/",
    "https://loudbeats.org/music/blogs-to-submit-music/",
  ];

  const blogs: BlogEntry[] = [];

  for (const url of urls) {
    const html = await politelyFetch(url);
    if (!html) continue;

    const $ = cheerio.load(html);

    // These articles typically list blogs with links in headings or lists
    $("h2, h3, h4").each((_, el) => {
      const $h = $(el);
      const heading = $h.text().trim();
      const $link = $h.find("a").first();
      let href = $link.attr("href") || "";

      // Sometimes the link is in the next sibling paragraph
      if (!href) {
        const $next = $h.next("p, div");
        const $nextLink = $next.find("a[href^='http']").first();
        href = $nextLink.attr("href") || "";
      }

      if (heading && href && !href.includes(new URL(url).hostname)) {
        const context = $h.next("p").text().trim().slice(0, 300);
        blogs.push({
          name: heading.replace(/^\d+[\.\)\-\s]+/, "").replace(/\s*[\–\-\|].*$/, "").trim(),
          url: href,
          description: context,
          genre: classifyGenre(heading + " " + context),
          region: classifyRegion(heading + " " + context),
        });
      }
    });

    // Also check ordered/unordered lists
    $("li").each((_, el) => {
      const $li = $(el);
      const $link = $li.find("a[href^='http']").first();
      const href = $link.attr("href") || "";
      const text = $link.text().trim() || $li.text().trim().split("\n")[0];

      if (
        href &&
        text.length > 2 &&
        !href.includes(new URL(url).hostname) &&
        !href.includes("twitter.com") &&
        !href.includes("facebook.com") &&
        !href.includes("instagram.com")
      ) {
        const context = $li.text().trim().slice(0, 300);
        blogs.push({
          name: text.replace(/^\d+[\.\)\-\s]+/, "").trim(),
          url: href,
          description: context,
          genre: classifyGenre(context),
          region: classifyRegion(context),
        });
      }
    });
  }

  return deduplicateBlogs(blogs);
}

// ─── Deduplication ────────────────────────────────────────────────────────────

function deduplicateBlogs(blogs: BlogEntry[]): BlogEntry[] {
  const seen = new Set<string>();
  return blogs.filter((b) => {
    // Normalize URL for dedup
    let key = "";
    try {
      const u = new URL(b.url);
      key = u.hostname.replace(/^www\./, "");
    } catch {
      key = b.name.toLowerCase();
    }
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

export type CrawlSource = "feedspot" | "hypemachine" | "articles" | "all";

export async function runCrawlPipeline(
  source: CrawlSource = "all",
  onProgress?: (msg: string) => void
): Promise<CrawlResult> {
  const log = onProgress || (() => {});
  const result: CrawlResult = {
    source,
    blogsDiscovered: 0,
    emailsExtracted: 0,
    contactsImported: 0,
    errors: [],
    contacts: [],
  };

  // ── Stage 1: Discover blogs from directories ──────────────────────────────

  log("Stage 1: Discovering music blogs from directories...");
  let allBlogs: BlogEntry[] = [];

  try {
    if (source === "feedspot" || source === "all") {
      log("Crawling Feedspot directories...");
      const feedspotBlogs = await crawlFeedspot();
      log(`Found ${feedspotBlogs.length} blogs from Feedspot`);
      allBlogs.push(...feedspotBlogs);
    }

    if (source === "hypemachine" || source === "all") {
      log("Crawling Hype Machine directory...");
      const hypeBlogs = await crawlHypeMachine();
      log(`Found ${hypeBlogs.length} blogs from Hype Machine`);
      allBlogs.push(...hypeBlogs);
    }

    if (source === "articles" || source === "all") {
      log("Crawling blog list articles...");
      const articleBlogs = await crawlBlogListArticles();
      log(`Found ${articleBlogs.length} blogs from article lists`);
      allBlogs.push(...articleBlogs);
    }
  } catch (err) {
    result.errors.push(`Directory crawl error: ${err}`);
  }

  // Deduplicate across all sources
  allBlogs = deduplicateBlogs(allBlogs);
  result.blogsDiscovered = allBlogs.length;
  log(`Total unique blogs discovered: ${allBlogs.length}`);

  // ── Stage 2: Crawl each blog for contact emails ───────────────────────────

  log("Stage 2: Extracting contact emails from blog sites...");
  const discovered: DiscoveredContact[] = [];

  for (let i = 0; i < allBlogs.length; i++) {
    const blog = allBlogs[i];
    if (!blog.url) continue;

    log(`[${i + 1}/${allBlogs.length}] Crawling ${blog.name}...`);

    try {
      const { emails, bio } = await findContactEmails(blog.url);

      for (const email of emails) {
        discovered.push({
          name: blog.name,
          email,
          outlet: blog.name,
          url: blog.url,
          genre: blog.genre || classifyGenre(bio + " " + (blog.description || "")),
          region: blog.region || classifyRegion(bio + " " + (blog.description || "")),
          type: "blog",
          beat: "Music Submissions",
          bio: (blog.description || bio || `Music blog discovered from ${source}`).slice(0, 500),
          source,
        });
        result.emailsExtracted++;
      }
    } catch (err) {
      result.errors.push(`Error crawling ${blog.name}: ${err}`);
    }
  }

  log(`Extracted ${result.emailsExtracted} emails from ${allBlogs.length} blogs`);

  // ── Stage 3: Import into database ─────────────────────────────────────────

  log("Stage 3: Importing contacts into database...");

  // Get existing emails to avoid duplicates
  const existingEmails = new Set(
    (await prisma.contact.findMany({ select: { email: true } })).map((c) => c.email.toLowerCase())
  );

  for (const contact of discovered) {
    const emailLower = contact.email.toLowerCase();
    if (existingEmails.has(emailLower)) continue;

    try {
      await prisma.contact.create({
        data: {
          id: `crawl-${emailLower.replace(/[@.]/g, "-")}-${Date.now()}`,
          name: contact.name,
          email: contact.email,
          outlet: contact.outlet,
          type: contact.type,
          genre: contact.genre,
          region: contact.region,
          beat: contact.beat,
          bio: contact.bio,
          website: contact.url,
          verified: false, // Crawled contacts start unverified
          articleCount: 0,
        },
      });
      existingEmails.add(emailLower);
      result.contactsImported++;
      result.contacts.push(contact);
    } catch (err) {
      // Skip duplicates silently
      if (String(err).includes("Unique constraint")) continue;
      result.errors.push(`Import error for ${contact.email}: ${err}`);
    }
  }

  log(`Imported ${result.contactsImported} new contacts`);
  log("Pipeline complete!");

  return result;
}

// ─── Import from a manually provided list of blog URLs ────────────────────────

export async function crawlCustomUrls(
  urls: string[],
  onProgress?: (msg: string) => void
): Promise<CrawlResult> {
  const log = onProgress || (() => {});
  const result: CrawlResult = {
    source: "custom",
    blogsDiscovered: urls.length,
    emailsExtracted: 0,
    contactsImported: 0,
    errors: [],
    contacts: [],
  };

  const existingEmails = new Set(
    (await prisma.contact.findMany({ select: { email: true } })).map((c) => c.email.toLowerCase())
  );

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    log(`[${i + 1}/${urls.length}] Crawling ${url}...`);

    try {
      const { emails, bio } = await findContactEmails(url);
      let hostname = "";
      try { hostname = new URL(url).hostname.replace(/^www\./, ""); } catch { hostname = url; }

      for (const email of emails) {
        const emailLower = email.toLowerCase();
        if (existingEmails.has(emailLower)) continue;

        const contact: DiscoveredContact = {
          name: hostname,
          email,
          outlet: hostname,
          url,
          genre: classifyGenre(bio),
          region: classifyRegion(bio),
          type: "blog",
          beat: "Music Submissions",
          bio: bio.slice(0, 500) || `Contact discovered from ${hostname}`,
          source: "custom",
        };

        try {
          await prisma.contact.create({
            data: {
              id: `crawl-${emailLower.replace(/[@.]/g, "-")}-${Date.now()}`,
              name: contact.name,
              email: contact.email,
              outlet: contact.outlet,
              type: contact.type,
              genre: contact.genre,
              region: contact.region,
              beat: contact.beat,
              bio: contact.bio,
              website: contact.url,
              verified: false,
              articleCount: 0,
            },
          });
          existingEmails.add(emailLower);
          result.contactsImported++;
          result.contacts.push(contact);
          result.emailsExtracted++;
        } catch {
          // skip dupes
        }
      }
    } catch (err) {
      result.errors.push(`Error crawling ${url}: ${err}`);
    }
  }

  return result;
}
