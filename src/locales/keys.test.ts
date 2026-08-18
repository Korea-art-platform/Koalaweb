import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ko from './ko/koala.json';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

function resolve(key: string): unknown {
  return key.split('.').reduce<unknown>(
    (node, part) =>
      node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
    ko,
  );
}

const SRC = join(process.cwd(), 'src');
const KEY_CALL = /\bt\(\s*['"]([a-zA-Z0-9_.]+)['"]/g;

const used = sourceFiles(SRC).flatMap((path) => {
  const text = readFileSync(path, 'utf8');
  return [...text.matchAll(KEY_CALL)].map((m) => ({ key: m[1], file: path.replace(SRC, 'src') }));
});

describe('번역 키', () => {
  it('화면에서 쓰는 키가 하나도 빠짐없이 존재한다', () => {
    const missing = used
      .filter(({ key }) => typeof resolve(key) !== 'string')
      .map(({ key, file }) => `${key}  (${file})`);

    expect(missing, '없는 키는 화면에 키 이름 그대로 노출된다').toEqual([]);
  });

  it('검사할 키를 실제로 모았다', () => {
    expect(used.length).toBeGreaterThan(100);
  });

  it('네임스페이스를 넘기지 않는다', () => {
    const namespaced = sourceFiles(SRC)
      .filter((path) => /useTranslation\(\s*['"]/.test(readFileSync(path, 'utf8')))
      .map((path) => path.replace(SRC, 'src'));

    expect(namespaced, '등록된 묶음은 하나뿐이라 이름을 넘기면 키를 찾지 못한다').toEqual([]);
  });
});
