import {
  FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT, FREE_SHIPPING_THRESHOLD_TEXT, SHIPPING_FEE_AMOUNT_TEXT,
} from '@/app/lib/shipping';
import { PAY_METHOD_SENTENCE, PG_DISPLAY_NAME } from '@/app/lib/pgInfo';

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  label: string;
  items: FaqItem[];
}

export const FAQS: FaqCategory[] = [
  {
    label: '주문 · 결제',
    items: [
      {
        q: '어떤 결제 수단을 지원하나요?',
        a: `${PAY_METHOD_SENTENCE}를 지원합니다. 결제는 ${PG_DISPLAY_NAME}의 보안 결제창에서 처리되며, 카드 정보는 KOALA에 저장되지 않습니다.`,
      },
      {
        q: '주문 후 취소는 언제까지 가능한가요?',
        a: '상품 준비 시작 전까지 마이페이지 > 주문 내역에서 직접 취소하실 수 있습니다. 배송이 시작된 이후에는 교환/반품 절차를 이용해 주세요.',
      },
      {
        q: '세금계산서 또는 현금영수증 발급이 가능한가요?',
        a: '현금영수증은 결제 완료 후 고객센터(koala-art@heron.kr)로 요청 시 발급 가능합니다. 사업자 세금계산서는 현재 별도 문의 부탁드립니다.',
      },
    ],
  },
  {
    label: '배송',
    items: [
      {
        q: '배송은 얼마나 걸리나요?',
        a: '결제 완료 후 영업일 기준 1~2일 내 출고되며, 출고 후 2~3일 내 수령 가능합니다. 한정판 및 특수 포장 상품은 최대 5~7일이 소요될 수 있습니다.',
      },
      {
        q: '배송비는 얼마인가요?',
        a: `${FREE_SHIPPING_THRESHOLD_TEXT} 이상 구매 시 무료 배송이 적용됩니다. ${FREE_SHIPPING_THRESHOLD_TEXT} 미만 구매 시 배송비 ${SHIPPING_FEE_AMOUNT_TEXT}원이 부과됩니다. 제주 및 도서산간 지역은 추가 배송비(3,000~5,000원)가 발생할 수 있습니다.`,
      },
      {
        q: '해외 배송이 가능한가요?',
        a: '현재 국내 배송만 지원합니다. 글로벌 배송 서비스는 준비 중으로, 서비스 오픈 시 공지사항을 통해 안내드리겠습니다.',
      },
    ],
  },
  {
    label: '교환 · 반품',
    items: [
      {
        q: '교환 및 반품 신청은 어떻게 하나요?',
        a: '상품 수령 후 7일 이내에 마이페이지 > 주문 내역에서 신청하거나 고객센터(koala-art@heron.kr)로 문의해 주세요. 상품 상태 확인 후 처리 안내를 드립니다.',
      },
      {
        q: '환불은 언제 처리되나요?',
        a: '반품 상품 회수 및 확인 후 영업일 기준 3~5일 이내 결제 수단으로 환불 처리됩니다. 카드 결제의 경우 카드사 정책에 따라 환불 반영 시점이 다를 수 있습니다.',
      },
      {
        q: '어떤 경우 교환/반품이 불가한가요?',
        a: '수령 후 7일이 경과한 경우, 고객 과실로 상품이 훼손된 경우, 포장이 개봉되거나 사용 흔적이 있는 경우, 한정판 에디션 번호가 훼손된 경우에는 교환/반품이 제한될 수 있습니다.',
      },
    ],
  },
  {
    label: '회원 · 계정',
    items: [
      {
        q: '소셜 로그인과 일반 계정을 함께 사용할 수 있나요?',
        a: '동일한 이메일로 가입된 소셜 계정과 일반 계정은 별도의 계정으로 관리됩니다. 계정 통합이 필요하신 경우 고객센터로 문의해 주세요.',
      },
      {
        q: '회원 탈퇴는 어떻게 하나요?',
        a: '마이페이지 > 설정에서 탈퇴 신청이 가능합니다. 탈퇴 시 위시리스트 등 계정 데이터는 복구되지 않으며, 진행 중인 주문이 있는 경우 탈퇴가 제한됩니다.',
      },
    ],
  },
  {
    label: '작품 · 아티스트',
    items: [
      {
        q: '작품의 진품 여부는 어떻게 확인하나요?',
        a: 'KOALA의 모든 작품은 KOALA가 작가와 직접 계약해 제작하거나 확보한 뒤 등록합니다. 한정판 에디션에는 작가 서명과 에디션 번호가 담긴 진품 보증서가 함께 제공됩니다.',
      },
      {
        q: '한정판(Limited Edition)이란 무엇인가요?',
        a: '작가와 협의해 제작 수량을 한정한 에디션 작품입니다. 각 작품마다 고유 에디션 번호(예: 5/50)가 부여되며, 수량 소진 후에는 재입고되지 않습니다.',
      },
      {
        q: 'KOALA와 함께 작업하고 싶은 작가입니다.',
        a: 'koala-art@heron.kr로 포트폴리오와 함께 연락 주시면 검토 후 안내드리겠습니다.',
      },
    ],
  },
];

