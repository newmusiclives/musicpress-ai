"use client";
import {
  Mic2,
  Target,
  TrendingUp,
  Music,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  "AI finds journalists who cover your genre",
  "One-click personalized pitch emails",
  "Professional press releases in seconds",
  "Electronic Press Kit builder included",
  "Track who opens and responds to pitches",
  "Get alerts when writers seek music stories",
  "Distribute to Spotify editorial blogs",
  "TrueFans CONNECT for live show donations",
];

export default function ForArtists() {
  return (
    <section id="artists" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Mic2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                For Artists & Bands
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Get Your Music in Front of{" "}
              <span className="gradient-text">the Right People</span>
            </h2>
            <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
              Stop cold-emailing generic press lists. Our AI analyzes your
              genre, sound, and story to match you with journalists, bloggers,
              and curators who actually want to hear from you.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/70">{benefit}</span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-base font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-6 py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Start Your First Campaign
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right - mock UI */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">Artist Campaign</div>
                <div className="text-xs text-foreground/50">
                  AI-Generated Media List
                </div>
              </div>
            </div>

            {[
              {
                name: "Sarah Chen",
                outlet: "Pitchfork",
                beat: "Indie Rock",
                match: 97,
              },
              {
                name: "Marcus Davis",
                outlet: "Rolling Stone",
                beat: "Alt-Rock",
                match: 94,
              },
              {
                name: "Emily Wright",
                outlet: "NME",
                beat: "Indie / Alt",
                match: 91,
              },
              {
                name: "Jake Torres",
                outlet: "Stereogum",
                beat: "Indie Rock",
                match: 89,
              },
              {
                name: "Aisha Patel",
                outlet: "The FADER",
                beat: "Emerging Artists",
                match: 86,
              },
            ].map((journalist) => (
              <div
                key={journalist.name}
                className="flex items-center justify-between bg-surface-light/50 rounded-xl p-3 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {journalist.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{journalist.name}</div>
                    <div className="text-xs text-foreground/50">
                      {journalist.outlet} · {journalist.beat}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-success" />
                    <span className="text-xs font-bold text-success">
                      {journalist.match}%
                    </span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-foreground/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
