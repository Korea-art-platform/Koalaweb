import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths' // 💡 플러그인 불러오기

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(), // 💡 여기에 쏙 넣어줍니다! (이제 복잡한 alias 설정 안 해도 됩니다)
  ],
  // resolve: { alias: ... } 부분은 싹 지워버리셔도 됩니다!
  assetsInclude: ['**/*.svg', '**/*.csv'],
})