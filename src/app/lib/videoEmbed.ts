import { safeHttpUrl } from './safeUrl';

const YOUTUBE_HOSTS = ['www.youtube.com', 'youtube.com'];
const VIMEO_HOSTS = ['vimeo.com', 'player.vimeo.com'];

const YOUTUBE_ID = /^[A-Za-z0-9_-]{1,64}$/;
const VIMEO_ID = /^[0-9]{1,20}$/;

function parseHttpUrl(value: string): URL | null {
  const safe = safeHttpUrl(value);
  if (!safe) return null;
  try {
    return new URL(safe);
  } catch {
    return null;
  }
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

export function youtubeEmbedUrl(value?: string | null): string | null {
  if (!value) return null;

  const url = parseHttpUrl(value);
  if (!url) return null;

  let id = '';
  if (url.hostname === 'youtu.be') {
    id = trimSlashes(url.pathname);
  } else if (YOUTUBE_HOSTS.includes(url.hostname)) {
    const path = trimSlashes(url.pathname);
    const [head, tail] = path.split('/');
    if (path === 'watch') id = url.searchParams.get('v') ?? '';
    else if ((head === 'embed' || head === 'shorts' || head === 'v') && tail) id = tail;
  }

  if (!YOUTUBE_ID.test(id)) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function vimeoEmbedUrl(value?: string | null): string | null {
  if (!value) return null;

  const url = parseHttpUrl(value);
  if (!url) return null;
  if (!VIMEO_HOSTS.includes(url.hostname)) return null;

  const [head, tail] = trimSlashes(url.pathname).split('/');
  const id = url.hostname === 'player.vimeo.com' ? (head === 'video' ? tail : '') : head;

  if (!id || !VIMEO_ID.test(id)) return null;
  return `https://player.vimeo.com/video/${id}`;
}

export function videoEmbedUrl(value?: string | null): string | null {
  return youtubeEmbedUrl(value) ?? vimeoEmbedUrl(value);
}

export function directVideoUrl(value?: string | null): string | null {
  if (!value) return null;

  const raw = value.trim();
  if (!/\.(mp4|webm)$/i.test(raw)) return null;
  if (raw.startsWith('/')) return raw;
  return safeHttpUrl(raw);
}
