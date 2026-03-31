import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await request.json();
  // items: Array<{ id: number, category: string, subcategory?: string, status?: string }>

  let updated = 0;
  for (const item of items) {
    const updates: any = {};
    if (item.category) updates.category = item.category;
    if (item.subcategory) updates.subcategory = item.subcategory;
    updates.status = item.status || 'categorized';

    await db.update(transactions)
      .set(updates)
      .where(and(eq(transactions.id, item.id), eq(transactions.userId, session.userId)));
    updated++;
  }

  return NextResponse.json({ updated });
}
