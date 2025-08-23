import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const backendPort = process.env.BACKEND_PORT || 3001

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './',
  server: {
    proxy: {
      '/api': `http://localhost:${backendPort}`
    }
  },
  configureServer(server) {
    server.httpServer?.once('listening', () => {
      const address = server.resolvedUrls?.local[0] || 'http://localhost:5173'
      console.log(`\n👉 Frontend running at: ${address}\n`)
      console.log(`👉 Proxying /api → http://localhost:${backendPort}\n`)
    })
  }
})
