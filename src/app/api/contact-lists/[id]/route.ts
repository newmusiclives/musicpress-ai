import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const updateContactListSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const contactList = await prisma.contactList.findUnique({
      where: { id },
      include: {
        items: {
          include: { contact: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!contactList) {
      return NextResponse.json(
        { error: "Contact list not found" },
        { status: 404 }
      );
    }

    if (contactList.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(contactList);
  } catch (err) {
    console.error("Error fetching contact list:", err);
    return NextResponse.json(
      { error: "Failed to fetch contact list" },
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

    const existing = await prisma.contactList.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Contact list not found" },
        { status: 404 }
      );
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateContactListSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const contactList = await prisma.contactList.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(contactList);
  } catch (err) {
    console.error("Error updating contact list:", err);
    return NextResponse.json(
      { error: "Failed to update contact list" },
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

    const existing = await prisma.contactList.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Contact list not found" },
        { status: 404 }
      );
    }
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.contactList.delete({ where: { id } });

    return NextResponse.json({ message: "Contact list deleted" });
  } catch (err) {
    console.error("Error deleting contact list:", err);
    return NextResponse.json(
      { error: "Failed to delete contact list" },
      { status: 500 }
    );
  }
}
