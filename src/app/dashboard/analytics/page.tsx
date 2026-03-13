"use client";
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  Eye,
  MessageSquare,
  ArrowUpRight,
  Globe,
  Newspaper,
  Mic2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface CampaignPerf {
  id: string;
  name: string;
  status: string;
  totalRecipients: number;
  sent: number;
  opened: number;
  replied: number;
  openRate: number;
  replyRate: number;
}

interface AnalyticsData {
  totalEmailsSent: number;
  avgOpenRate: number;
  avgReplyRate: number;
  totalContacts: number;
  totalPressReleases: number;
  totalMentions: number;
  campaignPerformance: CampaignPerf[];
  coverageByType: Record<string, number>;
  topOutlets: { outlet: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Failed to load analytics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32 gap-2 text-danger">
        <AlertCircle className="w-5 h-5" />
        <span>{error || "No data available"}</span>
      </div>
    );
  }

  const overviewStats = [
    { label: "Total Emails Sent", value: data.totalEmailsSent.toLocaleString(), change: `${data.campaignPerformance.length} campaigns`, up: true, icon: Mail },
    { label: "Average Open Rate", value: `${data.avgOpenRate}%`, change: "across all campaigns", up: data.avgOpenRate > 20, icon: Eye },
    { label: "Average Reply Rate", value: `${data.avgReplyRate}%`, change: "across all campaigns", up: data.avgReplyRate > 3, icon: MessageSquare },
    { label: "Media Contacts", value: data.totalContacts.toLocaleString(), change: `${data.totalMentions} mentions`, up: true, icon: Users },
  ];

  // Coverage by type with progress bars
  const totalCoverage = Object.values(data.coverageByType).reduce((a, b) => a + b, 0);
  const coverageItems = Object.entries(data.coverageByType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalCoverage > 0 ? Math.round((count / totalCoverage) * 100) : 0,
    }));

  const typeIcons: Record<string, typeof Newspaper> = {
    Podcast: Mic2,
    Blog: Globe,
    Playlist: Globe,
  };
  const typeColors = ["bg-primary", "bg-accent", "bg-truefans-orange", "bg-success", "bg-warning"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Analytics</h1>
        <p className="text-foreground/50 mt-1">
          Track your PR performance across all campaigns
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-primary" />
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-success" : "text-foreground/40"}`}>
                {stat.up && <ArrowUpRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-extrabold">{stat.value}</div>
            <div className="text-xs text-foreground/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign Performance */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold">Campaign Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-foreground/40 border-b border-border">
                  <th className="px-5 py-3 font-medium">Campaign</th>
                  <th className="px-5 py-3 font-medium text-right">Sent</th>
                  <th className="px-5 py-3 font-medium text-right">Opened</th>
                  <th className="px-5 py-3 font-medium text-right">Open Rate</th>
                  <th className="px-5 py-3 font-medium text-right">Replied</th>
                  <th className="px-5 py-3 font-medium text-right">Reply Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.campaignPerformance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-foreground/40 text-sm">
                      No campaign data yet.
                    </td>
                  </tr>
                )}
                {data.campaignPerformance.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border/50 hover:bg-surface-light/30 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium">{campaign.name}</td>
                    <td className="px-5 py-3 text-sm text-right text-foreground/60">{campaign.sent}</td>
                    <td className="px-5 py-3 text-sm text-right text-foreground/60">{campaign.opened}</td>
                    <td className="px-5 py-3 text-sm text-right">
                      <span className="text-success font-medium">{campaign.openRate}%</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-right text-foreground/60">{campaign.replied}</td>
                    <td className="px-5 py-3 text-sm text-right">
                      <span className="text-primary font-medium">{campaign.replyRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Coverage by type */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-4">Coverage by Type</h3>
            <div className="space-y-4">
              {coverageItems.length === 0 && (
                <p className="text-sm text-foreground/40">No coverage data yet.</p>
              )}
              {coverageItems.map((item, i) => {
                const Icon = typeIcons[item.type] || Newspaper;
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-foreground/50" />
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <span className="text-sm font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className={`${typeColors[i % typeColors.length]} h-2 rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top outlets */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-4">Top Outlets</h3>
            <div className="space-y-3">
              {data.topOutlets.length === 0 && (
                <p className="text-sm text-foreground/40">No outlet data yet.</p>
              )}
              {data.topOutlets.map((outlet, i) => (
                <div key={outlet.outlet} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground/30 w-4">{i + 1}</span>
                    <span className="text-sm font-medium">{outlet.outlet}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold">{outlet.count} mention{outlet.count !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
