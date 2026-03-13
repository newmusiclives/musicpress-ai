import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const updatePitchRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  outlet: z.string().min(1).optional(),
  journalist: z.string().optional(),
  category: z.string().optional(),
  deadline: z.string().optional(),
  genres: z.string().nullable().optional(),
  regions: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const pitchRequest = await prisma.pitchRequest.findUnique({
      where: { id },
      include: {
        responses: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!pitchRequest) {
      return NextResponse.json(
        { error: "Pitch request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pitchRequest);
  } catch (err) {
    console.error("Error fetching pitch request:", err);
    return NextResponse.json(
      { error: "Failed to fetch pitch request" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const existing = await prisma.pitchRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Pitch request not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updatePitchRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const pitchRequest = await prisma.pitchRequest.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(pitchRequest);
  } catch (err) {
    console.error("Error updating pitch request:", err);
    return NextResponse.json(
      { error: "Failed to update pitch request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const existing = await prisma.pitchRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Pitch request not found" },
        { status: 404 }
      );
    }

    await prisma.pitchRequest.delete({ where: { id } });

    return NextResponse.json({ message: "Pitch request deleted" });
  } catch (err) {
    console.error("Error deleting pitch request:", err);
    return NextResponse.json(
      { error: "Failed to delete pitch request" },
      { status: 500 }
    );
  }
}
