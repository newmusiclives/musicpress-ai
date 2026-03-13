"use client";
import { useState, useEffect } from "react";
import {
  Radio,
  ExternalLink,
  TrendingUp,
  Eye,
  Share2,
  Newspaper,
  Globe,
  Mic2,
  Plus,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface MediaMention {
  id: string;
  title: string;
  outlet: string;
  author: string | null;
  url: string | null;
  type: string;
  sentiment: string;
  reach: string | null;
  date: string;
}

const sentimentColors: Record<string, string> = {
  positive: "bg-success/10 text-success",
  neutral: "bg-foreground/10 text-foreground/50",
  negative: "bg-danger/10 text-danger",
};

const mentionTypes = ["Review", "Roundup", "News", "Podcast", "Playlist", "Feature", "Interview"];
const sentiments = ["positive", "neutral", "negative"];

function parseReach(reach: string | null): number {
  if (!reach) return 0;
  const cleaned = reach.replace(/[^0-9.KMB]/gi, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (cleaned.toUpperCase().includes("B")) return num * 1_000_000_000;
  if (cleaned.toUpperCase().includes("M")) return num * 1_000_000;
  if (cleaned.toUpperCase().includes("K")) return num * 1_000;
  return num;
}

function formatReach(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
}

export default function MediaMonitorPage() {
  const [mentions, setMentions] = useState<MediaMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  // Add form state
  const [formTitle, setFormTitle] = useState("");
  const [formOutlet, setFormOutlet] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formType, setFormType] = useState("News");
  const [formSentiment, setFormSentiment] = useState("positive");
  const [formReach, setFormReach] = useState("");

  async function fetchMentions() {
    try {
      const res = await fetch("/api/media-mentions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMentions(data.mentions || []);
    } catch (err) {
      setError("Failed to load media mentions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMentions();
  }, []);

  async function handleAddMention(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle || !formOutlet) return;
    setAdding(true);
    try {
      const res = await fetch("/api/media-mentions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          outlet: formOutlet,
          author: formAuthor || null,
          url: formUrl || null,
          type: formType,
          sentiment: formSentiment,
          reach: formReach || null,
        }),
      });
      if (res.ok) {
        setShowAdd(false);
        setFormTitle("");
        setFormOutlet("");
        setFormAuthor("");
        setFormUrl("");
        setFormReach("");
        await fetchMentions();
      }
    } catch (err) {
      console.error("Failed to add mention:", err);
    } finally {
      setAdding(false);
    }
  }

  // Computed stats
  const totalReach = mentions.reduce((sum, m) => sum + parseReach(m.reach), 0);
  const posCount = mentions.filter((m) => m.sentiment === "positive").length;
  const sentimentScore = mentions.length > 0 ? Math.round((posCount / mentions.length) * 100) : 0;

  // Coverage by type
  const typeMap: Record<string, number> = {};
  mentions.forEach((m) => { typeMap[m.type] = (typeMap[m.type] || 0) + 1; });
  const coverageTypes = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const typeIcons: Record<string, typeof Newspaper> = { Podcast: Mic2, Blog: Globe };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Media Monitor</h1>
          <p className="text-foreground/50 mt-1">
            Track mentions, coverage, and press pickup in real-time
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Mention
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Add Mention Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add Media Mention</h3>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>
            <form onSubmit={handleAddMention} className="space-y-4">
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Title</label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required placeholder="Article / mention title" className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Outlet</label>
                  <input type="text" value={formOutlet} onChange={(e) => setFormOutlet(e.target.value)} required placeholder="e.g. Pitchfork" className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Author</label>
                  <input type="text" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} placeholder="Author name" className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">URL</label>
                <input type="url" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://..." className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none">
                    {mentionTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Sentiment</label>
                  <select value={formSentiment} onChange={(e) => setFormSentiment(e.target.value)} className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none capitalize">
                    {sentiments.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Reach</label>
                  <input type="text" value={formReach} onChange={(e) => setFormReach(e.target.value)} placeholder="e.g. 2.4M" className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light">Cancel</button>
                <button type="submit" disabled={adding || !formTitle || !formOutlet} className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50">
                  {adding ? "Adding..." : "Add Mention"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Mentions", value: String(mentions.length), icon: Radio, change: `${mentions.length} tracked` },
          { label: "Total Reach", value: formatReach(totalReach), icon: Eye, change: "estimated" },
          { label: "Sentiment Score", value: `${sentimentScore}%`, icon: TrendingUp, change: "Positive" },
          { label: "Outlets", value: String(new Set(mentions.map((m) => m.outlet)).size), icon: Share2, change: "unique outlets" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground/50">{stat.label}</span>
            </div>
            <div className="text-2xl font-extrabold">{stat.value}</div>
            <div className="text-xs text-success mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Coverage by type */}
      {coverageTypes.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {coverageTypes.map(([type, count], i) => {
            const colors = ["from-primary to-primary-light", "from-accent to-accent-light", "from-truefans-orange to-truefans-amber"];
            const Icon = typeIcons[type] || Newspaper;
            return (
              <div key={type} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[i % 3]} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-xs text-foreground/50">{type}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mentions feed */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold">Recent Coverage</h2>
        </div>
        <div className="divide-y divide-border">
          {mentions.length === 0 && (
            <div className="p-8 text-center text-foreground/40 text-sm">
              No media mentions yet. Add your first mention to start tracking coverage.
            </div>
          )}
          {mentions.map((mention) => (
            <div
              key={mention.id}
              className="p-5 hover:bg-surface-light/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                    {mention.type === "Podcast" ? (
                      <Mic2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Newspaper className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{mention.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-foreground/40">
                      <span className="font-medium text-foreground/60">{mention.outlet}</span>
                      {mention.author && (
                        <>
                          <span>·</span>
                          <span>{mention.author}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{new Date(mention.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sentimentColors[mention.sentiment] || sentimentColors.neutral}`}>
                    {mention.sentiment}
                  </span>
                  {mention.reach && (
                    <div className="text-right">
                      <div className="text-xs font-bold">{mention.reach}</div>
                      <div className="text-xs text-foreground/40">reach</div>
                    </div>
                  )}
                  {mention.url && (
                    <a
                      href={mention.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-surface-light transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-foreground/40" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
