"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  PieChart,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/income", label: "Income", icon: Wallet },
  { href: "/dashboard/debts", label: "Debts", icon: CreditCard },
  { href: "/dashboard/budget", label: "Budget", icon: PieChart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-teal-500/10 text-teal-600"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-snow">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white font-bold text-sm">
                FB
              </div>
              <span className="text-lg font-bold text-charcoal">
                FlowBudget
              </span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={isActive(item.href)}
              />
            ))}
          </nav>
          <div className="border-t p-4">
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white font-bold text-sm">
              FB
            </div>
            <span className="text-lg font-bold text-charcoal">FlowBudget</span>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <span className="text-lg font-bold text-charcoal">
                  FlowBudget
                </span>
              </div>
              <nav className="space-y-1 p-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    active={isActive(item.href)}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
