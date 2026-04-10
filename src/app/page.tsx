"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  PieChart,
  Globe,
  Upload,
  Tag,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Check,
  AlertCircle,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-charcoal tracking-tight">
            Flow<span className="text-teal-500">Budget</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-600 hover:text-teal-500 transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-teal-500 transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-slate-600 hover:text-teal-500 transition-colors">FAQ</a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-600">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-slate-600 hover:text-teal-500"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-slate-600" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing" className="text-sm text-slate-600" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#faq" className="text-sm text-slate-600" onClick={() => setOpen(false)}>FAQ</a>
          <hr className="border-slate-100" />
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600">Login</Button>
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Get Started Free
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────
// Hero — Dashboard mockup SVG
// ─────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow */}
      <div className="absolute -inset-4 bg-teal-500/10 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="flex-1 mx-3 bg-slate-200 rounded-full h-4 max-w-[140px]" />
        </div>

        {/* Dashboard content */}
        <div className="p-5 bg-snow">
          {/* Top stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Monthly Income", value: "€4,200", color: "text-teal-500" },
              { label: "Total Spent", value: "€2,847", color: "text-coral-500" },
              { label: "Saved", value: "€1,353", color: "text-fresh-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-lg p-3 border border-slate-100">
                <p className="text-[9px] text-slate-400 mb-1">{s.label}</p>
                <p className={`font-mono font-bold text-sm ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-lg p-4 border border-slate-100 mb-3">
            <p className="text-[10px] font-medium text-slate-500 mb-3">Spending — Last 6 months</p>
            <div className="flex items-end gap-2 h-20">
              {[55, 72, 48, 88, 63, 79].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 5 ? "#0D9488" : "#CCFBF1",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m) => (
                <span key={m} className="text-[8px] text-slate-400 flex-1 text-center">{m}</span>
              ))}
            </div>
          </div>

          {/* Debt progress bar */}
          <div className="bg-white rounded-lg p-3 border border-slate-100">
            <div className="flex justify-between mb-2">
              <p className="text-[9px] font-medium text-slate-600">Debt Payoff — Student Loan</p>
              <p className="text-[9px] font-mono text-teal-500">67%</p>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: "67%" }} />
            </div>
            <p className="text-[8px] text-slate-400 mt-1.5">€4,200 remaining — on track to finish Oct 2026</p>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-3 -right-3 bg-teal-500 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-lg">
        PDF imported automatically
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ accordion item
// ─────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-charcoal text-sm">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 bg-white leading-relaxed border-t border-slate-100">
          {a}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Pricing toggle + cards
