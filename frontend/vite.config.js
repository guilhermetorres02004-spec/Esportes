import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8081",
      "^/login$": "http://localhost:8081",
      "^/logout$": "http://localhost:8081",
    },
  },
});
