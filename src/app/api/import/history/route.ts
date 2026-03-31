import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { imports } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(imports)
    .where(eq(imports.userId, session.userId))
    .orderBy(desc(imports.createdAt));

  return NextResponse.json({ imports: rows });
}
