import { describe, it, expect, vi, afterEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CART_QUERY_KEY, CART_UPDATED_EVENT, attachCartSync, notifyCartUpdated } from './useCart';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const SRC = join(process.cwd(), 'src');
const files = sourceFiles(SRC).map((path) => ({ path, text: readFileSync(path, 'utf8') }));
const HOOK_FILE = join('hooks', 'useCart.ts');

const detach: Array<() => void> = [];
afterEach(() => {
  while (detach.length) detach.pop()!();
});

describe('장바구니 갱신 신호', () => {
  it('신호를 보내면 장바구니를 다시 읽는다', () => {
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries').mockResolvedValue(undefined);
    detach.push(attachCartSync(client));

    notifyCartUpdated();

    expect(invalidate).toHaveBeenCalledWith({ queryKey: CART_QUERY_KEY });
  });

  it('떼어내면 더는 반응하지 않는다', () => {
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries').mockResolvedValue(undefined);

    attachCartSync(client)();
    notifyCartUpdated();

    expect(invalidate).not.toHaveBeenCalled();
  });

  it('앱이 뜰 때 붙인다', () => {
    const app = files.find((f) => f.path.endsWith(join('app', 'App.tsx')));

    expect(app, 'App.tsx 를 찾지 못했다').toBeDefined();
    expect(app!.text, '붙이지 않으면 담아도 화면이 그대로다')
      .toContain('attachCartSync(queryClient)');
  });

  it('신호를 보내는 곳은 모두 같은 함수를 쓴다', () => {
    const raw = files
      .filter((f) => f.text.includes(`new Event('${CART_UPDATED_EVENT}')`))
      .filter((f) => !f.path.endsWith(HOOK_FILE))
      .map((f) => f.path.replace(SRC, 'src'));

    expect(raw, '직접 부르면 이름이 어긋나도 아무도 모른다').toEqual([]);
  });
});
