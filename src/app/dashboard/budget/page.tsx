"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { formatCurrency, formatDate } from "@/lib/format";
import { Search, Filter, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: number;
  amount: string;
  currency: string | null;
  amountEur: string | null;
  description: string | null;
  date: string;
  categoryId: number | null;
}

function stripSource(desc: string | null): string {
  if (!desc) return "—";
  return desc.replace(/^\[.*?\]\s*/, "");
}

const PAGE_SIZE = 50;

export default function BudgetPage() {
  const [allTx, setAllTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/budget/transactions");
        if (res.ok) {
          const data = await res.json();
          setAllTx(data.transactions || []);
        }
      } catch (e) {
        console.error("Budget load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = allTx;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((tx) =>
        stripSource(tx.description).toLowerCase().includes(q)
      );
    }

    if (typeFilter === "income") {
      result = result.filter((tx) => parseFloat(tx.amount) >= 0);
    } else if (typeFilter === "expense") {
      result = result.filter((tx) => parseFloat(tx.amount) < 0);
    }

    if (dateFrom) {
      result = result.filter((tx) => tx.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((tx) => tx.date <= dateTo);
    }

    return result;
  }, [allTx, search, typeFilter, dateFrom, dateTo]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // For summary cards, use amountEur if available, otherwise fall back to amount (EUR transactions)
  const getEurAmount = (tx: Transaction) => {
    if (tx.amountEur) return parseFloat(tx.amountEur);
    if (!tx.currency || tx.currency === "EUR") return parseFloat(tx.amount);
    return 0; // Non-EUR without amountEur — skip for EUR totals
  };

  const totalIncome = filtered
    .filter((tx) => getEurAmount(tx) >= 0)
    .reduce((s, tx) => s + getEurAmount(tx), 0);
  const totalExpense = filtered
    .filter((tx) => getEurAmount(tx) < 0)
    .reduce((s, tx) => s + Math.abs(getEurAmount(tx)), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length.toLocaleString()} transaction{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Summary cards — show EUR totals */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-2 bg-teal-50">
              <ArrowUpRight className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Income (EUR, filtered)</p>
              <p className="font-mono text-lg font-bold text-teal-600">
                +{formatCurrency(totalIncome, "EUR")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full p-2 bg-red-50">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Expenses (EUR, filtered)</p>
              <p className="font-mono text-lg font-bold text-red-500">
                -{formatCurrency(totalExpense, "EUR")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                <Search className="h-3 w-3" /> Search
              </Label>
              <Input
                placeholder="Search descriptions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1">
                <Filter className="h-3 w-3" /> Type
              </Label>
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as "all" | "income" | "expense")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income (+)</SelectItem>
                  <SelectItem value="expense">Expenses (−)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          {(search || typeFilter !== "all" || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-xs text-muted-foreground"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No transactions match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((tx) => {
                    const amt = parseFloat(tx.amount);
                    const isPositive = amt >= 0;
                    const cur = tx.currency || "EUR";
                    const isNonEur = cur !== "EUR";
                    return (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {stripSource(tx.description)}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <span
                            className={`font-mono font-semibold ${
                              isPositive ? "text-teal-600" : "text-red-500"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {formatCurrency(amt, cur)}
                          </span>
                          {isNonEur && (
                            <Badge
                              variant="secondary"
                              className="ml-1.5 text-[10px] px-1.5 py-0 font-normal text-gray-500 bg-gray-100"
                            >
                              {cur}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
