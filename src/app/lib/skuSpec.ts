/**
 * 작품 규격 표기.
 *
 * 관리자는 가로·세로·높이를 mm 로 넣고 서버에는 cm 로 저장된다. 무게는 g 로 저장된다.
 * 화면마다 따로 조립하다가 세로가 빠지거나 무게가 늘 "-" 로 나왔다. 한 곳에서 만든다.
 */

function trim(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** 가로 × 세로 × 높이. 값이 있는 것만 그 순서로 잇는다. */
export function sizeText(widthCm?: unknown, depthCm?: unknown, heightCm?: unknown): string | null {
  const parts = [num(widthCm), num(depthCm), num(heightCm)].filter((v): v is number => v !== null);
  if (parts.length === 0) return null;
  return `${parts.map(trim).join(' × ')}cm`;
}

/** 무게. g 로 저장된 값을 쓰고, 1kg 이상이면 kg 로 읽기 쉽게 바꾼다. */
export function weightText(weightG?: unknown, weightKg?: unknown): string | null {
  const grams = num(weightG);
  if (grams !== null) {
    return grams >= 1000 ? `${trim(grams / 1000)}kg` : `${trim(grams)}g`;
  }
  const kilos = num(weightKg);
  return kilos === null ? null : `${trim(kilos)}kg`;
}
