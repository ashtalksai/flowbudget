export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (body.label !== undefined) updates.label = body.label;
  if (body.iban !== undefined) updates.iban = body.iban;
  if (body.accountNumber !== undefined) updates.accountNumber = body.accountNumber;
  if (body.currency !== undefined) updates.currency = body.currency;

  const [updated] = await db.update(accounts).set(updates)
    .where(and(eq(accounts.id, parseInt(params.id)), eq(accounts.userId, session.userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ account: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(accounts).where(and(eq(accounts.id, parseInt(params.id)), eq(accounts.userId, session.userId)));
  return NextResponse.json({ ok: true });
}
