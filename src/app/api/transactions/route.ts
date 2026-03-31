export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, accounts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, gte, lte, like, sql, desc, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = request.nextUrl.searchParams;
  const page = parseInt(url.get("page") || "1");
  const limit = 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(transactions.userId, session.userId)];

  if (url.get("account")) conditions.push(eq(transactions.accountId, parseInt(url.get("account")!)));
  if (url.get("category")) conditions.push(eq(transactions.category, url.get("category")!));
  if (url.get("currency")) conditions.push(eq(transactions.currency, url.get("currency")!));
  if (url.get("status")) conditions.push(eq(transactions.status, url.get("status")!));
  if (url.get("dateFrom")) conditions.push(gte(transactions.date, url.get("dateFrom")!));
  if (url.get("dateTo")) conditions.push(lte(transactions.date, url.get("dateTo")!));
  if (url.get("search")) conditions.push(like(transactions.description, `%${url.get("search")}%`));
  if (url.get("hideInternal") === "true") conditions.push(eq(transactions.isInternal, false));
  
  const direction = url.get("direction");
  if (direction === "income") conditions.push(sql`${transactions.amount}::numeric > 0`);
  if (direction === "expense") conditions.push(sql`${transactions.amount}::numeric < 0`);

  const where = and(...conditions);

  const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(transactions).where(where);
  const rows = await db.select({
    id: transactions.id,
    date: transactions.date,
    description: transactions.description,
    amount: transactions.amount,
    currency: transactions.currency,
    amountBase: transactions.amountBase,
    category: transactions.category,
    subcategory: transactions.subcategory,
    status: transactions.status,
    isInternal: transactions.isInternal,
    isReimbursable: transactions.isReimbursable,
    reimbursableFrom: transactions.reimbursableFrom,
    accountId: transactions.accountId,
    accountLabel: accounts.label,
  })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(where)
    .orderBy(desc(transactions.date), desc(transactions.id))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({
    transactions: rows,
    total: Number(countResult.count),
    page,
    totalPages: Math.ceil(Number(countResult.count) / limit),
  });
}
