"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Wallet, Clock, HandCoins } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/stats").then(r => r.json()).then(setStats);
    fetch("/api/transactions/summary").then(r => r.json()).then(d => setChartData(d.summary || []));
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-2xl font-bold text-fresh">{formatCurrency(stats.income)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-fresh-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(stats.expenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net</p>
                <p className={`text-2xl font-bold ${stats.net >= 0 ? 'text-fresh' : 'text-red-500'}`}>
                  {formatCurrency(stats.net)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-teal-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className={stats.pendingReview > 0 ? 'border-coral/50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pendingReview}</p>
              </div>
              <Clock className="h-8 w-8 text-coral-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash flow chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cash Flow — Last 12 Months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#22C55E" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.budgetProgress?.length > 0 ? (
              stats.budgetProgress.map((b: any) => {
                const pct = b.monthly_limit > 0 ? Math.round((parseFloat(b.spent) / parseFloat(b.monthly_limit)) * 100) : 0;
                return (
                  <div key={b.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{b.category}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(b.spent)} / {formatCurrency(b.monthly_limit)}
                      </span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className="h-2"
                      style={{ '--progress-color': pct > 80 ? '#EF4444' : pct > 50 ? '#EAB308' : '#22C55E' } as any} />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No budgets set yet. Go to Budget page to set them.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent transactions + reimbursables */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            {stats.reimbursablesOutstanding > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <HandCoins className="h-4 w-4 text-teal" />
                <span className="text-muted-foreground">Owed to you:</span>
                <span className="font-bold text-teal">{formatCurrency(stats.reimbursablesOutstanding)}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(stats.recentTransactions || []).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(t.date)}</span>
                      {t.account_label && <Badge variant="outline" className="text-xs">{t.account_label}</Badge>}
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-medium ${parseFloat(t.amount) >= 0 ? 'text-fresh' : 'text-red-500'}`}>
                    {formatCurrency(t.amount_base || t.amount, 'EUR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
