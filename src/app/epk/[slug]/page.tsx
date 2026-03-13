"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Music,
  MapPin,
  Globe,
  Mail,
  ExternalLink,
  Calendar,
  Quote,
  Disc3,
  Instagram,
  Twitter,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface EPKData {
  id: string;
  artistName: string;
  bio: string | null;
  genre: string | null;
  location: string | null;
  photoUrls: string | null;
  musicLinks: string | null;
  socialLinks: string | null;
  tourDates: string | null;
  pressQuotes: string | null;
  isPublished: boolean;
  user?: {
    name: string;
    email: string;
    website: string | null;
    spotifyUrl: string | null;
    instagramUrl: string | null;
    twitterUrl: string | null;
  };
}

export default function EPKPage() {
  const params = useParams();
  const [epk, setEpk] = useState<EPKData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/epk/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("EPK not found");
        return res.json();
      })
      .then(setEpk)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !epk) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">EPK Not Found</h1>
          <p className="text-foreground/50 mb-4">{error || "This press kit doesn't exist."}</p>
          <Link href="/" className="text-primary hover:underline">
            Go to MusicPress AI
          </Link>
        </div>
      </div>
    );
  }

  const musicLinks = epk.musicLinks ? JSON.parse(epk.musicLinks) : [];
  const socialLinks = epk.socialLinks ? JSON.parse(epk.socialLinks) : [];
  const tourDates = epk.tourDates ? JSON.parse(epk.tourDates) : [];
  const pressQuotes = epk.pressQuotes ? JSON.parse(epk.pressQuotes) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-64 bg-gradient-to-br from-primary/20 via-surface to-accent/20 flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 pb-8 w-full">
          <div className="flex items-end gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Music className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold">{epk.artistName}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-foreground/50">
                {epk.genre && (
                  <span className="flex items-center gap-1">
                    <Disc3 className="w-4 h-4" />
                    {epk.genre}
                  </span>
                )}
                {epk.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {epk.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Bio */}
        {epk.bio && (
          <section>
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">
              {epk.bio}
            </p>
          </section>
        )}

        {/* Music Links */}
        {musicLinks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Music</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {musicLinks.map((link: { label: string; url: string }, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  <Disc3 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-foreground/30 ml-auto" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Press Quotes */}
        {pressQuotes.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Press</h2>
            <div className="space-y-4">
              {pressQuotes.map((quote: { text: string; source: string }, i: number) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <Quote className="w-5 h-5 text-primary mb-2" />
                  <p className="text-foreground/80 italic mb-2">&quot;{quote.text}&quot;</p>
                  <p className="text-sm text-foreground/50">— {quote.source}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tour Dates */}
        {tourDates.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Tour Dates</h2>
            <div className="space-y-2">
              {tourDates.map((show: { date: string; venue: string; city: string; ticketUrl?: string }, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-surface border border-border rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{show.venue}</div>
                      <div className="text-sm text-foreground/50">
                        {show.date} · {show.city}
                      </div>
                    </div>
                  </div>
                  {show.ticketUrl && (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Tickets
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact / Social */}
        <section>
          <h2 className="text-xl font-bold mb-4">Contact & Social</h2>
          <div className="flex flex-wrap gap-3">
            {epk.user?.email && (
              <a
                href={`mailto:${epk.user.email}`}
                className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 hover:border-primary/30 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm">Email</span>
              </a>
            )}
            {epk.user?.website && (
              <a
                href={epk.user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 hover:border-primary/30 transition-colors"
              >
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm">Website</span>
              </a>
            )}
            {socialLinks.map((link: { platform: string; url: string }, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 hover:border-primary/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                <span className="text-sm">{link.platform}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-foreground/30">
            Electronic Press Kit created with{" "}
            <Link href="/" className="text-primary hover:underline">
              MusicPress AI
            </Link>{" "}
            — A{" "}
            <a
              href="https://truefansconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-truefans-orange hover:underline"
            >
              TrueFans CONNECT
            </a>{" "}
            Platform
          </p>
        </div>
      </div>
    </div>
  );
}
