"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [saving, setSaving] = useState(false);

  // Account form
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [acctForm, setAcctForm] = useState({ label: '', iban: '', currency: 'EUR' });

  // Rule form
  const [showAddRule, setShowAddRule] = useState(false);
  const [ruleForm, setRuleForm] = useState({ pattern: '', matchType: 'contains', category: '', subcategory: '' });

  // Test rule
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const [uRes, aRes, rRes, cRes] = await Promise.all([
        fetch("/api/auth/me").then(r => r.json()),
        fetch("/api/accounts").then(r => r.json()),
        fetch("/api/rules").then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
      ]);
      setUser(uRes.user);
      setName(uRes.user?.name || '');
      setCurrency(uRes.user?.currency || 'EUR');
      setAccounts(aRes.accounts || []);
      setRules(rRes.rules || []);
      setCategories(cRes.categories || []);
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, currency }),
    });
    setSaving(false);
  };

  const addAccount = async () => {
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acctForm),
    });
    setShowAddAccount(false);
    setAcctForm({ label: '', iban: '', currency: 'EUR' });
    const aRes = await fetch("/api/accounts").then(r => r.json());
    setAccounts(aRes.accounts || []);
  };

  const deleteAccount = async (id: number) => {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addRule = async () => {
    await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ruleForm, applyRetroactively: true }),
    });
    setShowAddRule(false);
    setRuleForm({ pattern: '', matchType: 'contains', category: '', subcategory: '' });
    const rRes = await fetch("/api/rules").then(r => r.json());
    setRules(rRes.rules || []);
  };

  const deleteRule = async (id: number) => {
    await fetch(`/api/rules/${id}`, { method: "DELETE" });
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const testRule = async () => {
    const res = await fetch("/api/rules/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: testInput }),
    });
    const data = await res.json();
    setTestResult(data.match);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={user?.email || ''} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Base Currency</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background mt-1"
                  value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="TRY">TRY</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <Button onClick={saveProfile} disabled={saving} className="bg-teal hover:bg-teal-600">
                <Save className="h-4 w-4 mr-1" /> {saving ? 'Saving...' : 'Save'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts */}
        <TabsContent value="accounts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Bank Accounts</CardTitle>
              <Button size="sm" onClick={() => setShowAddAccount(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Account
              </Button>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts yet.</p>
              ) : (
                <div className="space-y-2">
                  {accounts.map(acct => (
                    <div key={acct.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{acct.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {acct.currency}{acct.iban ? ` • ${acct.iban}` : ''}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => deleteAccount(acct.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules */}
        <TabsContent value="rules" className="mt-6 space-y-4">
          {/* Test rule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Enter a transaction description..." value={testInput}
                  onChange={e => setTestInput(e.target.value)} className="flex-1" />
                <Button onClick={testRule} variant="outline">Test</Button>
              </div>
              {testResult !== null && (
                <div className="mt-3 p-3 rounded-lg bg-muted">
                  {testResult ? (
                    <p className="text-sm">
                      <span className="font-medium text-fresh">Match:</span>{' '}
                      {testResult.pattern} → {testResult.category}
                      {testResult.subcategory ? ` › ${testResult.subcategory}` : ''}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No matching rule found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Rules ({rules.length})</CardTitle>
              <Button size="sm" onClick={() => setShowAddRule(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              {rules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rules yet. Rules auto-categorize imported transactions.</p>
              ) : (
                <div className="space-y-2">
                  {rules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-0.5 rounded">{rule.pattern}</code>
                          <Badge variant="outline" className="text-xs">{rule.matchType}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          → {rule.category}{rule.subcategory ? ` › ${rule.subcategory}` : ''}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add account dialog */}
      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Account</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Label (e.g. Revolut)" value={acctForm.label}
              onChange={e => setAcctForm(p => ({ ...p, label: e.target.value }))} />
            <Input placeholder="IBAN (optional)" value={acctForm.iban}
              onChange={e => setAcctForm(p => ({ ...p, iban: e.target.value }))} />
            <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              value={acctForm.currency} onChange={e => setAcctForm(p => ({ ...p, currency: e.target.value }))}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="TRY">TRY</option>
              <option value="CAD">CAD</option>
            </select>
            <Button onClick={addAccount} className="w-full bg-teal hover:bg-teal-600">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add rule dialog */}
      <Dialog open={showAddRule} onOpenChange={setShowAddRule}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Rule</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Pattern (e.g. Albert Heijn)" value={ruleForm.pattern}
              onChange={e => setRuleForm(p => ({ ...p, pattern: e.target.value }))} />
            <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              value={ruleForm.matchType} onChange={e => setRuleForm(p => ({ ...p, matchType: e.target.value }))}>
              <option value="contains">Contains</option>
              <option value="exact">Exact match</option>
              <option value="starts_with">Starts with</option>
              <option value="regex">Regex</option>
            </select>
            <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              value={ruleForm.category} onChange={e => setRuleForm(p => ({ ...p, category: e.target.value }))}>
              <option value="">Select category...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              value={ruleForm.subcategory} onChange={e => setRuleForm(p => ({ ...p, subcategory: e.target.value }))}>
              <option value="">Select subcategory (optional)...</option>
              {categories
                .find((c: any) => c.name === ruleForm.category)
                ?.children?.map((sub: any) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
            </select>
            <Button onClick={addRule} className="w-full bg-teal hover:bg-teal-600">Save Rule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
