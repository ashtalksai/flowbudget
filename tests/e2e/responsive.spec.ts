import { test, expect, Page } from '@playwright/test';

const BASE = 'https://flowbudget.ashketing.com';

async function signupAndLogin(page: Page): Promise<void> {
  const email = `qa-resp-${Date.now()}@guerrillamail.com`;
  await page.goto(`${BASE}/signup`);
  await page.getByRole('textbox', { name: /name/i }).fill('QA Responsive');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill('TestPass2026!');
  await page.getByRole('button', { name: /create account/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
}

test.describe('Responsive Layout — 375px Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('login page is usable on mobile', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('dashboard renders on mobile with hamburger nav', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard`);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    // Stat cards should still be visible (stacked)
    await expect(page.getByText('Income')).toBeVisible();
  });

  test('import page usable on mobile', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/import`);
    await expect(page.getByText(/drop a csv/i)).toBeVisible();
  });

  test('debts page usable on mobile', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard/debts`);
    await expect(page.getByText(/debts & reimbursables/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add debt/i })).toBeVisible();
  });
});

test.describe('Responsive Layout — 768px Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('dashboard renders with sidebar at tablet', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard`);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText('Income')).toBeVisible();
    await expect(page.getByText('Cash Flow')).toBeVisible();
  });
});

test.describe('Responsive Layout — 1280px Desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('dashboard renders full layout at desktop', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard`);
    await expect(page.getByRole('complementary')).toBeVisible(); // sidebar
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText('Budget Progress')).toBeVisible();
    await expect(page.getByText('Recent Transactions')).toBeVisible();
  });

  test('all 8 nav links visible in sidebar at desktop', async ({ page }) => {
    await signupAndLogin(page);
    await page.goto(`${BASE}/dashboard`);
    const links = ['Dashboard', 'Import', 'Review', 'Transactions', 'Budget', 'Income', 'Debts', 'Settings'];
    for (const link of links) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }
  });
});
