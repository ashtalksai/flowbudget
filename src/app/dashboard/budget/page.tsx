"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockCategories,
  mockTransactions,
  type MockCategory,
  type MockTransaction,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { Plus, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const PRESET_COLORS = [
  "#0D9488",
  "#F97316",
  "#22C55E",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#EAB308",
  "#EF4444",
];

export default function BudgetPage() {
  const [categories, setCategories] = useState<MockCategory[]>(mockCategories);
  const [transactions, setTransactions] = useState<MockTransaction[]>(mockTransactions);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [expDialogOpen, setExpDialogOpen] = useState(false);

  // Category form
  const [catName, setCatName] = useState("");
  const [catLimit, setCatLimit] = useState("");
  const [catColor, setCatColor] = useState(PRESET_COLORS[0]);

  // Expense form
  const [expAmount, setExpAmount] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expCatId, setExpCatId] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);

  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalBudget = categories.reduce((s, c) => s + c.monthlyLimit, 0);

  const pieData = categories.map((c) => ({
    name: c.name,
    value: c.spent,
    color: c.color,
  }));

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const newCat: MockCategory = {
      id: Date.now(),
      name: catName,
      monthlyLimit: parseFloat(catLimit),
      color: catColor,
      spent: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    setCatDialogOpen(false);
    setCatName("");
    setCatLimit("");
  }

  function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    const cat = categories.find((c) => c.id === parseInt(expCatId));
    if (!cat) return;
    const newTx: MockTransaction = {
      id: Date.now(),
      categoryId: cat.id,
      categoryName: cat.name,
      amount: parseFloat(expAmount),
      description: expDesc,
      date: expDate,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === cat.id ? { ...c, spent: c.spent + parseFloat(expAmount) } : c
      )
    );
    setExpDialogOpen(false);
    setExpAmount("");
    setExpDesc("");
    setExpCatId("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Budget</h1>
          <p className="text-sm text-muted-foreground">
            Track spending by category
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-1 h-4 w-4" /> Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="catName">Name</Label>
                  <Input
                    id="catName"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Entertainment"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catLimit">Monthly Limit (EUR)</Label>
                  <Input
                    id="catLimit"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={catLimit}
                    onChange={(e) => setCatLimit(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCatColor(color)}
                        className="h-8 w-8 rounded-full border-2 transition-transform"
                        style={{
                          backgroundColor: color,
                          borderColor: catColor === color ? "#1E293B" : "transparent",
                          transform: catColor === color ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
                  Add Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={expDialogOpen} onOpenChange={setExpDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-coral hover:bg-coral-600">
                <Plus className="mr-1 h-4 w-4" /> Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expAmount">Amount (EUR)</Label>
                  <Input
                    id="expAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expDesc">Description</Label>
                  <Input
                    id="expDesc"
                    required
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    placeholder="e.g. Grocery shopping"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={expCatId} onValueChange={setExpCatId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expDate">Date</Label>
                  <Input
                    id="expDate"
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-coral hover:bg-coral-600">
                  Add Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-4 w-4 text-teal-500" />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-charcoal">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="font-mono text-2xl font-bold text-charcoal">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground">
                of {formatCurrency(totalBudget)} budget
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category cards */}
        <div className="lg:col-span-2 space-y-3">
          {categories.map((cat) => {
            const pct = Math.min(100, (cat.spent / cat.monthlyLimit) * 100);
            const isOver = cat.spent > cat.monthlyLimit;
            return (
              <Card key={cat.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-charcoal">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-sm font-semibold ${isOver ? "text-red-500" : "text-charcoal"}`}>
                        {formatCurrency(cat.spent)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" / "}
                        {formatCurrency(cat.monthlyLimit)}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={pct}
                    className="h-2"
                    style={
                      {
                        "--progress-color": isOver ? "#EF4444" : cat.color,
                      } as React.CSSProperties
                    }
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 15)
                  .map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center gap-1.5 text-sm"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                categories.find((c) => c.id === tx.categoryId)
                                  ?.color || "#94a3b8",
                            }}
                          />
                          {tx.categoryName}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-charcoal">
                        -{formatCurrency(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
