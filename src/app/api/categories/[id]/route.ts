import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete children first
  await db.delete(categories).where(and(eq(categories.parentId, parseInt(params.id)), eq(categories.userId, session.userId)));
  await db.delete(categories).where(and(eq(categories.id, parseInt(params.id)), eq(categories.userId, session.userId)));
  
  return NextResponse.json({ ok: true });
}
