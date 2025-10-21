import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  //root:'docs',
  plugins: [react(), tailwindcss()],
  base: '/portfolio-site/' , // <-- Add this line for GitHub Pages deployment
}) 