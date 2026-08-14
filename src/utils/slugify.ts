const INITIALS = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp',
  's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
];

const MEDIALS = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae',
  'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
];

const FINALS = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm',
  'p', 't', 't', 'p', 'l', 'm', 'p', 'p', 't', 't',
  'ng', 't', 't', 'k', 't', 'p', 't',
];

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

function romanizeSyllable(code: number): string {
  const offset = code - HANGUL_START;
  const initial = Math.floor(offset / (21 * 28));
  const medial = Math.floor((offset % (21 * 28)) / 28);
  const final = offset % 28;

  return INITIALS[initial] + MEDIALS[medial] + FINALS[final];
}

export function romanizeKorean(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    result += code >= HANGUL_START && code <= HANGUL_END
      ? romanizeSyllable(code)
      : char;
  }
  return result;
}

export function slugify(name: string): string {
  return slugifyInput(name).replace(/^-+|-+$/g, '');
}

export function slugifyInput(text: string): string {
  return romanizeKorean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-');
}
