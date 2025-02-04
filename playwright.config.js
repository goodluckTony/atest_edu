// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: "chromium",
    // browserName: "webkit",
    headless: true,
    screenshot: "on",
    trace: "on"
  },

});


