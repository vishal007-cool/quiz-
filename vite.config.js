import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()   // 🟢 Tailwind plugin added
  ],
  base: "/nxtstore-ecommerce-site/",   // GitHub Pages base URL
});
