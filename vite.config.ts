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
    // Оптимизация: уменьшаем размер бандла через tree-shaking
    cssCodeSplit: true,
    // Оптимизация: уменьшаем размер через сжатие
    reportCompressedSize: false, // Ускоряет сборку
    rollupOptions: {
      output: {
        // Оптимизация code splitting: разделяем vendor и UI библиотеки для лучшей загрузки
        manualChunks: (id) => {
          // React core - критический, но кэшируется отдельно
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          // React Router - отдельный чанк для роутинга
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          // Radix UI - большая библиотека, отдельный чанк
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui'
          }
          // Lucide icons - отдельный чанк для иконок
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // Class variance authority и другие утилиты
          if (id.includes('node_modules/class-variance-authority') || 
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'vendor-utils'
          }
          // Tailwind и CSS обработка
          if (id.includes('node_modules/tailwindcss') ||
              id.includes('node_modules/@tailwindcss')) {
            return 'vendor-styles'
          }
          // Остальные node_modules - общий vendor чанк
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

