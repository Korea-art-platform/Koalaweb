import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    // 프로덕션 빌드 시에만 이미지 압축.
    //
    // 예전에는 imagemin 을 썼는데, 딸려 오는 패키지 서른 몇 개가 관리가 끊긴
    // 채로 취약점을 안고 있었다. sharp 는 자체 바이너리라 그 사슬이 통째로
    // 사라진다. 줄어드는 용량은 전과 같다.
    //
    // .webp 를 따로 만들지 않는다. 만들어 두기만 하고 코드 어디에서도
    // 참조하지 않아, 배포물에 아무도 받지 않는 파일만 쌓이고 있었다.
    ...(command === 'build' ? [
      ViteImageOptimizer({
        jpg: { quality: 82 },
        jpeg: { quality: 82 },
        png: { quality: 82 },
        // svgo 4 의 기본 설정을 그대로 쓴다. viewBox 는 이 판부터 기본으로
        // 남으므로 따로 지켜 줄 필요가 없다 — 3 에서 쓰던 override 를 그대로
        // 옮기면 "preset-default 에 없는 항목"이라며 경고가 난다.
        svg: { multipass: true },
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
