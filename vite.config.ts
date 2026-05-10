import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
  ],
  server: {
    port: 9080,
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      input: isSsrBuild ? './server/app.ts' : undefined,
    },
  },
}))
