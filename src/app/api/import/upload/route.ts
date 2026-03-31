import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, imports, rules, accounts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import Papa from "papaparse";

function detectFormat(headers: string[]): string {
  const h = headers.map(h => h.toLowerCase().trim());
  if (h.includes('type') && h.includes('product') && h.includes('started date')) return 'revolut';
  if (h.some(x => x.includes('transferwise')) || (h.includes('date') && h.includes('amount') && h.includes('currency') && h.includes('description'))) return 'wise';
  return 'generic';
}

function parseRevolutRow(row: any): { date: string; description: string; amount: number; currency: string } | null {
  if (row['State'] === 'REVERTED' || row['State'] === 'FAILED') return null;
  const dateStr = row['Completed Date'] || row['Started Date'];
  if (!dateStr) return null;
  // Format: "2024-01-15 12:30:00" or similar
  const date = dateStr.split(' ')[0];
  return {
    date,
    description: row['Description'] || '',
    amount: parseFloat(row['Amount']) || 0,
    currency: row['Currency'] || 'EUR',
  };
}

function parseWiseRow(row: any): { date: string; description: string; amount: number; currency: string } | null {
  let dateStr = row['Date'] || row['date'];
  if (!dateStr) return null;
  // DD-MM-YYYY -> YYYY-MM-DD
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [d, m, y] = dateStr.split('-');
    dateStr = `${y}-${m}-${d}`;
  }
  return {
    date: dateStr,
    description: row['Description'] || row['description'] || '',
    amount: parseFloat(row['Amount'] || row['amount']) || 0,
    currency: row['Currency'] || row['currency'] || 'EUR',
  };
}

function parseGenericRow(row: any, headers: string[]): { date: string; description: string; amount: number; currency: string } | null {
  const dateKey = headers.find(h => /date/i.test(h));
  const descKey = headers.find(h => /desc|memo|narr|note/i.test(h));
  const amountKey = headers.find(h => /amount|value|sum/i.test(h));
  const currKey = headers.find(h => /curr/i.test(h));
  
  if (!dateKey || !amountKey) return null;
  
  let dateStr = row[dateKey];
  if (dateStr && dateStr.match(/^\d{2}[-/]\d{2}[-/]\d{4}$/)) {
    const parts = dateStr.split(/[-/]/);
    dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  return {
    date: dateStr || '',
    description: descKey ? (row[descKey] || '') : '',
    amount: parseFloat(row[amountKey]) || 0,
    currency: currKey ? (row[currKey] || 'EUR') : 'EUR',
  };
}

function matchRule(description: string, userRules: any[]): any | null {
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
    if (match) return rule;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const accountId = formData.get("accountId") ? parseInt(formData.get("accountId") as string) : null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  
  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    return NextResponse.json({ error: "Failed to parse CSV" }, { status: 400 });
  }

  const headers = parsed.meta.fields || [];
  const format = detectFormat(headers);
  
  // Get user rules
  const userRules = await db.select().from(rules).where(eq(rules.userId, session.userId)).orderBy(rules.priority);

  let rowsNew = 0, rowsDuplicate = 0, rowsAutoCategorized = 0;
  const rows = parsed.data as any[];

  // Create import record
  const [importRecord] = await db.insert(imports).values({
    userId: session.userId,
    accountId,
    filename: file.name,
    formatDetected: format,
    rowsTotal: rows.length,
    status: 'processing',
  }).returning();

  for (const row of rows) {
    let txn: { date: string; description: string; amount: number; currency: string } | null = null;

    switch (format) {
      case 'revolut': txn = parseRevolutRow(row); break;
      case 'wise': txn = parseWiseRow(row); break;
      default: txn = parseGenericRow(row, headers); break;
    }

    if (!txn || !txn.date || txn.amount === 0) continue;

    // Dedup check
    const existing = await db.execute(sql`
      SELECT id FROM transactions 
      WHERE user_id = ${session.userId} 
        AND date = ${txn.date}::date 
        AND amount = ${txn.amount} 
        AND description = ${txn.description}
      LIMIT 1
    `);

    if (existing.rows.length > 0) {
      rowsDuplicate++;
      continue;
    }

    // Check rules
    const matchedRule = matchRule(txn.description, userRules);
    const category = matchedRule?.category || null;
    const subcategory = matchedRule?.subcategory || null;
    const status = matchedRule ? 'categorized' : 'pending';
    if (matchedRule) rowsAutoCategorized++;

    await db.insert(transactions).values({
      userId: session.userId,
      importId: importRecord.id,
      accountId,
      date: txn.date,
      description: txn.description,
      amount: txn.amount.toString(),
      currency: txn.currency,
      amountBase: txn.currency === 'EUR' ? txn.amount.toString() : null,
      category,
      subcategory,
      status,
      isReimbursable: matchedRule?.isReimbursable || false,
      reimbursableFrom: matchedRule?.reimbursableFrom || null,
      rawRow: row,
    });
    rowsNew++;
  }

  // Update import record
  await db.update(imports).set({
    rowsNew,
    rowsDuplicate,
    rowsAutoCategorized,
    rowsTotal: rows.length,
    status: 'completed',
  }).where(eq(imports.id, importRecord.id));

  return NextResponse.json({
    importId: importRecord.id,
    format,
    rowsTotal: rows.length,
    rowsNew,
    rowsDuplicate,
    rowsAutoCategorized,
    rowsPending: rowsNew - rowsAutoCategorized,
  });
}
