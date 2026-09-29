import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE lets CI deploy under a project sub-path (e.g. /2nd3d-website/)
// while local dev keeps serving from the root.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['gsap', 'framer-motion', 'lenis'],
        },
      },
    },
  },
});
