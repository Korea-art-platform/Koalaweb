interface Props {
  corner?: 'tr' | 'tl' | 'br' | 'bl';
  className?: string;
}

const CFG: Record<string, string> = {
  tr: 'top-0 right-0 origin-top-right rotate-45',
  tl: 'top-0 left-0 origin-top-left -rotate-45',
  br: 'bottom-0 right-0 origin-bottom-right -rotate-45',
  bl: 'bottom-0 left-0 origin-bottom-left rotate-45',
};

const OBANG = 'linear-gradient(90deg,#d6453f 0 25%,#2b49b5 25% 50%,#eeb600 50% 75%,#5e3b9e 75% 100%)';

export default function CornerAccent({ corner = 'tr', className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={
        `pointer-events-none absolute h-2.5 w-16 rounded-[1px] ` +
        `opacity-40 md:opacity-0 md:group-hover:opacity-100 ` +
        `transition-opacity duration-300 ease-out ${CFG[corner]} ${className}`
      }
      style={{ background: OBANG }}
    />
  );
}
