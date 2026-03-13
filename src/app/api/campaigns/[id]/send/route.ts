import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isGHLConfigured, ghlLaunchCampaign } from "@/lib/ghl";
import { getAuthUser } from "@/lib/session";

export async function POST(
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

    // Update campaign status
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: "active",
        sentAt: new Date(),
      },
    });

    // Update all pending recipients to sent
    await prisma.campaignRecipient.updateMany({
      where: { campaignId: id, status: "pending" },
      data: { status: "sent", sentAt: new Date() },
    });

    let ghlResult = null;

    // If GHL is configured, launch via GHL
    if (isGHLConfigured() && campaign.ghlWorkflowId) {
      ghlResult = await ghlLaunchCampaign({
        campaignId: id,
        workflowId: campaign.ghlWorkflowId,
        recipients: campaign.recipients.map((r) => ({
          email: r.contact.email,
          firstName: r.contact.name.split(" ")[0],
          lastName: r.contact.name.split(" ").slice(1).join(" ") || undefined,
        })),
      });
    }

    return NextResponse.json({
      campaign: updatedCampaign,
      recipientCount: campaign.recipients.length,
      ghlResult,
      message: "Campaign sent successfully",
    });
  } catch (error) {
    console.error("Error sending campaign:", error);
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}
