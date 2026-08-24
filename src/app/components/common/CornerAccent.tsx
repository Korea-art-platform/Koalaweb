interface Props {
  corner?: 'tr' | 'tl' | 'br' | 'bl';
  className?: string;
}

const POS: Record<string, string> = {
  tr: '-top-2.5 -right-7',
  tl: '-top-2.5 -left-7',
  br: '-bottom-2.5 -right-7',
  bl: '-bottom-2.5 -left-7',
};

const OBANG = 'linear-gradient(90deg,#d6453f 0 25%,#2b49b5 25% 50%,#eeb600 50% 75%,#5e3b9e 75% 100%)';

export default function CornerAccent({ corner = 'tr', className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={
        `pointer-events-none absolute h-2.5 w-20 rotate-45 rounded-[2px] ` +
        `opacity-40 md:opacity-0 md:group-hover:opacity-100 ` +
        `transition-opacity duration-300 ease-out ${POS[corner]} ${className}`
      }
      style={{ background: OBANG }}
    />
  );
}
