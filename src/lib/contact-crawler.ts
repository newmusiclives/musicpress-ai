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
  _contactType?: "blog" | "journalist" | "curator" | "podcaster" | "radio";
}

// ─── Email extraction ─────────────────────────────────────────────────────────

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const IGNORED_EMAIL_DOMAINS = [
  "example.com", "sentry.io", "wixpress.com", "sentry-next.wixpress.com",
  "sentry.wixpress.com", "w3.org",
  "schema.org", "wordpress.org", "wordpress.com", "gravatar.com",
  "google.com", "facebook.com", "twitter.com", "instagram.com",
  "cloudflare.com", "jsdelivr.net", "googleapis.com", "gstatic.com",
  "apple.com", "microsoft.com", "amazon.com", "youtube.com",
  "godaddy.com", "mysite.com", "yoursite.com", "domain.com",
  "email.com", "test.com", "localhost", "patreon.com",
  "ingest.sentry.io", "trustpilot.com", "rss.com",
  "wolfthemes.com", "gettyimages.com",
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
    // Filter out junk emails where local part matches or contains domain (e.g. domain.com@domain.com)
    const [localPart, domain] = lower.split("@");
    if (domain && localPart.includes(domain.split(".")[0])) return false;
    // Filter out very short local parts (likely junk)
    if (localPart.length < 3) return false;
    // Filter out sentry hex IDs and UUID-style emails
    if (/^[0-9a-f]{16,}$/i.test(localPart)) return false;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(localPart)) return false;
    // Filter out emails where domain has extra text appended (e.g. user@site.comword)
    if (/\.(com|net|org|io|co|uk|fm)[a-z]/i.test(domain)) return false;
    // Filter out sentry ingest subdomains
    if (domain && domain.includes("sentry")) return false;
    if (domain && domain.includes("wixpress")) return false;
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
    "https://bloggers.feedspot.com/rock_music_blogs/",
    "https://bloggers.feedspot.com/pop_music_blogs/",
    "https://bloggers.feedspot.com/folk_music_blogs/",
    "https://bloggers.feedspot.com/jazz_blogs/",
    "https://bloggers.feedspot.com/rnb_blogs/",
    "https://bloggers.feedspot.com/country_music_blogs/",
    "https://bloggers.feedspot.com/metal_blogs/",
    "https://bloggers.feedspot.com/punk_rock_blogs/",
    "https://bloggers.feedspot.com/classical_music_blogs/",
    "https://bloggers.feedspot.com/music_review_blogs/",
    "https://bloggers.feedspot.com/music_production_blogs/",
    "https://bloggers.feedspot.com/music_marketing_blogs/",
    "https://bloggers.feedspot.com/music_pr_blogs/",
    "https://bloggers.feedspot.com/music_business_blogs/",
    // Niche genre Feedspot pages
    "https://bloggers.feedspot.com/drum_and_bass_blogs/",
    "https://bloggers.feedspot.com/synthwave_blogs/",
    "https://bloggers.feedspot.com/shoegaze_blogs/",
    "https://bloggers.feedspot.com/post_rock_blogs/",
    "https://bloggers.feedspot.com/garage_rock_blogs/",
    "https://bloggers.feedspot.com/psychedelic_music_blogs/",
    "https://bloggers.feedspot.com/christian_music_blogs/",
    "https://bloggers.feedspot.com/worship_music_blogs/",
    "https://bloggers.feedspot.com/kpop_blogs/",
    "https://bloggers.feedspot.com/afrobeats_blogs/",
    "https://bloggers.feedspot.com/dancehall_blogs/",
    "https://bloggers.feedspot.com/grime_blogs/",
    "https://bloggers.feedspot.com/reggaeton_blogs/",
    "https://bloggers.feedspot.com/ambient_music_blogs/",
    "https://bloggers.feedspot.com/bluegrass_blogs/",
    "https://bloggers.feedspot.com/blues_blogs/",
    "https://bloggers.feedspot.com/soul_music_blogs/",
    "https://bloggers.feedspot.com/funk_music_blogs/",
    "https://bloggers.feedspot.com/world_music_blogs/",
    "https://bloggers.feedspot.com/latin_music_blogs/",
    "https://bloggers.feedspot.com/music_discovery_blogs/",
    "https://bloggers.feedspot.com/new_music_blogs/",
    "https://bloggers.feedspot.com/music_festival_blogs/",
    "https://bloggers.feedspot.com/singer_songwriter_blogs/",
    // Weblog.feedspot variants
    "https://weblog.feedspot.com/indie_music_blogs/",
    "https://weblog.feedspot.com/electronic_music_blogs/",
    "https://weblog.feedspot.com/hip_hop_blogs/",
    "https://weblog.feedspot.com/rock_music_blogs/",
    "https://weblog.feedspot.com/music_review_blogs/",
    "https://weblog.feedspot.com/music_marketing_blogs/",
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
    "https://www.musicgateway.com/blog/music-blogs-to-submit-to",
    "https://www.dittomusic.com/blog/best-music-blogs-to-submit-music-to",
    "https://cymbal.fm/blog/music-blogs-accepting-submissions",
    "https://www.groovermag.com/blog/best-music-blogs/",
    "https://www.musicxray.com/blog/music-blogs",
    "https://www.soundcharts.com/blog/music-blogs",
    "https://flypaper.soundfly.com/hustle/music-blogs-submit-music/",
    // Music industry how-to and marketing sites
    "https://www.musicindustryhowto.com/best-music-blogs-to-submit-your-music-to/",
    "https://www.musicindustryhowto.com/music-blog-submission/",
    "https://producerhive.com/music-marketing-tips/best-music-blogs/",
    "https://producerhive.com/music-marketing-tips/music-submission-sites/",
    "https://routenote.com/blog/best-music-blogs-to-submit-to/",
    "https://routenote.com/blog/how-to-submit-music-to-blogs/",
    "https://www.amuse.io/content/best-music-blogs",
    "https://www.amuse.io/content/how-to-get-your-music-on-blogs",
    "https://www.tunedly.com/blog/best-music-blogs-accepting-submissions",
    "https://www.reverbnation.com/blog/best-music-blogs/",
    "https://bandzoogle.com/blog/music-blogs-accepting-submissions",
    "https://bandzoogle.com/blog/how-to-submit-music-to-blogs",
    "https://blog.landr.com/music-blogs/",
    "https://blog.landr.com/music-blog-submission/",
    "https://splice.com/blog/best-music-blogs/",
    // Distribution and platform blogs
    "https://www.tunecore.com/blog/music-blogs-to-submit-to",
    "https://www.cdbaby.com/music-promotion/music-blogs",
    "https://www.distrokid.com/blog/music-blogs/",
    "https://www.recordlabel.store/blogs/music-marketing/best-music-blogs",
    "https://www.hypebot.com/hypebot/music-blogs-accepting-submissions.html",
    "https://www.makeitsupersound.com/blog/music-blogs-accepting-submissions",
    "https://www.musicentrepreneurhq.com/best-music-blogs-accepting-submissions/",
    "https://www.musicto.com/blog/best-music-blogs/",
    "https://heroic.academy/blog/music-blogs-to-submit-to",
    "https://www.thebalancecareers.com/best-music-blogs-to-submit-to-2460657",
    "https://www.indiemusician.com/best-music-blogs/",
    // Genre-specific blog list articles
    "https://producerhive.com/music-marketing-tips/electronic-music-blogs/",
    "https://producerhive.com/music-marketing-tips/hip-hop-blogs/",
    "https://www.musicindustryhowto.com/hip-hop-blogs/",
    "https://www.musicindustryhowto.com/indie-music-blogs/",
    "https://www.musicindustryhowto.com/electronic-music-blogs/",
    "https://cymbal.fm/blog/best-indie-music-blogs",
    "https://cymbal.fm/blog/best-electronic-music-blogs",
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

