import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  status: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        recipients: {
          include: { contact: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Compute recipient stats
    const recipientStats = {
      total: campaign.recipients.length,
      pending: campaign.recipients.filter((r) => r.status === "pending").length,
      sent: campaign.recipients.filter((r) => r.status === "sent").length,
      opened: campaign.recipients.filter((r) => r.status === "opened").length,
      clicked: campaign.recipients.filter((r) => r.status === "clicked").length,
      replied: campaign.recipients.filter((r) => r.status === "replied").length,
      bounced: campaign.recipients.filter((r) => r.status === "bounced").length,
    };

    return NextResponse.json({ ...campaign, recipientStats });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
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
    const body = await request.json();
    const parsed = updateCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify campaign belongs to user
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
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

    // Verify campaign belongs to user
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    await prisma.campaign.delete({ where: { id } });

    return NextResponse.json({ message: "Campaign deleted" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
