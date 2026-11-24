import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022', assetsDir: 'app', chunkSizeWarningLimit: 800,
    // one page per HTML file: the home page and the gallery
    rollupOptions: { input: { main: 'index.html', gallery: 'gallery.html' } },
  },
});