// ─────────────────────────────────────────────
function PricingSection() {
  const [yearly, setYearly] = useState(false);

  type Plan = {
    name: string;
    price: string;
    period: string;
    saving?: string | null;
    highlight: boolean;
    features: string[];
    cta: string;
    href: string;
  };

  const freePlan: Plan = {
    name: "Free",
    price: "€0",
    period: "forever",
    highlight: false,
    features: [
      "Basic income & expense tracking",
      "1 connected account",
      "Manual transaction entry",
      "3 budget categories",
      "Monthly summary report",
    ],
    cta: "Start For Free",
    href: "/signup",
  };

  const proPlan: Plan = {
    name: "Pro",
    price: yearly ? "€59.99" : "€6.99",
    period: yearly ? "/year" : "/month",
    saving: yearly ? "Save €24/yr" : null,
    highlight: true,
    features: [
      "Everything in Free",
      "Unlimited accounts",
      "PDF bank statement import",
      "Auto-categorization (AI)",
      "Income smoothing calculator",
      "Debt payoff planner & timeline",
      "Multi-currency support",
      "Priority email support",
    ],
    cta: "Start Pro Free — 14 days",
    href: "/signup?plan=pro",
  };

  return (
    <section id="pricing" className="py-24 bg-snow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">Pricing</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-charcoal">Simple, honest pricing</h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            No hidden fees. No dark patterns. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!yearly ? "bg-teal-500 text-white" : "text-slate-500"}`}
              onClick={() => setYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${yearly ? "bg-teal-500 text-white" : "text-slate-500"}`}
              onClick={() => setYearly(true)}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[freePlan, proPlan].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlight
                  ? "bg-teal-500 border-teal-500 text-white shadow-xl shadow-teal-500/20"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`text-sm font-semibold ${plan.highlight ? "text-teal-100" : "text-slate-500"}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mt-1">
                    <span className={`text-4xl font-bold font-mono ${plan.highlight ? "text-white" : "text-charcoal"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm mb-1 ${plan.highlight ? "text-teal-100" : "text-slate-400"}`}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.saving && (
                    <span className="inline-block mt-1 text-xs font-semibold bg-coral text-white px-2 py-0.5 rounded-full">
                      {plan.saving}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-teal-200" : "text-teal-500"}`} />
                    <span className={plan.highlight ? "text-teal-50" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <button
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-teal-600 hover:bg-teal-50"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-snow font-sans text-charcoal">
      <Navbar />

      {/* ── 1. HERO ───────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-50 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coral-50 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl opacity-40" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <span className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-100 mb-6">
                <Zap className="w-3 h-3" />
                Built for EU freelancers
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-charcoal">
                Take Control of<br />
                <span className="text-teal-500">Your Finances</span>
              </h1>
              <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg">
                Track every euro, tame irregular income, and visualise your debt payoff timeline — all in one place. No bank connection required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <button className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-500/25">
                    Start For Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <a href="#how-it-works">
                  <button className="flex items-center justify-center gap-2 border border-slate-300 text-charcoal font-semibold px-7 py-3.5 rounded-xl hover:border-teal-500 hover:text-teal-500 transition-colors">
                    See How It Works
                  </button>
                </a>
              </div>
              <p className="mt-4 text-xs text-slate-400">No credit card required &middot; Free plan available forever</p>
            </div>

            {/* Right: mockup */}
            <div className="lg:justify-self-end w-full">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF STRIP ─────────────────── */}
      <div className="border-y border-slate-100 bg-white py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {["ING Direct", "N26", "Revolut", "Wise", "Bunq"].map((b) => (
            <span key={b} className="text-sm font-semibold text-slate-300 tracking-wide uppercase">{b}</span>
          ))}
          <span className="text-xs text-slate-300 self-center">+ more PDF formats supported</span>
        </div>
      </div>

      {/* ── 3. PROBLEM ────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-coral uppercase tracking-widest">The Problem</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-charcoal">
              Why most finance apps fail freelancers
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Traditional budgeting tools are designed for salaried employees, not for people with irregular income and EU bank accounts.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <AlertCircle className="w-6 h-6 text-coral" />,
                title: "Overpriced Apps",
                body: "YNAB charges €110/yr. Mint is US-only. Most EU-friendly options cost €99–150/yr for features you barely use — and still lack PDF import.",
              },
              {
                icon: <FileText className="w-6 h-6 text-coral" />,
                title: "Missing Features",
                body: "EU banks don't do open banking the same way. No PDF bank statement import means hours of manual entry every month. Unacceptable in 2026.",
              },
              {
                icon: <PieChart className="w-6 h-6 text-coral" />,
                title: "Wrong Focus",
                body: "Pie charts show where you overspent — they don't help you fix it. You need a timeline-based debt payoff visualiser, not another donut chart.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="w-10 h-10 bg-coral-50 rounded-xl flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SOLUTION ───────────────────────────── */}
      <section className="py-20 bg-teal-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-semibold text-teal-200 uppercase tracking-widest">The Solution</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white leading-tight">
            FlowBudget is the finance tool<br className="hidden sm:block" /> EU freelancers actually need
          </h2>
          <p className="mt-5 text-teal-100 text-lg leading-relaxed max-w-2xl mx-auto">
            We built FlowBudget to handle every problem above. Upload your PDF bank statement in seconds, let our smart categorizer sort your transactions, then plan your debt payoff on a real timeline — all for a fraction of the cost of the alternatives.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
              PDF Import from any EU bank
            </div>
            <div className="bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
              Income smoothing for freelancers
            </div>
            <div className="bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
              Timeline-based debt payoff
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURES ───────────────────────────── */}
      <section id="features" className="py-24 bg-snow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">Features</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-charcoal">Everything you need, nothing you don&apos;t</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-5 h-5 text-teal-500" />,
                title: "PDF Bank Statement Import",
                body: "Upload PDFs from ING, N26, Revolut, Wise, Bunq and more. We parse them automatically — no manual entry, no CSV wrestling.",
              },
              {
                icon: <Sparkles className="w-5 h-5 text-teal-500" />,
                title: "Smart Categorization",
                body: "Transactions are auto-labelled using AI pattern matching. Grocery, SaaS subscription, client invoice — recognised instantly and trainable.",
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-teal-500" />,
                title: "Income Smoothing",
                body: "Variable monthly income? FlowBudget calculates a stable monthly \"salary\" from your freelance earnings so you can budget predictably.",
              },
              {
                icon: <Target className="w-5 h-5 text-teal-500" />,
                title: "Debt Payoff Planner",
                body: "Set your debt targets and see an interactive timeline showing exactly when you&apos;ll be debt-free, plus what happens if you pay more each month.",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-teal-500" />,
                title: "Budget Tracking",
                body: "Set monthly budgets by category. Get alerts before you overspend — not after. Track actuals vs. budget with a clean, uncluttered view.",
              },
              {
                icon: <Globe className="w-5 h-5 text-teal-500" />,
                title: "Multi-Currency Support",
                body: "Work with clients across the EU and beyond? Log income and expenses in any currency. FlowBudget converts everything to your base currency automatically.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ───────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">How It Works</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-charcoal">Up and running in minutes</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-slate-200" />

            {[
              {
                step: "01",
                icon: <Upload className="w-5 h-5 text-white" />,
                title: "Upload Your Statements",
                body: "Download your PDF bank statement from your EU bank and upload it directly. No bank login credentials needed — ever.",
              },
              {
                step: "02",
                icon: <Tag className="w-5 h-5 text-white" />,
                title: "Auto-Categorize",
                body: "Our engine reads every transaction and assigns it a category. Review suggestions and correct anything in one click. Done in under 2 minutes.",
              },
              {
                step: "03",
                icon: <Target className="w-5 h-5 text-white" />,
                title: "Track & Plan",
                body: "See your spending trends, set debt targets, calculate your smoothed income, and build a budget that actually matches freelance reality.",
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-charcoal rounded-full flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">{s.step}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PRICING ────────────────────────────── */}
      <PricingSection />

      {/* ── 8. FAQ ────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-teal-500 uppercase tracking-widest">FAQ</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-charcoal">Common questions</h2>
          </div>

          <div className="flex flex-col gap-3">
            <FAQItem
              q="How is FlowBudget different from YNAB or Mint?"
              a="YNAB is US-centric, costs over €100/year, and requires a live bank connection. Mint shut down. FlowBudget works with EU banks through PDF imports, costs up to 10x less, and focuses on features freelancers actually need — income smoothing and debt payoff timelines — not just budget envelopes."
            />
            <FAQItem
              q="Do you connect directly to my bank account?"
              a="No — and that's intentional. We never ask for your bank credentials. You simply download your monthly PDF statement from your bank's website and upload it to FlowBudget. Your banking credentials stay between you and your bank."
            />
            <FAQItem
              q="Which banks' PDF statements can I import?"
              a="We currently support PDFs from ING, N26, Revolut, Wise, Bunq, ABN AMRO, Rabobank, and most other major EU retail banks. If your bank isn't listed, contact us — we add new parsers weekly."
            />
            <FAQItem
              q="Is there a free tier? What are the limits?"
              a="Yes. The free plan lets you track income and expenses across one account with manual entry and 3 budget categories. It's genuinely useful for simple tracking. The Pro plan adds PDF import, unlimited accounts, AI categorization, debt planner, and income smoothing."
            />
            <FAQItem
              q="How do you keep my financial data secure?"
              a="All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Uploaded PDFs are processed and then deleted — we only store the extracted transaction data. We never sell your data. EU GDPR compliant."
            />
            <FAQItem
              q="What happens after I've paid off all my debt?"
              a="Great problem to have! FlowBudget doesn't disappear — your debt payoff planner converts into a savings goal tracker. Set a target (emergency fund, sabbatical, equipment), and we'll show you a timeline to reach it using the same payment habits."
            />
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ──────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-teal-500 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            Ready to finally understand your money?
          </h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Join hundreds of EU freelancers tracking their income, managing debt, and building financial clarity with FlowBudget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <button className="flex items-center justify-center gap-2 bg-white text-teal-600 font-semibold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg">
                Start For Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/signup?plan=pro">
              <button className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Try Pro — 14 days free
              </button>
            </Link>
          </div>
          <p className="mt-5 text-teal-200 text-sm">No credit card required for the free plan</p>
        </div>
      </section>

      {/* ── 10. FOOTER ────────────────────────────── */}
      <footer className="bg-charcoal text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">
                  Flow<span className="text-teal-400">Budget</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                Personal finance for EU freelancers. Track, categorize, and plan your way to financial freedom.
              </p>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
              <Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 text-xs text-slate-600">
            &copy; 2026 FlowBudget. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
