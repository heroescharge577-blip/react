import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Configuración necesaria para que GitHub Codespaces no bloquee la conexión
    allowedHosts: [
      "legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev"
    ],
    proxy: {
      // Intercepta las llamadas a /api y las manda al servidor Express
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        // Opcional: útil si tienes problemas de WebSocket o rutas complejas
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})