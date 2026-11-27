/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const PORTA_LIBERADA_NO_CORS = 3000

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // A API só libera CORS para localhost:3000 (CorsConfig.java no repositório BBTS-API).
  server: { port: PORTA_LIBERADA_NO_CORS },
  preview: { port: PORTA_LIBERADA_NO_CORS },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    css: false,
  },
})
