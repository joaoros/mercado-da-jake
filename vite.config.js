import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/mercado-da-jake/",
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: true
  }
})
