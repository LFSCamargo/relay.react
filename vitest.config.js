// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ babel: { plugins: ["babel-plugin-relay"] } })],
  test: {
    environment: "jsdom", // Use jsdom for DOM API support
    globals: true, // Enable global test APIs like `describe`, `it`
    setupFiles: "./tests/setup.ts", // Setup file path
    css: true, // Enable CSS if you're importing CSS files in components
    coverage: {
      reporter: ["text", "lcov"], // Coverage reporters
      exclude: [
        "node_modules/",
        "./tests/setup.ts",
        "src/**/__generated__/*",
        "eslint.config.js",
        "vite.config.ts",
        "vitest.config.js",
        "src/main.tsx",
      ], // Exclude certain files from coverage
    },
  },
});
