import { test, expect, Page } from '@playwright/test'

const URL = 'https://chaizelouis.github.io/NUTRICORE/'

async function waitForApp(page: Page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  // Attendre que React soit hydraté
  await page.waitForSelector('button', { timeout: 20000 })
  await page.waitForTimeout(1000)
}

test('1. Page splash visible', async ({ page }) => {
  await waitForApp(page)
  await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
  const body = await page.textContent('body')
  console.log('Contenu page:', body?.substring(0, 200))
  expect(body).toContain('Naturia')
})

test('2. Bouton Accéder à Naturia', async ({ page }) => {
  await waitForApp(page)
  const btns = await page.locator('button').allTextContents()
  console.log('Boutons trouvés:', btns)
  const acceder = page.locator('button', { hasText: 'Accéder' }).first()
  await expect(acceder).toBeVisible({ timeout: 10000 })
  await acceder.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/02-auth.png', fullPage: true })
  const inputs = await page.locator('input').count()
  console.log('Inputs trouvés:', inputs)
  expect(inputs).toBeGreaterThan(0)
})

test('3. Formulaire connexion', async ({ page }) => {
  await waitForApp(page)
  const seConnecter = page.locator('button', { hasText: 'Se connecter' }).first()
  await seConnecter.click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'test-results/03-login.png', fullPage: true })
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
})

test('4. Navigation retour', async ({ page }) => {
  await waitForApp(page)
  await page.locator('button', { hasText: 'Accéder' }).first().click()
  await page.waitForTimeout(1500)
  const retour = page.locator('button', { hasText: 'Retour' }).first()
  await expect(retour).toBeVisible({ timeout: 10000 })
  await retour.click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'test-results/04-retour.png', fullPage: true })
  const body = await page.textContent('body')
  expect(body).toContain('Naturia')
})
