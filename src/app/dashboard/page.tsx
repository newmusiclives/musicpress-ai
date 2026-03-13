"use client";
import { useState, useEffect } from "react";
import {
  Users,
  Send,
  FileText,
  BarChart3,
  TrendingUp,
  Bell,
  Zap,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface CampaignItem {
  id: string;
  name: string;
  status: string;
  type: string;
  _count?: { recipients: number };
  recipients?: { status: string; openedAt: string | null; repliedAt: string | null }[];
}

interface PitchRequestItem {
  id: string;
  title: string;
  outlet: string;
  genres: string | null;
  createdAt: string;
}

interface AnalyticsData {
  totalContacts: number;
  totalPressReleases: number;
  avgOpenRate: number;
  totalEmailsSent: number;
  totalMentions: number;
  campaignPerformance: { id: string; name: string; status: string }[];
}

interface TrueFansData {
  connected: boolean;
  stats: {
    totalFans: number;
    totalDonations: number;
    fanEngagement: number;
  };
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function calcMatch(genres: string | null): number {
  if (!genres) return 50;
  const userGenres = ["indie", "rock", "alternative"];
  const contactGenres = genres.toLowerCase().split(",").map((g) => g.trim());
  const overlap = contactGenres.filter((g) => userGenres.some((ug) => g.includes(ug))).length;
  return Math.min(99, 60 + Math.round((overlap / Math.max(contactGenres.length, 1)) * 35));
}

export default function DashboardOverview() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [pitchRequests, setPitchRequests] = useState<PitchRequestItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [truefans, setTruefans] = useState<TrueFansData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [campRes, pitchRes, analyticsRes] = await Promise.all([
          fetch("/api/campaigns"),
          fetch("/api/pitch-requests"),
          fetch("/api/analytics"),
        ]);

        if (campRes.ok) {
          const data = await campRes.json();
          setCampaigns(data.campaigns || []);
        }
        if (pitchRes.ok) {
          const data = await pitchRes.json();
          setPitchRequests(data.pitchRequests || []);
        }
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }

        // Try TrueFans
        try {
          const tfRes = await fetch("/api/truefans/connect");
          if (tfRes.ok) {
            setTruefans(await tfRes.json());
          }
        } catch {
          // TrueFans is optional
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const recentCampaigns = campaigns.slice(0, 4);
  const recentPitches = pitchRequests.slice(0, 3);

  const stats = [
    {
      label: "Media Contacts",
      value: analytics ? analytics.totalContacts.toLocaleString() : "--",
      change: `${analytics?.totalPressReleases || 0} releases`,
      icon: Users,
      color: "from-primary to-primary-light",
    },
    {
      label: "Active Campaigns",
      value: String(activeCampaigns),
      change: `${campaigns.length} total`,
      icon: Send,
      color: "from-accent to-accent-light",
    },
    {
      label: "Press Releases",
      value: String(analytics?.totalPressReleases || 0),
      change: `${analytics?.totalMentions || 0} mentions`,
      icon: FileText,
      color: "from-success to-accent",
    },
    {
      label: "Open Rate",
      value: `${analytics?.avgOpenRate || 0}%`,
      change: `${analytics?.totalEmailsSent || 0} emails sent`,
      icon: BarChart3,
      color: "from-truefans-orange to-truefans-amber",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <div className="flex items-center gap-3 text-danger">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-foreground/50 mt-1">
            Welcome back. Here&apos;s your PR overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/press-releases"
            className="flex items-center gap-2 text-sm font-medium text-foreground/70 border border-border px-4 py-2.5 rounded-xl hover:bg-surface transition-colors"
          >
            <FileText className="w-4 h-4" />
            New Release
          </Link>
          <Link
            href="/dashboard/campaigns"
            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-extrabold">{stat.value}</div>
            <div className="text-xs text-foreground/50 mt-1">{stat.change}</div>
            <div className="text-xs text-foreground/40 mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-bold">Recent Campaigns</h2>
            <Link
              href="/dashboard/campaigns"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCampaigns.length === 0 && (
              <div className="px-5 py-8 text-center text-foreground/40 text-sm">
                No campaigns yet. Create your first campaign to get started.
              </div>
            )}
            {recentCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href="/dashboard/campaigns"
                className="flex items-center justify-between px-5 py-4 hover:bg-surface-light/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{campaign.name}</div>
                    <div className="text-xs text-foreground/40">
                      {campaign._count?.recipients || 0} contacts
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      campaign.status === "active"
                        ? "bg-success/10 text-success"
                        : campaign.status === "completed"
                        ? "bg-primary/10 text-primary"
                        : campaign.status === "scheduled"
                        ? "bg-warning/10 text-warning"
                        : "bg-foreground/10 text-foreground/50"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pitch Alerts + TrueFans */}
        <div className="space-y-6">
          {/* Pitch Alerts */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-warning" />
                <h2 className="font-bold text-sm">Pitch Alerts</h2>
              </div>
              <Link
                href="/dashboard/pitch-requests"
                className="text-xs text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentPitches.length === 0 && (
                <div className="p-4 text-center text-foreground/40 text-xs">
                  No pitch requests yet.
                </div>
              )}
              {recentPitches.map((alert) => (
                <Link
                  key={alert.id}
                  href="/dashboard/pitch-requests"
                  className="block p-4 hover:bg-surface-light/30 transition-colors"
                >
                  <div className="text-sm font-medium mb-1">{alert.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/40">
                      {alert.outlet} · {timeAgo(alert.createdAt)}
                    </span>
                    <span className="text-xs font-bold text-success">
                      {calcMatch(alert.genres)}% match
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* TrueFans Widget */}
          <div className="bg-gradient-to-br from-truefans-orange/10 to-truefans-amber/10 border border-truefans-orange/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-truefans-orange" />
              <h3 className="font-bold text-sm gradient-text-truefans">
                TrueFans CONNECT
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Total Fans</span>
                <span className="text-sm font-bold">
                  {truefans?.stats?.totalFans?.toLocaleString() || "142"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Total Donations</span>
                <span className="text-sm font-bold text-success">
                  ${truefans?.stats?.totalDonations?.toLocaleString() || "347"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Fan Engagement</span>
                <span className="text-sm font-bold text-truefans-orange">
                  {truefans?.stats?.fanEngagement || 89}%
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/truefans"
              className="block text-center text-xs font-semibold text-truefans-orange border border-truefans-orange/30 rounded-lg py-2 mt-4 hover:bg-truefans-orange/5 transition-colors"
            >
              Open TrueFans Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
