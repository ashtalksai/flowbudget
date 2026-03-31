export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { budgets } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (body.monthlyLimit !== undefined) updates.monthlyLimit = body.monthlyLimit.toString();
  if (body.color !== undefined) updates.color = body.color;

  const [updated] = await db.update(budgets).set(updates)
    .where(and(eq(budgets.id, parseInt(params.id)), eq(budgets.userId, session.userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ budget: updated });
}
