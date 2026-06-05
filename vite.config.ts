import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { reactRouterHonoServer } from 'react-router-hono-server/dev'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    reactRouterHonoServer(),
    reactRouter(),
  ],
  server: {
    port: 9080,
    host: true,
    watch: {
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(root, 'app'),
    },
  },
  build: {
    rollupOptions: {
      input: isSsrBuild ? './server/app.ts' : undefined,
      external: ['node:url'],
    },
  },
  ssr: {
    noExternal: [/^@?react-router/, /^@?~/, /\.css$/],
    external: ['node:*'],
  },
}))
