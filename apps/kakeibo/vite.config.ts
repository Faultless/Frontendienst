import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative base + hash routing → deployable at any sub-path (GH Pages).
  base: "./",
  plugins: [react(), tailwindcss()],
});
