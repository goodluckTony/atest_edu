// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

export default defineConfig({
  globalSetup: './global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL,
    browserName: "chromium",
    // browserName: "webkit",
    headless: true,
    screenshot: "on",
    trace: "on",
  },
  
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

});


