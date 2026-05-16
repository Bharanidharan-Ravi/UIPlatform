import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: 'src/index.js',
      name: 'WGPlatform',
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es' ? 'wg-platform.es.js' : 'wg-platform.cjs',
      cssFileName: 'wg-platform'
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@tanstack/react-query',
        'react-router-dom',
        'zustand',
        'zustand/vanilla'
      ],
      output: {}
    }
  }
});
