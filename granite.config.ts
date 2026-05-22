import { defineConfig } from '@apps-in-toss/web-framework/config';

/** 앱인토스 미니앱 설정 */
export default defineConfig({
  appName: 'KOALA',
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
    },
  },
  webViewProps: {
    type: 'partner',
  },
});
