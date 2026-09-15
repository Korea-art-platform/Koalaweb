import { describe, it, expect } from 'vitest';
import { skuDisplayName } from './skuName';

describe('skuDisplayName', () => {
  it('모델에 종 이름이 들어 있으면 모델 이름만 쓴다', () => {
    expect(skuDisplayName('해피토마', '빨강색 해피토마')).toBe('빨강색 해피토마');
  });

  it('모델에 종 이름이 없으면 종을 앞에 붙인다', () => {
    expect(skuDisplayName('순정남', '블루')).toBe('순정남 블루');
  });

  it('영문은 대소문자를 가리지 않는다', () => {
    expect(skuDisplayName('HappyToma', 'red happytoma')).toBe('red happytoma');
  });

  it('모델이 비면 종 이름을 쓴다', () => {
    expect(skuDisplayName('해피토마', '  ')).toBe('해피토마');
  });

  it('앞뒤 공백을 지운다', () => {
    expect(skuDisplayName(' 순정남 ', ' 블루 ')).toBe('순정남 블루');
  });
});
