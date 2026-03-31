export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { debts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(debts).where(eq(debts.userId, session.userId));
  return NextResponse.json({ debts: rows });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [debt] = await db.insert(debts).values({
    userId: session.userId,
    name: body.name,
    balance: body.balance.toString(),
    apr: (body.apr || 0).toString(),
    minPayment: (body.minPayment || 0).toString(),
    notes: body.notes || null,
    dueDate: body.dueDate || null,
  }).returning();

  return NextResponse.json({ debt }, { status: 201 });
}
