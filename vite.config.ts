import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vitest/config";
import type _ from "vitest/globals";
import manifest from "./manifest.json";

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [react(), crx({ manifest })],
});
