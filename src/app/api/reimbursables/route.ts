export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reimbursables } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(reimbursables).where(eq(reimbursables.userId, session.userId));
  return NextResponse.json({ reimbursables: rows });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [row] = await db.insert(reimbursables).values({
    userId: session.userId,
    fromPerson: body.fromPerson,
    description: body.description || null,
    amount: body.amount.toString(),
    currency: body.currency || 'EUR',
    date: body.date,
    transactionId: body.transactionId || null,
  }).returning();

  return NextResponse.json({ reimbursable: row }, { status: 201 });
}
