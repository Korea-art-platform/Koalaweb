import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    port: 5173,
    proxy: {
      // API 요청을 로컬 백엔드로 프록시
      // → 브라우저가 같은 origin으로 인식 → HttpOnly 쿠키 정상 동작
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // OAuth2 로그인 흐름
      '/oauth2': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/login/oauth2': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})