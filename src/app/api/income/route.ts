import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { incomeEntries } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await db
      .select()
      .from(incomeEntries)
      .where(eq(incomeEntries.userId, session.userId))
      .orderBy(desc(incomeEntries.date));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Income GET error:", error);
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
    const { amount, source, date, isRecurring, frequency } = body;

    if (!amount || !source || !date) {
      return NextResponse.json(
        { error: "amount, source, and date are required" },
        { status: 400 }
      );
    }

    const [entry] = await db
      .insert(incomeEntries)
      .values({
        userId: session.userId,
        amount: String(amount),
        source: String(source),
        date: String(date),
        isRecurring: Boolean(isRecurring ?? false),
        frequency: frequency ? String(frequency) : null,
      })
      .returning();

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Income POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
