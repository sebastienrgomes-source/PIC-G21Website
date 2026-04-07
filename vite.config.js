import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5170,
    proxy: {
      "/api": {
        target: process.env.CONTACT_API_TARGET ?? "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
