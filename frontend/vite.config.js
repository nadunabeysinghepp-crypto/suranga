import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/suranga/", // MUST match repo name
  plugins: [react()],
});
