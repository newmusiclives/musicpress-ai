import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createShowSchema = z.object({
  artist: z.string().min(1, "Artist is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  capacity: z.number().int().nonnegative("Capacity must be non-negative"),
  ticketUrl: z.string().url().optional().or(z.literal("")),
  ticketsSold: z.number().int().nonnegative().optional(),
  pressStatus: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const venue = await prisma.venue.findUnique({ where: { id } });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
    if (venue.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const shows = await prisma.show.findMany({
      where: { venueId: id },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ shows });
  } catch (err) {
    console.error("Error fetching shows:", err);
    return NextResponse.json(
      { error: "Failed to fetch shows" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const venue = await prisma.venue.findUnique({ where: { id } });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
    if (venue.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createShowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const show = await prisma.show.create({
      data: {
        venueId: id,
        artist: parsed.data.artist,
        date: new Date(parsed.data.date),
        time: parsed.data.time,
        ticketUrl: parsed.data.ticketUrl,
        ticketsSold: parsed.data.ticketsSold || 0,
        capacity: parsed.data.capacity,
        pressStatus: parsed.data.pressStatus || "not_started",
      },
    });

    return NextResponse.json(show, { status: 201 });
  } catch (err) {
    console.error("Error creating show:", err);
    return NextResponse.json(
      { error: "Failed to create show" },
      { status: 500 }
    );
  }
}
