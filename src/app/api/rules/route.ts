import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rules, transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, like, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(rules).where(eq(rules.userId, session.userId)).orderBy(rules.priority);
  return NextResponse.json({ rules: rows });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [rule] = await db.insert(rules).values({
    userId: session.userId,
    pattern: body.pattern,
    matchType: body.matchType || 'contains',
    category: body.category,
    subcategory: body.subcategory || null,
    isReimbursable: body.isReimbursable || false,
    reimbursableFrom: body.reimbursableFrom || null,
    priority: body.priority || 0,
  }).returning();

  // Apply retroactively if requested
  if (body.applyRetroactively !== false) {
    const pattern = body.pattern.toLowerCase();
    let whereClause;
    switch (body.matchType) {
      case 'exact':
        whereClause = sql`LOWER(description) = ${pattern}`;
        break;
      case 'starts_with':
        whereClause = sql`LOWER(description) LIKE ${pattern + '%'}`;
        break;
      case 'regex':
        whereClause = sql`description ~* ${body.pattern}`;
        break;
      default:
        whereClause = sql`LOWER(description) LIKE ${'%' + pattern + '%'}`;
    }

    await db.execute(sql`
      UPDATE transactions 
      SET category = ${body.category}, 
          subcategory = ${body.subcategory || null},
          status = 'categorized',
          is_reimbursable = ${body.isReimbursable || false},
          reimbursable_from = ${body.reimbursableFrom || null}
      WHERE user_id = ${session.userId} 
        AND status = 'pending'
        AND ${whereClause}
    `);
  }

  return NextResponse.json({ rule }, { status: 201 });
}
