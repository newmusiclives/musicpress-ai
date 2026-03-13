"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  Target,
  Clock,
  Send,
  ExternalLink,
  Filter,
  Star,
  TrendingUp,
  Zap,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface PitchRequest {
  id: string;
  title: string;
  description: string;
  outlet: string;
  journalist: string;
  category: string;
  deadline: string | null;
  genres: string | null;
  regions: string | null;
  createdAt: string;
  _count?: { responses: number };
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function calcMatch(genres: string | null): number {
  if (!genres) return 50;
  const userGenres = ["indie", "rock", "alternative"];
  const reqGenres = genres.toLowerCase().split(",").map((g) => g.trim());
  const overlap = reqGenres.filter((g) => userGenres.some((ug) => g.includes(ug))).length;
  return Math.min(99, 55 + Math.round((overlap / Math.max(reqGenres.length, 1)) * 40));
}

export default function PitchRequestsPage() {
  const [requests, setRequests] = useState<PitchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [pitchModal, setPitchModal] = useState<string | null>(null);
  const [pitchMessage, setPitchMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPitchRequests() {
      try {
        const res = await fetch("/api/pitch-requests");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRequests(data.pitchRequests || []);
      } catch (err) {
        setError("Failed to load pitch requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPitchRequests();
  }, []);

  function toggleStar(id: string) {
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmitPitch(requestId: string) {
    if (!pitchMessage.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/pitch-requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pitchMessage }),
      });
      if (res.ok) {
        setPitchModal(null);
        setPitchMessage("");
      }
    } catch (err) {
      console.error("Failed to submit pitch:", err);
    } finally {
      setSubmitting(false);
    }
  }

  const categories = ["all", ...Array.from(new Set(requests.map((r) => r.category)))];
  const filtered = categoryFilter === "all" ? requests : requests.filter((r) => r.category === categoryFilter);

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
          <h1 className="text-3xl font-extrabold">Pitch Requests</h1>
          <p className="text-foreground/50 mt-1">
            Journalists actively looking for music stories -- matched to your profile
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-xl px-4 py-2.5">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Auto-matching ON</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Alert banner */}
      <div className="bg-gradient-to-r from-warning/10 to-truefans-orange/10 border border-warning/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-warning" />
        </div>
        <div>
          <div className="font-bold text-sm">{requests.length} pitch requests match your profile</div>
          <div className="text-xs text-foreground/50">AI analyzed your genre, location, and press history to find the best opportunities</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-xs font-bold text-success">Active</span>
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                categoryFilter === cat
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-foreground/60 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Pitch Response Modal */}
      {pitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Submit Your Pitch</h3>
              <button onClick={() => { setPitchModal(null); setPitchMessage(""); }} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>
            <p className="text-sm text-foreground/50 mb-4">
              {requests.find((r) => r.id === pitchModal)?.title}
            </p>
            <textarea
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              placeholder="Write your pitch response..."
              rows={6}
              className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setPitchModal(null); setPitchMessage(""); }}
                className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitPitch(pitchModal)}
                disabled={submitting || !pitchMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Sending..." : "Submit Pitch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center text-foreground/40 text-sm">
            No pitch requests found.
          </div>
        )}
        {filtered.map((request) => {
          const matchScore = calcMatch(request.genres);
          return (
            <div
              key={request.id}
              className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mt-0.5">
                    <Bell className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{request.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-foreground/40">
                      <span className="font-medium text-foreground/60">{request.outlet}</span>
                      <span>·</span>
                      <span>{request.journalist}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(request.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-success/10 rounded-lg px-2.5 py-1">
                    <Target className="w-3.5 h-3.5 text-success" />
                    <span className="text-sm font-bold text-success">{matchScore}%</span>
                  </div>
                  <button
                    onClick={() => toggleStar(request.id)}
                    className="p-2 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    <Star className={`w-4 h-4 ${starredIds.has(request.id) ? "text-truefans-amber fill-truefans-amber" : "text-foreground/30"}`} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-foreground/60 mb-4 ml-14">
                {request.description}
              </p>

              <div className="flex items-center justify-between ml-14">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {request.category}
                  </span>
                  {request.deadline && (
                    <span className="text-xs text-foreground/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Deadline: {request.deadline}
                    </span>
                  )}
                  {request._count && request._count.responses > 0 && (
                    <span className="text-xs text-foreground/40">
                      {request._count.responses} response{request._count.responses !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setPitchModal(request.id); setPitchMessage(""); }}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-4 py-1.5 rounded-lg hover:opacity-90"
                  >
                    <Send className="w-3 h-3" />
                    Pitch Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
