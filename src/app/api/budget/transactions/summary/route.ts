import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const cutoff = twelveMonthsAgo.toISOString().split("T")[0];

    // Use amount_eur for normalized values, fallback to amount
    const amtExpr = sql`coalesce(amount_eur, amount::numeric)`;

    const rows = await db
      .select({
        month: sql<string>`to_char(${transactions.date}::date, 'YYYY-MM')`,
        income: sql<string>`coalesce(sum(case when coalesce(amount_eur, amount::numeric) >= 0 then coalesce(amount_eur, amount::numeric) else 0 end), 0)`,
        expense: sql<string>`coalesce(sum(case when coalesce(amount_eur, amount::numeric) < 0 then abs(coalesce(amount_eur, amount::numeric)) else 0 end), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.userId),
          gte(transactions.date, cutoff),
          sql`(${transactions.isInternal} = false OR ${transactions.isInternal} IS NULL)`
        )
      )
      .groupBy(sql`to_char(${transactions.date}::date, 'YYYY-MM')`)
      .orderBy(sql`to_char(${transactions.date}::date, 'YYYY-MM')`);

    const summary = rows.map((r) => ({
      month: r.month,
      income: parseFloat(r.income),
      expense: parseFloat(r.expense),
    }));

    const now = new Date();
    const currentMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const [currentMonth] = await db
      .select({
        income: sql<string>`coalesce(sum(case when coalesce(amount_eur, amount::numeric) >= 0 then coalesce(amount_eur, amount::numeric) else 0 end), 0)`,
        expense: sql<string>`coalesce(sum(case when coalesce(amount_eur, amount::numeric) < 0 then abs(coalesce(amount_eur, amount::numeric)) else 0 end), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.userId),
          gte(transactions.date, currentMonthStart),
          sql`(${transactions.isInternal} = false OR ${transactions.isInternal} IS NULL)`
        )
      );

    return NextResponse.json({
      monthly: summary,
      currentMonth: {
        income: parseFloat(currentMonth?.income ?? "0"),
        expense: parseFloat(currentMonth?.expense ?? "0"),
      },
    });
  } catch (error) {
    console.error("GET /api/budget/transactions/summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