// ─── 4. Music Journalists — Publication staff/contributor pages ───────────────

async function crawlJournalists(): Promise<BlogEntry[]> {
  const sources = [
    // Feedspot journalist directories
    "https://bloggers.feedspot.com/music_journalists/",
    "https://bloggers.feedspot.com/music_critics/",
    // Major publication staff/about pages
    "https://pitchfork.com/about/",
    "https://pitchfork.com/staff/",
    "https://consequenceofsound.net/about/",
    "https://www.stereogum.com/about/",
    "https://www.nme.com/about-us",
    "https://www.thelineofbestfit.com/about",
    "https://www.clashmusic.com/contact/",
    "https://www.diymagazine.com/contact-us/",
    "https://www.billboard.com/about-us/",
    "https://www.rollingstone.com/contact/",
    "https://www.spin.com/about/",
    "https://www.pastemagazine.com/about",
    "https://www.brooklynvegan.com/about/",
    "https://www.undertheradarmag.com/contact",
    "https://exclaim.ca/contact",
    "https://www.themusic.com.au/contact",
    "https://www.musicradar.com/about-us",
    "https://www.popmatters.com/about",
    // Music journalist curated lists
    "https://muckrack.com/media-outlet/pitchfork",
    "https://blog.feedspot.com/music_journalism_blogs/",
    // Additional publications
    "https://www.thefader.com/about",
    "https://www.complex.com/about",
    "https://www.loudersound.com/contact-us",
    "https://www.theaquarian.com/contact/",
    "https://www.tinymixtapes.com/about",
    "https://www.drownedinsound.com/contact",
    "https://www.treblezine.com/about/",
    "https://www.thequietus.com/contact",
    "https://www.bandcamp.com/contact",
    "https://ra.co/about",
    "https://djmag.com/contact",
    "https://www.mixmag.net/contact",
    "https://www.magnetmagazine.com/contact/",
    "https://www.readdork.com/contact/",
    "https://www.gigwise.com/about",
    "https://www.musicomh.com/about",
    "https://www.sputnikmusic.com/contact.php",
    "https://www.albumoftheyear.org/about/",
    "https://www.soundslikenashville.com/contact/",
    "https://www.americansongwriter.com/contact/",
    "https://www.savingcountrymusic.com/contact/",
    // Electronic music press
    "https://www.dancingastronaut.com/contact/",
    "https://edm.com/contact",
    "https://www.youredm.com/about/",
    "https://www.magneticmag.com/contact/",
    "https://www.attackmagazine.com/about/",
    "https://www.electronicbeats.net/about/",
    "https://www.residentadvisor.net/about",
    // Metal / Rock press
    "https://metalinjection.net/contact",
    "https://www.metalsucks.net/contact/",
    "https://www.revolvermag.com/contact",
    "https://www.kerrang.com/contact",
    "https://www.punknews.org/contact",
    "https://www.invisibleoranges.com/about/",
    "https://www.angrymetalguy.com/about/",
    "https://www.heavyblogisheavy.com/contact/",
    "https://www.theprp.com/contact/",
    "https://www.deadpress.co.uk/about/",
    // Country / Americana / Folk press
    "https://www.nodepression.com/contact/",
    "https://www.theboot.com/contact/",
    "https://www.wideopencountry.com/contact/",
    "https://tasteofcountry.com/contact/",
    "https://www.roughstock.com/contact",
    "https://www.thecountrynote.com/contact/",
    "https://www.whiskeyriff.com/contact/",
    // Latin / World press
    "https://remezcla.com/about/",
    "https://www.soundsandcolours.com/about/",
    "https://worldmusiccentral.org/about/",
    "https://www.afropunk.com/contact/",
    // Industry / Business press
    "https://www.hypebot.com/contact/",
    "https://www.digitalmusicnews.com/contact/",
    "https://musically.com/contact/",
    "https://www.musicbusinessworldwide.com/contact/",
    "https://completemusicupdate.com/contact/",
    // Alt-weeklies / Regional
    "https://www.austinchronicle.com/contact/",
    "https://www.laweekly.com/contact/",
    "https://www.sfweekly.com/contact/",
    "https://www.chicagoreader.com/contact/",
    "https://www.dallasobserver.com/contact/",
    "https://www.phoenixnewtimes.com/contact/",
    "https://www.westword.com/contact/",
    "https://www.miaminewtimes.com/contact/",
    "https://www.villagevoice.com/contact-us/",
    // Additional Feedspot directories for journalists
    "https://bloggers.feedspot.com/music_news_blogs/",
    "https://bloggers.feedspot.com/music_magazine_blogs/",
    "https://bloggers.feedspot.com/entertainment_journalists/",
    "https://bloggers.feedspot.com/concert_blogs/",
    "https://bloggers.feedspot.com/music_festival_blogs/",
    // Regional / City music publications
    "https://www.nashvillescene.com/contact/",
    "https://www.portlandmercury.com/contact/",
    "https://www.thestranger.com/about/contact",
    "https://www.bostonglobe.com/about/contact-us/",
    "https://www.citypages.com/contact/",
    "https://www.seattlemet.com/contact/",
    "https://www.timeout.com/newyork/music/contact",
    "https://www.georgiastraight.com/contact",
    "https://www.orlandoweekly.com/contact/",
    "https://www.riverfronttimes.com/contact/",
    "https://www.clevescene.com/contact/",
    "https://www.metrotimes.com/contact/",
    "https://www.washingtonblade.com/contact/",
    // International publications
    "https://www.uncut.co.uk/contact-us/",
    "https://www.mojo4music.com/contact/",
    "https://www.thewire.co.uk/contact",
    "https://www.songlines.co.uk/contact",
    "https://www.rocksound.tv/contact",
    "https://www.musicweek.com/contact",
    "https://www.tonedeaf.com.au/contact/",
    "https://www.theaureview.com/contact/",
    "https://www.hhv-mag.com/contact/",
    "https://www.musikexpress.de/kontakt/",
    "https://www.mondosonoro.com/contacto/",
    // Online music magazines
    "https://atwoodmagazine.com/contact/",
    "https://earmilk.com/contact/",
    "https://pigeonsandplanes.com/contact/",
    "https://www.the405.com/contact/",
    "https://www.goldflakepaint.co.uk/contact/",
    "https://www.thelineofbestfit.com/contact",
    "https://www.undertheguntampabay.com/contact/",
    "https://beatsperminute.com/contact/",
    "https://www.popjustice.com/contact/",
    "https://www.clashmusic.com/about/",
    "https://www.crackmagazine.net/contact/",
    "https://www.dummymag.com/contact/",
    "https://thefourohfive.com/contact/",
    "https://www.culturecollide.com/contact/",
    "https://www.northerntransmissions.com/contact/",
    "https://www.whenthehornblows.com/contact/",
    "https://www.gorillavsbear.net/about/",
    "https://www.hearandnowmedia.com/contact/",
    "https://www.ones-to-watch.com/contact",
    // Genre-specific publications
    "https://www.metalhammer.com/contact/",
    "https://www.blabbermouth.net/contact/",
    "https://www.progmagazine.com/contact/",
    "https://www.electronicsound.co.uk/contact/",
    "https://www.djtimes.com/contact/",
    "https://www.metalstorm.net/pub/contact.php",
    "https://www.deadpress.co.uk/contact/",
    "https://www.outlawmag.com/contact/",
    "https://www.tinymixtapes.com/contact",
    "https://www.altpress.com/contact/",
    "https://www.substream.com/contact/",
    // Industry trades
    "https://www.pollstar.com/contact",
    "https://www.celebrityaccess.com/contact/",
    "https://variety.com/contact-us/",
    "https://deadline.com/contact-us/",
    "https://www.hollywoodreporter.com/contact-us/",
  ];

  const blogs: BlogEntry[] = [];

  for (const url of sources) {
    const html = await politelyFetch(url);
    if (!html) continue;

    const $ = cheerio.load(html);
    let hostname = "";
    try { hostname = new URL(url).hostname.replace(/^www\./, ""); } catch { hostname = url; }

    // For Feedspot directories, use the same parsing as blogs
    if (url.includes("feedspot.com")) {
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
      $("a[target='_blank']").each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") || "";
        const text = $a.text().trim();
        if (text.length > 3 && href.startsWith("http") && !href.includes("feedspot.com") && !href.includes("facebook.com") && !href.includes("twitter.com") && !blogs.some((b) => b.url === href)) {
          blogs.push({ name: text, url: href, genre: "All Genres", region: "Global" });
        }
      });
    } else {
      // For publication pages, treat the whole site as a journalist contact source
      blogs.push({
        name: hostname,
        url: url.replace(/\/about\/?$|\/staff\/?$|\/contact\/?$|\/about-us\/?$/i, ""),
        description: $('meta[name="description"]').attr("content") || "",
        genre: "All Genres",
        region: classifyRegion(hostname),
      });
    }
  }

  return deduplicateBlogs(blogs);
}

