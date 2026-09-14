/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';

const files = import.meta.glob('./**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const isAdmin = (path: string) => /\/Admin\/|AdminLayout|AdminRoute/.test(path);
const CHROME_IMPORT = /import\s+\w+\s+from\s+['"][^'"]*(layouts\/Header|layouts\/Footer|common\/QuickMenu)['"]/;

describe('공통 틀은 템플릿에서만 그린다', () => {
  it('헤더·푸터·퀵메뉴를 부르는 곳은 SiteLayout 하나뿐이다', () => {
    const offenders = Object.entries(files)
      .filter(([path]) => !/layouts\/(SiteLayout|Header|Footer)\.tsx$/.test(path) && !path.endsWith('common/QuickMenu.tsx'))
      .filter(([, src]) => CHROME_IMPORT.test(src))
      .map(([path]) => path);

    expect(offenders).toEqual([]);
  });

  it('페이지는 화면 높이를 스스로 걸지 않는다 — 틀이 채운다', () => {
    const offenders = Object.entries(files)
      .filter(([path]) => !isAdmin(path) && !path.endsWith('routes.tsx') && !/layouts\/(SiteLayout|ScreenShell)\.tsx$/.test(path))
      .filter(([path]) => !path.endsWith('pages/ServerError.tsx'))
      .filter(([, src]) => /className="[^"]*\bmin-h-screen\b/.test(src))
      .map(([path]) => path);

    expect(offenders).toEqual([]);
  });
});
