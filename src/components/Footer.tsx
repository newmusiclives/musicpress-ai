"use client";
import { Music, ExternalLink } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "For Artists", href: "#artists" },
    { label: "For Venues", href: "#venues" },
    { label: "Database", href: "#database" },
    { label: "Pricing", href: "#pricing" },
  ],
  Resources: [
    { label: "Press Release Templates", href: "/dashboard/press-releases" },
    { label: "EPK Builder", href: "/dashboard" },
    { label: "Music PR Guide", href: "#" },
    { label: "Blog", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  "TrueFans Ecosystem": [
    { label: "TrueFans CONNECT", href: "https://truefansconnect.com", external: true },
    { label: "TrueFans FM", href: "https://truefans.fm", external: true },
    { label: "TrueFans FM App (iOS)", href: "https://apps.apple.com/us/app/truefans-fm/id6747340246", external: true },
    { label: "TrueFans FM App (Android)", href: "https://play.google.com/store/apps/details?id=fm.truefans.twa", external: true },
    { label: "MEETn TrueFans Edition", href: "https://meetntruefans.com", external: true },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface/50 border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">
                MusicPress AI
              </span>
            </Link>
            <p className="text-sm text-foreground/40 leading-relaxed">
              AI-powered PR for music artists and live venues. Part of the
              TrueFans CONNECT ecosystem.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/30">
            &copy; {new Date().getFullYear()} MusicPress AI — A{" "}
            <a
              href="https://truefansconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-truefans-orange hover:underline"
            >
              TrueFans CONNECT
            </a>{" "}
            Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-foreground/30">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
