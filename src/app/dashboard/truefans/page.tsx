"use client";
import { useState, useEffect } from "react";
import {
  Zap,
  MapPin,
  DollarSign,
  Users,
  Heart,
  ExternalLink,
  QrCode,
  TrendingUp,
  Gift,
  Radio,
  Smartphone,
  Globe,
  Star,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface TrueFansData {
  connected: boolean;
  mock?: boolean;
  stats: {
    totalFans: number;
    totalDonations: number;
    showsDiscovered: number;
    fanEngagement: number;
    recentDonations: { fan: string; amount: number; show: string; time: string }[];
    topFans: { name: string; totalDonated: number; shows: number; since: string }[];
  };
}

const integrationFeatures = [
  {
    icon: QrCode,
    title: "Performance QR Codes",
    description: "Generate unique codes for each show. Fans scan to connect, donate, and follow instantly.",
    status: "Active",
  },
  {
    icon: MapPin,
    title: "Geo-Discovery",
    description: "Your shows appear on the TrueFans map. Fans nearby discover live music happening now.",
    status: "Active",
  },
  {
    icon: Smartphone,
    title: "Fan App Integration",
    description: "Fans use the TrueFans FM app (iOS & Android) to discover, support, and follow you.",
    status: "Connected",
  },
  {
    icon: Gift,
    title: "Merch & Music Links",
    description: "Add your merch store, streaming links, and music for sale directly to your TrueFans profile.",
    status: "Active",
  },
  {
    icon: Radio,
    title: "MEETn Integration",
    description: "Use MEETn TrueFans Edition for live streaming with built-in donation and merch links.",
    status: "Available",
  },
  {
    icon: Globe,
    title: "TrueFans FM Profile",
    description: "Your artist profile on TrueFans FM -- discoverable by fans across the platform.",
    status: "Live",
  },
];

export default function TrueFansPage() {
  const [data, setData] = useState<TrueFansData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [connectId, setConnectId] = useState("");
  const [connecting, setConnecting] = useState(false);

  async function fetchTrueFans() {
    try {
      const res = await fetch("/api/truefans/connect");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load TrueFans data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrueFans();
  }, []);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!connectId.trim()) return;
    setConnecting(true);
    try {
      const res = await fetch("/api/truefans/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ truefansId: connectId.trim() }),
      });
      if (res.ok) {
        setShowConnect(false);
        setConnectId("");
        await fetchTrueFans();
      }
    } catch (err) {
      console.error("Failed to connect:", err);
    } finally {
      setConnecting(false);
    }
  }

  const stats = data?.stats;
  const recentDonations = stats?.recentDonations || [];
  const topFans = stats?.topFans || [];

  const statCards = [
    { label: "Total Fans", value: stats?.totalFans?.toLocaleString() || "0", change: "this month", icon: Users, color: "from-truefans-orange to-truefans-amber" },
    { label: "Total Donations", value: `$${stats?.totalDonations?.toLocaleString() || "0"}`, change: "lifetime", icon: DollarSign, color: "from-success to-accent" },
    { label: "Shows Discovered", value: String(stats?.showsDiscovered || 0), change: "via geo-discovery", icon: MapPin, color: "from-primary to-accent" },
    { label: "Fan Engagement", value: `${stats?.fanEngagement || 0}%`, change: "engagement rate", icon: Heart, color: "from-danger to-truefans-orange" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-truefans-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-truefans-orange to-truefans-amber flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">
              <span className="gradient-text-truefans">TrueFans CONNECT</span>
            </h1>
            <p className="text-foreground/50 mt-0.5">
              Fan engagement, donations, and geo-discovery -- all in one place
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!data?.connected && (
            <button
              onClick={() => setShowConnect(true)}
              className="flex items-center gap-2 text-sm font-medium text-truefans-orange border border-truefans-orange/30 px-4 py-2.5 rounded-xl hover:bg-truefans-orange/5 transition-colors"
            >
              Connect Account
            </button>
          )}
          <a
            href="https://truefans.fm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-foreground/70 border border-border px-4 py-2.5 rounded-xl hover:bg-surface transition-colors"
          >
            <Globe className="w-4 h-4" />
            TrueFans FM
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://truefansconnect.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-truefans-orange to-truefans-amber px-5 py-2.5 rounded-xl hover:opacity-90"
          >
            <Zap className="w-4 h-4" />
            Open TrueFans
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Connect Modal */}
      {showConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Connect TrueFans Account</h3>
              <button onClick={() => setShowConnect(false)} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>
            <p className="text-sm text-foreground/50 mb-4">
              Enter your TrueFans ID to link your account and enable fan engagement features.
            </p>
            <form onSubmit={handleConnect} className="space-y-4">
              <input
                type="text"
                value={connectId}
                onChange={(e) => setConnectId(e.target.value)}
                required
                placeholder="Your TrueFans ID..."
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-truefans-orange/50"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowConnect(false)} className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light">Cancel</button>
                <button type="submit" disabled={connecting || !connectId.trim()} className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-truefans-orange to-truefans-amber rounded-lg hover:opacity-90 disabled:opacity-50">
                  {connecting ? "Connecting..." : "Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {data?.mock && (
        <div className="bg-truefans-orange/5 border border-truefans-orange/20 rounded-xl px-4 py-3 text-xs text-truefans-orange">
          Showing demo data. Connect your TrueFans account for real stats.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-surface border border-truefans-orange/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-extrabold">{stat.value}</div>
            <div className="text-xs text-foreground/50 mt-1">{stat.change}</div>
            <div className="text-xs text-foreground/40 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Donations */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Recent Fan Donations</h2>
            <span className="text-xs text-foreground/40">Last 7 days</span>
          </div>
          <div className="divide-y divide-border">
            {recentDonations.length === 0 && (
              <div className="p-8 text-center text-foreground/40 text-sm">No recent donations.</div>
            )}
            {recentDonations.map((donation, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-surface-light/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-truefans-orange/20 to-truefans-amber/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-truefans-orange" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{donation.fan}</div>
                    <div className="text-xs text-foreground/40">{donation.show}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-success">${donation.amount}</span>
                  <span className="text-xs text-foreground/30">{donation.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fans */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-truefans-amber" />
            Top Fans
          </h3>
          <div className="space-y-3">
            {topFans.length === 0 && (
              <p className="text-sm text-foreground/40">No fan data yet.</p>
            )}
            {topFans.map((fan, i) => (
              <div key={fan.name} className="flex items-center justify-between p-3 bg-surface-light/50 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-truefans-orange w-4">#{i + 1}</span>
                  <div>
                    <div className="text-sm font-medium">{fan.name}</div>
                    <div className="text-xs text-foreground/40">{fan.shows} shows · Since {fan.since}</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-success">${fan.totalDonated}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Features */}
      <div>
        <h2 className="font-bold text-lg mb-4">TrueFans CONNECT Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationFeatures.map((feature) => (
            <div key={feature.title} className="bg-surface border border-truefans-orange/10 rounded-2xl p-5 hover:border-truefans-orange/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-truefans-orange/10 to-truefans-amber/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-truefans-orange" />
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                  {feature.status}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-foreground/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-truefans-orange/10 via-truefans-amber/10 to-truefans-orange/10 border border-truefans-orange/20 rounded-2xl p-8 text-center glow-truefans">
        <h3 className="text-2xl font-extrabold mb-2">
          PR + Fan Engagement = <span className="gradient-text-truefans">Real Growth</span>
        </h3>
        <p className="text-foreground/50 mb-6 max-w-xl mx-auto">
          Every press campaign you run feeds into TrueFans CONNECT. When
          journalists write about you, fans find you. When fans find you, they
          show up, donate, and spread the word.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://truefansconnect.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-truefans-orange to-truefans-amber px-6 py-3 rounded-xl hover:opacity-90"
          >
            Visit TrueFans CONNECT
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://apps.apple.com/us/app/truefans-fm/id6747340246"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 border border-border px-6 py-3 rounded-xl hover:bg-surface transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            Get the App
          </a>
        </div>
      </div>
    </div>
  );
}
