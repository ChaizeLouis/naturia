import { test, expect, Page } from '@playwright/test'

async function loadPage(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  // Attendre React hydration
  await page.waitForSelector('button', { timeout: 30000 })
  await page.waitForTimeout(1500)
}

test('1. Page splash visible et complète', async ({ page }) => {
  await loadPage(page)
  await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
  
  const body = await page.textContent('body')
  expect(body).toContain('Naturia')
  
  const btns = await page.locator('button').allTextContents()
  console.log('Boutons trouvés:', btns)
  expect(btns.some(b => b.includes('Accéder') || b.includes('connecter'))).toBe(true)
})

test('2. Bouton Accéder ouvre auth', async ({ page }) => {
  await loadPage(page)
  
  // Chercher le bouton Accéder
  const acceder = page.locator('button', { hasText: /Accéder/i }).first()
  await expect(acceder).toBeVisible({ timeout: 15000 })
  await acceder.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/02-auth.png', fullPage: true })
  
  // Vérifier que la page auth s'est ouverte
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 })
  await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 })
})

test('3. Formulaire inscription fonctionnel', async ({ page }) => {
  await loadPage(page)
  await page.locator('button', { hasText: /Accéder/i }).first().click()
  await page.waitForTimeout(2000)
  
  await page.fill('input[type="email"]', 'test@naturia.ch')
  await page.fill('input[type="password"]', 'Test123456!')
  await page.screenshot({ path: 'test-results/03-form.png', fullPage: true })
  
  const emailVal = await page.locator('input[type="email"]').inputValue()
  expect(emailVal).toBe('test@naturia.ch')
})

test('4. Connexion depuis header', async ({ page }) => {
  await loadPage(page)
  const seConnecter = page.locator('button', { hasText: /Se connecter/i }).first()
  await expect(seConnecter).toBeVisible({ timeout: 15000 })
  await seConnecter.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/04-connexion.png', fullPage: true })
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 })
})

test('5. Retour depuis auth vers splash', async ({ page }) => {
  await loadPage(page)
  await page.locator('button', { hasText: /Accéder/i }).first().click()
  await page.waitForTimeout(2000)
  
  const retour = page.locator('button', { hasText: /Retour/i }).first()
  await expect(retour).toBeVisible({ timeout: 15000 })
  await retour.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/05-retour.png', fullPage: true })
  
  await expect(page.locator('button', { hasText: /Accéder/i }).first()).toBeVisible()
})

test('6. Onglet Connexion / Créer un compte', async ({ page }) => {
  await loadPage(page)
  await page.locator('button', { hasText: /Accéder/i }).first().click()
  await page.waitForTimeout(2000)
  
  // Vérifier les deux onglets
  await expect(page.locator('button', { hasText: /Connexion/i }).first()).toBeVisible()
  await expect(page.locator('button', { hasText: /Créer/i }).first()).toBeVisible()
  await page.screenshot({ path: 'test-results/06-tabs.png', fullPage: true })
})
