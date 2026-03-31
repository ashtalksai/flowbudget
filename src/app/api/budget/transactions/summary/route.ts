import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql, and, gte } from "drizzle-orm";

// Simple in-memory cache for EUR exchange rates (1 hour TTL)
let rateCache: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getEurRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (rateCache && now - rateCache.timestamp < CACHE_TTL_MS) {
    return rateCache.rates;
  }

  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=TRY,USD,CAD,GBP,CHF,SEK,NOK,DKK,PLN",
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      // data.rates = { TRY: 38.5, USD: 1.08, ... } (how many X per 1 EUR)
      rateCache = { rates: data.rates, timestamp: now };
      return data.rates;
    }
  } catch (e) {
    console.error("Failed to fetch EUR rates:", e);
  }

  // Fallback rates if API fails
  return rateCache?.rates ?? { TRY: 38.0, USD: 1.08, CAD: 1.48, GBP: 0.86 };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch live rates for conversion
    const eurRates = await getEurRates();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const cutoff = twelveMonthsAgo.toISOString().split("T")[0];

    // Build a SQL CASE expression that converts any currency to EUR
    // amount_eur is pre-computed for historical data; for rows without it, divide by the rate
    const rateCases = Object.entries(eurRates)
      .map(([cur, rate]) => `WHEN currency = '${cur}' THEN amount::numeric / ${rate}`)
      .join(" ");

    const eurExpr = sql.raw(
      `COALESCE(amount_eur, CASE ${rateCases} ELSE amount::numeric END)`
    );

    const rows = await db
      .select({
        month: sql<string>`to_char(${transactions.date}::date, 'YYYY-MM')`,
        income: sql<string>`coalesce(sum(case when ${eurExpr} >= 0 then ${eurExpr} else 0 end), 0)`,
        expense: sql<string>`coalesce(sum(case when ${eurExpr} < 0 then abs(${eurExpr}) else 0 end), 0)`,
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
        income: sql<string>`coalesce(sum(case when ${eurExpr} >= 0 then ${eurExpr} else 0 end), 0)`,
        expense: sql<string>`coalesce(sum(case when ${eurExpr} < 0 then abs(${eurExpr}) else 0 end), 0)`,
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
