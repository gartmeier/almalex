import { reactRouter } from "@react-router/dev/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "gartmeier",
      project: "almalex_frontend",
      telemetry: false,
    }),
  ],

  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },

  build: {
    sourcemap: true,
  },
});
