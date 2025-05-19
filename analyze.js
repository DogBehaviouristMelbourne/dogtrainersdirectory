// Bundle Size Analysis Configuration
// This script helps visualize the bundle size after building
// Run with: npm run analyze

import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import baseConfig from './vite.config.js';

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // or 'sunburst', 'network'
    })
  ],
  build: {
    ...baseConfig.build,
    minify: false, // Disable minification to better analyze the modules
    sourcemap: 'inline'
  }
});