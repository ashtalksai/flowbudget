export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, budgets, reimbursables } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Monthly stats
  const [monthStats] = await db.execute(sql`
    SELECT 
      SUM(CASE WHEN amount::numeric > 0 AND is_internal = false THEN COALESCE(amount_base, amount)::numeric ELSE 0 END) as income,
      SUM(CASE WHEN amount::numeric < 0 AND is_internal = false THEN ABS(COALESCE(amount_base, amount)::numeric) ELSE 0 END) as expenses
    FROM transactions
    WHERE user_id = ${session.userId} AND to_char(date, 'YYYY-MM') = ${currentMonth}
  `).then(r => r.rows);

  // Pending count
  const [pendingResult] = await db.execute(sql`
    SELECT count(*) as count FROM transactions WHERE user_id = ${session.userId} AND status = 'pending'
  `).then(r => r.rows);

  // Last 10 transactions
  const recent = await db.execute(sql`
    SELECT t.id, t.date, t.description, t.amount, t.currency, t.amount_base, t.category, t.status, t.is_internal, a.label as account_label
    FROM transactions t
    LEFT JOIN accounts a ON t.account_id = a.id
    WHERE t.user_id = ${session.userId}
    ORDER BY t.date DESC, t.id DESC
    LIMIT 10
  `).then(r => r.rows);

  // Top 5 budget categories with spend
  const budgetProgress = await db.execute(sql`
    SELECT b.category, b.monthly_limit, b.color,
      COALESCE(
        (SELECT SUM(ABS(COALESCE(amount_base, amount)::numeric))
         FROM transactions 
         WHERE user_id = ${session.userId} 
           AND category = b.category 
           AND amount::numeric < 0 
           AND is_internal = false
           AND to_char(date, 'YYYY-MM') = ${currentMonth}
        ), 0
      ) as spent
    FROM budgets b
    WHERE b.user_id = ${session.userId}
    ORDER BY spent DESC
    LIMIT 5
  `).then(r => r.rows);

  // Outstanding reimbursables
  const [reimbursableStats] = await db.execute(sql`
    SELECT COALESCE(SUM(amount::numeric), 0) as total, count(*) as count
    FROM reimbursables
    WHERE user_id = ${session.userId} AND status = 'outstanding'
  `).then(r => r.rows);

  return NextResponse.json({
    income: parseFloat((monthStats as any)?.income || '0'),
    expenses: parseFloat((monthStats as any)?.expenses || '0'),
    net: parseFloat((monthStats as any)?.income || '0') - parseFloat((monthStats as any)?.expenses || '0'),
    pendingReview: parseInt((pendingResult as any)?.count || '0'),
    recentTransactions: recent,
    budgetProgress,
    reimbursablesOutstanding: parseFloat((reimbursableStats as any)?.total || '0'),
    reimbursablesCount: parseInt((reimbursableStats as any)?.count || '0'),
  });
}
