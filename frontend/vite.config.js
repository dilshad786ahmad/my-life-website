import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy libraries into separate chunks
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-icons':   ['lucide-react'],
          'vendor-axios':   ['axios'],
          'vendor-google':  ['@react-oauth/google'],
        }
      }
    },
    // Increase chunk size warning limit (informational only)
    chunkSizeWarningLimit: 600,
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  // Optimize dev server for faster HMR
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'axios', 'lucide-react'],
  },
})
