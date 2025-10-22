
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

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
      '/auth': API_URL,
      '/places': API_URL,
      '/crime': API_URL,
      '/route': API_URL,
      '/user': API_URL,
      '/health': API_URL,
      '/api': API_URL,
      '/api/hotel-images': API_URL,
      '/api/hospital-images': API_URL,
    }
  }
});
