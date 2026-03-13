import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createContactListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const contactLists = await prisma.contactList.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contactLists });
  } catch (err) {
    console.error("Error fetching contact lists:", err);
    return NextResponse.json(
      { error: "Failed to fetch contact lists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createContactListSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const contactList = await prisma.contactList.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });

    return NextResponse.json(contactList, { status: 201 });
  } catch (err) {
    console.error("Error creating contact list:", err);
    return NextResponse.json(
      { error: "Failed to create contact list" },
      { status: 500 }
    );
  }
}
