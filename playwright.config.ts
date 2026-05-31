import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 2,
  timeout: 60000,
  outputDir: 'test-results',
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'https://chaizelouis.github.io/NUTRICORE/',
    trace: 'retain-on-failure',
    screenshot: 'always',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
})
