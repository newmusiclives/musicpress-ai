import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

/** Call at the top of every protected API route handler.
 *  Returns the authenticated user or a 401 response. */
export async function getAuthUser(): Promise<
  | { user: { id: string; email: string; name: string; role: string; plan: string }; error?: never }
  | { user?: never; error: NextResponse }
> {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user: session.user };
}
