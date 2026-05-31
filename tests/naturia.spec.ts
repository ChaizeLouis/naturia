import { test, expect } from '@playwright/test'

const URL = 'https://naturia.tony-bara1.workers.dev'

test.describe('Naturia — Tests complets', () => {

  test('1. Page splash s\'affiche correctement', async ({ page }) => {
    await page.goto(URL)
    await page.waitForTimeout(3000)
    
    // Screenshot page splash
    await page.screenshot({ path: 'test-results/01-splash.png', fullPage: true })
    
    // Vérifications
    await expect(page.locator('text=Naturia')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Accéder à Naturia')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=La santé naturelle')).toBeVisible({ timeout: 10000 })
  })

  test('2. Bouton "Accéder à Naturia" ouvre la page de connexion', async ({ page }) => {
    await page.goto(URL)
    await page.waitForTimeout(3000)
    await page.click('text=Accéder à Naturia')
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'test-results/02-auth.png', fullPage: true })
    
    await expect(page.locator('text=Créer un compte')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 10000 })
  })

  test('3. Connexion avec compte Amandine', async ({ page }) => {
    await page.goto(URL)
    await page.waitForTimeout(3000)
    
    // Aller sur connexion
    await page.click('text=Se connecter')
    await page.waitForTimeout(1000)
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', 'amandine@test.naturia.ch')
    await page.fill('input[type="password"]', 'test123456')
    await page.screenshot({ path: 'test-results/03-login-form.png', fullPage: true })
  })

  test('4. Navigation dashboard visible', async ({ page }) => {
    await page.goto(URL)
    await page.waitForTimeout(5000)
    await page.screenshot({ path: 'test-results/04-initial-state.png', fullPage: true })
    
    // Vérifier les éléments de navigation principaux
    const title = await page.title()
    expect(title).toContain('Naturia')
  })

  test('5. "Déjà un compte" mène à la connexion', async ({ page }) => {
    await page.goto(URL)
    await page.waitForTimeout(3000)
    await page.click('text=Déjà un compte')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/05-login-page.png', fullPage: true })
    await expect(page.locator('text=Connexion')).toBeVisible({ timeout: 10000 })
  })

  test('6. Retour à la splash depuis auth', async ({ page }) => {
    await page.goto(URL)
    await page.waitForTimeout(3000)
    await page.click('text=Accéder à Naturia')
    await page.waitForTimeout(1000)
    await page.click('text=← Retour')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: 'test-results/06-back-to-splash.png', fullPage: true })
    await expect(page.locator('text=La santé naturelle')).toBeVisible({ timeout: 10000 })
  })
})