// ─── 5. Playlist Curators — Spotify curator directories ──────────────────────

async function crawlCurators(): Promise<BlogEntry[]> {
  const sources = [
    "https://bloggers.feedspot.com/spotify_playlist_curators/",
    "https://bloggers.feedspot.com/apple_music_playlist_curators/",
    "https://blog.feedspot.com/spotify_playlists/",
    // Curator submission and directory sites
    "https://www.playlistpush.com/blog/spotify-playlist-curators",
    "https://www.dailyplaylists.com/blog/spotify-playlist-curators",
    "https://indiemono.com/playlist-curators/",
    "https://www.soundplate.com/contact/",
    "https://www.mysphera.co/curators",
    "https://www.tunemymusic.com/blog/spotify-playlist-curators",
    "https://bloggers.feedspot.com/youtube_music_channels/",
    "https://bloggers.feedspot.com/music_promotion_blogs/",
    "https://www.submithub.com/blog/best-music-blogs",
    "https://audiohype.io/resources/spotify-playlist-curators/",
    "https://www.musicgateway.com/blog/spotify-playlist-curators",
    "https://cymbal.fm/blog/playlist-curators",
    // More curator directories
    "https://bloggers.feedspot.com/soundcloud_music_blogs/",
    "https://bloggers.feedspot.com/youtube_music_channels/",
    "https://bloggers.feedspot.com/music_promotion_blogs/",
    "https://bloggers.feedspot.com/music_discovery_blogs/",
    "https://bloggers.feedspot.com/new_music_blogs/",
    "https://bloggers.feedspot.com/music_playlist_blogs/",
    "https://bloggers.feedspot.com/music_curation_blogs/",
    // Curator submission platforms (contact/about pages)
    "https://www.submithub.com/blog",
    "https://www.musosoup.com/contact/",
    "https://groover.co/en/about/",
    "https://www.dailyplaylists.com/about/",
    "https://www.soundplate.com/about/",
    "https://www.kolibrimusic.com/contact",
    "https://www.mysphera.co/about",
    // Independent curator sites
    "https://www.indieshuffle.com/contact/",
    "https://theshuffle.com.au/contact/",
    "https://www.stereostickman.com/contact/",
    "https://www.musiccrowns.org/contact/",
    "https://www.neonmusic.co.uk/contact",
    "https://www.lefuturewave.com/contact/",
    "https://www.chillfiltr.com/about/",
    "https://www.twomelody.com/contact/",
    // YouTube music channels
    "https://www.mrsuicidesheep.com/contact/",
    "https://www.proximity.net/contact/",
    "https://www.majesticcasual.com/contact/",
    "https://www.cloudkid.com/contact/",
    "https://www.thevibeguide.com/contact/",
    "https://www.chill.com/contact",
    // Massive Feedspot curator expansion
    "https://bloggers.feedspot.com/lofi_music_blogs/",
    "https://bloggers.feedspot.com/edm_blogs/",
    "https://bloggers.feedspot.com/house_music_blogs/",
    "https://bloggers.feedspot.com/techno_blogs/",
    "https://bloggers.feedspot.com/trance_blogs/",
    "https://bloggers.feedspot.com/dubstep_blogs/",
    "https://bloggers.feedspot.com/trap_music_blogs/",
    "https://bloggers.feedspot.com/chill_music_blogs/",
    "https://bloggers.feedspot.com/ambient_music_blogs/",
    "https://bloggers.feedspot.com/rnb_music_blogs/",
    "https://bloggers.feedspot.com/soul_music_blogs/",
    "https://bloggers.feedspot.com/reggae_blogs/",
    "https://bloggers.feedspot.com/latin_music_blogs/",
    "https://bloggers.feedspot.com/kpop_blogs/",
    "https://bloggers.feedspot.com/jpop_blogs/",
    "https://bloggers.feedspot.com/afrobeats_blogs/",
    "https://bloggers.feedspot.com/blues_blogs/",
    "https://bloggers.feedspot.com/jazz_blogs/",
    "https://bloggers.feedspot.com/country_music_blogs/",
    "https://bloggers.feedspot.com/bluegrass_blogs/",
    "https://bloggers.feedspot.com/americana_blogs/",
    "https://bloggers.feedspot.com/singer_songwriter_blogs/",
    "https://bloggers.feedspot.com/acoustic_music_blogs/",
    "https://bloggers.feedspot.com/music_video_blogs/",
    "https://bloggers.feedspot.com/music_licensing_blogs/",
    "https://bloggers.feedspot.com/dj_blogs/",
    "https://bloggers.feedspot.com/vinyl_blogs/",
    "https://bloggers.feedspot.com/music_gear_blogs/",
    "https://bloggers.feedspot.com/music_education_blogs/",
    "https://bloggers.feedspot.com/music_therapy_blogs/",
    // Curator-specific article sources
    "https://www.soundplate.com/best-spotify-playlist-curators/",
    "https://www.soundplate.com/spotify-playlist-curators/",
    "https://www.dailyplaylists.com/blog/best-spotify-playlist-curators/",
    "https://www.dittomusic.com/blog/spotify-playlist-curators",
    "https://www.musicgateway.com/blog/how-to-submit-music-to-spotify-playlists",
    "https://audiohype.io/resources/spotify-playlist-curators/",
    "https://www.recordlabel.store/blogs/music-marketing/spotify-playlist-curators",
    "https://blog.landr.com/spotify-playlist-curators/",
    "https://www.tunecore.com/blog/best-spotify-playlist-curators",
    "https://www.makeitsupersound.com/blog/spotify-playlist-curators",
    // More genre-specific Feedspot playlist pages
    "https://bloggers.feedspot.com/rap_playlist_curators/",
    "https://bloggers.feedspot.com/rock_playlist_curators/",
    "https://bloggers.feedspot.com/pop_playlist_curators/",
    "https://bloggers.feedspot.com/electronic_playlist_curators/",
    "https://bloggers.feedspot.com/indie_playlist_curators/",
    "https://bloggers.feedspot.com/chill_playlist_curators/",
    "https://bloggers.feedspot.com/workout_playlist_curators/",
    "https://bloggers.feedspot.com/study_music_playlists/",
    // More independent curator blogs/sites with contact pages
    "https://www.submithub.com/about/",
    "https://www.dailyplaylists.com/contact/",
    "https://www.playlistpush.com/contact",
    "https://www.soundplate.com/submit-music/",
    "https://www.artistpush.me/contact/",
    "https://www.omarimc.com/contact/",
    "https://www.theplaylisting.com/contact/",
    "https://www.unitedmasters.com/contact/",
    "https://www.beatchain.com/contact/",
    "https://www.featurefm.com/contact/",
    "https://www.playlist-promotion.com/contact/",
    // More YouTube music promotion channels
    "https://www.privilegeofmusic.com/contact/",
    "https://www.alexrainbirdmusic.com/contact/",
    "https://www.soundofus.com/contact/",
    "https://www.waveofgood.com/contact/",
    "https://www.koalacontrol.com/contact/",
    "https://www.thesoundyouneed.com/contact/",
    "https://www.galaxymusic.info/contact/",
    "https://www.cakemusic.com/contact/",
    "https://www.diversemusic.info/contact/",
    // SoundCloud repost channels
    "https://www.repostexchange.com/contact/",
    "https://www.repostnetwork.com/contact/",
    "https://www.artistunion.com/about/",
    // More curator directory articles
    "https://www.musicindustryhowto.com/spotify-playlist-curators/",
    "https://producerhive.com/music-marketing-tips/spotify-playlist-curators/",
    "https://routenote.com/blog/spotify-playlist-curators/",
  ];

  const blogs: BlogEntry[] = [];

  for (const url of sources) {
    const html = await politelyFetch(url);
    if (!html) continue;

    const $ = cheerio.load(html);

    if (url.includes("feedspot.com")) {
      $(".tbl_blog_row, .feed-item, [class*='blog-item'], .rss-block").each((_, el) => {
        const $el = $(el);
        const name = $el.find("h2, h3, .tbl_blog_name, .feed-name, a[target='_blank']").first().text().trim();
        const link = $el.find("a[target='_blank']").first().attr("href") || "";
        const desc = $el.find(".tbl_blog_about, .feed-description, p").first().text().trim();
        if (name && link && !link.includes("feedspot.com")) {
          blogs.push({ name: name.replace(/^\d+\.\s*/, ""), url: link, description: desc, genre: classifyGenre(desc), region: classifyRegion(desc) });
        }
      });
      $("a[target='_blank']").each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") || "";
        const text = $a.text().trim();
        if (text.length > 3 && href.startsWith("http") && !href.includes("feedspot.com") && !href.includes("facebook.com") && !href.includes("twitter.com") && !blogs.some((b) => b.url === href)) {
          blogs.push({ name: text, url: href, genre: "All Genres", region: "Global" });
        }
      });
    } else {
      // Parse article-style lists for curator sites
      $("h2, h3, h4").each((_, el) => {
        const $h = $(el);
        const heading = $h.text().trim();
        const $link = $h.find("a").first();
        let href = $link.attr("href") || "";
        if (!href) {
          const $next = $h.next("p, div");
          href = $next.find("a[href^='http']").first().attr("href") || "";
        }
        if (heading && href && !href.includes(new URL(url).hostname)) {
          blogs.push({
            name: heading.replace(/^\d+[\.\)\-\s]+/, "").replace(/\s*[\–\-\|].*$/, "").trim(),
            url: href,
            description: $h.next("p").text().trim().slice(0, 300),
            genre: classifyGenre(heading),
            region: classifyRegion(heading),
          });
        }
      });
      // Also add the page itself as a source
      blogs.push({
        name: new URL(url).hostname.replace(/^www\./, ""),
        url: url,
        genre: "All Genres",
        region: "Global",
      });
    }
  }

  return deduplicateBlogs(blogs);
}

