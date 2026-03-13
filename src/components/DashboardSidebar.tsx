"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Music,
  LayoutDashboard,
  Users,
  Send,
  FileText,
  BarChart3,
  Bell,
  Radio,
  MapPin,
  Zap,
  Settings,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contacts Database", href: "/dashboard/contacts", icon: Users },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { label: "Press Releases", href: "/dashboard/press-releases", icon: FileText },
  { label: "Pitch Requests", href: "/dashboard/pitch-requests", icon: Bell },
  { label: "Media Monitor", href: "/dashboard/media-monitor", icon: Radio },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Venue Tools", href: "/dashboard/venues", icon: MapPin },
  { label: "TrueFans CONNECT", href: "/dashboard/truefans", icon: Zap },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Music className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold">
          <span className="gradient-text">MusicPress</span>
          <span className="text-foreground/60 text-xs ml-1">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-foreground/50 hover:text-foreground hover:bg-surface-light"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.label === "TrueFans CONNECT" && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-truefans-orange animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-2">
        <a
          href="https://truefansconnect.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs text-truefans-orange/70 hover:text-truefans-orange transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          TrueFans CONNECT
        </a>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-foreground/40 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
