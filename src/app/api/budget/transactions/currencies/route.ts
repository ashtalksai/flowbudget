import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        currency: sql<string>`coalesce(${transactions.currency}, 'EUR')`,
        totalSpent: sql<string>`coalesce(sum(case when amount::numeric < 0 then amount::numeric else 0 end), 0)`,
        totalReceived: sql<string>`coalesce(sum(case when amount::numeric >= 0 then amount::numeric else 0 end), 0)`,
        count: sql<string>`count(*)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.userId),
          sql`(${transactions.isInternal} = false OR ${transactions.isInternal} IS NULL)`
        )
      )
      .groupBy(sql`coalesce(${transactions.currency}, 'EUR')`)
      .orderBy(sql`count(*) desc`);

    const currencies = rows.map((r) => ({
      currency: r.currency,
      totalSpent: parseFloat(r.totalSpent),
      totalReceived: parseFloat(r.totalReceived),
      count: parseInt(r.count),
    }));

    return NextResponse.json({ currencies });
  } catch (error) {
    console.error("GET /api/budget/transactions/currencies error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
