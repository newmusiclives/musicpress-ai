import { NextRequest, NextResponse } from "next/server";
import { runCrawlPipeline, crawlCustomUrls, CrawlSource } from "@/lib/contact-crawler";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const importContactsSchema = z.object({
  source: z.enum(["all", "feedspot", "hypemachine", "articles"]).optional(),
  urls: z.array(z.url("Each URL must be a valid URL")).optional(),
});

// POST /api/contacts/import — Trigger a crawl pipeline
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = importContactsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { source, urls } = parsed.data;

    // Custom URL list
    if (urls && urls.length > 0) {
      const result = await crawlCustomUrls(urls);
      return NextResponse.json(result);
    }

    // Directory crawl
    const crawlSource: CrawlSource = source || "all";
    const result = await runCrawlPipeline(crawlSource);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Crawl pipeline error:", err);
    return NextResponse.json(
      { error: "Crawl pipeline failed" },
      { status: 500 }
    );
  }
}

// GET /api/contacts/import — Get current contact count
export async function GET() {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { prisma } = await import("@/lib/prisma");
    const total = await prisma.contact.count();
    const crawled = await prisma.contact.count({ where: { verified: false } });
    const verified = await prisma.contact.count({ where: { verified: true } });
    return NextResponse.json({ total, crawled, verified });
  } catch (error) {
    console.error("Error fetching import stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch import stats" },
      { status: 500 }
    );
  }
}
