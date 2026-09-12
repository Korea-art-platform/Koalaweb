// 누끼 이미지에서 제품 색을 뽑아 히어로 배경용으로 한 톤 누른다

export type Rgb = [number, number, number];

type Bin = { n: number; r: number; g: number; b: number };

export function rgbToHsl(r: number, g: number, b: number): Rgb {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [h * 60, s, l];
}

export function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
      : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// 상대 휘도 — 흰 글씨 대비를 따질 때 쓴다
export function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = ([r, g, b]: Rgb) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

// 색상 24칸 + 무채색 3칸(어두움·중간·밝음) — 같은 색의 명암은 한 칸에 모인다
function bucketOf(r: number, g: number, b: number): number {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (s < 0.18 || l < 0.08 || l > 0.94) return 100 + Math.min(2, Math.floor(l * 3));
  return Math.floor(h / 15);
}

// 불투명한 픽셀 중 가장 많은 칸의 평균색
export function dominantColor(data: ArrayLike<number>): Rgb | null {
  const bins = new Map<number, Bin>();
  for (let i = 0; i + 3 < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = bucketOf(r, g, b);
    const bin = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bin.n += 1;
    bin.r += r;
    bin.g += g;
    bin.b += b;
    bins.set(key, bin);
  }
  let best: Bin | null = null;
  for (const bin of bins.values()) {
    if (!best || bin.n > best.n) best = bin;
  }
  if (!best) return null;
  return [Math.round(best.r / best.n), Math.round(best.g / best.n), Math.round(best.b / best.n)];
}

// 이미지를 64px 로 줄여 제품 색을 뽑는다
export function pickProductColor(img: CanvasImageSource, width: number, height: number): Rgb | null {
  if (!width || !height) return null;
  const scale = 64 / Math.max(width, height);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  return dominantColor(ctx.getImageData(0, 0, w, h).data);
}

// 채도를 낮추고 흰 글씨가 읽히는 밝기(휘도 0.17 이하)까지 누른다
export function softenColor([r, g, b]: Rgb): string {
  const [h, s, l] = rgbToHsl(r, g, b);
  const s2 = Math.min(s * 0.6, 0.5);
  let l2 = Math.min(Math.max(l * 0.85, 0.2), 0.45);
  let rgb = hslToRgb(h, s2, l2);
  while (luminance(rgb) > 0.17 && l2 > 0.2) {
    l2 -= 0.02;
    rgb = hslToRgb(h, s2, l2);
  }
  return toHex(rgb);
}
