
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react({
    include: '**/*.{jsx,tsx}',
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../attached_assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/places': 'http://localhost:3000',
      '/crime': 'http://localhost:3000',
      '/route': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/api/hotel-images': 'http://localhost:3000',
      '/api/hospital-images': 'http://localhost:3000',
    }
  }
});
