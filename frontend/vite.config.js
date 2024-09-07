import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
    fs: {
      allow: [
        // Add the path to your project root
        path.resolve(__dirname, '..'),
      ],
    },
    sourcemapIgnoreList: () => true, 
  },
})
