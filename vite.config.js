import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, 'public/build'),
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/js/main.js'),
      name: 'Portfolio',
      formats: ['iife'],
      fileName: () => 'main.js'
    }
  }
});
