import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const respondSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const body = await request.json();
    const parsed = respondSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify pitch request exists
    const pitchRequest = await prisma.pitchRequest.findUnique({
      where: { id },
    });

    if (!pitchRequest) {
      return NextResponse.json(
        { error: "Pitch request not found" },
        { status: 404 }
      );
    }

    const response = await prisma.pitchResponse.create({
      data: {
        pitchRequestId: id,
        userId: user.id,
        message: parsed.data.message,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("Error submitting pitch response:", err);
    return NextResponse.json(
      { error: "Failed to submit pitch response" },
      { status: 500 }
    );
  }
}
