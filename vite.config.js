import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// A API só libera CORS para localhost:3000 (CorsConfig.java no repositório BBTS-API).
// Por isso o dev server e o preview não usam a porta padrão do Vite.
const PORTA_LIBERADA_NO_CORS = 3000;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: PORTA_LIBERADA_NO_CORS },
  preview: { port: PORTA_LIBERADA_NO_CORS },
});
