import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, incomeEntries, debts, budgetCategories, transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.delete(transactions).where(eq(transactions.userId, session.userId));
    await db.delete(budgetCategories).where(eq(budgetCategories.userId, session.userId));
    await db.delete(debts).where(eq(debts.userId, session.userId));
    await db.delete(incomeEntries).where(eq(incomeEntries.userId, session.userId));
    await db.delete(users).where(eq(users.id, session.userId));

    const response = NextResponse.json({ message: "Account deleted successfully" });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
