"use client";
import Link from "next/link";
import {
  Zap,
  Users,
  Newspaper,
  Radio,
  ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Music Journalists", value: "125,000+", icon: Newspaper },
  { label: "Playlist Curators", value: "45,000+", icon: Radio },
  { label: "Blogs & Outlets", value: "80,000+", icon: Users },
  { label: "Podcasters", value: "200,000+", icon: Radio },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center animated-gradient overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-truefans-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface/80 border border-border rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-truefans-orange animate-pulse" />
            <span className="text-sm text-foreground/70">
              Powered by{" "}
              <span className="gradient-text-truefans font-semibold">
                TrueFans CONNECT
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            AI-Powered PR for{" "}
            <span className="gradient-text">Music Artists</span> &{" "}
            <span className="gradient-text">Live Venues</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find the right music journalists, bloggers, playlist curators, and
            podcasters. Create press releases, run campaigns, and get your music
            heard — all powered by AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-8 py-4 rounded-xl hover:opacity-90 transition-all glow-primary"
            >
              <Zap className="w-5 h-5" />
              Start Free — No Card Required
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 text-lg font-semibold text-foreground/70 border border-border px-8 py-4 rounded-xl hover:bg-surface transition-all"
            >
              See How It Works
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface/60 backdrop-blur-sm border border-border rounded-xl p-4 text-center"
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
