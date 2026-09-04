interface Props {
  className?: string;
}

function Corner({ pos }: { pos: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      className={`absolute text-koala-purple ${pos}`}
    >
      <path d="M3 29 V3 H29" />
      <path d="M3 15 H15 V3" />
    </svg>
  );
}

export default function WindowFrame({ className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-[inherit] border-[3px] border-koala-purple/85 ${className}`}
    >
      <Corner pos="top-2 left-2" />
      <Corner pos="top-2 right-2 rotate-90" />
      <Corner pos="bottom-2 right-2 rotate-180" />
      <Corner pos="bottom-2 left-2 -rotate-90" />
    </span>
  );
}
