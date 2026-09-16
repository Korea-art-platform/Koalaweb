import { describe, it, expect } from 'vitest';
import { videoEmbedUrl, directVideoUrl } from './videoEmbed';

describe('영상 임베드 주소', () => {
  it('유튜브 보기 주소는 임베드 주소로 다시 만든다', () => {
    expect(videoEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    expect(videoEmbedUrl('https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('유튜브 짧은 주소도 임베드 주소가 된다', () => {
    expect(videoEmbedUrl('https://youtu.be/dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('이미 임베드 주소여도 아이디만 뽑아 다시 만든다', () => {
    expect(videoEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('비메오 주소는 플레이어 주소로 다시 만든다', () => {
    expect(videoEmbedUrl('https://vimeo.com/76979871'))
      .toBe('https://player.vimeo.com/video/76979871');
    expect(videoEmbedUrl('https://player.vimeo.com/video/76979871'))
      .toBe('https://player.vimeo.com/video/76979871');
  });

  it('주소 안에 youtube.com 이 섞여 있을 뿐인 남의 주소는 막는다', () => {
    expect(videoEmbedUrl('https://evil.com/?x=youtube.com')).toBeNull();
    expect(videoEmbedUrl('https://evil.com/youtube.com/embed/x')).toBeNull();
    expect(videoEmbedUrl('https://youtube.com.evil.com/watch?v=abc')).toBeNull();
    expect(videoEmbedUrl('https://evil.com/vimeo.com/76979871')).toBeNull();
  });

  it('javascript: 는 막는다', () => {
    expect(videoEmbedUrl('javascript:alert(1)')).toBeNull();
    expect(videoEmbedUrl('javascript:alert("youtube.com/embed/x")')).toBeNull();
  });

  it('알아볼 수 없는 주소와 빈 값은 막는다', () => {
    expect(videoEmbedUrl('https://example.com/video')).toBeNull();
    expect(videoEmbedUrl('')).toBeNull();
    expect(videoEmbedUrl(null)).toBeNull();
    expect(videoEmbedUrl(undefined)).toBeNull();
  });
});

describe('직접 재생 파일 주소', () => {
  it('mp4 · webm 파일은 그대로 쓴다', () => {
    expect(directVideoUrl('https://cdn.example.com/a.mp4')).toBe('https://cdn.example.com/a.mp4');
    expect(directVideoUrl('/media/a.webm')).toBe('/media/a.webm');
  });

  it('http 가 아닌 주소는 막는다', () => {
    expect(directVideoUrl('javascript:alert(1)//a.mp4')).toBeNull();
    expect(directVideoUrl('https://cdn.example.com/a.txt')).toBeNull();
    expect(directVideoUrl('')).toBeNull();
  });
});
