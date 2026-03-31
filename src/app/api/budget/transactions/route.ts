import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        currency: transactions.currency,
        amountEur: transactions.amountEur,
        description: transactions.description,
        date: transactions.date,
        categoryId: transactions.categoryId,
        isInternal: transactions.isInternal,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.userId),
          sql`(${transactions.isInternal} = false OR ${transactions.isInternal} IS NULL)`
        )
      )
      .orderBy(desc(transactions.date), desc(transactions.createdAt));

    return NextResponse.json({ transactions: results });
  } catch (error) {
    console.error("GET /api/budget/transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, date, description, categoryId } = body;

    if (!amount || !date) {
      return NextResponse.json(
        { error: "amount and date are required" },
        { status: 400 }
      );
    }

    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: session.userId,
        amount: String(amount),
        date,
        description: description ?? null,
        categoryId: categoryId ?? null,
      })
      .returning();

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("POST /api/budget/transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
