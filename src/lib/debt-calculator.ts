export interface Debt {
  id: number;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

export interface PayoffScheduleMonth {
  month: number;
  payments: { debtId: number; name: string; payment: number; remainingBalance: number }[];
}

export interface PayoffResult {
  schedule: PayoffScheduleMonth[];
  totalMonths: number;
  totalInterest: number;
  debtFreeDate: Date;
}

function calculatePayoff(debts: Debt[], strategy: "snowball" | "avalanche"): PayoffResult {
  const remaining = debts.map((d) => ({
    ...d,
    balance: d.balance,
  }));

  const schedule: PayoffScheduleMonth[] = [];
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 360; // safety cap

  while (remaining.some((d) => d.balance > 0) && month < maxMonths) {
    month++;

    // Sort based on strategy
    const sorted = [...remaining].filter((d) => d.balance > 0);
    if (strategy === "snowball") {
      sorted.sort((a, b) => a.balance - b.balance);
    } else {
      sorted.sort((a, b) => b.apr - a.apr);
    }

    // Apply interest
    for (const debt of remaining) {
      if (debt.balance <= 0) continue;
      const monthlyRate = debt.apr / 100 / 12;
      const interest = debt.balance * monthlyRate;
      debt.balance += interest;
      totalInterest += interest;
    }

    // Pay minimums first
    let extraBudget = 0;
    const monthPayments: PayoffScheduleMonth["payments"] = [];

    for (const debt of remaining) {
      if (debt.balance <= 0) {
        extraBudget += debt.minPayment;
        continue;
      }
      const payment = Math.min(debt.minPayment, debt.balance);
      debt.balance -= payment;
      monthPayments.push({
        debtId: debt.id,
        name: debt.name,
        payment,
        remainingBalance: Math.max(0, debt.balance),
      });
      if (debt.balance <= 0) {
        extraBudget += debt.minPayment - payment;
      }
    }

    // Apply extra to priority debt
    for (const priorityDebt of sorted) {
      if (extraBudget <= 0) break;
      const rd = remaining.find((d) => d.id === priorityDebt.id)!;
      if (rd.balance <= 0) continue;
      const extraPayment = Math.min(extraBudget, rd.balance);
      rd.balance -= extraPayment;
      extraBudget -= extraPayment;
      const existing = monthPayments.find((p) => p.debtId === rd.id);
      if (existing) {
        existing.payment += extraPayment;
        existing.remainingBalance = Math.max(0, rd.balance);
      }
    }

    schedule.push({ month, payments: monthPayments });
  }

  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + month);

  return {
    schedule,
    totalMonths: month,
    totalInterest: Math.round(totalInterest * 100) / 100,
    debtFreeDate,
  };
}

export function calculateSnowball(debts: Debt[]): PayoffResult {
  return calculatePayoff(debts, "snowball");
}

export function calculateAvalanche(debts: Debt[]): PayoffResult {
  return calculatePayoff(debts, "avalanche");
}

export function calculateMinimumOnly(debts: Debt[]): PayoffResult {
  // Simulate paying just minimums with no extra allocation
  const remaining = debts.map((d) => ({ ...d, balance: d.balance }));
  const schedule: PayoffScheduleMonth[] = [];
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 360;

  while (remaining.some((d) => d.balance > 0) && month < maxMonths) {
    month++;
    const monthPayments: PayoffScheduleMonth["payments"] = [];

    for (const debt of remaining) {
      if (debt.balance <= 0) continue;
      const monthlyRate = debt.apr / 100 / 12;
      const interest = debt.balance * monthlyRate;
      debt.balance += interest;
      totalInterest += interest;
      const payment = Math.min(debt.minPayment, debt.balance);
      debt.balance -= payment;
      monthPayments.push({
        debtId: debt.id,
        name: debt.name,
        payment,
        remainingBalance: Math.max(0, debt.balance),
      });
    }

    schedule.push({ month, payments: monthPayments });
  }

  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + month);

  return { schedule, totalMonths: month, totalInterest: Math.round(totalInterest * 100) / 100, debtFreeDate };
}
