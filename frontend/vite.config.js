import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { execSync } from 'child_process'

// Função para verificar se uma porta está em uso
function isPortInUse(port) {
  try {
    if (process.platform === 'win32') {
      const result = execSync(`netstat -ano | findstr :${port}`).toString()
      return result.length > 0
    } else {
      const result = execSync(`lsof -i:${port} -t`).toString()
      return result.length > 0
    }
  } catch (e) {
    return false
  }
}

// Função para encontrar uma porta disponível
function findAvailablePort(startPort) {
  let port = startPort
  while (isPortInUse(port)) {
    console.log(`⚠️ Porta ${port} em uso, tentando próxima...`)
    port++
    if (port > startPort + 10) {
      console.warn(`⚠️ Não foi possível encontrar uma porta disponível após ${startPort + 10}. Usando ${startPort + 100}`)
      return startPort + 100
    }
  }
  return port
}

// Porta padrão e alternativa
const DEFAULT_PORT = 5173
const port = findAvailablePort(DEFAULT_PORT)

// Configurar a porta sem modificar o arquivo .env
const configuredPort = 5174 // Porta fixa para evitar reinicializações

export default defineConfig({
  plugins: [react()],
  server: {
    port: configuredPort,
    host: true, // Isso permite acesso de outros dispositivos na rede
    open: true,
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'self'"
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    },
    // Lidar com erros de inicialização
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      ignored: ['**/.env', '**/.env.*'] // Ignorar alterações em arquivos .env
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    css: true,
  }
})
