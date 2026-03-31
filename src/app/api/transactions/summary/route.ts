import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.execute(sql`
    SELECT 
      to_char(date, 'YYYY-MM') as month,
      SUM(CASE WHEN amount::numeric > 0 AND is_internal = false THEN COALESCE(amount_base, amount)::numeric ELSE 0 END) as income,
      SUM(CASE WHEN amount::numeric < 0 AND is_internal = false THEN ABS(COALESCE(amount_base, amount)::numeric) ELSE 0 END) as expenses
    FROM transactions
    WHERE user_id = ${session.userId}
    GROUP BY to_char(date, 'YYYY-MM')
    ORDER BY month DESC
    LIMIT 12
  `);

  return NextResponse.json({ summary: rows.rows.reverse() });
}
