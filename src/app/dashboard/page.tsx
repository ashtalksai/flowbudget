"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Transaction {
  id: number;
  amount: string;
  description: string | null;
  date: string;
  categoryId: number | null;
}

interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

interface SummaryData {
  monthly: MonthlySummary[];
  currentMonth: { income: number; expense: number };
}

function stripSource(desc: string | null): string {
  if (!desc) return "—";
  return desc.replace(/^\[.*?\]\s*/, "");
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sumRes, txRes] = await Promise.all([
          fetch("/api/budget/transactions/summary"),
          fetch("/api/budget/transactions"),
        ]);
        if (sumRes.ok) {
          const data = await sumRes.json();
          setSummary(data);
        }
        if (txRes.ok) {
          const data = await txRes.json();
          setRecentTx((data.transactions || []).slice(0, 10));
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const monthlyIncome = summary?.currentMonth.income ?? 0;
  const monthlyExpense = summary?.currentMonth.expense ?? 0;
  const net = monthlyIncome - monthlyExpense;

  const chartData = (summary?.monthly ?? []).map((m) => ({
    month: formatMonth(m.month),
    Income: m.income,
    Expenses: m.expense,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your financial overview at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/income">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
              <Plus className="mr-1 h-4 w-4" /> Income
            </Button>
          </Link>
          <Link href="/dashboard/budget">
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" /> Expense
            </Button>
          </Link>
          <Link href="/dashboard/debts">
            <Button size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" /> Debt
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Income This Month</p>
                <p className="mt-1 font-mono text-2xl font-bold text-charcoal">
                  {formatCurrency(monthlyIncome)}
                </p>
              </div>
              <div className="rounded-full p-3 bg-teal-50">
                <ArrowUpRight className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expenses This Month</p>
                <p className="mt-1 font-mono text-2xl font-bold text-charcoal">
                  {formatCurrency(monthlyExpense)}
                </p>
              </div>
              <div className="rounded-full p-3 bg-red-50">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net This Month</p>
                <p className={`mt-1 font-mono text-2xl font-bold ${net >= 0 ? "text-teal-600" : "text-red-500"}`}>
                  {net >= 0 ? "+" : ""}{formatCurrency(net)}
                </p>
              </div>
              <div className={`rounded-full p-3 ${net >= 0 ? "bg-teal-50" : "bg-red-50"}`}>
                {net >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income/Expense chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cash Flow — Last 12 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No transaction data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      String(name),
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Income" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Link href="/dashboard/budget">
            <Button variant="ghost" size="sm" className="text-teal-600">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx) => {
                const amt = parseFloat(tx.amount);
                const isPositive = amt >= 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-charcoal">
                          {stripSource(tx.description)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(tx.date)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-sm font-semibold ${
                        isPositive ? "text-teal-600" : "text-red-500"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(amt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
