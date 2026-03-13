import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";

// Junk email detection patterns — mirrors the crawler filters
const JUNK_DOMAINS = [
  "sentry.io", "sentry-next.wixpress.com", "sentry.wixpress.com", "wixpress.com",
  "w3.org", "schema.org", "wordpress.org", "wordpress.com", "gravatar.com",
  "google.com", "facebook.com", "twitter.com", "instagram.com",
  "cloudflare.com", "jsdelivr.net", "googleapis.com", "gstatic.com",
  "apple.com", "microsoft.com", "amazon.com", "youtube.com",
  "example.com", "test.com", "localhost",
];

const JUNK_PREFIXES = [
  "noreply", "no-reply", "donotreply", "mailer-daemon",
  "postmaster", "webmaster", "hostmaster",
];

function isJunkEmail(email: string): string | null {
  const lower = email.toLowerCase();
  const [localPart, domain] = lower.split("@");

  // Known junk domains
  for (const d of JUNK_DOMAINS) {
    if (lower.endsWith(`@${d}`)) return `junk domain: ${d}`;
  }

  // Junk prefixes
  for (const p of JUNK_PREFIXES) {
    if (lower.startsWith(p)) return `junk prefix: ${p}`;
  }

  // Local part contains domain name (e.g. domain.com@domain.com)
  if (domain) {
    const domainBase = domain.split(".")[0];
    if (domainBase.length > 2 && localPart.includes(domainBase) && localPart.length > domainBase.length) {
      return "local part contains domain name";
    }
    if (localPart === domain) {
      return "local part equals domain";
    }
  }

  // Very short local parts
  if (localPart.length < 3) return "local part too short";

  // Hex string emails (sentry IDs, tracking pixels)
  if (/^[0-9a-f]{16,}$/i.test(localPart)) return "hex string (tracking/sentry ID)";
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(localPart)) return "UUID-style email";

  // File extension emails
  if (/\.(png|jpg|jpeg|gif|svg|css|js|webp|ico)$/i.test(lower)) return "file extension in email";

  // Generic addresses that aren't useful contacts
  if (/^(admin|support|help|abuse|security|billing|sales|legal)@/i.test(lower)) return "generic role address";

  return null;
}

function isSuspiciousContact(contact: { name: string; email: string; outlet: string; bio: string | null }): string | null {
  const email = contact.email.toLowerCase();

  // Name is just a URL or domain
  if (/^(https?:\/\/|www\.)/.test(contact.name)) return "name is a URL";

  // Duplicate name/email/outlet all the same single word
  if (contact.name === contact.email && contact.name === contact.outlet) return "name/email/outlet identical";

  // Email looks auto-generated (long random strings)
  const localPart = email.split("@")[0];
  if (localPart.length > 30 && !/[aeiou]{2}/i.test(localPart)) return "likely auto-generated email";

  return null;
}

// GET /api/contacts/cleanup — Scan contacts and return flagged ones (preview)
export async function GET() {
  try {
    const { error } = await getAuthUser();
    if (error) return error;

    const allContacts = await prisma.contact.findMany({
      select: { id: true, name: true, email: true, outlet: true, bio: true, type: true, createdAt: true },
    });

    const junk: Array<{ id: string; name: string; email: string; outlet: string; type: string; reason: string }> = [];
    const suspicious: Array<{ id: string; name: string; email: string; outlet: string; type: string; reason: string }> = [];

    for (const c of allContacts) {
      const junkReason = isJunkEmail(c.email);
      if (junkReason) {
        junk.push({ id: c.id, name: c.name, email: c.email, outlet: c.outlet, type: c.type, reason: junkReason });
        continue;
      }
      const suspReason = isSuspiciousContact(c);
      if (suspReason) {
        suspicious.push({ id: c.id, name: c.name, email: c.email, outlet: c.outlet, type: c.type, reason: suspReason });
      }
    }

    return NextResponse.json({
      total: allContacts.length,
      junkCount: junk.length,
      suspiciousCount: suspicious.length,
      cleanCount: allContacts.length - junk.length - suspicious.length,
      junk,
      suspicious,
    });
  } catch (err) {
    console.error("Cleanup scan error:", err);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}

// POST /api/contacts/cleanup — Delete flagged contacts
export async function POST(request: NextRequest) {
  try {
    const { error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const ids: string[] = body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No contact IDs provided" }, { status: 400 });
    }

    // Delete in batches of 100
    let deleted = 0;
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100);
      const result = await prisma.contact.deleteMany({
        where: { id: { in: batch } },
      });
      deleted += result.count;
    }

    return NextResponse.json({ deleted, requested: ids.length });
  } catch (err) {
    console.error("Cleanup delete error:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
