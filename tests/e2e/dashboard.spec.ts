import { test, expect, Page } from '@playwright/test';

const BASE = 'https://flowbudget.ashketing.com';

async function signupAndLogin(page: Page): Promise<void> {
  const email = `qa-dash-${Date.now()}@guerrillamail.com`;
  await page.goto(`${BASE}/signup`);
  await page.getByRole('textbox', { name: /name/i }).fill('QA Dashboard');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill('TestPass2026!');
  await page.getByRole('button', { name: /create account/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
}

test.describe('Dashboard & Core Pages', () => {
  test('dashboard renders stat cards and chart', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard`);
    await expect(page.getByText('Income')).toBeVisible();
    await expect(page.getByText('Expenses')).toBeVisible();
    await expect(page.getByText('Net')).toBeVisible();
    await expect(page.getByText('Pending Review')).toBeVisible();
    await expect(page.getByText('Cash Flow')).toBeVisible();
  });

  test('sidebar navigation present and functional', async ({ page }) => {
    await signupAndLogin(page);
    const navLinks = ['Dashboard', 'Import', 'Review', 'Transactions', 'Budget', 'Income', 'Debts', 'Settings'];
    for (const link of navLinks) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }
    // Click each nav link and verify no crash
    await page.getByRole('link', { name: 'Import' }).click();
    await expect(page).toHaveURL(/import/);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page).toHaveURL(/review/);
    await page.getByRole('link', { name: 'Transactions' }).click();
    await expect(page).toHaveURL(/transactions/);
    await page.getByRole('link', { name: 'Budget' }).click();
    await expect(page).toHaveURL(/budget/);
    await page.getByRole('link', { name: 'Income' }).click();
    await expect(page).toHaveURL(/income/);
    await page.getByRole('link', { name: 'Debts' }).click();
    await expect(page).toHaveURL(/debts/);
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/settings/);
  });

  test('import page has upload zone', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/import`);
    await expect(page.getByText(/drop a csv/i)).toBeVisible();
    await expect(page.getByText(/import history/i)).toBeVisible();
  });

  test('review queue renders with search and filter', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/review`);
    await expect(page.getByText(/review queue/i)).toBeVisible();
    await expect(page.getByPlaceholder(/search descriptions/i)).toBeVisible();
  });

  test('transactions page renders with filters', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/transactions`);
    await expect(page.getByRole('heading', { name: /transactions/i })).toBeVisible();
    await expect(page.getByText(/0 transactions total/i)).toBeVisible();
  });

  test('budget page has month navigation and set budget CTA', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/budget`);
    await expect(page.getByRole('heading', { name: /budget/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /set budget/i })).toBeVisible();
  });

  test('income page renders monthly chart', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/income`);
    await expect(page.getByText(/monthly income/i)).toBeVisible();
    await expect(page.getByText(/income by category/i)).toBeVisible();
  });

  test('debts page has debt list and reimbursables', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/debts`);
    await expect(page.getByText(/debts & reimbursables/i)).toBeVisible();
    await expect(page.getByText(/total debt/i)).toBeVisible();
    await expect(page.getByText(/reimbursables/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add debt/i })).toBeVisible();
  });

  test('settings page has profile and tabs', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/settings`);
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /accounts/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /rules/i })).toBeVisible();
  });

  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get(`${BASE}/api/health`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });
});
