import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// 인증 상태를 저장할 파일 경로
export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // 1. Setup 프로젝트: 여기서 로그인을 수행하고 상태를 저장합니다.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        channel: 'chrome', // Google 로그인 보안 문제 회피를 위해 실제 Chrome 브라우저 사용
        headless: false, // 사용자가 직접 소셜 로그인 클릭을 해야 하므로 헤드리스 모드 꺼둠
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'], // 자동화 감지 플래그 제거
        },
      },
    },

    // 2. 일반 브라우저 프로젝트들: setup에 의존하며, 저장된 인증 상태를 사용합니다.
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },

    {
      name: 'firefox',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE,
      },
    },

    {
      name: 'webkit',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: STORAGE_STATE,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
