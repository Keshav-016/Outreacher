import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        option: 'options.html',
        popup: 'popup.html',
        contentScript: 'src/contentScript.ts',
        background: 'src/background.ts',
      },
      output: {
        entryFileNames: '[name].js', // generates contentScript.js
      },
    },
  },
});
