import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, incomeEntries, debts, budgetCategories, transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        currency: users.currency,
        tier: users.tier,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [userIncomeEntries, userDebts, userBudgetCategories, userTransactions] =
      await Promise.all([
        db.select().from(incomeEntries).where(eq(incomeEntries.userId, session.userId)),
        db.select().from(debts).where(eq(debts.userId, session.userId)),
        db.select().from(budgetCategories).where(eq(budgetCategories.userId, session.userId)),
        db.select().from(transactions).where(eq(transactions.userId, session.userId)),
      ]);

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user,
      incomeEntries: userIncomeEntries,
      debts: userDebts,
      budgetCategories: userBudgetCategories,
      transactions: userTransactions,
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
