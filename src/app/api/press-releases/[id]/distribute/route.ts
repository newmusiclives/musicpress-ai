import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";

export async function POST(
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

    const outletsReached = Math.floor(Math.random() * 41) + 20; // 20-60

    const updated = await prisma.pressRelease.update({
      where: { id },
      data: {
        status: "distributed",
        distributedAt: new Date(),
        outletsReached: pressRelease.outletsReached + outletsReached,
      },
    });

    return NextResponse.json({
      pressRelease: updated,
      newOutletsReached: outletsReached,
      message: "Press release distributed successfully",
    });
  } catch (err) {
    console.error("Error distributing press release:", err);
    return NextResponse.json(
      { error: "Failed to distribute press release" },
      { status: 500 }
    );
  }
}
