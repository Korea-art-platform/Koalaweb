import { motion } from 'framer-motion';

interface Props {
  active: boolean;
  size?: number;
  className?: string;
}

export default function WishBookmark({ active, size = 22, className = '' }: Props) {
  return (
    <motion.svg
      width={size}
      height={Math.round((size * 34) / 24)}
      viewBox="0 0 24 34"
      className={className}
      aria-hidden
      initial={false}
      animate={active ? { rotate: [-16, 10, -6, 3, 0], y: [-4, 0, 0, 0, 0] } : { rotate: 0, y: 0 }}
      transition={active ? { duration: 0.6, ease: 'easeOut' } : { duration: 0.15, ease: 'easeOut' }}
      style={{ transformOrigin: '50% 14%', overflow: 'visible' }}
    >
      <circle cx="12" cy="5" r="3" fill="none" stroke={active ? '#5e3b9e' : 'currentColor'} strokeWidth="1.7" />
      <line x1="12" y1="8" x2="12" y2="10.2" stroke={active ? '#5e3b9e' : 'currentColor'} strokeWidth="1.7" strokeLinecap="round" />
      <rect
        x="5.5" y="10.2" width="13" height="20" rx="3"
        fill={active ? '#c9a45c' : 'none'}
        stroke={active ? '#8a6a2e' : 'currentColor'}
        strokeWidth="1.7"
      />
      {active && (
        <g>
          <circle cx="12" cy="16.4" r="2" fill="#3e2259" />
          <path d="M8.6 21.4 q3.4 3 6.8 0" fill="none" stroke="#3e2259" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      )}
    </motion.svg>
  );
}
