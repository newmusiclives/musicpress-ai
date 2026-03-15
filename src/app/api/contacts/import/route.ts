import { NextRequest, NextResponse } from "next/server";
import { runCrawlPipeline, crawlCustomUrls, CrawlSource } from "@/lib/contact-crawler";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const importContactsSchema = z.object({
  source: z.enum(["all", "feedspot", "hypemachine", "articles", "journalists", "curators", "podcasters", "radio"]).optional(),
  urls: z.array(z.url("Each URL must be a valid URL")).optional(),
});

// Track background crawl status
let crawlStatus: {
  running: boolean;
  startedAt: string | null;
  result: {
    blogsDiscovered: number;
    emailsExtracted: number;
    contactsImported: number;
    errors: string[];
  } | null;
} = { running: false, startedAt: null, result: null };

// POST /api/contacts/import — Trigger a crawl pipeline (runs in background)
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    if (crawlStatus.running) {
      return NextResponse.json(
        { message: "Crawl already in progress", startedAt: crawlStatus.startedAt },
        { status: 202 }
      );
    }

    const body = await request.json();
    const parsed = importContactsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { source, urls } = parsed.data;

    // Custom URL list — these are fast, run synchronously
    if (urls && urls.length > 0) {
      const result = await crawlCustomUrls(urls);
      return NextResponse.json(result);
    }

    // Directory crawl — run in background, return immediately
    const crawlSource: CrawlSource = source || "all";
    crawlStatus = { running: true, startedAt: new Date().toISOString(), result: null };

    // Fire and forget — don't await
    runCrawlPipeline(crawlSource)
      .then((result) => {
        crawlStatus = {
          running: false,
          startedAt: crawlStatus.startedAt,
          result: {
            blogsDiscovered: result.blogsDiscovered,
            emailsExtracted: result.emailsExtracted,
            contactsImported: result.contactsImported,
            errors: result.errors.slice(0, 20),
          },
        };
        console.log(`Crawl complete: ${result.contactsImported} contacts imported from ${result.blogsDiscovered} sources`);
      })
      .catch((err) => {
        console.error("Background crawl error:", err);
        crawlStatus = {
          running: false,
          startedAt: crawlStatus.startedAt,
          result: {
            blogsDiscovered: 0,
            emailsExtracted: 0,
            contactsImported: 0,
            errors: [String(err)],
          },
        };
      });

    return NextResponse.json({
      message: "Crawl started in background. Contacts will appear as they are imported. Refresh the page to see progress.",
      blogsDiscovered: 0,
      emailsExtracted: 0,
      contactsImported: 0,
      errors: [],
    });
  } catch (err) {
    console.error("Crawl pipeline error:", err);
    return NextResponse.json(
      { error: "Crawl pipeline failed" },
      { status: 500 }
    );
  }
}

// GET /api/contacts/import — Get current contact count + crawl status
export async function GET() {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { prisma } = await import("@/lib/prisma");
    const total = await prisma.contact.count();
    const crawled = await prisma.contact.count({ where: { verified: false } });
    const verified = await prisma.contact.count({ where: { verified: true } });
    return NextResponse.json({ total, crawled, verified, crawlStatus });
  } catch (error) {
    console.error("Error fetching import stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch import stats" },
      { status: 500 }
    );
  }
}
