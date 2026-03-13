import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const toggleSavedContactSchema = z.object({
  contactId: z.string().min(1, "contactId is required"),
});

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const savedContacts = await prisma.savedContact.findMany({
      where: { userId: user.id },
      include: { contact: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ savedContacts });
  } catch (error) {
    console.error("Error fetching saved contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = toggleSavedContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { contactId } = parsed.data;

    // Toggle: check if already saved
    const existing = await prisma.savedContact.findUnique({
      where: {
        userId_contactId: { userId: user.id, contactId },
      },
    });

    if (existing) {
      await prisma.savedContact.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false, message: "Contact unsaved" });
    }

    const saved = await prisma.savedContact.create({
      data: { userId: user.id, contactId },
      include: { contact: true },
    });

    return NextResponse.json({ saved: true, savedContact: saved }, { status: 201 });
  } catch (error) {
    console.error("Error toggling saved contact:", error);
    return NextResponse.json(
      { error: "Failed to toggle saved contact" },
      { status: 500 }
    );
  }
}
