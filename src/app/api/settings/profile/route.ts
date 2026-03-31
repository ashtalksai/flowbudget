export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.currency !== undefined) updates.currency = body.currency;

  const [updated] = await db.update(users).set(updates)
    .where(eq(users.id, session.userId))
    .returning({ id: users.id, email: users.email, name: users.name, currency: users.currency });

  return NextResponse.json({ user: updated });
}
