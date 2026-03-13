import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createPitchRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  outlet: z.string().min(1, "Outlet is required"),
  journalist: z.string().min(1, "Journalist is required"),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().nullable().optional(),
  genres: z.string().nullable().optional(),
  regions: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const pitchRequests = await prisma.pitchRequest.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pitchRequests });
  } catch (err) {
    console.error("Error fetching pitch requests:", err);
    return NextResponse.json(
      { error: "Failed to fetch pitch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createPitchRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const pitchRequest = await prisma.pitchRequest.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        outlet: parsed.data.outlet,
        journalist: parsed.data.journalist,
        category: parsed.data.category,
        deadline: parsed.data.deadline,
        genres: parsed.data.genres,
        regions: parsed.data.regions,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json(pitchRequest, { status: 201 });
  } catch (err) {
    console.error("Error creating pitch request:", err);
    return NextResponse.json(
      { error: "Failed to create pitch request" },
      { status: 500 }
    );
  }
}
