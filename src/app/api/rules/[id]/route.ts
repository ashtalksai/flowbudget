export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rules } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (body.pattern !== undefined) updates.pattern = body.pattern;
  if (body.matchType !== undefined) updates.matchType = body.matchType;
  if (body.category !== undefined) updates.category = body.category;
  if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
  if (body.priority !== undefined) updates.priority = body.priority;

  const [updated] = await db.update(rules).set(updates)
    .where(and(eq(rules.id, parseInt(params.id)), eq(rules.userId, session.userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ rule: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(rules).where(and(eq(rules.id, parseInt(params.id)), eq(rules.userId, session.userId)));
  return NextResponse.json({ ok: true });
}
