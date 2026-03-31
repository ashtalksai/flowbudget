export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.execute(sql`
    SELECT 
      to_char(date, 'YYYY-MM') as month,
      category,
      SUM(COALESCE(amount_base, amount)::numeric) as total
    FROM transactions
    WHERE user_id = ${session.userId}
      AND amount::numeric > 0
      AND is_internal = false
    GROUP BY to_char(date, 'YYYY-MM'), category
    ORDER BY month DESC
  `);

  // Also get monthly totals for smoothed average
  const monthlyTotals = await db.execute(sql`
    SELECT 
      to_char(date, 'YYYY-MM') as month,
      SUM(COALESCE(amount_base, amount)::numeric) as total
    FROM transactions
    WHERE user_id = ${session.userId}
      AND amount::numeric > 0
      AND is_internal = false
    GROUP BY to_char(date, 'YYYY-MM')
    ORDER BY month DESC
    LIMIT 12
  `);

  // Calculate 6-month smoothed average
  const totals = monthlyTotals.rows.map((r: any) => ({ month: r.month, total: parseFloat(r.total) }));
  const smoothed = totals.map((item: any, idx: number) => {
    const window = totals.slice(idx, idx + 6);
    const avg = window.reduce((s: number, w: any) => s + w.total, 0) / window.length;
    return { month: item.month, average: Math.round(avg * 100) / 100 };
  });

  return NextResponse.json({
    byCategory: rows.rows,
    monthlyTotals: totals.reverse(),
    smoothedAverage: smoothed.reverse(),
  });
}
