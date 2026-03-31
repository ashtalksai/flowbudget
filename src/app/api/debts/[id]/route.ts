export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { debts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.balance !== undefined) updates.balance = body.balance.toString();
  if (body.apr !== undefined) updates.apr = body.apr.toString();
  if (body.minPayment !== undefined) updates.minPayment = body.minPayment.toString();
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.dueDate !== undefined) updates.dueDate = body.dueDate;

  const [updated] = await db.update(debts).set(updates)
    .where(and(eq(debts.id, parseInt(params.id)), eq(debts.userId, session.userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ debt: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(debts).where(and(eq(debts.id, parseInt(params.id)), eq(debts.userId, session.userId)));
  return NextResponse.json({ ok: true });
}