export const FAQS_EN: FaqCategory[] = [
  {
    label: 'Orders & payment',
    items: [
      {
        q: 'Which payment methods do you accept?',
        a: 'Credit and debit cards, Kakao Pay, Naver Pay, bank transfer, and mobile phone billing. Payments are processed in a secure checkout window run by our payment provider, and KOALA never stores your card details.',
      },
      {
        q: 'Until when can I cancel an order?',
        a: 'You can cancel it yourself under My page > Orders until we start preparing it. Once it has shipped, please use the exchange and return process instead.',
      },
      {
        q: 'Can I get a cash receipt or tax invoice?',
        a: 'Cash receipts are available on request after payment — email koala-art@heron.kr. For business tax invoices, please contact us directly.',
      },
    ],
  },
  {
    label: 'Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Orders ship within 1–2 business days of payment and usually arrive 2–3 days after that. Limited editions and specially packed items can take up to 5–7 days.',
      },
      {
        q: 'How much is shipping?',
        a: `Shipping is free on orders of ₩${FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT} or more. Below that, a shipping fee of ₩${SHIPPING_FEE_AMOUNT_TEXT} applies. Jeju and remote islands may add ₩3,000–5,000.`,
      },
      {
        q: 'Do you ship internationally?',
        a: 'We currently ship within Korea only. International shipping is in preparation, and we will announce it on the Notices page when it opens.',
      },
    ],
  },
  {
    label: 'Exchanges & returns',
    items: [
      {
        q: 'How do I request an exchange or return?',
        a: 'Within 7 days of delivery, request it under My page > Orders or email koala-art@heron.kr. We will check the item and guide you through the next steps.',
      },
      {
        q: 'When will I get my refund?',
        a: 'Refunds are issued to your original payment method within 3–5 business days after we receive and inspect the returned item. Card refunds may take longer depending on your card issuer.',
      },
      {
        q: 'When are exchanges or returns not possible?',
        a: 'When more than 7 days have passed since delivery, the item was damaged by the customer, the packaging was opened or the item shows signs of use, or a limited edition number has been damaged.',
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        q: 'Can I use a social login and a regular account together?',
        a: 'Social and regular accounts are managed separately, even if they share an email address. Contact us if you need them merged.',
      },
      {
        q: 'How do I delete my account?',
        a: 'You can request it under My page > Settings. Account data such as your wishlist cannot be recovered, and you cannot delete your account while an order is in progress.',
      },
    ],
  },
  {
    label: 'Works & artists',
    items: [
      {
        q: 'How do I know a work is authentic?',
        a: 'Every work on KOALA is produced or acquired by KOALA under a direct agreement with the artist before it is listed. Limited editions come with a certificate of authenticity bearing the artist\'s signature and edition number.',
      },
      {
        q: 'What is a limited edition?',
        a: 'A work produced in a fixed quantity agreed with the artist. Each piece carries its own edition number (for example, 5/50), and it is not restocked once sold out.',
      },
      {
        q: 'I am an artist and would like to work with KOALA.',
        a: 'Send your portfolio to koala-art@heron.kr and we will get back to you after reviewing it.',
      },
    ],
  },
];

const HOME_FAQ_POSITIONS: [number, number][] = [[1, 0], [1, 1], [2, 0], [2, 1]];

function pick(source: FaqCategory[]): FaqItem[] {
  return HOME_FAQ_POSITIONS
    .map(([category, item]) => source[category]?.items[item])
    .filter((item): item is FaqItem => item != null);
}

export function faqsFor(english: boolean): FaqCategory[] {
  return english ? FAQS_EN : FAQS;
}

export function homeFaqsFor(english: boolean): FaqItem[] {
  return pick(faqsFor(english));
}

export const HOME_FAQS: FaqItem[] = pick(FAQS);
