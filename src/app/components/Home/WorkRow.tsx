interface Props {
  children: React.ReactNode;
  columns?: 2 | 4;
}

export default function WorkRow({ children, columns = 4 }: Props) {
  const grid = columns === 2
    ? 'md:grid md:grid-cols-2 md:gap-11'
    : 'md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8';

  return (
    <div
      className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5
        no-scrollbar md:mx-0 md:snap-none md:overflow-visible md:px-0 ${grid}`}
    >
      {children}
    </div>
  );
}

export function WorkCell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      className={`shrink-0 snap-start md:w-auto md:max-w-none md:shrink ${
        wide ? 'w-[78vw] max-w-[320px]' : 'w-[62vw] max-w-[240px]'
      }`}
    >
      {children}
    </div>
  );
}
