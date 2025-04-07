import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// this one does not deploy properly via github default pages
export default defineConfig({
  base: '/UniFlow/',
  plugins: [react()],
})