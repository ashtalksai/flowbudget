import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { budgets } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(budgets).where(eq(budgets.userId, session.userId));
  return NextResponse.json({ budgets: rows });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Upsert
  const [existing] = await db.select().from(budgets)
    .where(and(eq(budgets.userId, session.userId), eq(budgets.category, body.category)));

  if (existing) {
    const [updated] = await db.update(budgets).set({
      monthlyLimit: body.monthlyLimit.toString(),
      color: body.color || existing.color,
    }).where(eq(budgets.id, existing.id)).returning();
    return NextResponse.json({ budget: updated });
  }

  const [created] = await db.insert(budgets).values({
    userId: session.userId,
    category: body.category,
    monthlyLimit: body.monthlyLimit.toString(),
    color: body.color || '#0D9488',
  }).returning();

  return NextResponse.json({ budget: created }, { status: 201 });
}
