"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowLeftRight, HandCoins, SkipForward, ChevronDown, Search, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: string;
  currency: string;
  amountBase: string | null;
  category: string | null;
  subcategory: string | null;
  status: string;
  accountId: number | null;
  accountLabel: string | null;
  isInternal: boolean;
}

interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  children: { id: number; name: string; slug: string }[];
}

export default function ReviewPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkSubcategory, setBulkSubcategory] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [createRuleFor, setCreateRuleFor] = useState<Record<number, boolean>>({});
  const [reimbursableInput, setReimbursableInput] = useState<Record<number, string>>({});
  const [showReimbursable, setShowReimbursable] = useState<Record<number, boolean>>({});
  const [categorySearch, setCategorySearch] = useState<Record<number, string>>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Record<number, { cat: string; sub: string }>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: "pending", page: page.toString() });
    if (searchFilter) params.set("search", searchFilter);
    if (accountFilter) params.set("account", accountFilter);

    const [txRes, catRes, acctRes] = await Promise.all([
      fetch(`/api/transactions?${params}`).then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/accounts").then(r => r.json()),
    ]);

    setTxns(txRes.transactions || []);
    setTotalPending(txRes.total || 0);
    setTotalAll(txRes.total || 0);
    setCategories(catRes.categories || []);
    setAccounts(acctRes.accounts || []);
    setLoading(false);
  }, [page, searchFilter, accountFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categorize = async (id: number, category: string, subcategory: string) => {
    await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, subcategory, status: "categorized" }),
    });

    // Create rule if checkbox checked
    if (createRuleFor[id]) {
      const txn = txns.find(t => t.id === id);
      if (txn) {
        const pattern = txn.description?.slice(0, 50) || "";
        await fetch("/api/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pattern,
            matchType: "contains",
            category,
            subcategory,
            applyRetroactively: true,
          }),
        });
      }
    }

    setTxns(prev => prev.filter(t => t.id !== id));
    setTotalPending(prev => prev - 1);
  };

  const markInternal = async (id: number) => {
    await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isInternal: true, status: "internal", category: "Transfer", subcategory: "Internal" }),
    });
    setTxns(prev => prev.filter(t => t.id !== id));
    setTotalPending(prev => prev - 1);
  };

  const markReimbursable = async (id: number) => {
    const fromPerson = reimbursableInput[id];
    if (!fromPerson) return;
    const txn = txns.find(t => t.id === id);
    
    await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isReimbursable: true, reimbursableFrom: fromPerson, status: "categorized", category: "Reimbursable" }),
    });

    if (txn) {
      await fetch("/api/reimbursables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPerson,
          description: txn.description,
          amount: Math.abs(parseFloat(txn.amount)).toString(),
          currency: txn.currency,
          date: txn.date,
          transactionId: id,
        }),
      });
    }

    setTxns(prev => prev.filter(t => t.id !== id));
    setTotalPending(prev => prev - 1);
    setShowReimbursable(prev => ({ ...prev, [id]: false }));
  };

  const skip = async (id: number) => {
    setTxns(prev => prev.filter(t => t.id !== id));
  };

  const bulkCategorize = async () => {
    if (!bulkCategory || selectedIds.size === 0) return;
    const items = Array.from(selectedIds).map(id => ({
      id, category: bulkCategory, subcategory: bulkSubcategory, status: "categorized",
    }));
    await fetch("/api/transactions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setTxns(prev => prev.filter(t => !selectedIds.has(t.id)));
    setTotalPending(prev => prev - selectedIds.size);
    setSelectedIds(new Set());
    setBulkCategory("");
    setBulkSubcategory("");
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === txns.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(txns.map(t => t.id)));
    }
  };

  const filteredCategories = (txnId: number) => {
    const search = (categorySearch[txnId] || "").toLowerCase();
    if (!search) return categories;
    return categories.map(cat => ({
      ...cat,
      children: cat.children.filter(c => c.name.toLowerCase().includes(search) || cat.name.toLowerCase().includes(search)),
    })).filter(cat => cat.name.toLowerCase().includes(search) || cat.children.length > 0);
  };

  const _reviewed = totalAll - totalPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Review Queue</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalPending} transactions pending review
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{totalPending} remaining</span>
          </div>
          <Progress value={100 - (totalAll > 0 ? (totalPending / totalAll) * 100 : 0)} className="h-2" />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search descriptions..."
            value={searchFilter}
            onChange={e => { setSearchFilter(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm bg-background"
          value={accountFilter}
          onChange={e => { setAccountFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Accounts</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <Card className="border-teal/50 bg-teal-50/50 dark:bg-teal-950/20">
          <CardContent className="pt-4 pb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={bulkCategory}
              onChange={e => setBulkCategory(e.target.value)}
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children.map(sub => (
                    <option key={sub.id} value={cat.name} data-sub={sub.name}>
                      {cat.name} › {sub.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <Button size="sm" onClick={bulkCategorize} disabled={!bulkCategory}>
              Apply to Selected
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-teal" />
        </div>
      ) : txns.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Check className="h-12 w-12 text-fresh mx-auto mb-4" />
            <h3 className="text-lg font-semibold">All caught up!</h3>
            <p className="text-muted-foreground">No pending transactions to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left w-8">
                    <input type="checkbox" checked={selectedIds.size === txns.length && txns.length > 0}
                      onChange={toggleSelectAll} className="rounded" />
                  </th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Account</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-left min-w-[200px]">Category</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((txn) => (
                  <tr key={txn.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <input type="checkbox" checked={selectedIds.has(txn.id)}
                        onChange={() => toggleSelect(txn.id)} className="rounded" />
                    </td>
                    <td className="p-3 whitespace-nowrap text-muted-foreground">{formatDate(txn.date)}</td>
                    <td className="p-3">
                      {txn.accountLabel && <Badge variant="outline" className="text-xs">{txn.accountLabel}</Badge>}
                    </td>
                    <td className="p-3 max-w-xs truncate" title={txn.description || ''}>
                      {txn.description || <span className="text-muted-foreground italic">No description</span>}
                    </td>
                    <td className={`p-3 text-right font-mono font-medium whitespace-nowrap ${parseFloat(txn.amount) >= 0 ? 'text-fresh' : 'text-red-500'}`}>
                      {formatCurrency(txn.amountBase || txn.amount, 'EUR')}
                      {txn.currency !== 'EUR' && (
                        <Badge variant="secondary" className="ml-1 text-xs">{txn.currency}</Badge>
                      )}
                    </td>
                    <td className="p-3 relative" ref={openDropdown === txn.id ? dropdownRef : null}>
                      <div className="relative">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === txn.id ? null : txn.id)}
                          className="w-full text-left border rounded px-2 py-1.5 text-sm flex items-center justify-between bg-background hover:bg-muted/50"
                        >
                          <span className={selectedCategory[txn.id] ? '' : 'text-muted-foreground'}>
                            {selectedCategory[txn.id]
                              ? `${selectedCategory[txn.id].cat}${selectedCategory[txn.id].sub ? ' › ' + selectedCategory[txn.id].sub : ''}`
                              : 'Select category...'}
                          </span>
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </button>
                        {openDropdown === txn.id && (
                          <div className="absolute z-50 top-full left-0 w-64 mt-1 bg-card border rounded-lg shadow-lg max-h-60 overflow-hidden">
                            <div className="p-2 border-b">
                              <Input
                                placeholder="Search..."
                                value={categorySearch[txn.id] || ''}
                                onChange={e => setCategorySearch(prev => ({ ...prev, [txn.id]: e.target.value }))}
                                className="h-8 text-sm"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-y-auto max-h-48">
                              {filteredCategories(txn.id).map(cat => (
                                <div key={cat.id}>
                                  <button
                                    onClick={() => {
                                      setSelectedCategory(prev => ({ ...prev, [txn.id]: { cat: cat.name, sub: '' } }));
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-sm font-semibold hover:bg-muted"
                                  >
                                    {cat.name}
                                  </button>
                                  {cat.children.map(sub => (
                                    <button
                                      key={sub.id}
                                      onClick={() => {
                                        setSelectedCategory(prev => ({ ...prev, [txn.id]: { cat: cat.name, sub: sub.name } }));
                                        setOpenDropdown(null);
                                      }}
                                      className="w-full text-left pl-6 pr-3 py-1.5 text-sm hover:bg-muted text-muted-foreground"
                                    >
                                      {sub.name}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <label className="flex items-center gap-1.5 mt-1">
                        <input
                          type="checkbox"
                          checked={createRuleFor[txn.id] || false}
                          onChange={e => setCreateRuleFor(prev => ({ ...prev, [txn.id]: e.target.checked }))}
                          className="rounded h-3 w-3"
                        />
                        <span className="text-xs text-muted-foreground">Create rule</span>
                      </label>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-fresh hover:text-fresh hover:bg-fresh/10"
                          title="Confirm"
                          disabled={!selectedCategory[txn.id]}
                          onClick={() => {
                            const sel = selectedCategory[txn.id];
                            if (sel) categorize(txn.id, sel.cat, sel.sub);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-blue-500 hover:text-blue-500 hover:bg-blue-50"
                          title="Mark Internal"
                          onClick={() => markInternal(txn.id)}
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-teal hover:text-teal hover:bg-teal-50"
                            title="Mark Reimbursable"
                            onClick={() => setShowReimbursable(prev => ({ ...prev, [txn.id]: !prev[txn.id] }))}
                          >
                            <HandCoins className="h-4 w-4" />
                          </Button>
                          {showReimbursable[txn.id] && (
                            <div className="absolute z-50 right-0 top-full mt-1 bg-card border rounded-lg shadow-lg p-3 w-48">
                              <Input
                                placeholder="Who owes you?"
                                value={reimbursableInput[txn.id] || ''}
                                onChange={e => setReimbursableInput(prev => ({ ...prev, [txn.id]: e.target.value }))}
                                className="h-8 text-sm mb-2"
                                autoFocus
                              />
                              <Button size="sm" className="w-full" onClick={() => markReimbursable(txn.id)}
                                disabled={!reimbursableInput[txn.id]}>
                                Confirm
                              </Button>
                            </div>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground"
                          title="Skip"
                          onClick={() => skip(txn.id)}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPending > 50 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(totalPending / 50)}
          </span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(totalPending / 50)} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
