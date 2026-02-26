import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库独立打包
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 将大型组件独立打包
          'weather-components': [
            './src/components/WeatherCard.jsx',
            './src/components/TemperatureChart.jsx'
          ]
        }
      }
    },
    // 开启代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除console
        drop_debugger: true
      }
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  plugins: [react()],
})
