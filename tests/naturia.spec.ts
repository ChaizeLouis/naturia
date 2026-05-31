import { test, expect } from '@playwright/test'

const BASE = 'https://chaizelouis.github.io/NUTRICORE/'

test.describe('Naturia — Tests complets', () => {

  test('1. Page splash s\'affiche', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
    await expect(page.locator('text=Naturia').first()).toBeVisible({ timeout: 15000 })
  })

  test('2. Bouton Accéder à Naturia', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    const btn = page.locator('text=Accéder à Naturia').first()
    await expect(btn).toBeVisible({ timeout: 15000 })
    await btn.click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/02-apres-clic.png', fullPage: true })
  })

  test('3. Formulaire auth visible', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    const btn = page.locator('text=Accéder à Naturia').first()
    if (await btn.isVisible()) await btn.click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/03-auth.png', fullPage: true })
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible({ timeout: 15000 })
  })

  test('4. Connexion Amandine', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    const acceder = page.locator('text=Accéder à Naturia').first()
    if (await acceder.isVisible()) await acceder.click()
    await page.waitForTimeout(1000)
    const seConnecter = page.locator('text=Se connecter').first()
    if (await seConnecter.isVisible()) await seConnecter.click()
    await page.waitForTimeout(1000)
    await page.fill('input[type="email"]', 'amandine@test.naturia.ch')
    await page.fill('input[type="password"]', 'Test123456!')
    await page.screenshot({ path: 'test-results/04-login.png', fullPage: true })
    await page.locator('button[type="submit"]').first().click()
    await page.waitForTimeout(4000)
    await page.screenshot({ path: 'test-results/05-apres-login.png', fullPage: true })
  })

  test('5. Screenshot état initial complet', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'test-results/00-etat-initial.png', fullPage: true })
    const title = await page.title()
    expect(title).toBeTruthy()
    console.log('Titre page:', title)
  })
})
