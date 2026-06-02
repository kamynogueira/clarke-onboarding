import { test as base } from '@playwright/test'

export const test = base.extend({
  adminPage: async ({ page }, use) => {
    // Faz login real como admin
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(process.env.TEST_ADMIN_EMAIL!)
    await page.getByLabel('Senha').fill(process.env.TEST_ADMIN_PASSWORD!)
    await page.getByRole('button', { name: 'Entrar' }).click()
    // Aguarda o código 2FA — em testes use um usuário sem 2FA
    await page.waitForURL('/admin')
    await use(page)
  },
})