export interface ArtInfoItem {
  label: string;
  value: string;
}

interface ArtInfoProps {
  items?: ArtInfoItem[];
}

const DEFAULT_ITEMS: ArtInfoItem[] = [
  { label: '소재', value: '철, 알루미늄' },
  { label: '크기', value: '25cm × 5 × 25cm' },
  { label: '무게', value: '100g' },
  { label: '배달비용', value: '300원' },
];

export function ArtInfo({ items = DEFAULT_ITEMS }: ArtInfoProps) {
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
