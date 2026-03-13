"use client";
import { useState, useEffect } from "react";
import {
  Send,
  Plus,
  BarChart3,
  Mail,
  Eye,
  MessageSquare,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Loader2,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  subject: string | null;
  body: string | null;
  createdAt: string;
  sentAt: string | null;
  _count?: { recipients: number };
}

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  completed: "bg-primary/10 text-primary",
  draft: "bg-foreground/10 text-foreground/50",
  scheduled: "bg-warning/10 text-warning",
};

const campaignTypes = [
  "Album Release", "Single Release", "Tour Promo", "Event Promo",
  "Venue Event", "Podcast Pitch", "Festival", "General",
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Create form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Album Release");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");
  const [creating, setCreating] = useState(false);

  async function fetchCampaigns() {
    try {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      setError("Failed to load campaigns");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filtered = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  // Compute quick stats from real data
  const totalSent = campaigns.reduce((sum, c) => sum + (c._count?.recipients || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName) return;
    setCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          type: formType,
          subject: formSubject || null,
          body: formBody || null,
          status: "draft",
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setFormName("");
        setFormSubject("");
        setFormBody("");
        await fetchCampaigns();
      }
    } catch (err) {
      console.error("Failed to create campaign:", err);
    } finally {
      setCreating(false);
    }
  }

  async function handleSend(campaignId: string) {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, { method: "POST" });
      if (res.ok) {
        await fetchCampaigns();
      }
    } catch (err) {
      console.error("Failed to send campaign:", err);
    }
  }

  async function handleDelete(campaignId: string) {
    if (!confirm("Delete this campaign?")) return;
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, { method: "DELETE" });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      }
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
    setMenuOpen(null);
  }

  async function handleAIGenerate() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/press-releases/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: aiPrompt,
          type: "Campaign",
          tone: "professional",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.body || data.title || "Generation complete.");
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setAiLoading(false);
    }
  }

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
          <h1 className="text-3xl font-extrabold">Campaigns</h1>
          <p className="text-foreground/50 mt-1">
            Manage your media outreach campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">New Campaign</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Campaign Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  placeholder="e.g. New Album Launch"
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none"
                >
                  {campaignTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Subject Line</label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Body</label>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Campaign email body..."
                  rows={4}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !formName}
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Recipients", value: totalSent.toLocaleString(), icon: Mail },
          { label: "Campaigns", value: String(campaigns.length), icon: BarChart3 },
          { label: "Active", value: String(activeCampaigns), icon: Send },
          { label: "Drafts", value: String(campaigns.filter((c) => c.status === "draft").length), icon: MessageSquare },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground/50">{stat.label}</span>
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {["all", "active", "scheduled", "draft", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? "bg-primary text-white"
                : "bg-surface border border-border text-foreground/60 hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Campaign cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center text-foreground/40 text-sm">
            No campaigns found. Create your first campaign to get started.
          </div>
        )}
        {filtered.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-1">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{campaign.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[campaign.status] || statusStyles.draft}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-foreground/40">
                    <span>{campaign.type}</span>
                    <span>·</span>
                    <span>{campaign._count?.recipients || 0} contacts</span>
                    <span>·</span>
                    <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {campaign.status === "draft" && (
                  <button
                    onClick={() => handleSend(campaign.id)}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-success to-accent px-3 py-1.5 rounded-lg hover:opacity-90"
                  >
                    <Send className="w-3 h-3" />
                    Send
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === campaign.id ? null : campaign.id)}
                    className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-foreground/40" />
                  </button>
                  {menuOpen === campaign.id && (
                    <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-xl z-10 py-1 w-40">
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-light flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {campaign.subject && (
              <div className="mt-3 ml-14 text-xs text-foreground/40">
                Subject: {campaign.subject}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Campaign Builder CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold">AI Campaign Builder</h3>
              <p className="text-sm text-foreground/50">
                Describe your release and AI will help draft campaign content.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAIBuilder(!showAIBuilder)}
            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-accent px-5 py-2.5 rounded-xl hover:opacity-90 whitespace-nowrap"
          >
            {showAIBuilder ? "Close" : "Try AI Builder"}
            <ChevronRight className={`w-4 h-4 transition-transform ${showAIBuilder ? "rotate-90" : ""}`} />
          </button>
        </div>

        {showAIBuilder && (
          <div className="mt-4 space-y-4">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your campaign... e.g. 'New indie rock album launching April 15, targeting music blogs and playlist curators'"
              className="w-full bg-surface border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 min-h-[100px] resize-none"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-accent px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? "Generating..." : "Generate"}
              </button>
            </div>
            {aiResult && (
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="text-xs text-foreground/40 mb-2">AI Generated Content:</div>
                <div className="text-sm text-foreground/80 whitespace-pre-wrap">{aiResult}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
