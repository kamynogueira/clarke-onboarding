import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve exibir a tela de login', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Clarke/i);
    await expect(page.getByText('Clarke Onboarding')).toBeVisible();
  });

  test.skip('deve exibir erro com credenciais inválidas — login desativado');

  test('deve redirecionar para login se não autenticado', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/login/, { timeout: 15_000 });
  });

  test('deve redirecionar para login se acessar onboarding sem auth', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/login/, { timeout: 15_000 });
  });
});
