export function safeHttpUrl(value?: string | null): string | null {
  if (!value) return null;

  const raw = value.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return raw;
  } catch {
    return null;
  }
}
