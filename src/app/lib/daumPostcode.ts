declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: { oncomplete: (data: DaumPostcodeData) => void }) => { open: () => void };
    };
  }
}

interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
}

export interface PostcodeResult {
  zipCode: string;
  address: string;
}

const SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
let loadingPromise: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loadingPromise = null;
      reject(new Error('주소 검색 스크립트를 불러오지 못했습니다.'));
    };
    document.head.appendChild(s);
  });
  return loadingPromise;
}

export async function openAddressSearch(onComplete: (result: PostcodeResult) => void) {
  await ensureLoaded();
  if (!window.daum?.Postcode) throw new Error('주소 검색을 사용할 수 없습니다.');
  new window.daum.Postcode({
    oncomplete: (data) => {
      onComplete({
        zipCode: data.zonecode,
        address: data.roadAddress || data.jibunAddress,
      });
    },
  }).open();
}
