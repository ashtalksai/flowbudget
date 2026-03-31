import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const month = request.nextUrl.searchParams.get("month") || new Date().toISOString().slice(0, 7);

  const rows = await db.execute(sql`
    SELECT 
      category,
      SUM(ABS(COALESCE(amount_base, amount)::numeric)) as spent
    FROM transactions
    WHERE user_id = ${session.userId}
      AND to_char(date, 'YYYY-MM') = ${month}
      AND amount::numeric < 0
      AND is_internal = false
      AND category IS NOT NULL
    GROUP BY category
    ORDER BY spent DESC
  `);

  return NextResponse.json({ actuals: rows.rows });
}
