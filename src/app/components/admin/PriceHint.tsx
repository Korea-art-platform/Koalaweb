interface Props {
  listPrice: string;
  salePrice: string;
  /** 대분류가 면세로 표시돼 있는가. 아직 안 골랐으면 undefined. */
  taxExempt?: boolean;
}

const won = (n: number) => n.toLocaleString();

/**
 * 어드민이 넣은 값이 고객에게 얼마로 보이는지 적어 준다.
 *
 * 상품에 저장하는 가격은 부가세를 뺀 공급가액인데, 화면에는 10% 붙은 금액이
 * 나간다. 이 차이를 모르고 "고객에게 33만원으로 보이게" 하려고 330000 을
 * 넣으면 363,000원에 팔린다.
 */
export default function PriceHint({ listPrice, salePrice, taxExempt }: Props) {
  const list = Number(listPrice);
  const sale = Number(salePrice);
  const hasList = listPrice !== '' && !Number.isNaN(list) && list > 0;
  if (!hasList) return null;

  const hasSale = salePrice !== '' && !Number.isNaN(sale) && sale > 0;
  const gross = (v: number) => (taxExempt ? v : Math.round(v * 1.1));

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
      {taxExempt === undefined ? (
        <p className="text-gray-400">대분류를 고르면 고객에게 보이는 금액을 알려드립니다.</p>
      ) : taxExempt ? (
        <p>
          <b className="text-gray-900">면세 분류</b>라 부가세가 붙지 않습니다.
          고객에게 <b className="text-gray-900">₩{won(hasSale ? sale : list)}</b> 로 보입니다.
        </p>
      ) : (
        <p>
          부가세 10%가 붙어 고객에게{' '}
          <b className="text-koala-purple">₩{won(gross(hasSale ? sale : list))}</b> 로 보이고,
          그 금액이 결제됩니다.
          {hasSale && <span className="text-gray-400"> (정가는 ₩{won(gross(list))})</span>}
        </p>
      )}
    </div>
  );
}
