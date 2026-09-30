import { describe, expect, it } from 'vitest';
import { localizeNames } from './localizeNames';

describe('localizeNames', () => {
  it('영어일 때 상품명과 장바구니 상품명을 영문명으로 바꾼다', () => {
    const data = {
      data: {
        content: [
          { skuCode: 'A', name: '빨강색 해피토마', nameEn: 'Red Happytoma', model: '해피토마', modelEn: 'Happytoma' },
          { skuCode: 'B', name: '순정남', nameEn: null },
        ],
        items: [{ skuCode: 'A', skuName: '빨강색 해피토마', skuNameEn: 'Red Happytoma' }],
      },
    };

    localizeNames(data, true);

    expect(data.data.content[0]).toMatchObject({ name: 'Red Happytoma', nameKo: '빨강색 해피토마', model: 'Happytoma' });
    expect(data.data.content[1].name).toBe('순정남');
    expect(data.data.items[0]).toMatchObject({ skuName: 'Red Happytoma', skuNameKo: '빨강색 해피토마' });
  });

  it('한국어일 때나 상품이 아닌 항목은 그대로 둔다', () => {
    const sku = { skuCode: 'A', name: '빨강색 해피토마', nameEn: 'Red Happytoma' };
    localizeNames(sku, false);
    expect(sku.name).toBe('빨강색 해피토마');

    const category = { code: 'ORIGINAL', name: '원작', nameEn: 'Original' };
    localizeNames(category, true);
    expect(category.name).toBe('원작');
  });

  it('영어일 때 작가 이름을 영문으로 바꾸고, 상품 안의 작가 코드는 상품명으로 착각하지 않는다', () => {
    const data = {
      artists: [{ artistCode: 'P1', name: '박준상', nameEn: 'Park Junsang' }, { artistCode: 'K1', name: '김원근', nameEn: null }],
      sku: { skuCode: 'A', artistCode: 'P1', name: '버즈', nameEn: 'Birds', artistName: '박준상', artistNameEn: 'Park Junsang' },
    };

    localizeNames(data, true);

    expect(data.artists[0]).toMatchObject({ name: 'Park Junsang', nameKo: '박준상' });
    expect(data.artists[1].name).toBe('김원근');
    expect(data.sku).toMatchObject({ name: 'Birds', artistName: 'Park Junsang', artistNameKo: '박준상' });
  });

  it('영문명이 공백이면 한글명을 유지한다', () => {
    const sku = { skuCode: 'A', name: '해피토마', nameEn: '  ' };
    localizeNames(sku, true);
    expect(sku.name).toBe('해피토마');
  });
});
