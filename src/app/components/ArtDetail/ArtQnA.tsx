import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

export interface QnAItem {
  id: string;
  question: string;
  answer: string;
}

interface ArtQnAProps {
  items?: QnAItem[];
  contactEmail?: string;
}

const DEFAULT_ITEMS: QnAItem[] = [
  { id: 'q-01', question: '전체 결제 되나요?', answer: '네, 전체 결제가 가능합니다.' },
  { id: 'q-02', question: '해외 배송이 가능한가요?', answer: '현재 국내 배송만 지원하고 있습니다.' },
  { id: 'q-03', question: '호환성 손상이 있어요', answer: '상품 수령 후 7일 이내 고객센터로 문의해 주세요.' },
  { id: 'q-04', question: '대편 명도 들여', answer: '자세한 내용은 고객센터를 통해 확인하실 수 있습니다.' },
  { id: 'q-05', question: '결제 방식', answer: '카드, 계좌이체, 간편결제 등 다양한 방식을 지원합니다.' },
];

export function ArtQnA({ items = DEFAULT_ITEMS, contactEmail = 'help@koala.co.kr' }: ArtQnAProps) {
  return (
    <section className="mb-16">
      <h3 className="text-lg font-semibold mb-1">QnA</h3>
      <p className="text-xs text-gray-400 mb-4">
        궁금한 점은{' '}
        <a href={`mailto:${contactEmail}`} className="underline hover:text-black transition-colors">
          {contactEmail}
        </a>
        로 문의 주세요
      </p>
      <Accordion type="single" collapsible className="border-t border-gray-200">
        {items.map((item, idx) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-sm font-normal py-4 hover:no-underline">
              <span className="text-gray-400 mr-3 text-xs">
                Q-{String(idx + 1).padStart(2, '0')}
              </span>
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-500 pb-4 pl-8">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
