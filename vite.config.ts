import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    port: 5173,
    proxy: {
      // API 요청을 로컬 백엔드로 프록시
      // → 브라우저가 같은 origin으로 인식 → HttpOnly 쿠키 정상 동작
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/admin/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // OAuth2 인가 요청만 백엔드로 프록시 (/oauth2/callback은 프론트 라우트이므로 제외)
      '/oauth2/authorization': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login/oauth2/code': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
}))