"use client";

import { useEffect, useState, useCallback } from "react";
// Card components available if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

export default function TransactionsPage() {
  const [txns, setTxns] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [hideInternal, setHideInternal] = useState(true);

  useEffect(() => {
    fetch("/api/accounts").then(r => r.json()).then(d => setAccounts(d.accounts || []));
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  const loadTxns = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.set("search", search);
    if (accountFilter) params.set("account", accountFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (currencyFilter) params.set("currency", currencyFilter);
    if (directionFilter) params.set("direction", directionFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (hideInternal) params.set("hideInternal", "true");

    const res = await fetch(`/api/transactions?${params}`).then(r => r.json());
    setTxns(res.transactions || []);
    setTotal(res.total || 0);
    setTotalPages(res.totalPages || 1);
    setLoading(false);
  }, [page, search, accountFilter, categoryFilter, currencyFilter, directionFilter, statusFilter, dateFrom, dateTo, hideInternal]);

  useEffect(() => { loadTxns(); }, [loadTxns]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <p className="text-muted-foreground text-sm">{total} transactions total</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <select className="border rounded-lg px-3 py-2 text-sm bg-background" value={accountFilter}
          onChange={e => { setAccountFilter(e.target.value); setPage(1); }}>
          <option value="">All Accounts</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-background" value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-background" value={directionFilter}
          onChange={e => { setDirectionFilter(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-background" value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="categorized">Categorized</option>
          <option value="internal">Internal</option>
        </select>
        <Input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
          className="w-36" placeholder="From" />
        <Input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
          className="w-36" placeholder="To" />
        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
          <input type="checkbox" checked={hideInternal} onChange={e => setHideInternal(e.target.checked)} className="rounded" />
          Hide internal
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-teal" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Account</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {txns.map(txn => (
                  <tr key={txn.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">{formatDate(txn.date)}</td>
                    <td className="p-3">{txn.accountLabel && <Badge variant="outline" className="text-xs">{txn.accountLabel}</Badge>}</td>
                    <td className="p-3 max-w-xs truncate">{txn.description || '-'}</td>
                    <td className="p-3">
                      {txn.category ? (
                        <span className="text-xs">
                          {txn.category}{txn.subcategory ? ` › ${txn.subcategory}` : ''}
                        </span>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className={`p-3 text-right font-mono font-medium whitespace-nowrap ${parseFloat(txn.amount) >= 0 ? 'text-fresh' : 'text-red-500'}`}>
                      {formatCurrency(txn.amountBase || txn.amount, 'EUR')}
                      {txn.currency !== 'EUR' && (
                        <Badge variant="secondary" className="ml-1 text-xs font-normal">{txn.currency} {formatCurrency(txn.amount, txn.currency)}</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant={txn.status === 'categorized' ? 'default' : txn.status === 'internal' ? 'secondary' : 'outline'}
                        className="text-xs">
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
