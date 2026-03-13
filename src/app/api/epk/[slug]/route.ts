import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const updateEpkSchema = z.object({
  artistName: z.string().min(1).optional(),
  bio: z.string().nullable().optional(),
  genre: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  photoUrls: z.string().nullable().optional(),
  musicLinks: z.string().nullable().optional(),
  socialLinks: z.string().nullable().optional(),
  tourDates: z.string().nullable().optional(),
  pressQuotes: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

// Public endpoint — no auth required
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const epk = await prisma.ePK.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            genre: true,
            location: true,
            website: true,
            spotifyUrl: true,
            instagramUrl: true,
            twitterUrl: true,
          },
        },
      },
    });

    if (!epk) {
      return NextResponse.json({ error: "EPK not found" }, { status: 404 });
    }

    return NextResponse.json(epk);
  } catch (err) {
    console.error("Error fetching EPK:", err);
    return NextResponse.json(
      { error: "Failed to fetch EPK" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { slug } = await params;

    const existing = await prisma.ePK.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "EPK not found" }, { status: 404 });
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateEpkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const epk = await prisma.ePK.update({
      where: { slug },
      data: parsed.data,
    });

    return NextResponse.json(epk);
  } catch (err) {
    console.error("Error updating EPK:", err);
    return NextResponse.json(
      { error: "Failed to update EPK" },
      { status: 500 }
    );
  }
}
