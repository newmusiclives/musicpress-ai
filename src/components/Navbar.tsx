"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Music,
  Menu,
  X,
  Zap,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "For Artists", href: "#artists" },
  { label: "For Venues", href: "#venues" },
  { label: "Database", href: "#database" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">MusicPress</span>
              <span className="text-foreground/60 text-sm ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors px-4 py-2"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Get Started Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm text-foreground/60 hover:text-foreground transition-colors py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="block w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent px-5 py-2.5 rounded-lg mt-3"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
