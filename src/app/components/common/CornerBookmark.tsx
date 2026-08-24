interface Props {
  corner?: 'tr' | 'tl';
  className?: string;
}

export default function CornerBookmark({ corner = 'tr', className = '' }: Props) {
  const isR = corner === 'tr';
  const rot = isR ? 34 : -34;
  return (
    <span
      aria-hidden
      className={
        `pointer-events-none absolute z-10 -top-4 ${isR ? '-right-1' : '-left-1'} ` +
        `opacity-45 md:opacity-0 md:group-hover:opacity-100 ` +
        `-translate-y-1 md:group-hover:translate-y-0 ` +
        `transition-all duration-300 ease-out ${className}`
      }
    >
      <svg width="26" height="58" viewBox="0 0 26 58" style={{ overflow: 'visible' }}>
        <g transform={`rotate(${rot} 13 6)`}>
          <circle cx="13" cy="6" r="3.4" fill="none" stroke="#5e3b9e" strokeWidth="1.8" />
          <line x1="13" y1="9.4" x2="13" y2="12" stroke="#5e3b9e" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="5.5" y="12" width="15" height="40" rx="3.4" fill="#c9a45c" stroke="#8a6a2e" strokeWidth="1.8" />
          <circle cx="13" cy="21" r="2.2" fill="#3e2259" />
          <path d="M9 26.5 q4 3.4 8 0" fill="none" stroke="#3e2259" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  );
}
