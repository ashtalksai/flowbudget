import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { incomeEntries } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(incomeEntries)
      .where(
        and(
          eq(incomeEntries.id, id),
          eq(incomeEntries.userId, session.userId)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ entry: deleted });
  } catch (error) {
    console.error("Income DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
