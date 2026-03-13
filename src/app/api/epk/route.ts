import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createEpkSchema = z.object({
  artistName: z.string().min(1, "Artist name is required"),
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

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createEpkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Generate slug from artistName
    const baseSlug = parsed.data.artistName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.ePK.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const epk = await prisma.ePK.create({
      data: {
        userId: user.id,
        artistName: parsed.data.artistName,
        bio: parsed.data.bio ?? null,
        genre: parsed.data.genre ?? null,
        location: parsed.data.location ?? null,
        photoUrls: parsed.data.photoUrls ?? null,
        musicLinks: parsed.data.musicLinks ?? null,
        socialLinks: parsed.data.socialLinks ?? null,
        tourDates: parsed.data.tourDates ?? null,
        pressQuotes: parsed.data.pressQuotes ?? null,
        isPublished: parsed.data.isPublished ?? false,
        slug,
      },
    });

    return NextResponse.json(epk, { status: 201 });
  } catch (err) {
    console.error("Error creating EPK:", err);
    return NextResponse.json(
      { error: "Failed to create EPK" },
      { status: 500 }
    );
  }
}
