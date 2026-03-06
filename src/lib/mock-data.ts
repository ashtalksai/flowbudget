export interface MockIncome {
  id: number;
  amount: number;
  source: string;
  date: string;
  isRecurring: boolean;
  frequency?: string;
}

export interface MockDebt {
  id: number;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

export interface MockCategory {
  id: number;
  name: string;
  monthlyLimit: number;
  color: string;
  spent: number;
}

export interface MockTransaction {
  id: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  description: string;
  date: string;
}

function generateMonthlyIncome(): MockIncome[] {
  const entries: MockIncome[] = [];
  const sources = [
    "Web Dev Project",
    "UI/UX Contract",
    "Consulting",
    "Maintenance Retainer",
    "Workshop",
    "Logo Design",
    "App Development",
    "SEO Audit",
    "Copywriting",
    "Tech Support",
  ];
  const amounts = [2200, 3500, 5100, 2800, 7200, 4300, 6100, 3200, 4800, 5500, 2500, 3900];
  let id = 1;

  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const baseAmount = amounts[11 - i];
    entries.push({
      id: id++,
      amount: baseAmount,
      source: sources[Math.floor(Math.random() * sources.length)],
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 25) + 1).padStart(2, "0")}`,
      isRecurring: false,
    });
    // Some months have a second payment
    if (baseAmount < 4000) {
      entries.push({
        id: id++,
        amount: Math.floor(Math.random() * 2000) + 1000,
        source: sources[Math.floor(Math.random() * sources.length)],
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 10) + 15).padStart(2, "0")}`,
        isRecurring: false,
      });
    }
  }

  // Add a recurring retainer
  entries.push({
    id: id++,
    amount: 1500,
    source: "Monthly Retainer - Acme Corp",
    date: new Date().toISOString().split("T")[0],
    isRecurring: true,
    frequency: "monthly",
  });

  return entries;
}

export const mockIncome: MockIncome[] = generateMonthlyIncome();

export const mockDebts: MockDebt[] = [
  { id: 1, name: "Student Loan", balance: 12500, apr: 4.5, minPayment: 250 },
  { id: 2, name: "Credit Card", balance: 3200, apr: 19.9, minPayment: 95 },
  { id: 3, name: "Equipment Loan", balance: 5800, apr: 7.2, minPayment: 180 },
];

export const mockCategories: MockCategory[] = [
  { id: 1, name: "Housing", monthlyLimit: 1200, color: "#0D9488", spent: 1200 },
  { id: 2, name: "Food & Dining", monthlyLimit: 450, color: "#F97316", spent: 312 },
  { id: 3, name: "Transport", monthlyLimit: 200, color: "#22C55E", spent: 145 },
  { id: 4, name: "Software & Tools", monthlyLimit: 150, color: "#8B5CF6", spent: 89 },
  { id: 5, name: "Health & Fitness", monthlyLimit: 100, color: "#EC4899", spent: 65 },
];

export const mockTransactions: MockTransaction[] = [
  { id: 1, categoryId: 1, categoryName: "Housing", amount: 1200, description: "Rent - March", date: "2026-03-01" },
  { id: 2, categoryId: 2, categoryName: "Food & Dining", amount: 42.5, description: "Grocery Store", date: "2026-03-05" },
  { id: 3, categoryId: 4, categoryName: "Software & Tools", amount: 29, description: "Figma Pro", date: "2026-03-04" },
  { id: 4, categoryId: 3, categoryName: "Transport", amount: 45, description: "Monthly Transit Pass", date: "2026-03-01" },
  { id: 5, categoryId: 2, categoryName: "Food & Dining", amount: 18.9, description: "Lunch - Cafe", date: "2026-03-03" },
  { id: 6, categoryId: 5, categoryName: "Health & Fitness", amount: 35, description: "Gym Membership", date: "2026-03-01" },
  { id: 7, categoryId: 2, categoryName: "Food & Dining", amount: 67.3, description: "Weekly groceries", date: "2026-03-02" },
  { id: 8, categoryId: 4, categoryName: "Software & Tools", amount: 12, description: "GitHub Copilot", date: "2026-03-01" },
  { id: 9, categoryId: 3, categoryName: "Transport", amount: 22.5, description: "Uber to client", date: "2026-03-04" },
  { id: 10, categoryId: 2, categoryName: "Food & Dining", amount: 35.2, description: "Dinner out", date: "2026-03-05" },
  { id: 11, categoryId: 5, categoryName: "Health & Fitness", amount: 30, description: "Pharmacy", date: "2026-03-03" },
  { id: 12, categoryId: 4, categoryName: "Software & Tools", amount: 48, description: "Notion + Linear", date: "2026-03-01" },
  { id: 13, categoryId: 2, categoryName: "Food & Dining", amount: 52.8, description: "Restaurant - Client lunch", date: "2026-03-06" },
  { id: 14, categoryId: 3, categoryName: "Transport", amount: 35, description: "Train to Berlin", date: "2026-03-05" },
  { id: 15, categoryId: 2, categoryName: "Food & Dining", amount: 96.1, description: "Costco run", date: "2026-03-01" },
  { id: 16, categoryId: 1, categoryName: "Housing", amount: 45, description: "Electricity bill", date: "2026-03-03" },
  { id: 17, categoryId: 3, categoryName: "Transport", amount: 42.5, description: "Car sharing - weekend", date: "2026-03-02" },
  { id: 18, categoryId: 4, categoryName: "Software & Tools", amount: 0, description: "VS Code (free)", date: "2026-03-01" },
  { id: 19, categoryId: 2, categoryName: "Food & Dining", amount: 28.4, description: "Coffee supplies", date: "2026-03-04" },
  { id: 20, categoryId: 5, categoryName: "Health & Fitness", amount: 0, description: "Morning jog (free)", date: "2026-03-06" },
];

// Helper: get monthly totals for last 12 months
export function getMonthlyIncomeTotals() {
  const totals: { month: string; total: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthTotal = mockIncome
      .filter((inc) => inc.date.startsWith(key))
      .reduce((sum, inc) => sum + inc.amount, 0);
    totals.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      total: monthTotal,
    });
  }
  return totals;
}

// 6-month rolling average
export function getSmoothedAverage() {
  const totals = getMonthlyIncomeTotals();
  const last6 = totals.slice(-6);
  return Math.round(last6.reduce((s, m) => s + m.total, 0) / last6.length);
}

export function getTotalDebt() {
  return mockDebts.reduce((s, d) => s + d.balance, 0);
}

export function getMonthlyBudgetRemaining() {
  const totalLimit = mockCategories.reduce((s, c) => s + c.monthlyLimit, 0);
  const totalSpent = mockCategories.reduce((s, c) => s + c.spent, 0);
  return totalLimit - totalSpent;
}
