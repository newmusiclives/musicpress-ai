import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const userId = user.id;

    // Fetch campaigns with recipients
    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      include: {
        recipients: true,
      },
    });

    // Fetch press releases
    const pressReleases = await prisma.pressRelease.findMany({
      where: { userId },
    });

    // Fetch media mentions
    const mentions = await prisma.mediaMention.findMany({
      where: { userId },
    });

    // Total contacts in db
    const totalContacts = await prisma.contact.count();

    // Compute email stats across all campaigns
    const allRecipients = campaigns.flatMap((c) => c.recipients);
    const nonPending = allRecipients.filter((r) => r.status !== "pending");
    const totalEmailsSent = nonPending.length;
    const opened = allRecipients.filter((r) => r.openedAt !== null).length;
    const replied = allRecipients.filter((r) => r.repliedAt !== null).length;

    const avgOpenRate =
      totalEmailsSent > 0
        ? Math.round((opened / totalEmailsSent) * 100)
        : 0;
    const avgReplyRate =
      totalEmailsSent > 0
        ? Math.round((replied / totalEmailsSent) * 100)
        : 0;

    // Campaign performance
    const campaignPerformance = campaigns.map((c) => {
      const total = c.recipients.length;
      const sent = c.recipients.filter((r) => r.status !== "pending").length;
      const campaignOpened = c.recipients.filter((r) => r.openedAt !== null).length;
      const campaignReplied = c.recipients.filter((r) => r.repliedAt !== null).length;

      return {
        id: c.id,
        name: c.name,
        status: c.status,
        totalRecipients: total,
        sent,
        opened: campaignOpened,
        replied: campaignReplied,
        openRate: sent > 0 ? Math.round((campaignOpened / sent) * 100) : 0,
        replyRate: sent > 0 ? Math.round((campaignReplied / sent) * 100) : 0,
      };
    });

    // Coverage by type
    const coverageByType: Record<string, number> = {};
    for (const m of mentions) {
      coverageByType[m.type] = (coverageByType[m.type] || 0) + 1;
    }

    // Top outlets
    const outletCounts: Record<string, number> = {};
    for (const m of mentions) {
      outletCounts[m.outlet] = (outletCounts[m.outlet] || 0) + 1;
    }
    const topOutlets = Object.entries(outletCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([outlet, count]) => ({ outlet, count }));

    return NextResponse.json({
      totalEmailsSent,
      avgOpenRate,
      avgReplyRate,
      totalContacts,
      totalPressReleases: pressReleases.length,
      totalMentions: mentions.length,
      campaignPerformance,
      coverageByType,
      topOutlets,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
