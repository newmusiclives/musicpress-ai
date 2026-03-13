import { NextRequest, NextResponse } from "next/server";
import { ghlLaunchCampaign, isGHLConfigured } from "@/lib/ghl";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const launchCampaignSchema = z.object({
  campaignId: z.string().min(1, "campaignId is required"),
  workflowId: z.string().min(1, "workflowId is required"),
  recipients: z.array(z.object({
    email: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })).min(1, "At least one recipient is required"),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = launchCampaignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    if (!isGHLConfigured()) {
      return NextResponse.json({
        message: "GHL not configured - mock success",
        mock: true,
        campaignId: parsed.data.campaignId,
        recipientCount: parsed.data.recipients.length,
      });
    }

    const result = await ghlLaunchCampaign({
      campaignId: parsed.data.campaignId,
      workflowId: parsed.data.workflowId,
      recipients: parsed.data.recipients,
    });

    return NextResponse.json({ results: result });
  } catch (err) {
    console.error("Error launching GHL campaign:", err);
    return NextResponse.json(
      { error: "Failed to launch GHL campaign" },
      { status: 500 }
    );
  }
}
