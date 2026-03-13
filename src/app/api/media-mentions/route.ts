import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createMentionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  outlet: z.string().min(1, "Outlet is required"),
  author: z.string().optional(),
  url: z.string().url().optional(),
  type: z.string().min(1, "Type is required"),
  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
  reach: z.string().nullable().optional(),
  date: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const mentions = await prisma.mediaMention.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ mentions });
  } catch (err) {
    console.error("Error fetching media mentions:", err);
    return NextResponse.json(
      { error: "Failed to fetch media mentions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createMentionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const mention = await prisma.mediaMention.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        outlet: parsed.data.outlet,
        author: parsed.data.author,
        url: parsed.data.url,
        type: parsed.data.type,
        sentiment: parsed.data.sentiment || "neutral",
        reach: parsed.data.reach,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      },
    });

    return NextResponse.json(mention, { status: 201 });
  } catch (err) {
    console.error("Error creating media mention:", err);
    return NextResponse.json(
      { error: "Failed to create media mention" },
      { status: 500 }
    );
  }
}
