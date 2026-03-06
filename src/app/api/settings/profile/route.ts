import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

const VALID_CURRENCIES = ["EUR", "USD", "GBP", "CHF", "SEK", "NOK", "DKK", "PLN"] as const;
type Currency = typeof VALID_CURRENCIES[number];

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, currency } = body;

    if (currency !== undefined && !VALID_CURRENCIES.includes(currency as Currency)) {
      return NextResponse.json(
        { error: `Invalid currency. Must be one of: ${VALID_CURRENCIES.join(", ")}` },
        { status: 400 }
      );
    }

    const updates: { name?: string | null; currency?: string } = {};

    if (name !== undefined) {
      updates.name = name === "" ? null : String(name).slice(0, 100);
    }
    if (currency !== undefined) {
      updates.currency = currency as Currency;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, session.userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        currency: users.currency,
        tier: users.tier,
      });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
