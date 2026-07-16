import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sparkroot/',
  // Add more config if needed
  server: {
    port: 5173,
    strictPort: true,
  },
});