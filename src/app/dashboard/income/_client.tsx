"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from "recharts";

const COLORS = ['#0D9488', '#22C55E', '#3B82F6', '#F97316', '#8B5CF6', '#EC4899', '#EAB308', '#EF4444'];

export default function IncomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [excludedCategories, setExcludedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/income/summary").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal" /></div>;

  const { byCategory, monthlyTotals, smoothedAverage } = data || {};

  // Get unique categories from income
  const allCategories = Array.from(new Set((byCategory || []).map((r: any) => r.category || 'Uncategorized')));

  // Build chart data: each month has bars per category + smoothed line
  const months = (monthlyTotals || []).map((mt: any) => mt.month);
  const chartData = months.map((m: string) => {
    const point: any = { month: m };
    allCategories.forEach(cat => {
      if (!excludedCategories.has(cat as string)) {
        const match = (byCategory || []).find((r: any) => r.month === m && (r.category || 'Uncategorized') === cat);
        point[cat as string] = match ? parseFloat(match.total) : 0;
      }
    });
    const avg = (smoothedAverage || []).find((s: any) => s.month === m);
    point.average = avg ? avg.average : 0;
    return point;
  });

  // Category totals for the summary table
  const categoryTotals = allCategories.map(cat => {
    const total = (byCategory || [])
      .filter((r: any) => (r.category || 'Uncategorized') === cat)
      .reduce((s: number, r: any) => s + parseFloat(r.total), 0);
    return { category: cat, total };
  }).sort((a, b) => b.total - a.total);

  const toggleCategory = (cat: string) => {
    setExcludedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Income</h1>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                {allCategories.filter(c => !excludedCategories.has(c as string)).map((cat, i) => (
                  <Bar key={cat as string} dataKey={cat as string} stackId="a" fill={COLORS[i % COLORS.length]} />
                ))}
                <Line type="monotone" dataKey="average" stroke="#F97316" strokeWidth={2} dot={false} name="6-mo Average" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category toggles + table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Income by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {allCategories.map((cat, i) => (
              <button
                key={cat as string}
                onClick={() => toggleCategory(cat as string)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  excludedCategories.has(cat as string)
                    ? 'bg-muted text-muted-foreground border-muted'
                    : 'text-white border-transparent'
                }`}
                style={!excludedCategories.has(cat as string) ? { backgroundColor: COLORS[i % COLORS.length] } : {}}
              >
                {cat as string}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {categoryTotals.map((ct, i) => (
              <div key={ct.category as string} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium">{ct.category as string}</span>
                </div>
                <span className="text-sm font-mono text-fresh">{formatCurrency(ct.total)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
