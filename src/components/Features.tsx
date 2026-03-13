"use client";
import {
  Search,
  Sparkles,
  Send,
  BarChart3,
  Radio,
  Users,
  Music2,
  Globe,
  Bell,
  Layers,
  Mic2,
  MapPin,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Music Media Database",
    description:
      "Access 125,000+ music journalists, 45,000+ playlist curators, 80,000+ music blogs, and 200,000+ podcast contacts. Filter by genre, region, beat, and outlet type.",
    color: "from-primary to-primary-light",
  },
  {
    icon: Sparkles,
    title: "AI Press Release Writer",
    description:
      "Generate professional press releases for album launches, tour announcements, venue events, and single drops. AP-style formatting with music industry tone.",
    color: "from-accent to-accent-light",
  },
  {
    icon: Send,
    title: "Smart Pitch Campaigns",
    description:
      "AI-personalized pitch emails sent to curated journalist lists. One-click outreach with follow-up sequences and A/B testing built in.",
    color: "from-primary to-accent",
  },
  {
    icon: Users,
    title: "Built-In CRM",
    description:
      "Track every journalist interaction, pitch status, and media relationship. Tag contacts, set reminders, and manage your entire media network.",
    color: "from-success to-accent",
  },
  {
    icon: BarChart3,
    title: "Campaign Analytics",
    description:
      "Real-time open rates, click tracking, response rates, and media pickup analytics. Know exactly which outlets are engaging with your campaigns.",
    color: "from-primary-light to-primary",
  },
  {
    icon: Bell,
    title: "Pitch Request Alerts",
    description:
      "Get notified when journalists are actively looking for music stories. AI matches opportunities to your genre, location, and artist profile.",
    color: "from-warning to-truefans-orange",
  },
  {
    icon: Radio,
    title: "Distribution Network",
    description:
      "Distribute press releases to top music publications, streaming blogs, and podcast directories. Wholesale pricing saves 50-70% on PR wires.",
    color: "from-accent to-primary",
  },
  {
    icon: Mic2,
    title: "Podcast Outreach",
    description:
      "Dedicated podcast database with 200K+ shows. Find music podcasts, interview shows, and industry pods. Pitch directly from the platform.",
    color: "from-truefans-orange to-truefans-amber",
  },
  {
    icon: Globe,
    title: "AI Indexing for Search",
    description:
      "Get your press releases indexed by ChatGPT, Perplexity, Grok, and Gemini. When fans search for your genre, your music shows up.",
    color: "from-primary to-accent",
  },
  {
    icon: MapPin,
    title: "Venue PR Tools",
    description:
      "Dedicated tools for live music venues — promote upcoming shows, announce lineups, manage venue press kits, and build local media relationships.",
    color: "from-success to-accent-light",
  },
  {
    icon: Music2,
    title: "EPK Builder",
    description:
      "Create stunning Electronic Press Kits with bio, photos, music links, tour dates, and social stats. Share a single link with any media contact.",
    color: "from-primary-light to-accent-light",
  },
  {
    icon: Layers,
    title: "TrueFans CONNECT Integration",
    description:
      "Connect your TrueFans profile for instant fan donations, geo-powered discovery at shows, and direct fan-to-artist engagement during live performances.",
    color: "from-truefans-orange to-truefans-amber",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Get Press Coverage</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            A complete AI-powered PR toolkit built specifically for the music
            industry — from finding the right contacts to distributing your story
            worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-surface/60 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:bg-surface"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
