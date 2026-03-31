"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit2, Check, HandCoins, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DebtsPage() {
  const [debts, setDebts] = useState<any[]>([]);
  const [reimbursables, setReimbursables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [showAddReimb, setShowAddReimb] = useState(false);
  const [debtForm, setDebtForm] = useState({ name: '', balance: '', apr: '', minPayment: '', notes: '', dueDate: '' });
  const [reimbForm, setReimbForm] = useState({ fromPerson: '', description: '', amount: '', date: '' });
  const [payoffMethod, setPayoffMethod] = useState<'snowball' | 'avalanche'>('avalanche');

  useEffect(() => {
    const load = async () => {
      const [dRes, rRes] = await Promise.all([
        fetch("/api/debts").then(r => r.json()),
        fetch("/api/reimbursables").then(r => r.json()),
      ]);
      setDebts(dRes.debts || []);
      setReimbursables(rRes.reimbursables || []);
      setLoading(false);
    };
    load();
  }, []);

  const saveDebt = async () => {
    await fetch("/api/debts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: debtForm.name,
        balance: parseFloat(debtForm.balance),
        apr: parseFloat(debtForm.apr) || 0,
        minPayment: parseFloat(debtForm.minPayment) || 0,
        notes: debtForm.notes,
        dueDate: debtForm.dueDate || null,
      }),
    });
    setShowAddDebt(false);
    setDebtForm({ name: '', balance: '', apr: '', minPayment: '', notes: '', dueDate: '' });
    const dRes = await fetch("/api/debts").then(r => r.json());
    setDebts(dRes.debts || []);
  };

  const deleteDebt = async (id: number) => {
    await fetch(`/api/debts/${id}`, { method: "DELETE" });
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const saveReimb = async () => {
    await fetch("/api/reimbursables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromPerson: reimbForm.fromPerson,
        description: reimbForm.description,
        amount: parseFloat(reimbForm.amount),
        date: reimbForm.date || new Date().toISOString().split('T')[0],
      }),
    });
    setShowAddReimb(false);
    setReimbForm({ fromPerson: '', description: '', amount: '', date: '' });
    const rRes = await fetch("/api/reimbursables").then(r => r.json());
    setReimbursables(rRes.reimbursables || []);
  };

  const markPaid = async (id: number) => {
    await fetch(`/api/reimbursables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: 'paid' }),
    });
    const rRes = await fetch("/api/reimbursables").then(r => r.json());
    setReimbursables(rRes.reimbursables || []);
  };

  const deleteReimb = async (id: number) => {
    await fetch(`/api/reimbursables/${id}`, { method: "DELETE" });
    setReimbursables(prev => prev.filter(r => r.id !== id));
  };

  // Simple payoff calculation
  const totalDebt = debts.reduce((s, d) => s + parseFloat(d.balance || '0'), 0);
  const sortedDebts = [...debts].sort((a, b) => {
    if (payoffMethod === 'snowball') return parseFloat(a.balance) - parseFloat(b.balance);
    return parseFloat(b.apr || '0') - parseFloat(a.apr || '0');
  });

  const outstanding = reimbursables.filter(r => r.status === 'outstanding');
  const paid = reimbursables.filter(r => r.status === 'paid');
  const totalOutstanding = outstanding.reduce((s, r) => s + parseFloat(r.amount || '0'), 0);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Debts & Reimbursables</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalDebt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Owed to You</p>
            <p className="text-2xl font-bold text-teal">{formatCurrency(totalOutstanding)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net Position</p>
            <p className={`text-2xl font-bold ${totalOutstanding - totalDebt >= 0 ? 'text-fresh' : 'text-red-500'}`}>
              {formatCurrency(totalOutstanding - totalDebt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Debts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Debts</CardTitle>
          <div className="flex items-center gap-2">
            <select className="border rounded px-2 py-1 text-sm bg-background"
              value={payoffMethod} onChange={e => setPayoffMethod(e.target.value as any)}>
              <option value="avalanche">Avalanche (highest APR)</option>
              <option value="snowball">Snowball (lowest balance)</option>
            </select>
            <Button size="sm" onClick={() => setShowAddDebt(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Debt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedDebts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No debts. 🎉</p>
          ) : (
            <div className="space-y-3">
              {sortedDebts.map((debt, idx) => (
                <div key={debt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                    <div>
                      <p className="font-medium">{debt.name}</p>
                      <p className="text-xs text-muted-foreground">
                        APR: {debt.apr}% • Min: {formatCurrency(debt.minPayment || 0)}
                        {debt.dueDate && ` • Due: ${formatDate(debt.dueDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono font-bold text-red-500">{formatCurrency(debt.balance)}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => deleteDebt(debt.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reimbursables Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Reimbursables</CardTitle>
          <Button size="sm" onClick={() => setShowAddReimb(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="outstanding">
            <TabsList>
              <TabsTrigger value="outstanding">Outstanding ({outstanding.length})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="outstanding" className="mt-4">
              {outstanding.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nobody owes you money.</p>
              ) : (
                <div className="space-y-2">
                  {outstanding.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{r.fromPerson}</p>
                        <p className="text-xs text-muted-foreground">{r.description} • {formatDate(r.date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal">{formatCurrency(r.amount)}</span>
                        <Button size="sm" variant="outline" onClick={() => markPaid(r.id)}>
                          <Check className="h-3 w-3 mr-1" /> Paid
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => deleteReimb(r.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="paid" className="mt-4">
              {paid.length === 0 ? (
                <p className="text-sm text-muted-foreground">No paid reimbursables yet.</p>
              ) : (
                <div className="space-y-2">
                  {paid.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                      <div>
                        <p className="font-medium">{r.fromPerson}</p>
                        <p className="text-xs text-muted-foreground">{r.description} • Paid {r.paidDate ? formatDate(r.paidDate) : ''}</p>
                      </div>
                      <span className="font-mono">{formatCurrency(r.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add debt dialog */}
      <Dialog open={showAddDebt} onOpenChange={setShowAddDebt}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Debt</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name (e.g. Credit Card)" value={debtForm.name}
              onChange={e => setDebtForm(p => ({ ...p, name: e.target.value }))} />
            <Input type="number" placeholder="Balance" value={debtForm.balance}
              onChange={e => setDebtForm(p => ({ ...p, balance: e.target.value }))} />
            <Input type="number" placeholder="APR %" value={debtForm.apr}
              onChange={e => setDebtForm(p => ({ ...p, apr: e.target.value }))} />
            <Input type="number" placeholder="Minimum Payment" value={debtForm.minPayment}
              onChange={e => setDebtForm(p => ({ ...p, minPayment: e.target.value }))} />
            <Input type="date" value={debtForm.dueDate}
              onChange={e => setDebtForm(p => ({ ...p, dueDate: e.target.value }))} />
            <Input placeholder="Notes" value={debtForm.notes}
              onChange={e => setDebtForm(p => ({ ...p, notes: e.target.value }))} />
            <Button onClick={saveDebt} className="w-full bg-teal hover:bg-teal-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add reimbursable dialog */}
      <Dialog open={showAddReimb} onOpenChange={setShowAddReimb}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Reimbursable</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Who owes you?" value={reimbForm.fromPerson}
              onChange={e => setReimbForm(p => ({ ...p, fromPerson: e.target.value }))} />
            <Input placeholder="Description" value={reimbForm.description}
              onChange={e => setReimbForm(p => ({ ...p, description: e.target.value }))} />
            <Input type="number" placeholder="Amount" value={reimbForm.amount}
              onChange={e => setReimbForm(p => ({ ...p, amount: e.target.value }))} />
            <Input type="date" value={reimbForm.date}
              onChange={e => setReimbForm(p => ({ ...p, date: e.target.value }))} />
            <Button onClick={saveReimb} className="w-full bg-teal hover:bg-teal-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
