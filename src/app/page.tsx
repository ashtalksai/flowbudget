import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LayoutGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const features = [
  {
    icon: TrendingUpIcon,
    title: "Income Smoothing Engine",
    description:
      "Turn irregular freelance payments into a predictable monthly budget. Our algorithm analyzes your income patterns and creates a stable baseline.",
  },
  {
    icon: ShieldIcon,
    title: "Debt Payoff Planner",
    description:
      "Avalanche or snowball — pick your strategy. We calculate the optimal payoff plan and show you exactly when you'll be debt-free.",
  },
  {
    icon: LayoutGridIcon,
    title: "Smart Budget Categories",
    description:
      "Customizable spending categories with smart limits that adjust based on your smoothed income. No more guessing what you can afford.",
  },
  {
    icon: GlobeIcon,
    title: "Multi-Currency Support",
    description:
      "Work with clients across the EU? Track income in multiple currencies with automatic conversion to your base currency.",
  },
];

const testimonials = [
  {
    name: "Marta K.",
    location: "Berlin, DE",
    text: "FlowBudget finally made my freelance income feel predictable. I used to stress every month about whether I could cover rent — now I have a clear plan.",
  },
  {
    name: "Joao S.",
    location: "Lisbon, PT",
    text: "The income smoothing is brilliant. I get paid in chunks from different clients, but FlowBudget turns it all into a steady monthly number I can budget around.",
  },
  {
    name: "Elise D.",
    location: "Amsterdam, NL",
    text: "I paid off my credit card debt 4 months faster than expected thanks to the debt planner. The avalanche method visualization kept me motivated.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-snow">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-teal">
            <span className="font-mono">Flow</span>Budget
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-charcoal">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-coral hover:bg-coral-600 text-white">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-teal-50 text-teal border-teal-200 hover:bg-teal-50">
            Built for EU freelancers
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight tracking-tight">
            Stop guessing.
            <br />
            <span className="text-teal">Start budgeting.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            FlowBudget turns your irregular freelance income into a predictable
            monthly budget. Know exactly what you can spend, save, and invest —
            every single month.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-coral hover:bg-coral-600 text-white text-lg px-8 py-6 shadow-lg shadow-coral/25"
              >
                Start Free
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-gray-300"
              >
                See how it works
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free forever for basic tracking. No credit card required.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              Everything you need to manage freelance finances
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built tools for the unique challenges of irregular income.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-teal" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free. Upgrade when you need more power.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Free tier */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-charcoal">Free</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono text-charcoal">
                    $0
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-gray-600">
                  Perfect for getting started with budgeting.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Basic income & expense tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>1 debt
                    account
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>3
                    budget categories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Monthly summary
                  </li>
                </ul>
                <Link href="/signup" className="block mt-8">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro tier */}
            <Card className="border-teal shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-teal text-white hover:bg-teal-600">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-charcoal">Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono text-charcoal">
                    $9
                  </span>
                  <span className="text-gray-500">.99/month</span>
                </div>
                <p className="mt-1 text-sm text-teal font-medium">
                  or $89.99/year (save 25%)
                </p>
                <p className="mt-2 text-gray-600">
                  Full power for serious freelancers.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Income Smoothing Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Unlimited debt accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Unlimited categories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    CSV/PDF export
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Multi-currency support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-fresh font-bold">&#10003;</span>
                    Priority support
                  </li>
                </ul>
                <Link href="/signup" className="block mt-8">
                  <Button className="w-full bg-coral hover:bg-coral-600 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              Trusted by freelancers across Europe
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-gray-100">
                <CardContent className="p-6">
                  <p className="text-gray-600 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-semibold text-charcoal">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FlowBudget. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-charcoal transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-charcoal transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-charcoal transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
