import { test, expect } from '@playwright/test';

const BASE = 'https://flowbudget.ashketing.com';

test.describe('Landing & Auth Pages (Unauthenticated)', () => {
  test('root redirects unauthenticated users to login', async ({ page }) => {
    // NOTE: No public landing page exists — root redirects to /login for unauthenticated users
    await page.goto(BASE);
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  test('login page loads with form', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.getByRole('heading', { name: /flowbudget/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('signup page loads with form', async ({ page }) => {
    await page.goto(`${BASE}/signup`);
    await expect(page.getByRole('heading', { name: /flowbudget/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('/pitch returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE}/pitch`);
    expect(response?.status()).toBe(404);
  });

  test('/docs returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE}/docs`);
    expect(response?.status()).toBe(404);
  });

  test('/privacy returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE}/privacy`);
    expect(response?.status()).toBe(404);
  });

  test('/terms returns 404', async ({ page }) => {
    const response = await page.goto(`${BASE}/terms`);
    expect(response?.status()).toBe(404);
  });

  test('no console errors on login page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(`${BASE}/login`);
    expect(errors).toHaveLength(0);
  });
});
