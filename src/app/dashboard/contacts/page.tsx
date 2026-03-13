"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Plus,
  Star,
  Newspaper,
  Headphones,
  Globe,
  Mic2,
  Users,
  ListMusic,
  Podcast,
  Target,
  Loader2,
  AlertCircle,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Database,
  Zap,
  CheckCircle2,
  LinkIcon,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  outlet: string;
  type: string;
  genre: string | null;
  region: string | null;
  beat: string | null;
  verified: boolean;
  articleCount: number;
}

const categories = [
  { id: "all", label: "All Contacts", icon: null },
  { id: "journalist", label: "Journalists", icon: Newspaper },
  { id: "curator", label: "Curators", icon: Headphones },
  { id: "blog", label: "Blogs", icon: Globe },
  { id: "podcaster", label: "Podcasters", icon: Mic2 },
];

const genres = [
  "All Genres", "Rock", "Indie", "Pop", "Hip Hop", "R&B", "Electronic",
  "Country", "Jazz", "Classical", "Folk", "Metal", "Punk", "Latin", "World",
];

const regions = ["All Regions", "US", "UK", "EU", "Canada", "Australia", "Asia", "Latin America", "Global"];

function calcMatch(genre: string | null): number {
  if (!genre) return 50;
  const userGenres = ["indie", "rock", "alternative"];
  const contactGenres = genre.toLowerCase().split(",").map((g) => g.trim());
  const overlap = contactGenres.filter((g) => userGenres.some((ug) => g.includes(ug))).length;
  return Math.min(99, 55 + Math.round((overlap / Math.max(contactGenres.length, 1)) * 40));
}

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCreateList, setShowCreateList] = useState(false);
  const [listName, setListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);

  // Import crawler state
  const [showImport, setShowImport] = useState(false);
  const [importSource, setImportSource] = useState<string>("all");
  const [customUrls, setCustomUrls] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    blogsDiscovered: number;
    emailsExtracted: number;
    contactsImported: number;
    errors: string[];
  } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch saved contacts
  useEffect(() => {
    fetch("/api/contacts/saved")
      .then((r) => r.json())
      .then((data) => {
        const ids = new Set<string>((data.savedContacts || []).map((sc: { contactId: string }) => sc.contactId));
        setSavedIds(ids);
      })
      .catch(() => {});
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (activeCategory !== "all") params.set("type", activeCategory);
      if (selectedGenre !== "All Genres") params.set("genre", selectedGenre);
      if (selectedRegion !== "All Regions") params.set("region", selectedRegion);

      const res = await fetch(`/api/contacts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data.contacts || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to load contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeCategory, selectedGenre, selectedRegion]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory, selectedGenre, selectedRegion]);

  async function toggleSave(contactId: string) {
    try {
      const res = await fetch("/api/contacts/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (data.saved) next.add(contactId);
          else next.delete(contactId);
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Outlet", "Type", "Genre", "Region", "Match Score"];
    const rows = contacts.map((c) => [
      c.name, c.email, c.outlet, c.type, c.genre || "", c.region || "", String(calcMatch(c.genre)),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCreateList() {
    if (!listName.trim()) return;
    setCreatingList(true);
    try {
      const res = await fetch("/api/contact-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName.trim() }),
      });
      if (res.ok) {
        setShowCreateList(false);
        setListName("");
      }
    } catch (err) {
      console.error("Failed to create list:", err);
    } finally {
      setCreatingList(false);
    }
  }

  async function handleDelete(contactId: string, contactName: string) {
    if (!confirm(`Delete contact "${contactName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/contacts/${contactId}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        setTotal((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Failed to delete contact:", err);
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected contact(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/contacts/${id}`, { method: "DELETE" })
        )
      );
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setTotal((prev) => prev - selectedIds.size);
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Failed to delete contacts:", err);
    }
  }

  async function handleImport() {
    setImporting(true);
    setImportResult(null);
    try {
      const body: Record<string, unknown> = {};
      if (customUrls.trim()) {
        body.urls = customUrls.trim().split("\n").map((u) => u.trim()).filter(Boolean);
      } else {
        body.source = importSource;
      }
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setImportResult(data);
        fetchContacts(); // Refresh the list
      } else {
        setImportResult({ blogsDiscovered: 0, emailsExtracted: 0, contactsImported: 0, errors: ["Crawl failed. Try again."] });
      }
    } catch (err) {
      setImportResult({ blogsDiscovered: 0, emailsExtracted: 0, contactsImported: 0, errors: [String(err)] });
    } finally {
      setImporting(false);
    }
  }

  const pageNumbers = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Contacts Database</h1>
          <p className="text-foreground/50 mt-1">
            {total.toLocaleString()} verified music media contacts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 text-sm font-medium text-danger border border-danger/30 px-4 py-2.5 rounded-xl hover:bg-danger/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.size})
            </button>
          )}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-medium text-foreground/70 border border-border px-4 py-2.5 rounded-xl hover:bg-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => { setShowImport(true); setImportResult(null); }}
            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-success px-4 py-2.5 rounded-xl hover:opacity-90"
          >
            <Upload className="w-4 h-4" />
            Import Contacts
          </button>
          <button
            onClick={() => setShowCreateList(true)}
            className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 rounded-xl hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Create List
          </button>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Create Contact List</h3>
              <button onClick={() => setShowCreateList(false)} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List name..."
              className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateList(false)}
                className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={creatingList || !listName.trim()}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {creatingList ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Contacts Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-lg">Import Contacts</h3>
              </div>
              <button onClick={() => setShowImport(false)} className="p-1 rounded-lg hover:bg-surface-light">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>

            {!importResult ? (
              <>
                <p className="text-sm text-foreground/50 mb-4">
                  Crawl directories to discover music journalists, playlist curators, podcasters, and blogs. The crawler visits contact pages and extracts publicly available emails.
                </p>

                {/* Source selector */}
                <div className="mb-4">
                  <label className="text-xs text-foreground/50 mb-2 block">Crawl Source</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: "All Sources", desc: "Blogs + Journalists + Curators + Podcasters", icon: Zap },
                      { id: "feedspot", label: "Feedspot", desc: "Music blog directories", icon: Globe },
                      { id: "hypemachine", label: "Hype Machine", desc: "Indexed music blogs", icon: Headphones },
                      { id: "articles", label: "Blog Lists", desc: "Curated article lists", icon: Newspaper },
                      { id: "journalists", label: "Journalists", desc: "Music journalists & critics", icon: Users },
                      { id: "curators", label: "Curators", desc: "Spotify & playlist curators", icon: ListMusic },
                      { id: "podcasters", label: "Podcasters", desc: "Music podcast hosts", icon: Podcast },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setImportSource(s.id); setCustomUrls(""); }}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          importSource === s.id && !customUrls
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-foreground/20"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <s.icon className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">{s.label}</span>
                        </div>
                        <span className="text-xs text-foreground/40">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URLs */}
                <div className="mb-4">
                  <label className="text-xs text-foreground/50 mb-1 block flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    Or paste custom blog URLs (one per line)
                  </label>
                  <textarea
                    value={customUrls}
                    onChange={(e) => setCustomUrls(e.target.value)}
                    placeholder={"https://example-music-blog.com\nhttps://another-blog.com\nhttps://indie-blog.net"}
                    rows={3}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 outline-none focus:border-accent/50 resize-none font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowImport(false)}
                    className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-success rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Crawling...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        Start Crawl
                      </>
                    )}
                  </button>
                </div>

                {importing && (
                  <div className="mt-4 bg-accent/5 border border-accent/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      <span className="text-sm font-medium text-accent">Crawling in progress...</span>
                    </div>
                    <p className="text-xs text-foreground/40">
                      Discovering blogs, visiting contact pages, extracting emails. This may take a few minutes depending on the source.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Results view */
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="font-bold text-success">Crawl Complete</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-surface-light rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold">{importResult.blogsDiscovered}</div>
                    <div className="text-xs text-foreground/40">Blogs Found</div>
                  </div>
                  <div className="bg-surface-light rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold">{importResult.emailsExtracted}</div>
                    <div className="text-xs text-foreground/40">Emails Found</div>
                  </div>
                  <div className="bg-surface-light rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-success">{importResult.contactsImported}</div>
                    <div className="text-xs text-foreground/40">Imported</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-danger/5 border border-danger/20 rounded-xl p-3 mb-4 max-h-24 overflow-y-auto">
                    <div className="text-xs font-medium text-danger mb-1">{importResult.errors.length} errors:</div>
                    {importResult.errors.slice(0, 5).map((err, i) => (
                      <div key={i} className="text-xs text-foreground/40 truncate">{err}</div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => { setImportResult(null); }}
                    className="px-4 py-2 text-sm text-foreground/60 border border-border rounded-lg hover:bg-surface-light"
                  >
                    Run Another
                  </button>
                  <button
                    onClick={() => setShowImport(false)}
                    className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-success rounded-lg hover:opacity-90"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-primary text-white"
                : "bg-surface border border-border text-foreground/60 hover:text-foreground"
            }`}
          >
            {cat.icon && <cat.icon className="w-4 h-4" />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, outlet, genre, or region..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none"
          />
          <div className="flex items-center gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-surface-light border border-border rounded-lg text-xs text-foreground/60 px-3 py-2 outline-none"
            >
              {genres.map((g) => <option key={g}>{g}</option>)}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-surface-light border border-border rounded-lg text-xs text-foreground/60 px-3 py-2 outline-none"
            >
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 gap-2 text-danger">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Results table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-foreground/40 border-b border-border">
                    <th className="px-4 py-3 font-medium w-8">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.size === contacts.length && contacts.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Outlet</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Genre Focus</th>
                    <th className="px-4 py-3 font-medium">Region</th>
                    <th className="px-4 py-3 font-medium">Match</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-foreground/40 text-sm">
                        No contacts found.
                      </td>
                    </tr>
                  )}
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b border-border/50 hover:bg-surface-light/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedIds.has(contact.id)}
                          onChange={() => toggleSelect(contact.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-xs font-bold">{contact.name[0]}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{contact.name}</div>
                            <div className="text-xs text-foreground/40">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground/60">{contact.outlet}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{contact.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground/60">{contact.genre || "--"}</td>
                      <td className="px-4 py-3 text-sm text-foreground/60">{contact.region || "--"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-success" />
                          <span className="text-xs font-bold text-success">{calcMatch(contact.genre)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push("/dashboard/campaigns")}
                            className="p-1.5 rounded-lg hover:bg-surface-light transition-colors"
                          >
                            <Mail className="w-4 h-4 text-foreground/40" />
                          </button>
                          <button
                            onClick={() => toggleSave(contact.id)}
                            className="p-1.5 rounded-lg hover:bg-surface-light transition-colors"
                          >
                            <Star className={`w-4 h-4 ${savedIds.has(contact.id) ? "text-truefans-amber fill-truefans-amber" : "text-foreground/40"}`} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id, contact.name)}
                            className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 className="w-4 h-4 text-foreground/40 hover:text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 flex items-center justify-between border-t border-border">
              <span className="text-xs text-foreground/40">
                Showing {contacts.length} of {total.toLocaleString()} contacts
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs text-foreground/50 px-3 py-1.5 border border-border rounded-lg hover:bg-surface-light disabled:opacity-30"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`text-xs px-3 py-1.5 rounded-lg ${
                      p === page ? "text-white bg-primary" : "text-foreground/50 border border-border hover:bg-surface-light"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs text-foreground/50 px-3 py-1.5 border border-border rounded-lg hover:bg-surface-light disabled:opacity-30"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
