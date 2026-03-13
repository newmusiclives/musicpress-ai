"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Star,
  Send,
  Globe,
  CheckCircle,
  Newspaper,
  Loader2,
  AlertCircle,
  Plus,
  ChevronDown,
} from "lucide-react";

interface ContactDetail {
  id: string;
  name: string;
  email: string;
  outlet: string;
  type: string;
  genre: string | null;
  region: string | null;
  beat: string | null;
  phone: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  website: string | null;
  bio: string | null;
  verified: boolean;
  articleCount: number;
  _count?: { savedBy: number };
}

interface ContactList {
  id: string;
  name: string;
  _count?: { items: number };
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [lists, setLists] = useState<ContactList[]>([]);
  const [showListDropdown, setShowListDropdown] = useState(false);

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch(`/api/contacts/${id}`);
        if (!res.ok) throw new Error("Contact not found");
        const data = await res.json();
        setContact(data);
      } catch (err) {
        setError("Failed to load contact");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, [id]);

  useEffect(() => {
    fetch("/api/contacts/saved")
      .then((r) => r.json())
      .then((data) => {
        const saved = (data.savedContacts || []).some((sc: { contactId: string }) => sc.contactId === id);
        setIsSaved(saved);
      })
      .catch(() => {});

    fetch("/api/contact-lists")
      .then((r) => r.json())
      .then((data) => setLists(data.contactLists || []))
      .catch(() => {});
  }, [id]);

  async function toggleSave() {
    try {
      const res = await fetch("/api/contacts/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-32 gap-4">
        <div className="flex items-center gap-2 text-danger">
          <AlertCircle className="w-5 h-5" />
          <span>{error || "Contact not found"}</span>
        </div>
        <button onClick={() => router.push("/dashboard/contacts")} className="text-sm text-primary hover:underline">
          Back to Contacts
        </button>
      </div>
    );
  }

  const socialLinks = [
    { label: "Twitter", value: contact.twitter, prefix: "https://twitter.com/" },
    { label: "Instagram", value: contact.instagram, prefix: "https://instagram.com/" },
    { label: "LinkedIn", value: contact.linkedin, prefix: "https://linkedin.com/in/" },
    { label: "Website", value: contact.website, prefix: "" },
  ].filter((l) => l.value);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/contacts")}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Contacts
      </button>

      {/* Contact header */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-2xl font-bold">{contact.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold">{contact.name}</h1>
                {contact.verified && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
              <p className="text-foreground/50">{contact.outlet}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {contact.type}
                </span>
                {contact.region && (
                  <span className="text-xs text-foreground/40">{contact.region}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                isSaved
                  ? "border-truefans-amber/30 text-truefans-amber bg-truefans-amber/5"
                  : "border-border text-foreground/60 hover:bg-surface-light"
              }`}
            >
              <Star className={`w-4 h-4 ${isSaved ? "fill-truefans-amber" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => router.push("/dashboard/campaigns")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:opacity-90"
            >
              <Send className="w-4 h-4" />
              Send Pitch
            </button>
            <div className="relative">
              <button
                onClick={() => setShowListDropdown(!showListDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground/60 hover:bg-surface-light"
              >
                <Plus className="w-4 h-4" />
                Add to List
                <ChevronDown className="w-3 h-3" />
              </button>
              {showListDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl z-10 py-2">
                  {lists.length === 0 && (
                    <div className="px-4 py-3 text-xs text-foreground/40">No lists yet.</div>
                  )}
                  {lists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => setShowListDropdown(false)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-light transition-colors"
                    >
                      {list.name}
                      <span className="text-xs text-foreground/40 ml-2">
                        ({list._count?.items || 0})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio */}
          {contact.bio && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-3">Bio</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{contact.bio}</p>
            </div>
          )}

          {/* Details */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-bold mb-4">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-foreground/40 mb-1">Email</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  {contact.email}
                </div>
              </div>
              {contact.phone && (
                <div>
                  <div className="text-xs text-foreground/40 mb-1">Phone</div>
                  <div className="text-sm font-medium">{contact.phone}</div>
                </div>
              )}
              {contact.genre && (
                <div>
                  <div className="text-xs text-foreground/40 mb-1">Genre Focus</div>
                  <div className="text-sm font-medium">{contact.genre}</div>
                </div>
              )}
              {contact.beat && (
                <div>
                  <div className="text-xs text-foreground/40 mb-1">Beat</div>
                  <div className="text-sm font-medium">{contact.beat}</div>
                </div>
              )}
              {contact.region && (
                <div>
                  <div className="text-xs text-foreground/40 mb-1">Region</div>
                  <div className="text-sm font-medium">{contact.region}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-foreground/40 mb-1">Outlet</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-foreground/40" />
                  {contact.outlet}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4">Social Links</h3>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.prefix ? `${link.prefix}${link.value}` : link.value || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-surface-light/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{link.label}</div>
                      <div className="text-xs text-foreground/40">{link.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Articles Published</span>
                <span className="text-sm font-bold">{contact.articleCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Verified</span>
                <span className={`text-sm font-bold ${contact.verified ? "text-success" : "text-foreground/40"}`}>
                  {contact.verified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">Saved by</span>
                <span className="text-sm font-bold">{contact._count?.savedBy || 0} users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
