import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { budgetCategories } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await db
      .select()
      .from(budgetCategories)
      .where(eq(budgetCategories.userId, session.userId));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/budget/categories error:", error);
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
    const { name, monthlyLimit, color } = body;

    if (!name || monthlyLimit === undefined || !color) {
      return NextResponse.json(
        { error: "name, monthlyLimit, and color are required" },
        { status: 400 }
      );
    }

    const [category] = await db
      .insert(budgetCategories)
      .values({
        userId: session.userId,
        name,
        monthlyLimit: String(monthlyLimit),
        color,
      })
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/budget/categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
