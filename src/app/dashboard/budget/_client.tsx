"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BudgetPage() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState<any[]>([]);
  const [actuals, setActuals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const [addLimit, setAddLimit] = useState("");
  const [detailCategory, setDetailCategory] = useState<string | null>(null);
  const [detailTxns, setDetailTxns] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [bRes, aRes, cRes] = await Promise.all([
        fetch("/api/budgets").then(r => r.json()),
        fetch(`/api/budgets/actuals?month=${month}`).then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
      ]);
      setBudgets(bRes.budgets || []);
      setActuals(aRes.actuals || []);
      setCategories(cRes.categories || []);
      setLoading(false);
    };
    load();
  }, [month]);

  const changeMonth = (delta: number) => {
    const d = new Date(month + '-01');
    d.setMonth(d.getMonth() + delta);
    setMonth(d.toISOString().slice(0, 7));
  };

  const monthLabel = new Date(month + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const saveBudget = async () => {
    if (!addCategory || !addLimit) return;
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: addCategory, monthlyLimit: parseFloat(addLimit) }),
    });
    setShowAdd(false);
    setAddCategory("");
    setAddLimit("");
    // Reload
    const bRes = await fetch("/api/budgets").then(r => r.json());
    setBudgets(bRes.budgets || []);
  };

  const openDetail = async (category: string) => {
    setDetailCategory(category);
    const params = new URLSearchParams({
      category, status: '', direction: 'expense',
      dateFrom: month + '-01',
      dateTo: new Date(new Date(month + '-01').setMonth(new Date(month + '-01').getMonth() + 1)).toISOString().slice(0, 10),
      hideInternal: 'true',
    });
    const res = await fetch(`/api/transactions?${params}`).then(r => r.json());
    setDetailTxns(res.transactions || []);
  };

  // Merge budgets with actuals
  const allCategories = new Set([
    ...budgets.map(b => b.category),
    ...actuals.map(a => a.category),
  ]);

  const merged = Array.from(allCategories).map(cat => {
    const budget = budgets.find(b => b.category === cat);
    const actual = actuals.find(a => a.category === cat);
    const spent = parseFloat(actual?.spent || '0');
    const limit = parseFloat(budget?.monthlyLimit || '0');
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    return { category: cat, spent, limit, pct, color: budget?.color || '#6B7280', hasBudget: !!budget };
  }).sort((a, b) => b.spent - a.spent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budget</h1>
        <Button onClick={() => setShowAdd(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Set Budget
        </Button>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-lg font-semibold min-w-[180px] text-center">{monthLabel}</span>
        <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal" /></div>
      ) : merged.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No spending data for this month.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {merged.map(item => (
            <Card key={item.category} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openDetail(item.category)}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.category}</span>
                  <div className="text-sm text-right">
                    <span className="font-mono">{formatCurrency(item.spent)}</span>
                    {item.hasBudget && (
                      <span className="text-muted-foreground"> / {formatCurrency(item.limit)}</span>
                    )}
                    {!item.hasBudget && (
                      <span className="text-xs text-muted-foreground ml-2">No budget</span>
                    )}
                  </div>
                </div>
                {item.hasBudget && (
                  <Progress value={Math.min(item.pct, 100)} className="h-2"
                    style={{ '--tw-bg-opacity': 1, background: `${item.pct > 80 ? '#FEE2E2' : item.pct > 50 ? '#FEF9C3' : '#DCFCE7'}` } as any} />
                )}
                {item.hasBudget && (
                  <p className={`text-xs mt-1 ${item.pct > 80 ? 'text-red-500' : item.pct > 50 ? 'text-yellow-600' : 'text-fresh'}`}>
                    {item.pct}% used
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add budget dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              value={addCategory} onChange={e => setAddCategory(e.target.value)}>
              <option value="">Select category...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <Input type="number" placeholder="Monthly limit (EUR)" value={addLimit}
              onChange={e => setAddLimit(e.target.value)} />
            <Button onClick={saveBudget} className="w-full bg-teal hover:bg-teal-600">Save Budget</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailCategory} onOpenChange={() => setDetailCategory(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailCategory} — {monthLabel}</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {detailTxns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions.</p>
            ) : detailTxns.map(t => (
              <div key={t.id} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm truncate max-w-xs">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                </div>
                <span className="text-sm font-mono text-red-500">{formatCurrency(t.amountBase || t.amount)}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
