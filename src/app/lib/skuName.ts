export function skuDisplayName(species: string, model: string): string {
  const s = species.trim();
  const m = model.trim();
  if (!m) return s;
  if (!s || m.toLowerCase().includes(s.toLowerCase())) return m;
  return `${s} ${m}`;
}
