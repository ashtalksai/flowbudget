export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(categories).where(eq(categories.userId, session.userId));
  
  // Build hierarchical structure
  const parents = all.filter(c => !c.parentId);
  const tree = parents.map(parent => ({
    ...parent,
    children: all.filter(c => c.parentId === parent.id),
  }));

  return NextResponse.json({ categories: tree });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [cat] = await db.insert(categories).values({
    userId: session.userId,
    name: body.name,
    slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
    parentId: body.parentId || null,
    icon: body.icon || null,
    color: body.color || null,
  }).returning();

  return NextResponse.json({ category: cat }, { status: 201 });
}
