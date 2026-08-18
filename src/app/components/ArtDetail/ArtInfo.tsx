import { SHIPPING_SUMMARY_TEXT } from '@/app/lib/shipping';
export interface ArtInfoItem {
  label: string;
  value: string;
}

interface ArtInfoProps {
  items: ArtInfoItem[];
}

export const SHIPPING_FEE_TEXT = SHIPPING_SUMMARY_TEXT;

export function ArtInfo({ items }: ArtInfoProps) {
  return (
    <section className="mb-16">
      <h3 className="text-lg font-semibold mb-4">작품 소개</h3>
      <div className="border-t border-gray-200">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-6 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-400 w-24 flex-shrink-0">{item.label}</span>
            <span className="text-sm text-gray-700">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
