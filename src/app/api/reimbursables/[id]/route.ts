import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reimbursables } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.paidDate !== undefined) updates.paidDate = body.paidDate;
  if (body.status === 'paid' && !body.paidDate) updates.paidDate = new Date().toISOString().split('T')[0];

  const [updated] = await db.update(reimbursables).set(updates)
    .where(and(eq(reimbursables.id, parseInt(params.id)), eq(reimbursables.userId, session.userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reimbursable: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(reimbursables).where(and(eq(reimbursables.id, parseInt(params.id)), eq(reimbursables.userId, session.userId)));
  return NextResponse.json({ ok: true });
}
