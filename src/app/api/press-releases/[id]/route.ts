import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const updatePressReleaseSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  body: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  status: z.string().optional(),
  language: z.string().optional(),
  tone: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const pressRelease = await prisma.pressRelease.findUnique({
      where: { id },
    });

    if (!pressRelease) {
      return NextResponse.json(
        { error: "Press release not found" },
        { status: 404 }
      );
    }

    if (pressRelease.userId !== user.id) {
      return NextResponse.json(
        { error: "Press release not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pressRelease);
  } catch (err) {
    console.error("Error fetching press release:", err);
    return NextResponse.json(
      { error: "Failed to fetch press release" },
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

    const existing = await prisma.pressRelease.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Press release not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updatePressReleaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const pressRelease = await prisma.pressRelease.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(pressRelease);
  } catch (err) {
    console.error("Error updating press release:", err);
    return NextResponse.json(
      { error: "Failed to update press release" },
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

    const existing = await prisma.pressRelease.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Press release not found" },
        { status: 404 }
      );
    }

    await prisma.pressRelease.delete({ where: { id } });

    return NextResponse.json({ message: "Press release deleted" });
  } catch (err) {
    console.error("Error deleting press release:", err);
    return NextResponse.json(
      { error: "Failed to delete press release" },
      { status: 500 }
    );
  }
}