// ─── 6. Music Podcasters — Podcast directories ──────────────────────────────

async function crawlPodcasters(): Promise<BlogEntry[]> {
  const sources = [
    "https://bloggers.feedspot.com/music_podcasts/",
    "https://bloggers.feedspot.com/indie_music_podcasts/",
    "https://bloggers.feedspot.com/hip_hop_podcasts/",
    "https://bloggers.feedspot.com/rock_music_podcasts/",
    "https://bloggers.feedspot.com/music_industry_podcasts/",
    "https://bloggers.feedspot.com/music_production_podcasts/",
    // Podcast network contact pages
    "https://www.iheart.com/contact/",
    "https://gimletmedia.com/about",
    // More Feedspot podcast category pages
    "https://blog.feedspot.com/music_interview_podcasts/",
    "https://bloggers.feedspot.com/music_history_podcasts/",
    "https://bloggers.feedspot.com/electronic_music_podcasts/",
    "https://bloggers.feedspot.com/jazz_podcasts/",
    "https://bloggers.feedspot.com/classical_music_podcasts/",
    "https://bloggers.feedspot.com/country_music_podcasts/",
    "https://bloggers.feedspot.com/metal_podcasts/",
    "https://bloggers.feedspot.com/punk_podcasts/",
    "https://bloggers.feedspot.com/rnb_podcasts/",
    "https://bloggers.feedspot.com/music_business_podcasts/",
    "https://bloggers.feedspot.com/music_marketing_podcasts/",
    "https://bloggers.feedspot.com/songwriting_podcasts/",
    "https://bloggers.feedspot.com/dj_podcasts/",
    "https://bloggers.feedspot.com/music_education_podcasts/",
    "https://bloggers.feedspot.com/music_technology_podcasts/",
    "https://bloggers.feedspot.com/audio_podcasts/",
    "https://bloggers.feedspot.com/podcast_about_music/",
    // Individual music podcast websites with contact pages
    "https://songexploder.net/about",
    "https://www.brokenrecordpodcast.com/contact",
    "https://www.npr.org/sections/allsongs/",
    "https://dissectpodcast.com/contact/",
    "https://www.switchedonpop.com/contact/",
    "https://www.tapeoppod.com/contact/",
    "https://www.songwritersdreamcast.com/contact/",
    "https://www.sodajerker.com/contact/",
    "https://www.bandsplain.com/contact/",
    "https://www.musicbusinessworldwide.com/contact/",
    "https://www.andthewroterit.com/contact/",
    "https://www.noisyghost.com/contact/",
    "https://www.musicpeoplepodcast.com/contact/",
    "https://www.thetonedownpodcast.com/contact/",
    "https://www.sound-opinions.org/contact",
    "https://www.musicrespawn.com/contact/",
    // Podcast network pages
    "https://www.iheart.com/contact/",
    "https://gimletmedia.com/about",
    "https://www.stitcher.com/about",
    "https://www.earwolf.com/contact/",
    "https://www.maximumfun.org/contact",
    "https://radiopublic.com/about",
    "https://www.wondery.com/contact-us/",
    "https://www.prx.org/contact",
    // Podcast directory roundups
    "https://www.musicindustryhowto.com/best-music-podcasts/",
    "https://blog.feedspot.com/music_podcasts/",
    "https://www.pastemagazine.com/music/best-music-podcasts/",
    "https://www.vulture.com/article/best-music-podcasts.html",
    "https://www.complex.com/music/best-music-podcasts",
    "https://www.rollingstone.com/music/music-lists/best-music-podcasts/",
    "https://www.nme.com/features/best-music-podcasts",
    "https://producerhive.com/music-marketing-tips/best-music-podcasts/",
    "https://www.podchaser.com/lists/best-music-podcasts",
    "https://www.listennotes.com/best-music-podcasts/",
    "https://discoverpods.com/best-music-podcasts/",
    "https://www.podcastinsights.com/best-music-podcasts/",
  ];

  const blogs: BlogEntry[] = [];

  for (const url of sources) {
    const html = await politelyFetch(url);
    if (!html) continue;

    const $ = cheerio.load(html);

    if (url.includes("feedspot.com")) {
      $(".tbl_blog_row, .feed-item, [class*='blog-item'], .rss-block").each((_, el) => {
        const $el = $(el);
        const name = $el.find("h2, h3, .tbl_blog_name, .feed-name, a[target='_blank']").first().text().trim();
        const link = $el.find("a[target='_blank']").first().attr("href") || "";
        const desc = $el.find(".tbl_blog_about, .feed-description, p").first().text().trim();
        if (name && link && !link.includes("feedspot.com")) {
          blogs.push({ name: name.replace(/^\d+\.\s*/, ""), url: link, description: desc, genre: classifyGenre(desc), region: classifyRegion(desc) });
        }
      });
      $("a[target='_blank']").each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") || "";
        const text = $a.text().trim();
        if (text.length > 3 && href.startsWith("http") && !href.includes("feedspot.com") && !href.includes("facebook.com") && !href.includes("twitter.com") && !blogs.some((b) => b.url === href)) {
          blogs.push({ name: text, url: href, genre: "All Genres", region: "Global" });
        }
      });
    } else {
      blogs.push({
        name: new URL(url).hostname.replace(/^www\./, ""),
        url: url,
        description: $('meta[name="description"]').attr("content") || "",
        genre: "All Genres",
        region: classifyRegion($("body").text().slice(0, 1000)),
      });
    }
  }

  return deduplicateBlogs(blogs);
}

