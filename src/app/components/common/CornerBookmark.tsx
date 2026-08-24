interface Props {
  className?: string;
}

export default function CornerBookmark({ className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 -top-4 right-[20%] ${className}`}
    >
      <span className="koala-bm-swing block">
        <svg width="30" height="70" viewBox="0 0 30 70" style={{ overflow: 'visible' }}>
          <circle cx="15" cy="6" r="3.6" fill="none" stroke="#5e3b9e" strokeWidth="1.9" />
          <line x1="15" y1="9.6" x2="15" y2="12.4" stroke="#5e3b9e" strokeWidth="1.9" strokeLinecap="round" />
          <rect x="6.5" y="12.4" width="17" height="50" rx="3.6" fill="#c9a45c" stroke="#8a6a2e" strokeWidth="1.9" />
          <g fill="#e79aa8">
            <circle cx="11" cy="22" r="1.7" />
            <circle cx="19" cy="26" r="1.7" />
          </g>
          <circle cx="15" cy="40" r="2.4" fill="#3e2259" />
          <path d="M10.6 46 q4.4 3.6 8.8 0" fill="none" stroke="#3e2259" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}
