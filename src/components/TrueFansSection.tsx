"use client";
import {
  Zap,
  MapPin,
  DollarSign,
  Radio,
  BarChart3,
  Heart,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const truefansFeatures = [
  {
    icon: MapPin,
    title: "Geo-Powered Discovery",
    description:
      "Fans find live music near them instantly. Your shows appear on the TrueFans map, driving walk-ins and building audiences organically.",
  },
  {
    icon: DollarSign,
    title: "Instant Fan Donations",
    description:
      "Accept donations during live performances with zero setup fees. Fans support artists directly — no waiting periods, instant payouts.",
  },
  {
    icon: Radio,
    title: "Live Performance Codes",
    description:
      "Create custom QR codes for each show. Fans scan to connect, donate, buy merch, and follow — all in one seamless experience.",
  },
  {
    icon: BarChart3,
    title: "Fan Analytics",
    description:
      "Track fan engagement, donation trends, show attendance, and geographic reach. Understand your audience like never before.",
  },
  {
    icon: Heart,
    title: "Fan Relationship Building",
    description:
      "Automated thank-you messages, fan alerts for upcoming shows, and direct artist-to-fan communication channels.",
  },
  {
    icon: Zap,
    title: "PR + Fan Synergy",
    description:
      "Combine press coverage with fan engagement. When journalists write about you, TrueFans drives fans to your shows and music.",
  },
];

export default function TrueFansSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-truefans-orange/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-truefans-orange/10 border border-truefans-orange/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-truefans-orange" />
            <span className="text-sm text-truefans-orange font-medium">
              Powered by TrueFans CONNECT
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text-truefans">TrueFans CONNECT</span>{" "}
            — Where PR Meets{" "}
            <span className="gradient-text">Fan Engagement</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-3xl mx-auto leading-relaxed">
            MusicPress AI is built on the TrueFans CONNECT ecosystem.
            Every press campaign you run feeds into real fan connections —
            turning media coverage into loyal supporters who show up, donate,
            and spread the word.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {truefansFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group bg-surface/60 border border-truefans-orange/10 rounded-2xl p-6 hover:border-truefans-orange/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-truefans-orange to-truefans-amber flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-truefans-orange/10 via-truefans-amber/10 to-truefans-orange/10 border border-truefans-orange/20 rounded-2xl p-8 md:p-12 text-center glow-truefans">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            Already on TrueFans CONNECT?
          </h3>
          <p className="text-foreground/60 mb-6 max-w-xl mx-auto">
            Connect your TrueFans account to unlock geo-discovery, instant
            donations, and fan analytics alongside your PR campaigns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://truefansconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base font-bold text-white bg-gradient-to-r from-truefans-orange to-truefans-amber px-8 py-3.5 rounded-xl hover:opacity-90 transition-all"
            >
              Visit TrueFans CONNECT
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="/dashboard/truefans"
              className="inline-flex items-center gap-2 text-base font-semibold text-truefans-orange border border-truefans-orange/30 px-8 py-3.5 rounded-xl hover:bg-truefans-orange/5 transition-all"
            >
              Connect Your Account
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
