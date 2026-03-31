export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(accounts).where(eq(accounts.userId, session.userId));
  return NextResponse.json({ accounts: rows });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [account] = await db.insert(accounts).values({
    userId: session.userId,
    label: body.label,
    iban: body.iban || null,
    accountNumber: body.accountNumber || null,
    currency: body.currency || 'EUR',
  }).returning();

  return NextResponse.json({ account }, { status: 201 });
}
