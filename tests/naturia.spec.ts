import { test, expect } from '@playwright/test'

const BASE = 'https://chaizelouis.github.io/NUTRICORE/'

test.beforeEach(async ({ page }) => {
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  // Attendre que React soit hydraté (max 8 secondes)
  await page.waitForFunction(() => {
    return document.querySelector('button') !== null
  }, { timeout: 8000 }).catch(() => {})
})

test('1. Page splash — Naturia visible', async ({ page }) => {
  await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
  await expect(page.locator('text=Naturia').first()).toBeVisible({ timeout: 10000 })
  await expect(page.locator('text=La santé naturelle').first()).toBeVisible({ timeout: 10000 })
  console.log('✅ Page splash OK')
})

test('2. Bouton Accéder à Naturia', async ({ page }) => {
  const btn = page.locator('text=Accéder à Naturia').first()
  await expect(btn).toBeVisible({ timeout: 10000 })
  await btn.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/02-auth.png', fullPage: true })
  console.log('✅ Bouton Accéder OK')
})

test('3. Page auth — formulaire complet', async ({ page }) => {
  await page.locator('text=Accéder à Naturia').first().click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/03-form.png', fullPage: true })
  await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 })
  await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 10000 })
  await expect(page.locator('text=Créer un compte').first()).toBeVisible({ timeout: 10000 })
  await expect(page.locator('text=Connexion').first()).toBeVisible({ timeout: 10000 })
  console.log('✅ Formulaire auth OK')
})

test('4. Retour depuis auth vers splash', async ({ page }) => {
  await page.locator('text=Accéder à Naturia').first().click()
  await page.waitForTimeout(1500)
  await page.locator('text=← Retour').first().click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'test-results/04-retour.png', fullPage: true })
  await expect(page.locator('text=Accéder à Naturia').first()).toBeVisible({ timeout: 10000 })
  console.log('✅ Retour splash OK')
})

test('5. Connexion Se connecter', async ({ page }) => {
  await page.locator('text=Se connecter').first().click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'test-results/05-login.png', fullPage: true })
  await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 })
  console.log('✅ Connexion directe OK')
})

test('6. Inscription — tous les champs', async ({ page }) => {
  await page.locator('text=Accéder à Naturia').first().click()
  await page.waitForTimeout(1500)
  await page.fill('input[type="email"]', 'amandine@test.naturia.ch')
  await page.fill('input[type="password"]', 'Test123456!')
  await page.screenshot({ path: 'test-results/06-register-filled.png', fullPage: true })
  console.log('✅ Champs inscription OK')
})
