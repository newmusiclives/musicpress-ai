"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  Newspaper,
  Radio,
  Headphones,
  Mic2,
  Globe,
  Mail,
} from "lucide-react";

const tabs = [
  { id: "journalists", label: "Journalists", icon: Newspaper, count: "125K+" },
  { id: "curators", label: "Playlist Curators", icon: Headphones, count: "45K+" },
  { id: "blogs", label: "Blogs & Outlets", icon: Globe, count: "80K+" },
  { id: "podcasts", label: "Podcasters", icon: Mic2, count: "200K+" },
];

const journalistData = [
  { name: "Jessica Morrison", outlet: "Pitchfork", genre: "Indie, Alt-Rock", region: "US", email: true },
  { name: "David Park", outlet: "Rolling Stone", genre: "Rock, Pop", region: "US", email: true },
  { name: "Amara Johnson", outlet: "NME", genre: "Indie, Electronic", region: "UK", email: true },
  { name: "Liam O'Brien", outlet: "Consequence of Sound", genre: "Rock, Metal", region: "US", email: true },
  { name: "Sofia Garcia", outlet: "Remezcla", genre: "Latin, Urban", region: "US/LATAM", email: true },
  { name: "Thomas Mueller", outlet: "Musikexpress", genre: "Indie, Electronic", region: "DE", email: true },
];

const curatorData = [
  { name: "Spotify Editorial", outlet: "New Music Friday", genre: "All Genres", region: "Global", email: true },
  { name: "IndieShuffle Team", outlet: "IndieShuffle", genre: "Indie, Folk", region: "Global", email: true },
  { name: "Alex Rivera", outlet: "Chill Vibes Playlist", genre: "Lo-Fi, Chill", region: "US", email: true },
  { name: "Noise Curator", outlet: "Discover Weekly Feeder", genre: "Electronic, Dance", region: "Global", email: true },
  { name: "Maya Sato", outlet: "Fresh Finds", genre: "Pop, R&B", region: "US", email: true },
  { name: "BeatDiggers", outlet: "Hip Hop Central", genre: "Hip Hop, Rap", region: "US", email: true },
];

const blogData = [
  { name: "Brooklyn Vegan", outlet: "Music Blog", genre: "Indie, Punk", region: "US", email: true },
  { name: "Line of Best Fit", outlet: "Music Publication", genre: "Indie, Electronic", region: "UK", email: true },
  { name: "Earmilk", outlet: "Music Blog", genre: "Electronic, Hip Hop", region: "US", email: true },
  { name: "The 405", outlet: "Music Blog", genre: "Indie, Alt", region: "UK", email: true },
  { name: "Pigeons & Planes", outlet: "Music Discovery", genre: "All Genres", region: "US", email: true },
  { name: "Clash Magazine", outlet: "Music Magazine", genre: "Rock, Pop", region: "UK", email: true },
];

const podcastData = [
  { name: "Song Exploder", outlet: "Hrishikesh Hirway", genre: "All Genres", region: "US", email: true },
  { name: "Dissect Podcast", outlet: "Cole Cuchna", genre: "Hip Hop, R&B", region: "US", email: true },
  { name: "Switched on Pop", outlet: "Nate Sloan", genre: "Pop", region: "US", email: true },
  { name: "Sound Opinions", outlet: "WBEZ Chicago", genre: "Rock, Indie", region: "US", email: true },
  { name: "Tape Notes", outlet: "John Kennedy", genre: "Production, Indie", region: "UK", email: true },
  { name: "Broken Record", outlet: "Rick Rubin", genre: "All Genres", region: "US", email: true },
];

const dataMap: Record<string, typeof journalistData> = {
  journalists: journalistData,
  curators: curatorData,
  blogs: blogData,
  podcasts: podcastData,
};

export default function DatabasePreview() {
  const [activeTab, setActiveTab] = useState("journalists");

  return (
    <section id="database" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            The Largest{" "}
            <span className="gradient-text">Music Media Database</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            450,000+ verified contacts across music journalists, playlist
            curators, blogs, and podcasters. Updated daily with AI.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-foreground/60 hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-white/20"
                    : "bg-foreground/10"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name, outlet, genre, or region..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none"
            />
            <button className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-foreground/40 border-b border-border">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Outlet / Show</th>
                  <th className="px-4 py-3 font-medium">Genre Focus</th>
                  <th className="px-4 py-3 font-medium">Region</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {dataMap[activeTab].map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-surface-light/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-xs font-bold">{item.name[0]}</span>
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/60">
                      {item.outlet}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/60">
                      {item.genre}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/60">
                      {item.region}
                    </td>
                    <td className="px-4 py-3">
                      {item.email && (
                        <div className="flex items-center gap-1 text-success">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 text-center text-sm text-foreground/40 border-t border-border">
            Showing 6 of {tabs.find((t) => t.id === activeTab)?.count} contacts
            —{" "}
            <a href="/dashboard/contacts" className="text-primary hover:underline">
              Sign up to access full database
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
