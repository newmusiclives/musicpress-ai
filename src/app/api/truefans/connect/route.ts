import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { getMockTrueFansStats, isTrueFansConfigured, getArtistStats } from "@/lib/truefans";
import { z } from "zod/v4";
import type { NextRequest } from "next/server";

const connectSchema = z.object({
  truefansId: z.string().min(1, "truefansId is required"),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = connectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        truefansId: parsed.data.truefansId,
        truefansConnected: true,
      },
    });

    return NextResponse.json({
      message: "TrueFans account connected",
      user: {
        id: updatedUser.id,
        truefansId: updatedUser.truefansId,
        truefansConnected: updatedUser.truefansConnected,
      },
    });
  } catch (err) {
    console.error("Error connecting TrueFans:", err);
    return NextResponse.json(
      { error: "Failed to connect TrueFans account" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { truefansId: true, truefansConnected: true },
    });

    if (!dbUser?.truefansConnected || !dbUser?.truefansId) {
      return NextResponse.json({
        connected: false,
        stats: getMockTrueFansStats(),
        mock: true,
      });
    }

    if (isTrueFansConfigured()) {
      try {
        const stats = await getArtistStats(dbUser.truefansId);
        return NextResponse.json({ connected: true, stats });
      } catch {
        // Fall back to mock if real API fails
        return NextResponse.json({
          connected: true,
          stats: getMockTrueFansStats(),
          mock: true,
        });
      }
    }

    return NextResponse.json({
      connected: true,
      stats: getMockTrueFansStats(),
      mock: true,
    });
  } catch (err) {
    console.error("Error fetching TrueFans stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch TrueFans stats" },
      { status: 500 }
    );
  }
}
