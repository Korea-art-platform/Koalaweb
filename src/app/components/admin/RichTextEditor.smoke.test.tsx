import { describe, it, expect } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { noticeToSafeHtml } from '@/app/lib/html';

function editorWith(html: string) {
  return new Editor({
    element: document.createElement('div'),
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: html,
  });
}

describe('공지 에디터', () => {
  it('저장된 서식을 잃지 않고 되살린다', () => {
    const source = '<h2>공지 제목</h2><p><strong>굵게</strong>와 <em>기울임</em></p><ul><li>항목</li></ul>';
    const out = editorWith(source).getHTML();

    expect(out).toContain('<h2>공지 제목</h2>');
    expect(out).toContain('<strong>굵게</strong>');
    expect(out).toContain('<em>기울임</em>');
    expect(out).toContain('<li>');
  });

  it('이미지와 링크 확장이 붙어 있다', () => {
    const out = editorWith('<p><a href="https://example.com">링크</a></p><img src="https://example.com/a.png">').getHTML();

    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('src="https://example.com/a.png"');
  });

  it('에디터가 스키마에 없는 속성을 떨군다', () => {
    const out = editorWith('<p onclick="alert(1)">본문</p><script>alert(2)</script>').getHTML();

    expect(out).not.toContain('onclick');
    expect(out).not.toContain('<script');
    expect(out).toContain('본문');
  });

  it('정화기는 에디터와 무관하게 혼자서도 막는다', () => {
    const safe = noticeToSafeHtml(
      '<p onclick="alert(1)">본문</p><script>alert(2)</script><a href="javascript:alert(3)">링크</a>',
    );

    expect(safe).not.toContain('onclick');
    expect(safe).not.toContain('<script');
    expect(safe).not.toContain('javascript:');
    expect(safe).toContain('본문');
  });
});
