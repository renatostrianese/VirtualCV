import { defineConfig } from 'vite';

// base './' lets the build work on GitHub Pages under any repo name (or a custom domain).
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
