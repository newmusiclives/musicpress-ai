"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Sparkles,
  Send,
  Eye,
  MoreVertical,
  Wand2,
  Loader2,
  AlertCircle,
  X,
  Trash2,
  Edit3,
  Save,
} from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  subtitle: string | null;
  body: string;
  type: string;
  status: string;
  language: string;
  tone: string;
  outletsReached: number;
  totalViews: number;
  distributedAt: string | null;
  createdAt: string;
}

const templates = [
  { name: "Album / EP Release", icon: "🎵" },
  { name: "Single Drop", icon: "🎤" },
  { name: "Tour Announcement", icon: "🚌" },
  { name: "Venue Event", icon: "🏟️" },
  { name: "Festival Lineup", icon: "🎪" },
  { name: "Award / Nomination", icon: "🏆" },
  { name: "Collaboration", icon: "🤝" },
  { name: "Signing / Deal", icon: "📝" },
];

const languages = ["English", "Spanish", "French", "German", "Portuguese", "Japanese"];
const tones = ["Professional Tone", "Casual / Indie", "Formal / Corporate", "Energetic / Hype"];

export default function PressReleasesPage() {
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLanguage, setAiLanguage] = useState("English");
  const [aiTone, setAiTone] = useState("Professional Tone");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ title: string; subtitle: string; body: string } | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [distributing, setDistributing] = useState<string | null>(null);

  async function fetchReleases() {
    try {
      const res = await fetch("/api/press-releases");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReleases(data.pressReleases || []);
    } catch (err) {
      setError("Failed to load press releases");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReleases();
  }, []);

  async function handleGenerate() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const toneMap: Record<string, string> = {
        "Professional Tone": "professional",
        "Casual / Indie": "casual",
        "Formal / Corporate": "formal",
        "Energetic / Hype": "energetic",
      };
      const langMap: Record<string, string> = { English: "en", Spanish: "es", French: "fr", German: "de", Portuguese: "pt", Japanese: "ja" };
      const res = await fetch("/api/press-releases/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: aiPrompt,
          type: "General",
          tone: toneMap[aiTone] || "professional",
          language: langMap[aiLanguage] || "en",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedContent({
          title: data.title || "",
          subtitle: data.subtitle || "",
          body: data.body || "",
        });
      }
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!generatedContent) return;
    setSavingDraft(true);
    try {
      const res = await fetch("/api/press-releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedContent.title,
          subtitle: generatedContent.subtitle,
          body: generatedContent.body,
          type: "General",
          status: "draft",
        }),
      });
      if (res.ok) {
        setGeneratedContent(null);
        setAiPrompt("");
        await fetchReleases();
      }
    } catch (err) {
      console.error("Failed to save draft:", err);
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleDistribute(releaseId: string) {
    setDistributing(releaseId);
    try {
      const res = await fetch(`/api/press-releases/${releaseId}/distribute`, { method: "POST" });
      if (res.ok) {
        await fetchReleases();
      }
    } catch (err) {
      console.error("Failed to distribute:", err);
    } finally {
      setDistributing(null);
    }
    setMenuOpen(null);
  }

  async function handleDelete(releaseId: string) {
    if (!confirm("Delete this press release?")) return;
    try {
      const res = await fetch(`/api/press-releases/${releaseId}`, { method: "DELETE" });
      if (res.ok) {
        setReleases((prev) => prev.filter((r) => r.id !== releaseId));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
    setMenuOpen(null);
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
          <h1 className="text-3xl font-extrabold">Press Releases</h1>
          <p className="text-foreground/50 mt-1">
            Create, manage, and distribute press releases
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Writer
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* AI Writer Panel */}
      {showAI && (
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">AI Press Release Writer</h3>
              <p className="text-xs text-foreground/50">
                Describe your news and AI will generate a professional press release in AP style
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-foreground/50 mb-2 block">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {templates.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setAiPrompt(`Write a press release for: ${t.name}`)}
                    className="flex items-center gap-1.5 text-xs bg-surface border border-border rounded-lg px-3 py-2 hover:border-primary/30 transition-colors"
                  >
                    <span>{t.icon}</span>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your news... e.g. 'We're an indie rock band from Austin releasing our debut album Electric Dreams on April 15...'"
              className="w-full bg-surface border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 transition-colors min-h-[120px] resize-none"
            />

            <div className="flex items-center gap-3">
              <select
                value={aiLanguage}
                onChange={(e) => setAiLanguage(e.target.value)}
                className="bg-surface border border-border rounded-lg text-xs text-foreground/60 px-3 py-2 outline-none"
              >
                {languages.map((l) => <option key={l}>{l}</option>)}
              </select>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="bg-surface border border-border rounded-lg text-xs text-foreground/60 px-3 py-2 outline-none"
              >
                {tones.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button
                onClick={handleGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                className="ml-auto flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-accent px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? "Generating..." : "Generate Press Release"}
              </button>
            </div>
          </div>

          {/* Generated content preview */}
          {generatedContent && (
            <div className="mt-4 bg-surface border border-border rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground/60">Generated Press Release</h4>
                <button
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {savingDraft ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  {savingDraft ? "Saving..." : "Save as Draft"}
                </button>
              </div>
              <h3 className="text-lg font-bold">{generatedContent.title}</h3>
              {generatedContent.subtitle && (
                <p className="text-sm text-foreground/60 italic">{generatedContent.subtitle}</p>
              )}
              <div className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed">
                {generatedContent.body}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Releases list */}
      <div className="space-y-3">
        {releases.length === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center text-foreground/40 text-sm">
            No press releases yet. Use the AI Writer to create your first one.
          </div>
        )}
        {releases.map((release) => (
          <div
            key={release.id}
            className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-1">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{release.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-foreground/40">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      release.status === "distributed"
                        ? "bg-success/10 text-success"
                        : release.status === "scheduled"
                        ? "bg-warning/10 text-warning"
                        : "bg-foreground/10 text-foreground/50"
                    }`}>
                      {release.status}
                    </span>
                    <span>{release.type}</span>
                    <span>·</span>
                    <span>{new Date(release.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {release.status === "distributed" && (
                  <div className="flex items-center gap-4 mr-4">
                    <div className="text-center">
                      <div className="text-sm font-bold">{release.outletsReached}</div>
                      <div className="text-xs text-foreground/40">Outlets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">{release.totalViews.toLocaleString()}</div>
                      <div className="text-xs text-foreground/40">Views</div>
                    </div>
                  </div>
                )}
                {(release.status === "draft" || release.status === "saved") && (
                  <button
                    onClick={() => handleDistribute(release.id)}
                    disabled={distributing === release.id}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-success to-accent px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {distributing === release.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    Distribute
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === release.id ? null : release.id)}
                    className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-foreground/40" />
                  </button>
                  {menuOpen === release.id && (
                    <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-xl z-10 py-1 w-44">
                      {release.status !== "distributed" && (
                        <button
                          onClick={() => { handleDistribute(release.id); }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-surface-light flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Distribute
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(release.id)}
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
          </div>
        ))}
      </div>

      {/* Distribution info */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Distribution Network</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Music Publications", count: "500+", desc: "Pitchfork, NME, Stereogum..." },
            { label: "News Wires", count: "AP, UPI", desc: "Major wire services" },
            { label: "Streaming Blogs", count: "200+", desc: "Spotify blogs, Apple Music..." },
            { label: "AI Indexed", count: "5 AIs", desc: "ChatGPT, Perplexity, Grok..." },
          ].map((item) => (
            <div key={item.label} className="bg-surface-light/50 rounded-xl p-4 border border-border/50">
              <div className="text-lg font-bold text-primary">{item.count}</div>
              <div className="text-sm font-medium mt-1">{item.label}</div>
              <div className="text-xs text-foreground/40">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
