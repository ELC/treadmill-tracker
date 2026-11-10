import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const pwaThemeColor = "#0f0f12";
const pwaBackgroundColor = "#0f0f12";

const appBase = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base: appBase,
  server: {
    host: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      devOptions: {
        enabled: process.env.VITE_PWA_DEV !== "false",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
      manifest: {
        id: appBase,
        name: "Treadmill Tracker",
        short_name: "Treadmill",
        prefer_related_applications: false,
        description:
          "Run structured treadmill workouts with timers and session stats.",
        theme_color: pwaThemeColor,
        background_color: pwaBackgroundColor,
        display: "standalone",
        scope: appBase,
        start_url: appBase,
        orientation: "portrait",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
