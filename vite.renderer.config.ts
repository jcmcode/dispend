import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        // Tailwind v4 works as a PostCSS plugin
        require('@tailwindcss/postcss')(),
      ],
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
    },
  },
  build: {
    rollupOptions: {
      input: 'src/renderer/index.html',
    },
  },
});
