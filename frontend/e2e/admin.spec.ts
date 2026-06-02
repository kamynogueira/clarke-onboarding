import { expect } from '@playwright/test';
import { test } from './fixtures/auth';

test.skip('Login desativado no momento');

test.describe('Admin — Usuários', () => {
  test('deve exibir a página de usuários', async ({ adminPage }) => {
    await adminPage.goto('/admin/users');
    await expect(adminPage.getByText('Usuários')).toBeVisible();
  });

  test('deve abrir o drawer de novo usuário', async ({ adminPage }) => {
    await adminPage.goto('/admin/users');
    await adminPage.getByRole('button', { name: 'Novo usuário' }).click();
    await expect(adminPage.getByText('Nome completo')).toBeVisible();
  });
});

test.describe('Admin — Trilhas', () => {
  test('deve exibir a página de trilhas', async ({ adminPage }) => {
    await adminPage.goto('/admin/trails');
    await expect(adminPage.getByText('Trilhas')).toBeVisible();
  });
});
