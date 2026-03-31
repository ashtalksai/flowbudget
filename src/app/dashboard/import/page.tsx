"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";

export default function ImportPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  useEffect(() => {
    fetch("/api/import/history").then(r => r.json()).then(d => setHistory(d.imports || []));
    fetch("/api/accounts").then(r => r.json()).then(d => setAccounts(d.accounts || []));
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    if (selectedAccount) formData.append("accountId", selectedAccount);

    try {
      const res = await fetch("/api/import/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setResult(data);
      // Refresh history
      fetch("/api/import/history").then(r => r.json()).then(d => setHistory(d.imports || []));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [selectedAccount]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Import Transactions</h1>

      {/* Account selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Import to account:</label>
        <select
          className="border rounded-lg px-3 py-2 text-sm bg-background"
          value={selectedAccount}
          onChange={e => setSelectedAccount(e.target.value)}
        >
          <option value="">Auto-detect / None</option>
          {accounts.map(a => <option key={a.id} value={a.id}>{a.label} ({a.currency})</option>)}
        </select>
      </div>

      {/* Drop zone */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? 'border-teal bg-teal-50/50' : 'border-muted-foreground/20 hover:border-teal/50'
        }`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <CardContent className="pt-12 pb-12 text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-teal" />
              <p className="text-sm text-muted-foreground">Processing file...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">Drop a CSV file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports Revolut, Wise, and generic CSV formats</p>
            </>
          )}
          <input id="file-input" type="file" accept=".csv,.xlsx" onChange={onFileChange} className="hidden" />
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="border-fresh/50 bg-fresh-50/50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-fresh" />
              <h3 className="font-semibold">Import Complete</h3>
              <Badge>{result.format}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold">{result.rowsTotal}</p>
                <p className="text-xs text-muted-foreground">Total rows</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-fresh">{result.rowsNew}</p>
                <p className="text-xs text-muted-foreground">New transactions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{result.rowsDuplicate}</p>
                <p className="text-xs text-muted-foreground">Duplicates skipped</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal">{result.rowsAutoCategorized}</p>
                <p className="text-xs text-muted-foreground">Auto-categorized</p>
              </div>
            </div>
            {result.rowsPending > 0 && (
              <div className="mt-4">
                <Button onClick={() => window.location.href = '/dashboard/review'} className="bg-teal hover:bg-teal-600">
                  Review {result.rowsPending} Pending →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Import History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No imports yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">File</th>
                    <th className="p-3 text-left">Format</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-right">New</th>
                    <th className="p-3 text-right">Duplicates</th>
                    <th className="p-3 text-right">Auto-cat</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(imp => (
                    <tr key={imp.id} className="border-t">
                      <td className="p-3 whitespace-nowrap">{imp.createdAt ? formatDate(imp.createdAt) : '-'}</td>
                      <td className="p-3 max-w-xs truncate">{imp.filename}</td>
                      <td className="p-3"><Badge variant="outline">{imp.formatDetected}</Badge></td>
                      <td className="p-3 text-right">{imp.rowsTotal}</td>
                      <td className="p-3 text-right text-fresh">{imp.rowsNew}</td>
                      <td className="p-3 text-right text-muted-foreground">{imp.rowsDuplicate}</td>
                      <td className="p-3 text-right text-teal">{imp.rowsAutoCategorized}</td>
                      <td className="p-3"><Badge variant={imp.status === 'completed' ? 'default' : 'secondary'}>{imp.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
