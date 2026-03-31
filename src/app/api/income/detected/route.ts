import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, gt, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pull positive (incoming) transactions where is_internal = false, grouped by month
    const result = await db
      .select({
        month: sql<string>`to_char(${transactions.date}::date, 'YYYY-MM')`.as("month"),
        totalAmount: sql<string>`sum(COALESCE(${transactions.amountEur}, ${transactions.amount}))`.as("total_amount"),
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.userId),
          eq(transactions.isInternal, false),
          gt(sql`COALESCE(${transactions.amountEur}, ${transactions.amount})`, sql`0`)
        )
      )
      .groupBy(sql`to_char(${transactions.date}::date, 'YYYY-MM')`)
      .orderBy(sql`to_char(${transactions.date}::date, 'YYYY-MM') DESC`);

    // Also get individual transactions for detail view
    const detailRows = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        amountEur: transactions.amountEur,
        currency: transactions.currency,
        description: transactions.description,
        date: transactions.date,
        account: transactions.account,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.userId),
          eq(transactions.isInternal, false),
          gt(sql`COALESCE(${transactions.amountEur}, ${transactions.amount})`, sql`0`)
        )
      )
      .orderBy(sql`${transactions.date} DESC`)
      .limit(100);

    return NextResponse.json({ monthly: result, transactions: detailRows });
  } catch (error) {
    console.error("Detected income GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
