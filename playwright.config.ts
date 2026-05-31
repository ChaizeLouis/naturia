import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:3000/NUTRICORE'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  timeout: 60000,
  outputDir: 'test-results',
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 45000,
  },
  webServer: {
    command: 'serve serve-root -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
