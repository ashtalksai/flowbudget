"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockIncome,
  getSmoothedAverage,
  type MockIncome,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import { Plus, Trash2, TrendingUp, DollarSign } from "lucide-react";

export default function IncomePage() {
  const [entries, setEntries] = useState<MockIncome[]>(mockIncome);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"all" | "monthly" | "weekly">("all");

  // Form state
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (view === "monthly") {
      const thisMonth = new Date().toISOString().slice(0, 7);
      return sorted.filter((e) => e.date.startsWith(thisMonth));
    }
    if (view === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sorted.filter((e) => new Date(e.date) >= weekAgo);
    }
    return sorted;
  }, [entries, view]);

  const totalIncome = filteredEntries.reduce((s, e) => s + e.amount, 0);
  const smoothedAvg = getSmoothedAverage();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newEntry: MockIncome = {
      id: Date.now(),
      amount: parseFloat(amount),
      source,
      date,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setDialogOpen(false);
    setAmount("");
    setSource("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsRecurring(false);
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Income Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Track your freelance income and see your smoothed average
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="mr-1 h-4 w-4" /> Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Income Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (EUR)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Web Dev Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="recurring" className="text-sm">
                  Recurring income
                </Label>
              </div>
              {isRecurring && (
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
                Add Income
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-fresh-50 p-3">
              <DollarSign className="h-5 w-5 text-fresh-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {view === "all" ? "Total" : view === "monthly" ? "This Month" : "This Week"} Income
              </p>
              <p className="font-mono text-2xl font-bold text-charcoal">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-teal-50 p-3">
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                6-Month Smoothed Average
              </p>
              <p className="font-mono text-2xl font-bold text-charcoal">
                {formatCurrency(smoothedAvg)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View toggle + table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Income History</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell className="font-medium">{entry.source}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-fresh-600">
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.isRecurring ? "default" : "secondary"}
                        className={
                          entry.isRecurring
                            ? "bg-teal-100 text-teal-700 hover:bg-teal-100"
                            : ""
                        }
                      >
                        {entry.isRecurring
                          ? `Recurring (${entry.frequency})`
                          : "One-time"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No income entries found for this period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
