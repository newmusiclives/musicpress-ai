import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const addContactsSchema = z.object({
  contactIds: z.array(z.string().min(1)).min(1, "contactIds array is required"),
});

const removeContactSchema = z.object({
  contactId: z.string().min(1, "contactId is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const list = await prisma.contactList.findUnique({ where: { id } });
    if (!list) {
      return NextResponse.json(
        { error: "Contact list not found" },
        { status: 404 }
      );
    }
    if (list.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = addContactsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Add contacts, skipping duplicates
    const results = await Promise.allSettled(
      parsed.data.contactIds.map((contactId: string) =>
        prisma.contactListItem.create({
          data: {
            contactListId: id,
            contactId,
          },
        })
      )
    );

    const created = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json(
      { message: "Contacts added to list", created, duplicatesSkipped: failed },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding contacts to list:", err);
    return NextResponse.json(
      { error: "Failed to add contacts to list" },
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

    const list = await prisma.contactList.findUnique({ where: { id } });
    if (!list) {
      return NextResponse.json(
        { error: "Contact list not found" },
        { status: 404 }
      );
    }
    if (list.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = removeContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    await prisma.contactListItem.delete({
      where: {
        contactListId_contactId: {
          contactListId: id,
          contactId: parsed.data.contactId,
        },
      },
    });

    return NextResponse.json({ message: "Contact removed from list" });
  } catch (err) {
    console.error("Error removing contact from list:", err);
    return NextResponse.json(
      { error: "Failed to remove contact from list" },
      { status: 500 }
    );
  }
}
