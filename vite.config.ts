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
          // Radix UI - разделяем на более мелкие чанки для лучшей загрузки
          if (id.includes('node_modules/@radix-ui')) {
            // Разделяем большие компоненты Radix UI
            if (id.includes('@radix-ui/react-dialog') || 
                id.includes('@radix-ui/react-popover') ||
                id.includes('@radix-ui/react-alert-dialog')) {
              return 'vendor-ui-dialogs'
            }
            if (id.includes('@radix-ui/react-select') ||
                id.includes('@radix-ui/react-dropdown-menu')) {
              return 'vendor-ui-selects'
            }
            return 'vendor-ui'
          }
          // Lucide icons - отдельный чанк для иконок
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // Supabase - большая библиотека, отдельный чанк
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          // Form libraries - отдельный чанк
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform')) {
            return 'vendor-forms'
          }
          // Validation libraries
          if (id.includes('node_modules/zod')) {
            return 'vendor-validation'
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
          // Charts библиотеки
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts'
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

