"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockTransactions,
  getMonthlyIncomeTotals,
  getSmoothedAverage,
  getTotalDebt,
  getMonthlyBudgetRemaining,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { calculateAvalanche } from "@/lib/debt-calculator";
import { mockDebts } from "@/lib/mock-data";
import { TrendingUp, Wallet, CreditCard, PiggyBank, Plus } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const statCards = [
  {
    title: "Smoothed Monthly Income",
    getValue: () => formatCurrency(getSmoothedAverage()),
    icon: TrendingUp,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    title: "Total Debt",
    getValue: () => formatCurrency(getTotalDebt()),
    icon: CreditCard,
    color: "text-coral-600",
    bg: "bg-coral-50",
  },
  {
    title: "Debt-Free Date",
    getValue: () => {
      const result = calculateAvalanche(mockDebts);
      return result.debtFreeDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    },
    icon: Wallet,
    color: "text-fresh-600",
    bg: "bg-fresh-50",
  },
  {
    title: "Budget Remaining",
    getValue: () => formatCurrency(getMonthlyBudgetRemaining()),
    icon: PiggyBank,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function DashboardPage() {
  const monthlyTotals = getMonthlyIncomeTotals();
  const smoothedAvg = getSmoothedAverage();
  const recentTransactions = mockTransactions.slice(0, 5);

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-charcoal">
                    {stat.getValue()}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Income chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Income Flow — Last 12 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTotals}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Income"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#22C55E"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <ReferenceLine
                  y={smoothedAvg}
                  stroke="#0D9488"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  label={{
                    value: `Avg: ${formatCurrency(smoothedAvg)}`,
                    position: "right",
                    fill: "#0D9488",
                    fontSize: 12,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
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
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-charcoal">
                      {tx.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(tx.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {tx.categoryName}
                  </Badge>
                  <span className="font-mono text-sm font-semibold text-charcoal">
                    -{formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
