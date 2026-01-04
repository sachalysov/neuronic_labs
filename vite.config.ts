import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Отключены sourcemaps для уменьшения размера сборки
    // Оптимизация: минификация для продакшена (esbuild встроен в Vite, быстрее чем terser)
    minify: 'esbuild',
    // Оптимизация размера чанков
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Оптимизация code splitting: разделяем vendor и UI библиотеки
        manualChunks: (id) => {
          // Vendor chunks (React, React DOM)
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          // Router chunk
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui'
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // Остальные node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Оптимизация имен файлов для кэширования
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})

