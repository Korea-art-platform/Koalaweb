export interface CareerItem {
  year: string;
  content: string;
}

interface ArtistCareerProps {
  items?: CareerItem[];
}

const DEFAULT_ITEMS: CareerItem[] = [
  { year: '년도', content: '출생' },
  { year: '년도', content: '내용' },
  { year: '년도', content: '내용' },
  { year: '년도', content: '내용' },
  { year: '년도', content: '진행' },
];

export function ArtistCareer({ items = DEFAULT_ITEMS }: ArtistCareerProps) {
  return (
    <section className="mb-16">
      <h3 className="text-lg font-semibold mb-4">연혁</h3>
      <div className="border-t border-gray-200">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-6 py-3 border-b border-gray-100">
            <span className="text-sm text-gray-400 w-16 flex-shrink-0">{item.year}</span>
            <span className="text-sm text-gray-700">{item.content}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
