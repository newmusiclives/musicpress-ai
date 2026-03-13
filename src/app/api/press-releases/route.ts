import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createPressReleaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  type: z.string().min(1, "Type is required"),
  status: z.string().optional(),
  language: z.string().optional(),
  tone: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { userId: user.id };
    if (status) where.status = status;

    const pressReleases = await prisma.pressRelease.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pressReleases });
  } catch (err) {
    console.error("Error fetching press releases:", err);
    return NextResponse.json(
      { error: "Failed to fetch press releases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createPressReleaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const pressRelease = await prisma.pressRelease.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        body: parsed.data.body,
        type: parsed.data.type,
        status: parsed.data.status || "draft",
        language: parsed.data.language || "en",
        tone: parsed.data.tone || "professional",
      },
    });

    return NextResponse.json(pressRelease, { status: 201 });
  } catch (err) {
    console.error("Error creating press release:", err);
    return NextResponse.json(
      { error: "Failed to create press release" },
      { status: 500 }
    );
  }
}
