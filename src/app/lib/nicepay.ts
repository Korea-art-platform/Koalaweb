const SDK_URL = 'https://pay.nicepay.co.kr/v1/js/';

declare global {
  interface Window {
    AUTHNICE?: {
      requestPay: (options: Record<string, unknown>) => void;
    };
  }
}

let loading: Promise<void> | null = null;

/**
 * 나이스 결제창 스크립트를 한 번만 불러온다.
 *
 * 결제 버튼을 두 번 누르거나 화면을 오갈 때마다 script 태그가 늘어나면
 * AUTHNICE 가 여러 번 초기화된다. 로딩 Promise 를 재사용해 한 번만 붙인다.
 */
export function loadNicePay(): Promise<void> {
  if (window.AUTHNICE) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SDK_URL;
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

export type NicePayMethod = 'card' | 'bank' | 'cellphone' | 'kakaopay' | 'naverpayCard';

export type NicePayRequest = {
  clientId: string;
  method: NicePayMethod;
  orderId: string;
  amount: number;
  goodsName: string;
  returnUrl: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerTel?: string;
};

/**
 * 결제창을 띄운다.
 *
 * 토스와 달리 결과가 Promise 로 돌아오지 않는다. 인증이 끝나면 나이스가
 * **서버의 returnUrl 로 POST** 하고, 서버가 승인을 마친 뒤 브라우저를 돌려보낸다.
 * 그래서 여기서는 "성공"을 알 수 없고, 실패 콜백(fnError)만 받는다.
 */
export function requestNicePay(
  request: NicePayRequest,
  onError: (message: string) => void,
): void {
  if (!window.AUTHNICE) {
    onError('결제 모듈이 준비되지 않았습니다.');
    return;
  }
  window.AUTHNICE.requestPay({
    ...request,
    fnError: (result: { errorMsg?: string; msg?: string }) => {
      onError(result?.errorMsg ?? result?.msg ?? '결제를 진행하지 못했습니다.');
    },
  });
}
