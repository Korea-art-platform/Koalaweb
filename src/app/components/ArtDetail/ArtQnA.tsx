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

export function ArtQnA({ items = [], contactEmail = 'koala-art@heron.kr' }: ArtQnAProps) {
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
      {items.length === 0 ? (
        <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-400">
          아직 등록된 문의가 없습니다. 궁금한 점은 위 이메일로 문의해 주세요.
        </div>
      ) : (
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
      )}
    </section>
  );
}
