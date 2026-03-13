"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Plus,
  Star,
  Send,
  FileText,
  Image,
  Music,
  Zap,
  ExternalLink,
  Megaphone,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number | null;
  rating: number;
  description: string | null;
  _count?: { shows: number };
}

interface Show {
  id: string;
  artist: string;
  date: string;
  time: string | null;
  ticketsSold: number;
  capacity: number;
  pressStatus: string;
  coverage: number;
}

interface TrueFansStats {
  totalFans: number;
  totalDonations: number;
  fanEngagement: number;
}

const pressKit = [
  { label: "Venue Bio", icon: FileText, status: "Complete" },
  { label: "Photo Gallery", icon: Image, status: "12 photos" },
  { label: "Past Artists", icon: Music, status: "48 listed" },
  { label: "Press Contact", icon: Send, status: "Complete" },
];

export default function VenuesPage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [truefansStats, setTruefansStats] = useState<TrueFansStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddShow, setShowAddShow] = useState(false);
  const [adding, setAdding] = useState(false);

  // Add show form
  const [formArtist, setFormArtist] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formCapacity, setFormCapacity] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const venueRes = await fetch("/api/venues");
        if (!venueRes.ok) throw new Error("Failed to fetch venues");
        const venueData = await venueRes.json();
        const venues = venueData.venues || [];

        if (venues.length > 0) {
          const v = venues[0];
          setVenue(v);

          const showRes = await fetch(`/api/venues/${v.id}/shows`);
          if (showRes.ok) {
            const showData = await showRes.json();
            setShows(showData.shows || []);
          }
        }

        // Fetch TrueFans stats
        try {
          const tfRes = await fetch("/api/truefans/connect");
          if (tfRes.ok) {
            const tfData = await tfRes.json();
            setTruefansStats(tfData.stats);
          }
        } catch {
          // optional
        }
      } catch (err) {
        setError("Failed to load venue data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAddShow(e: React.FormEvent) {
    e.preventDefault();
    if (!venue || !formArtist || !formDate) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/venues/${venue.id}/shows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: formArtist,
          date: formDate,
          time: formTime || null,
          capacity: formCapacity ? parseInt(formCapacity) : venue.capacity || 0,
        }),
      });
      if (res.ok) {
        setShowAddShow(false);
        setFormArtist("");
        setFormDate("");
        setFormTime("");
        setFormCapacity("");
        // Refresh shows
        const showRes = await fetch(`/api/venues/${venue.id}/shows`);
        if (showRes.ok) {
          const showData = await showRes.json();
          setShows(showData.shows || []);
        }
      }
    } catch (err) {
      console.error("Failed to add show:", err);
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Venue Tools</h1>
          <p className="text-foreground/50 mt-1">No venues found. Create one to get started.</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Venue Tools</h1>
          <p className="text-foreground/50 mt-1">
            Manage your venue&apos;s press presence and show promotions
          </p>
        </div>
        <button
          onClick={() => setShowAddShow(true)}
          className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-success px-5 py-2.5 rounded-xl hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Show
        </button>
      </div>

      {/* Add Show Modal */}
      {showAddShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add Show</h3>
              <button onClick={() => setShowAddShow(false)} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>
            <form onSubmit={handleAddShow} className="space-y-4">
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Artist</label>
                <input type="text" value={formArtist} onChange={(e) => setFormArtist(e.target.value)} required placeholder="Artist name" className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Date</label>
                  <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">Time</label>
                  <input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-foreground/50 mb-1 block">Capacity</label>
                <input type="number" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} placeholder={`Default: ${venue.capacity || 0}`} className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddShow(false)} className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light">Cancel</button>
                <button type="submit" disabled={adding || !formArtist || !formDate} className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-success rounded-lg hover:opacity-90 disabled:opacity-50">
                  {adding ? "Adding..." : "Add Show"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Venue header card */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-success flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{venue.name}</h2>
              <p className="text-sm text-foreground/50">{venue.location} · Capacity: {venue.capacity || "N/A"}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-truefans-amber" />
                  <span className="text-sm font-bold">{venue.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-truefans-orange">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">{truefansStats?.totalFans || 0} fans</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold">{shows.length}</div>
              <div className="text-xs text-foreground/40">Shows</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming shows */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Shows</h2>
          </div>
          <div className="divide-y divide-border">
            {shows.length === 0 && (
              <div className="p-8 text-center text-foreground/40 text-sm">
                No shows yet. Add your first show.
              </div>
            )}
            {shows.map((show) => {
              const ticketPct = show.capacity > 0 ? Math.round((show.ticketsSold / show.capacity) * 100) : 0;
              return (
                <div key={show.id} className="p-4 hover:bg-surface-light/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{show.artist}</div>
                        <div className="text-xs text-foreground/40">
                          {new Date(show.date).toLocaleDateString()} {show.time && `· ${show.time}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-medium">{ticketPct}% sold</div>
                        <div className="text-xs text-foreground/40">tickets</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        show.pressStatus.includes("confirmed") || show.pressStatus.includes("Confirmed")
                          ? "bg-success/10 text-success"
                          : show.pressStatus.includes("sent") || show.pressStatus.includes("Sent")
                          ? "bg-primary/10 text-primary"
                          : show.pressStatus === "scheduled"
                          ? "bg-warning/10 text-warning"
                          : "bg-foreground/10 text-foreground/50"
                      }`}>
                        {show.pressStatus}
                      </span>
                      <div className="flex items-center gap-1">
                        <Megaphone className="w-3 h-3 text-foreground/30" />
                        <span className="text-xs text-foreground/40">{show.coverage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Press Kit */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-4">Venue Press Kit</h3>
            <div className="space-y-3">
              {pressKit.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-surface-light/50 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs text-success">{item.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-semibold text-primary border border-primary/30 rounded-lg py-2 hover:bg-primary/5 transition-colors">
              Edit Press Kit
            </button>
          </div>

          {/* TrueFans widget */}
          <div className="bg-gradient-to-br from-truefans-orange/10 to-truefans-amber/10 border border-truefans-orange/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-truefans-orange" />
              <h3 className="font-bold text-sm gradient-text-truefans">
                TrueFans CONNECT
              </h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Total Fans</span>
                <span className="text-sm font-bold">{truefansStats?.totalFans?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Total Donations</span>
                <span className="text-sm font-bold text-success">${truefansStats?.totalDonations?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Fan Engagement</span>
                <span className="text-sm font-bold text-truefans-orange">{truefansStats?.fanEngagement || 0}%</span>
              </div>
            </div>
            <a
              href="https://truefansconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-truefans-orange border border-truefans-orange/30 rounded-lg py-2 hover:bg-truefans-orange/5 transition-colors"
            >
              Open TrueFans Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
