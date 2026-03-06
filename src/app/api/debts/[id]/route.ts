import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { debts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid debt id" }, { status: 400 });
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
      .update(debts)
      .set({
        name: name.trim(),
        balance: String(balance),
        apr: String(apr),
        minPayment: String(minPayment),
      })
      .where(and(eq(debts.id, id), eq(debts.userId, session.userId)))
      .returning();

    if (!debt) {
      return NextResponse.json({ error: "Debt not found" }, { status: 404 });
    }

    return NextResponse.json({ debt });
  } catch (error) {
    console.error("PUT /api/debts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid debt id" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(debts)
      .where(and(eq(debts.id, id), eq(debts.userId, session.userId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Debt not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/debts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
