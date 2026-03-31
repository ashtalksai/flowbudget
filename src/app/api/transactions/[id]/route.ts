import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  
  if (body.category !== undefined) updates.category = body.category;
  if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
  if (body.status !== undefined) updates.status = body.status;
  if (body.isInternal !== undefined) updates.isInternal = body.isInternal;
  if (body.isReimbursable !== undefined) updates.isReimbursable = body.isReimbursable;
  if (body.reimbursableFrom !== undefined) updates.reimbursableFrom = body.reimbursableFrom;

  const [updated] = await db.update(transactions)
    .set(updates)
    .where(and(eq(transactions.id, parseInt(params.id)), eq(transactions.userId, session.userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ transaction: updated });
}
