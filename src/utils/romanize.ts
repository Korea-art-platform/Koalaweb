/**
 * 한글 이름을 로마자로 옮긴다. 국어의 로마자 표기법(개정) 기준이다.
 *
 * 등록 화면에서 한국어를 치면 영문 칸을 채워 주는 용도다. 사람이 고칠 수 있는
 * 초안이지 정답이 아니다 — 작가나 작품 이름은 관용 표기가 따로 있는 경우가
 * 많아(예: 이순신 → Yi Sunsin) 마지막 판단은 등록자가 한다.
 *
 * 음운 변화(자음 동화·구개음화)는 넣지 않았다. 주소를 만드는 게 목적이라
 * 글자 대 글자로 옮기는 편이 예측 가능하고, 규칙을 넣으면 등록자가 왜 이런
 * 철자가 나왔는지 알기 어려워진다.
 */

const CHOSEONG = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp',
  's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
];

const JUNGSEONG = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae',
  'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
];

const JONGSEONG = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm',
  'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng',
  't', 't', 'k', 't', 'p', 't',
];

/**
 * 받침 뒤에 모음이 오면 그 받침이 다음 글자 첫소리로 넘어간다(연음).
 * 호돌이는 hodoli 가 아니라 hodori 이고, 꽃이는 kkochi 다.
 *
 * [남는 받침, 넘어가는 소리] 로 적었다. 겹받침은 앞은 남고 뒤만 넘어간다 —
 * 닭이 → dalgi.
 */
const LIAISON: Record<number, [string, string]> = {
  1: ['', 'g'],   2: ['', 'kk'],  3: ['k', 's'],  4: ['', 'n'],
  5: ['n', 'j'],  6: ['n', 'h'],  7: ['', 'd'],   8: ['', 'r'],
  9: ['l', 'g'], 10: ['l', 'm'], 11: ['l', 'b'], 12: ['l', 's'],
 13: ['l', 't'], 14: ['l', 'p'], 15: ['l', 'h'], 16: ['', 'm'],
 17: ['', 'b'],  18: ['p', 's'], 19: ['', 's'],  20: ['', 'ss'],
 21: ['ng', ''], 22: ['', 'j'],  23: ['', 'ch'], 24: ['', 'k'],
 25: ['', 't'],  26: ['', 'p'],  27: ['', 'h'],
};

const SILENT_ONSET = 11; // ㅇ

const BASE = 0xac00;
const LAST = 0xd7a3;

export function romanize(input: string): string {
  if (!input) return '';

  const chars = [...input];
  let out = '';
  let carried = ''; // 앞 글자에서 넘어온 첫소리

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const code = ch.codePointAt(0)!;

    if (code >= BASE && code <= LAST) {
      const index = code - BASE;
      const cho = Math.floor(index / 588);
      const jung = Math.floor((index % 588) / 28);
      const jong = index % 28;

      out += carried || CHOSEONG[cho];
      carried = '';
      out += JUNGSEONG[jung];

      if (jong === 0) continue;

      // 다음 글자가 ㅇ 으로 시작하면 받침이 그쪽으로 넘어간다
      const next = chars[i + 1]?.codePointAt(0) ?? 0;
      const nextIsHangul = next >= BASE && next <= LAST;
      const nextOnsetSilent = nextIsHangul && Math.floor((next - BASE) / 588) === SILENT_ONSET;

      if (nextOnsetSilent && LIAISON[jong]) {
        const [stay, move] = LIAISON[jong];
        out += stay;
        carried = move;
      } else {
        out += JONGSEONG[jong];
      }
      continue;
    }

    // 한글이 아닌 글자를 만나면 넘길 소리를 여기서 털어 낸다
    if (carried) { out += carried; carried = ''; }

    // 영문·숫자는 그대로 두고, 띄어쓰기는 살린다.
    if (/[A-Za-z0-9]/.test(ch)) out += ch.toLowerCase();
    else if (/\s/.test(ch)) out += ' ';
    // 그 밖의 문자(기호·한자 등)는 주소에 쓸 수 없어 버린다.
  }

  if (carried) out += carried;
  return out.replace(/\s+/g, ' ').trim();
}
