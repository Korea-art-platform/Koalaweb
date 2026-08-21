import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
  'h1', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a', 'img', 'blockquote', 'hr', 'span', 'code', 'pre',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'target', 'rel'];

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/)/i,
  });
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  const text = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return text.replace(/\s+/g, ' ').trim();
}

export function isHtmlEmpty(html: string | null | undefined): boolean {
  return stripHtml(html).length === 0;
}

export function noticeToSafeHtml(content: string | null | undefined): string {
  if (!content) return '';
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const prepared = looksHtml ? content : content.replace(/\n/g, '<br>');
  return sanitizeHtml(prepared);
}
