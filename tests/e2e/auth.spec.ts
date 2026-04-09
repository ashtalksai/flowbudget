import { test, expect } from '@playwright/test';

const BASE = 'https://flowbudget.ashketing.com';
const TEST_EMAIL = `qa-${Date.now()}@guerrillamail.com`;
const TEST_PASS = 'TestPass2026!';

test.describe('Auth Flow', () => {
  test('signup creates account and redirects to dashboard', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await expect(page).toHaveURL(/signup/);
    await page.getByRole('textbox', { name: /name/i }).fill('QA Tester');
    await page.getByRole('textbox', { name: /email/i }).fill(TEST_EMAIL);
    await page.getByRole('textbox', { name: /password/i }).fill(TEST_PASS);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    // First signup
    await page.goto(`${BASE}/signup`);
    const email = `qa-login-${Date.now()}@guerrillamail.com`;
    await page.getByRole('textbox', { name: /name/i }).fill('QA Login');
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(TEST_PASS);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/login/);

    // Login
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(TEST_PASS);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.getByRole('textbox', { name: /email/i }).fill('notreal@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('WrongPass123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 5000 });
  });

  test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  test('logout clears session', async ({ page }) => {
    // Signup first
    await page.goto(`${BASE}/signup`);
    const email = `qa-logout-${Date.now()}@guerrillamail.com`;
    await page.getByRole('textbox', { name: /name/i }).fill('QA Logout');
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(TEST_PASS);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/login/);

    // Verify session gone
    await page.goto(`${BASE}/dashboard`);
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });
});
