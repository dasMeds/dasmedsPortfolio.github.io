import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        experience: resolve(import.meta.dirname, 'experience.html'),
        portfolio: resolve(import.meta.dirname, 'portfolio.html'),
        contact: resolve(import.meta.dirname, 'contact.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three';
          if (id.includes('/node_modules/gsap/')) return 'gsap';
        }
      }
    }
  }
});
