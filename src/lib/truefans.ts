/**
 * TrueFans CONNECT integration.
 *
 * Handles connection to TrueFans CONNECT for geo-discovery,
 * fan donations, and engagement analytics.
 */

const API_URL = process.env.TRUEFANS_API_URL || "https://truefansconnect.com/api";
const API_KEY = process.env.TRUEFANS_API_KEY || "";

interface TrueFansRequestOptions {
  method: string;
  path: string;
  body?: Record<string, unknown>;
}

async function truefansFetch<T = unknown>({ method, path, body }: TrueFansRequestOptions): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TrueFans API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Artist Profile ─────────────────────────────────────────────────────────

export async function connectArtistProfile(data: {
  truefansId: string;
  artistName: string;
  email: string;
  genre?: string;
  location?: string;
}) {
  return truefansFetch({
    method: "POST",
    path: "/connect/artist",
    body: data,
  });
}

export async function getArtistStats(truefansId: string) {
  return truefansFetch({
    method: "GET",
    path: `/artists/${truefansId}/stats`,
  });
}

// ─── Fan Engagement ─────────────────────────────────────────────────────────

export async function getFanDonations(truefansId: string, days: number = 30) {
  return truefansFetch({
    method: "GET",
    path: `/artists/${truefansId}/donations?days=${days}`,
  });
}

export async function getTopFans(truefansId: string, limit: number = 10) {
  return truefansFetch({
    method: "GET",
    path: `/artists/${truefansId}/fans/top?limit=${limit}`,
  });
}

export async function getNearbyFans(truefansId: string, lat: number, lng: number) {
  return truefansFetch({
    method: "GET",
    path: `/artists/${truefansId}/fans/nearby?lat=${lat}&lng=${lng}`,
  });
}

// ─── Venue Integration ──────────────────────────────────────────────────────

export async function registerVenue(data: {
  truefansId: string;
  venueName: string;
  address: string;
  lat: number;
  lng: number;
}) {
  return truefansFetch({
    method: "POST",
    path: "/connect/venue",
    body: data,
  });
}

export async function getVenueGeoStats(truefansId: string) {
  return truefansFetch({
    method: "GET",
    path: `/venues/${truefansId}/geo-stats`,
  });
}

// ─── Performance QR Codes ───────────────────────────────────────────────────

export async function createPerformanceCode(data: {
  truefansId: string;
  showName: string;
  venueId?: string;
  date: string;
}) {
  return truefansFetch({
    method: "POST",
    path: "/performance-codes",
    body: data,
  });
}

export function isTrueFansConfigured(): boolean {
  return !!(API_KEY && API_URL);
}

/**
 * Returns mock stats when API is not configured.
 * Remove this when the real API is connected.
 */
export function getMockTrueFansStats() {
  return {
    totalFans: 2847,
    totalDonations: 4523,
    showsDiscovered: 89,
    fanEngagement: 91,
    recentDonations: [
      { fan: "Alex M.", amount: 25, show: "The Midnight Owls @ Blue Note", time: "2h ago" },
      { fan: "Sarah K.", amount: 10, show: "Luna & The Wolves @ Blue Note", time: "5h ago" },
      { fan: "Mike R.", amount: 50, show: "Direct Artist Support", time: "1d ago" },
      { fan: "Jenny L.", amount: 15, show: "DJ Solarflare @ Vinyl Room", time: "1d ago" },
      { fan: "Carlos D.", amount: 20, show: "Brass Revolution @ Blue Note", time: "2d ago" },
    ],
    topFans: [
      { name: "Mike R.", totalDonated: 340, shows: 12, since: "Jan 2026" },
      { name: "Sarah K.", totalDonated: 215, shows: 8, since: "Feb 2026" },
      { name: "Alex M.", totalDonated: 180, shows: 15, since: "Dec 2025" },
      { name: "Jenny L.", totalDonated: 155, shows: 6, since: "Feb 2026" },
      { name: "Carlos D.", totalDonated: 130, shows: 9, since: "Jan 2026" },
    ],
  };
}
