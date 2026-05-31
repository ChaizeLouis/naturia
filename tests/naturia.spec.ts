import { test, expect } from '@playwright/test'

const BASE = 'https://chaizelouis.github.io/NUTRICORE/'

test.describe('Naturia — Tests visuels complets', () => {

  test('1. Page splash — chargement et contenu', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
    await expect(page).toHaveTitle(/Naturia/)
    await expect(page.getByText('Naturia')).toBeVisible({ timeout: 15000 })
  })

  test('2. Page splash — bouton Accéder à Naturia', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(5000)
    const btn = page.getByText('Accéder à Naturia')
    await expect(btn).toBeVisible({ timeout: 15000 })
    await page.screenshot({ path: 'test-results/02-splash-btn.png', fullPage: true })
    await btn.click()
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'test-results/03-after-click.png', fullPage: true })
  })

  test('3. Page auth — formulaire connexion', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(5000)
    await page.getByText('Accéder à Naturia').click()
    await page.waitForTimeout(3000)
    await expect(page.getByText('Connexion')).toBeVisible({ timeout: 15000 })
    await page.screenshot({ path: 'test-results/04-auth.png', fullPage: true })
  })

  test('4. Inscription nouveau compte', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(5000)
    await page.getByText('Accéder à Naturia').click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/05-inscription.png', fullPage: true })
    await expect(page.getByText('Créer un compte')).toBeVisible({ timeout: 15000 })
  })

  test('5. Connexion Amandine', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(5000)
    await page.getByText('Accéder à Naturia').click()
    await page.waitForTimeout(2000)
    
    // Passer en mode connexion
    const loginLink = page.getByText('Se connecter')
    if (await loginLink.isVisible()) await loginLink.click()
    await page.waitForTimeout(1000)
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', 'amandine@test.naturia.ch')
    await page.fill('input[type="password"]', 'Test1234!')
    await page.screenshot({ path: 'test-results/06-login-filled.png', fullPage: true })
    await page.click('button[type="submit"]')
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'test-results/07-after-login.png', fullPage: true })
  })

})
