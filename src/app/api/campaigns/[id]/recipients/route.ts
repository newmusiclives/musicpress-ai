import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const addRecipientsSchema = z.object({
  contactIds: z.array(z.string().min(1)).min(1, "contactIds array is required"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const recipients = await prisma.campaignRecipient.findMany({
      where: { campaignId: id },
      include: { contact: true },
      orderBy: { contact: { name: "asc" } },
    });

    return NextResponse.json({ recipients });
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipients" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const parsed = addRecipientsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { contactIds } = parsed.data;

    // Create recipients, skipping duplicates
    const results = await Promise.allSettled(
      contactIds.map((contactId: string) =>
        prisma.campaignRecipient.create({
          data: {
            campaignId: id,
            contactId,
          },
        })
      )
    );

    const created = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json(
      { message: "Recipients added", created, duplicatesSkipped: failed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding recipients:", error);
    return NextResponse.json(
      { error: "Failed to add recipients" },
      { status: 500 }
    );
  }
}
