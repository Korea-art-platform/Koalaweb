const TEST_SDK = 'https://democpay.payple.kr/js/v1/payment.js';
const PROD_SDK = 'https://cpay.payple.kr/js/v1/payment.js';

declare global {
  interface Window {
    PaypleCpayAuthCheck?: (obj: Record<string, unknown>) => void;
  }
}

let loading: Promise<void> | null = null;

/**
 * 페이플 결제창 스크립트를 한 번만 불러온다.
 *
 * 테스트와 운영이 스크립트 주소부터 다르다. 잘못 섞으면 테스트 키로 운영 결제창이
 * 뜨거나 그 반대가 되는데, 둘 다 조용히 실패한다.
 */
export function loadPayple(isProduction: boolean): Promise<void> {
  if (window.PaypleCpayAuthCheck) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = isProduction ? PROD_SDK : TEST_SDK;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error('결제 모듈을 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export type PaypleRequest = {
  clientKey: string;
  orderId: string;
  amount: number;
  goodsName: string;
  returnUrl: string;
  payerName?: string;
  payerEmail?: string;
  payerHp?: string;
};

/**
 * 결제창을 띄운다.
 *
 * 나이스와 마찬가지로 결과가 Promise 로 돌아오지 않는다. 인증이 끝나면 페이플이
 * 서버의 PCD_RST_URL 로 POST 하고, 서버가 승인한 뒤 브라우저를 돌려보낸다.
 *
 * PCD_PAY_WORK='CERT' 는 "인증만 하고 승인은 서버가 한다"는 뜻이다.
 * 'PAY' 로 두면 결제창이 승인까지 해버려 우리 쪽 금액 대조·재고 확인이 끼어들 자리가 없다.
 */
export function requestPayple(
  request: PaypleRequest,
  onError: (message: string) => void,
): void {
  if (!window.PaypleCpayAuthCheck) {
    onError('결제 모듈이 준비되지 않았습니다.');
    return;
  }

  window.PaypleCpayAuthCheck({
    clientKey: request.clientKey,
    PCD_PAY_TYPE: 'card',
    PCD_PAY_WORK: 'CERT',
    PCD_CARD_VER: '02',
    PCD_PAY_GOODS: request.goodsName,
    PCD_PAY_TOTAL: request.amount,
    PCD_PAY_OID: request.orderId,
    PCD_PAYER_NAME: request.payerName,
    PCD_PAYER_EMAIL: request.payerEmail,
    PCD_PAYER_HP: request.payerHp,
    PCD_RST_URL: request.returnUrl,
    callbackFunction: (result: { PCD_PAY_RST?: string; PCD_PAY_MSG?: string }) => {
      // 성공은 서버가 처리한다. 여기서는 실패만 사용자에게 알린다.
      if (result?.PCD_PAY_RST !== 'success') {
        onError(result?.PCD_PAY_MSG ?? '결제를 진행하지 못했습니다.');
      }
    },
  });
}
