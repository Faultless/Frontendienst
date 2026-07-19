import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative base → deployable at any sub-path (GH Pages). Single screen, no router.
  base: "./",
  plugins: [react(), tailwindcss()],
});
