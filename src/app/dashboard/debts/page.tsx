"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDebts, type MockDebt } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import {
  calculateSnowball,
  calculateAvalanche,
  calculateMinimumOnly,
  type Debt,
} from "@/lib/debt-calculator";
import { Plus, Trash2, CreditCard, Calendar, TrendingDown, Percent } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DEBT_COLORS = ["#0D9488", "#F97316", "#22C55E", "#8B5CF6", "#EC4899"];

export default function DebtsPage() {
  const [debts, setDebts] = useState<MockDebt[]>(mockDebts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("avalanche");

  // Form state
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [minPayment, setMinPayment] = useState("");

  const result = useMemo(() => {
    if (debts.length === 0) return null;
    const inputs: Debt[] = debts.map((d) => ({ ...d }));
    return strategy === "snowball"
      ? calculateSnowball(inputs)
      : calculateAvalanche(inputs);
  }, [debts, strategy]);

  const minimumResult = useMemo(() => {
    if (debts.length === 0) return null;
    const inputs: Debt[] = debts.map((d) => ({ ...d }));
    return calculateMinimumOnly(inputs);
  }, [debts]);

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.minPayment, 0);
  const interestSaved = minimumResult && result
    ? Math.round((minimumResult.totalInterest - result.totalInterest) * 100) / 100
    : 0;

  // Build chart data (show every 3rd month for readability)
  const chartData = useMemo(() => {
    if (!result) return [];
    const step = Math.max(1, Math.floor(result.schedule.length / 20));
    return result.schedule
      .filter((_, i) => i % step === 0 || i === result.schedule.length - 1)
      .map((month) => {
        const row: Record<string, number | string> = { month: `M${month.month}` };
        for (const payment of month.payments) {
          row[payment.name] = Math.round(payment.remainingBalance);
        }
        return row;
      });
  }, [result]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newDebt: MockDebt = {
      id: Date.now(),
      name,
      balance: parseFloat(balance),
      apr: parseFloat(apr),
      minPayment: parseFloat(minPayment),
    };
    setDebts((prev) => [...prev, newDebt]);
    setDialogOpen(false);
    setName("");
    setBalance("");
    setApr("");
    setMinPayment("");
  }

  function handleDelete(id: number) {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Debt Payoff Planner</h1>
          <p className="text-sm text-muted-foreground">
            Compare snowball vs avalanche strategies
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="mr-1 h-4 w-4" /> Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Debt</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Debt Name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Student Loan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance (EUR)</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apr">APR (%)</Label>
                <Input
                  id="apr"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  value={apr}
                  onChange={(e) => setApr(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPayment">Minimum Monthly Payment (EUR)</Label>
                <Input
                  id="minPayment"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={minPayment}
                  onChange={(e) => setMinPayment(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
                Add Debt
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-coral-50 p-2.5">
                <CreditCard className="h-4 w-4 text-coral-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Debt</p>
                <p className="font-mono text-xl font-bold text-charcoal">
                  {formatCurrency(totalDebt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-teal-50 p-2.5">
                <TrendingDown className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Payment</p>
                <p className="font-mono text-xl font-bold text-charcoal">
                  {formatCurrency(totalMinPayment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-fresh-50 p-2.5">
                <Calendar className="h-4 w-4 text-fresh-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Debt-Free Date</p>
                <p className="font-mono text-xl font-bold text-charcoal">
                  {result
                    ? result.debtFreeDate.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-fresh-50 p-2.5">
                <Percent className="h-4 w-4 text-fresh-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interest Saved</p>
                <p className="font-mono text-xl font-bold text-fresh-600">
                  {formatCurrency(interestSaved)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-charcoal">Strategy:</span>
        <Tabs value={strategy} onValueChange={(v) => setStrategy(v as typeof strategy)}>
          <TabsList>
            <TabsTrigger value="avalanche">Avalanche (Highest APR)</TabsTrigger>
            <TabsTrigger value="snowball">Snowball (Lowest Balance)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Debt cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {debts.map((debt, i) => (
          <Card key={debt.id} className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{ backgroundColor: DEBT_COLORS[i % DEBT_COLORS.length] }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-charcoal">{debt.name}</h3>
                  <p className="font-mono text-2xl font-bold text-charcoal mt-1">
                    {formatCurrency(debt.balance)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(debt.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <span>
                  APR: <span className="font-mono font-medium text-charcoal">{debt.apr}%</span>
                </span>
                <span>
                  Min: <span className="font-mono font-medium text-charcoal">{formatCurrency(debt.minPayment)}/mo</span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payoff timeline chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Payoff Timeline ({strategy === "avalanche" ? "Avalanche" : "Snowball"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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
                  {debts.map((debt, i) => (
                    <Bar
                      key={debt.id}
                      dataKey={debt.name}
                      stackId="a"
                      fill={DEBT_COLORS[i % DEBT_COLORS.length]}
                      radius={i === debts.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
