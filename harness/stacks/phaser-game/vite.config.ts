import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths: required so the built bundle also works unpacked
  // from a subpath (GitHub Pages project sites, itch.io HTML5 embeds).
  base: './',
  server: { host: true },
  build: {
    // Phaser alone is ~1.4MB; that's expected library weight, not a warning
    // sign for our own code (see manualChunks below).
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Phaser barely changes between our releases; splitting it out keeps
        // rebuilds cacheable on Pages/CDN and quiets the >500kb chunk warning.
        manualChunks: { phaser: ['phaser'] },
      },
    },
  },
});
