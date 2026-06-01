import { defineConfig, devices } from '@playwright/test'

// En CI: tester le vrai site Vercel déployé
// En local: tester avec serve
const baseURL = process.env.BASE_URL || 'http://localhost:3000'
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 2,
  timeout: 60000,
  outputDir: 'test-results',
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'on',
    actionTimeout: 20000,
    navigationTimeout: 45000,
  },
  // Serveur local seulement si pas en CI (en CI on teste le vrai site Vercel)
  webServer: isCI ? undefined : {
    command: 'serve out -p 3000',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile', use: { ...devices['iPhone 14'] } },
  ],
})
