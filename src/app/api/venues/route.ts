import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createVenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  address: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const venues = await prisma.venue.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { shows: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ venues });
  } catch (err) {
    console.error("Error fetching venues:", err);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createVenueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        location: parsed.data.location,
        capacity: parsed.data.capacity,
        address: parsed.data.address,
        description: parsed.data.description,
        website: parsed.data.website,
        phone: parsed.data.phone,
        photoUrl: parsed.data.photoUrl,
      },
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (err) {
    console.error("Error creating venue:", err);
    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 }
    );
  }
}
