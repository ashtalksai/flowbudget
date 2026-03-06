import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { debts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userDebts = await db
      .select()
      .from(debts)
      .where(eq(debts.userId, session.userId))
      .orderBy(debts.createdAt);

    return NextResponse.json({ debts: userDebts });
  } catch (error) {
    console.error("GET /api/debts error:", error);
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

    const { name, balance, apr, minPayment } = await request.json();

    if (!name || balance === undefined || apr === undefined || minPayment === undefined) {
      return NextResponse.json(
        { error: "name, balance, apr, and minPayment are required" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json(
        { error: "name must be a non-empty string up to 100 characters" },
        { status: 400 }
      );
    }

    const [debt] = await db
      .insert(debts)
      .values({
        userId: session.userId,
        name: name.trim(),
        balance: String(balance),
        apr: String(apr),
        minPayment: String(minPayment),
      })
      .returning();

    return NextResponse.json({ debt }, { status: 201 });
  } catch (error) {
    console.error("POST /api/debts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
