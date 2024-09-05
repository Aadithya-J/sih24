import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/, 
    exclude: [],
    sourcemap: false, 
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      sourcemap: false, 
    },
  },
  build: {
    sourcemap: false, 
  },
  server: {
    sourcemapIgnoreList: () => true, 
  },
})
