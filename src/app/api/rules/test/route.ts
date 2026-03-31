export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rules } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { description } = await request.json();
  const userRules = await db.select().from(rules).where(eq(rules.userId, session.userId)).orderBy(rules.priority);

  for (const rule of userRules) {
    const desc = description.toLowerCase();
    const pattern = rule.pattern.toLowerCase();
    let match = false;
    switch (rule.matchType) {
      case 'exact': match = desc === pattern; break;
      case 'contains': match = desc.includes(pattern); break;
      case 'starts_with': match = desc.startsWith(pattern); break;
      case 'regex':
        try { match = new RegExp(pattern, 'i').test(description); } catch { match = false; }
        break;
      default: match = desc.includes(pattern);
    }
    if (match) return NextResponse.json({ match: rule });
  }

  return NextResponse.json({ match: null });
}
