import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()   // 🟢 Tailwind plugin added
  ],
  base: "/gemini-ai/",   // GitHub Pages base URL
});
