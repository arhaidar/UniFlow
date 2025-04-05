import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/UniFlow/',
  server: {
    port: 3000,
    open: true,
  },
  build: { 
    outDir: 'root',
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [react()],
})

// this one does not deploy properly via github default pages
// export default defineConfig({
//   base: '/UniFlow/',
//   plugins: [react()],
// })