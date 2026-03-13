"use client";
import {
  MapPin,
  Calendar,
  Megaphone,
  CheckCircle,
  ArrowRight,
  Users,
  Star,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  "Promote upcoming shows to local press",
  "Announce lineups and special events",
  "Build relationships with local music writers",
  "Create venue press kits in minutes",
  "Track coverage across local outlets",
  "Distribute to event calendars automatically",
  "TrueFans CONNECT geo-discovery for shows",
  "Boost walk-in traffic with AI targeting",
];

const upcomingShows = [
  {
    artist: "The Midnight Owls",
    date: "Mar 22",
    status: "Press Sent",
    coverage: 3,
  },
  {
    artist: "Luna & The Wolves",
    date: "Mar 28",
    status: "Confirmed",
    coverage: 5,
  },
  {
    artist: "DJ Solarflare",
    date: "Apr 3",
    status: "Draft",
    coverage: 0,
  },
  {
    artist: "Brass Revolution",
    date: "Apr 10",
    status: "Press Sent",
    coverage: 2,
  },
];

export default function ForVenues() {
  return (
    <section id="venues" className="py-24 bg-surface/30 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - mock UI */}
          <div className="order-2 lg:order-1 bg-surface border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">
                  Venue Dashboard — The Blue Note
                </div>
                <div className="text-xs text-foreground/50">
                  Upcoming Show Press Coverage
                </div>
              </div>
            </div>

            {upcomingShows.map((show) => (
              <div
                key={show.artist}
                className="flex items-center justify-between bg-surface-light/50 rounded-xl p-3 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-success/30 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{show.artist}</div>
                    <div className="text-xs text-foreground/50">
                      {show.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      show.status === "Confirmed"
                        ? "bg-success/10 text-success"
                        : show.status === "Press Sent"
                        ? "bg-primary/10 text-primary"
                        : "bg-foreground/10 text-foreground/50"
                    }`}
                  >
                    {show.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Megaphone className="w-3 h-3 text-foreground/40" />
                    <span className="text-xs text-foreground/50">
                      {show.coverage} hits
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-truefans-orange" />
                <span className="text-xs text-foreground/50">
                  <span className="text-truefans-orange font-semibold">
                    TrueFans CONNECT
                  </span>{" "}
                  active — 142 fans nearby
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-truefans-amber" />
                <span className="text-xs font-bold text-truefans-amber">
                  4.8
                </span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">
                For Live Music Venues
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Fill Every Seat with{" "}
              <span className="gradient-text">Smarter PR</span>
            </h2>
            <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
              Promote your shows to local music writers, bloggers, and event
              calendars automatically. Build lasting press relationships that
              keep your venue in the spotlight.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/70">{benefit}</span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/venues"
              className="inline-flex items-center gap-2 text-base font-bold text-white bg-gradient-to-r from-accent to-success px-6 py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Set Up Your Venue
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
