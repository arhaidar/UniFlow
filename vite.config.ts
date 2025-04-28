import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/UniFlow/', // Base URL for assets when deployed
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // '@' points to the src directory
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