// ─── 7. Radio Stations — College, community, and independent radio ──────────

async function crawlRadio(): Promise<BlogEntry[]> {
  const sources = [
    // Feedspot radio categories
    "https://bloggers.feedspot.com/college_radio_blogs/",
    "https://bloggers.feedspot.com/internet_radio_blogs/",
    "https://bloggers.feedspot.com/radio_station_blogs/",
    "https://bloggers.feedspot.com/community_radio_blogs/",
    "https://bloggers.feedspot.com/online_radio_blogs/",
    "https://blog.feedspot.com/college_radio_stations/",
    "https://blog.feedspot.com/internet_radio_stations/",
    // Individual college/independent radio station contact pages
    "https://www.kexp.org/contact/",
    "https://wfmu.org/contact/",
    "https://www.kcrw.com/about/contact",
    "https://kutx.org/contact/",
    "https://www.wxpn.org/contact/",
    "https://www.wers.org/contact/",
    "https://www.wfuv.org/contact",
    "https://www.wbgo.org/contact",
    "https://www.wmbr.org/contact/",
    "https://www.kalx.berkeley.edu/contact/",
    "https://www.kcsb.org/contact/",
    "https://www.kzsu.stanford.edu/contact/",
    "https://www.wrvu.org/contact/",
    "https://www.wxyc.org/contact/",
    "https://www.wprb.com/contact/",
    "https://www.kvrx.org/contact/",
    "https://www.wmuc.umd.edu/contact/",
    "https://www.whrb.org/contact/",
    "https://www.ktru.org/contact/",
    "https://www.chirpradio.org/contact",
    "https://www.the-current.org/contact",
    "https://www.krcc.org/contact",
    "https://www.kunc.org/contact",
    "https://www.wwoz.org/contact",
    "https://www.kuow.org/contact",
    "https://www.wbez.org/contact",
    // Online/independent radio
    "https://www.nts.live/about",
    "https://www.rinse.fm/contact/",
    "https://www.dublab.com/contact",
    "https://somafm.com/contact/",
    "https://www.bff.fm/contact",
    "https://www.ehfm.live/contact",
    // College radio directories and roundup articles
    "https://www.collegeradio.com/contact/",
    "https://www.musicindustryhowto.com/college-radio-stations/",
    "https://blog.landr.com/college-radio-stations/",
    "https://www.musicbusinessworldwide.com/college-radio/",
    "https://producerhive.com/music-marketing-tips/college-radio-stations/",
  ];

  const blogs: BlogEntry[] = [];

  for (const url of sources) {
    const html = await politelyFetch(url);
    if (!html) continue;

    const $ = cheerio.load(html);

    if (url.includes("feedspot.com")) {
      $(".tbl_blog_row, .feed-item, [class*='blog-item'], .rss-block").each((_, el) => {
        const $el = $(el);
        const name = $el.find("h2, h3, .tbl_blog_name, .feed-name, a[target='_blank']").first().text().trim();
        const link = $el.find("a[target='_blank']").first().attr("href") || "";
        const desc = $el.find(".tbl_blog_about, .feed-description, p").first().text().trim();
        if (name && link && !link.includes("feedspot.com")) {
          blogs.push({ name: name.replace(/^\d+\.\s*/, ""), url: link, description: desc, genre: classifyGenre(desc), region: classifyRegion(desc) });
        }
      });
      $("a[target='_blank']").each((_, el) => {
        const $a = $(el);
        const href = $a.attr("href") || "";
        const text = $a.text().trim();
        if (text.length > 3 && href.startsWith("http") && !href.includes("feedspot.com") && !href.includes("facebook.com") && !href.includes("twitter.com") && !blogs.some((b) => b.url === href)) {
          blogs.push({ name: text, url: href, genre: "All Genres", region: "Global" });
        }
      });
    } else {
      // For individual station pages, treat the whole site as a radio contact source
      let hostname = "";
      try { hostname = new URL(url).hostname.replace(/^www\./, ""); } catch { hostname = url; }
      blogs.push({
        name: hostname,
        url: url.replace(/\/about\/?$|\/contact\/?$/i, ""),
        description: $('meta[name="description"]').attr("content") || "",
        genre: "All Genres",
        region: classifyRegion(hostname + " " + ($("body").text().slice(0, 1000))),
      });
    }
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

export type CrawlSource = "feedspot" | "hypemachine" | "articles" | "journalists" | "curators" | "podcasters" | "radio" | "all";

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

    if (source === "journalists" || source === "all") {
      log("Crawling journalist directories...");
      const journalistEntries = await crawlJournalists();
      log(`Found ${journalistEntries.length} journalist sources`);
      allBlogs.push(...journalistEntries.map(e => ({ ...e, _contactType: "journalist" as const })));
    }

    if (source === "curators" || source === "all") {
      log("Crawling playlist curator directories...");
      const curatorEntries = await crawlCurators();
      log(`Found ${curatorEntries.length} curator sources`);
      allBlogs.push(...curatorEntries.map(e => ({ ...e, _contactType: "curator" as const })));
    }

    if (source === "podcasters" || source === "all") {
      log("Crawling music podcast directories...");
      const podcasterEntries = await crawlPodcasters();
      log(`Found ${podcasterEntries.length} podcaster sources`);
      allBlogs.push(...podcasterEntries.map(e => ({ ...e, _contactType: "podcaster" as const })));
    }

    if (source === "radio" || source === "all") {
      log("Crawling radio station directories...");
      const radioEntries = await crawlRadio();
      log(`Found ${radioEntries.length} radio station sources`);
      allBlogs.push(...radioEntries.map(e => ({ ...e, _contactType: "radio" as const })));
    }
  } catch (err) {
    result.errors.push(`Directory crawl error: ${err}`);
  }

  // Deduplicate across all sources
  allBlogs = deduplicateBlogs(allBlogs);
  result.blogsDiscovered = allBlogs.length;
  log(`Total unique blogs discovered: ${allBlogs.length}`);

  // ── Stage 2: Crawl each blog and import contacts immediately ────────────

  log("Stage 2: Extracting contacts and importing into database...");

  // Get existing emails to avoid duplicates
  const existingEmails = new Set(
    (await prisma.contact.findMany({ select: { email: true } })).map((c) => c.email.toLowerCase())
  );

  for (let i = 0; i < allBlogs.length; i++) {
    const blog = allBlogs[i];
    if (!blog.url) continue;

    log(`[${i + 1}/${allBlogs.length}] Crawling ${blog.name}...`);

    try {
      const { emails, bio } = await findContactEmails(blog.url);

      for (const email of emails) {
        const emailLower = email.toLowerCase();
        if (existingEmails.has(emailLower)) continue;

        const contactType = blog._contactType || (source === "journalists" ? "journalist" : source === "curators" ? "curator" : source === "podcasters" ? "podcaster" : "blog");
        const beatMap: Record<string, string> = {
          blog: "Music Submissions",
          journalist: "Music Journalism",
          curator: "Playlist Curation",
          podcaster: "Music Podcast",
          radio: "Radio Station",
        };
        const contact: DiscoveredContact = {
          name: blog.name,
          email,
          outlet: blog.name,
          url: blog.url,
          genre: blog.genre || classifyGenre(bio + " " + (blog.description || "")),
          region: blog.region || classifyRegion(bio + " " + (blog.description || "")),
          type: contactType,
          beat: beatMap[contactType] || "Music Submissions",
          bio: (blog.description || bio || `${contactType} discovered from ${source}`).slice(0, 500),
          source,
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
          log(`  ✓ Imported: ${email} (${blog.name})`);
        } catch (err) {
          if (String(err).includes("Unique constraint")) continue;
          result.errors.push(`Import error for ${email}: ${err}`);
        }
      }
    } catch (err) {
      result.errors.push(`Error crawling ${blog.name}: ${err}`);
    }
  }

  log(`Imported ${result.contactsImported} new contacts from ${allBlogs.length} blogs`);
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
