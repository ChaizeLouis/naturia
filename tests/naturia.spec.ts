import { test, expect, Page } from '@playwright/test'

async function waitForApp(page: Page) {
  await page.goto('/')
  // Attendre que React hydrate
  await page.waitForSelector('button', { timeout: 30000 })
  await page.waitForTimeout(2000)
}

test('1. Page splash — Naturia visible', async ({ page }) => {
  await waitForApp(page)
  await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
  const body = await page.textContent('body')
  console.log('Page contient:', body?.substring(0, 300))
  expect(body).toContain('Naturia')
})

test('2. Bouton Accéder à Naturia fonctionne', async ({ page }) => {
  await waitForApp(page)
  const btns = await page.locator('button').allTextContents()
  console.log('Boutons:', btns)
  const acceder = page.locator('button', { hasText: 'Accéder' }).first()
  await expect(acceder).toBeVisible({ timeout: 15000 })
  await acceder.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/02-auth.png', fullPage: true })
  await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 15000 })
})

test('3. Formulaire inscription complet', async ({ page }) => {
  await waitForApp(page)
  await page.locator('button', { hasText: 'Accéder' }).first().click()
  await page.waitForTimeout(2000)
  await page.fill('input[type="email"]', 'amandine@test.naturia.ch')
  await page.fill('input[type="password"]', 'Test123456!')
  await page.screenshot({ path: 'test-results/03-form-filled.png', fullPage: true })
  console.log('✅ Formulaire rempli OK')
})

test('4. Onglet connexion', async ({ page }) => {
  await waitForApp(page)
  await page.locator('button', { hasText: 'Accéder' }).first().click()
  await page.waitForTimeout(1500)
  const connexion = page.locator('button', { hasText: 'Connexion' }).first()
  await connexion.click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'test-results/04-connexion.png', fullPage: true })
  await expect(page.locator('input[type="email"]')).toBeVisible()
})

test('5. Retour à la splash page', async ({ page }) => {
  await waitForApp(page)
  await page.locator('button', { hasText: 'Accéder' }).first().click()
  await page.waitForTimeout(1500)
  await page.locator('button', { hasText: 'Retour' }).first().click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'test-results/05-splash-retour.png', fullPage: true })
  await expect(page.locator('button', { hasText: 'Accéder' }).first()).toBeVisible()
})

test('6. Se connecter depuis splash', async ({ page }) => {
  await waitForApp(page)
  await page.locator('button', { hasText: 'Se connecter' }).first().click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/06-se-connecter.png', fullPage: true })
  await expect(page.locator('input[type="email"]')).toBeVisible()
})
