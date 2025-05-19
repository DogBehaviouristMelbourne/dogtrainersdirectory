import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Increase the chunk size warning limit to reduce unnecessary warnings
    chunkSizeWarningLimit: 800,
    
    // Configure code splitting and optimization
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
        },
        // Ensure chunk filenames include content hash for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        // Ensure entry filenames include content hash for better caching
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    
    // Enable minification with terser (more aggressive than esbuild)
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
        // Remove debugger statements in production
        drop_debugger: true
      }
    },
    
    // Generate sourcemaps for production debugging
    sourcemap: true,
    
    // Improve CSS extraction
    cssCodeSplit: true,
    
    // Add asset inlining for small files to reduce HTTP requests
    assetsInlineLimit: 4096, // 4kb
  },
  
  // Add optimizations for development mode
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app'],
  }
});