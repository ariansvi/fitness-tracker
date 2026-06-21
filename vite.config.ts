import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://ariansvi.github.io/fitness-tracker/
  base: '/fitness-tracker/',
  plugins: [react(), tailwindcss()],
})
