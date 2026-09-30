type Node = Record<string, unknown>;

const MAX_DEPTH = 8;

function hasText(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== '';
}

const SKU_FIELDS: [string, string, string][] = [
  ['name', 'nameEn', 'nameKo'],
  ['model', 'modelEn', 'modelKo'],
  ['subModelName', 'subModelNameEn', 'subModelNameKo'],
  ['color', 'colorEn', 'colorKo'],
];

function swap(node: Node) {
  if (typeof node.skuCode === 'string') {
    for (const [field, en, ko] of SKU_FIELDS) {
      if (hasText(node[en]) && typeof node[field] === 'string') {
        node[ko] = node[field];
        node[field] = node[en];
      }
    }
  }
  if (hasText(node.skuNameEn) && typeof node.skuName === 'string') {
    node.skuNameKo = node.skuName;
    node.skuName = node.skuNameEn;
  }
}

function walk(value: unknown, depth: number) {
  if (depth > MAX_DEPTH || value === null || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) walk(item, depth + 1);
    return;
  }
  const node = value as Node;
  swap(node);
  for (const key of Object.keys(node)) walk(node[key], depth + 1);
}

export function localizeNames<T>(data: T, english: boolean): T {
  if (english) walk(data, 0);
  return data;
}
