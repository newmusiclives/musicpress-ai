import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Verify database connection
    await prisma.$queryRawUnsafe("SELECT 1");
    const total = await prisma.contact.count();
    const byType = await prisma.contact.groupBy({ by: ["type"], _count: true });
    const breakdown = Object.fromEntries(byType.map((t) => [t.type, t._count]));
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString(), contacts: { total, ...breakdown } });
  } catch {
    return NextResponse.json({ status: "error", message: "Database unreachable" }, { status: 503 });
  }
}
