import { defineConfig, devices } from "@playwright/test";

/** Not Vite's default 5173, so a running `mise run dev` (PWA dev on) is never reused. */
const devPort = 5183;
const devBaseURL = `http://127.0.0.1:${String(devPort)}`;
/** Production build + `vite preview`, for PWA output (manifest, service worker). */
const previewPort = 5184;
const previewBaseURL = `http://127.0.0.1:${String(previewPort)}`;
const pwaSpecs = "**/tests/**/*.pwa.spec.ts";
const useSystemChrome = process.env.PW_CHANNEL === "chrome";

const chromiumUse = useSystemChrome
  ? { channel: "chrome" as const, ...devices["Desktop Chrome"] }
  : { ...devices["Desktop Chrome"] };

export default defineConfig({
  testDir: "./src",
  testMatch: "**/tests/**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: pwaSpecs,
      use: { ...chromiumUse, baseURL: devBaseURL },
    },
    {
      name: "chromium-pwa",
      testMatch: pwaSpecs,
      use: { ...chromiumUse, baseURL: previewBaseURL },
    },
  ],
  webServer: [
    {
      command: `VITE_PWA_DEV=false npm run dev -- --host 127.0.0.1 --port ${String(devPort)} --strictPort`,
      url: devBaseURL,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npx vite build && npx vite preview --host 127.0.0.1 --port ${String(previewPort)} --strictPort`,
      url: previewBaseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
