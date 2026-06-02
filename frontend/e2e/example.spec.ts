import { test, expect } from '@playwright/test';

test('página de login carrega corretamente', async ({ page }) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Clarke/i);
});

test('página de login exibe formulário de acesso', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder('seu@clarke.com.br')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
});
