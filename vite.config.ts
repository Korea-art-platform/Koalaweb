import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteImagemin from '@vheemstra/vite-plugin-imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imageminWebp from 'imagemin-webp'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    // 프로덕션 빌드 시에만 이미지 압축 + WebP 생성
    ...(command === 'build' ? [
      viteImagemin({
        plugins: {
          jpg: imageminMozjpeg({ quality: 82 }),
          png: imageminPngquant({ quality: [0.7, 0.9], strip: true }),
          svg: imageminSvgo({ plugins: [{ name: 'preset-default' }] }),
        },
        // 원본 옆에 .webp 파일도 함께 생성
        makeWebp: {
          plugins: {
            jpg: imageminWebp({ quality: 80 }),
            png: imageminWebp({ quality: 80 }),
          },
        },
      }),
    ] : []),
  ],
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    port: 5173,
    host: true,   // 로컬 네트워크의 다른 기기(스마트폰 등)에서 접속 허용
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

  // 테스트 — 브라우저 없이 도는 순수 로직 위주.
  // jsdom 은 canvas·Image 를 쓰는 이미지 축소 테스트에 필요하다.
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
}))
