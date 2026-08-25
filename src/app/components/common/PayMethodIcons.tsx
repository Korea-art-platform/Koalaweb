import type { PayMethod } from '@/app/lib/pg';

interface IconProps {
  size?: number;
}

export function CardIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#3E2259" />
      <rect x="10" y="15" width="28" height="18" rx="3" fill="white" />
      <rect x="10" y="19" width="28" height="4" fill="#3E2259" />
      <rect x="14" y="28" width="8" height="2.5" rx="1.25" fill="#3E2259" />
    </svg>
  );
}

export function BankTransferIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#F2F4F6" />
      <path d="M24 10L38 19H10L24 10Z" fill="#4E5968" />
      <rect x="13" y="21" width="4" height="12" rx="1" fill="#4E5968" />
      <rect x="22" y="21" width="4" height="12" rx="1" fill="#4E5968" />
      <rect x="31" y="21" width="4" height="12" rx="1" fill="#4E5968" />
      <rect x="10" y="34" width="28" height="3" rx="1.5" fill="#4E5968" />
    </svg>
  );
}

export function MobileIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#F2F4F6" />
      <rect x="16" y="10" width="16" height="28" rx="3" fill="#4E5968" />
      <rect x="19" y="13" width="10" height="18" rx="1" fill="#F2F4F6" />
      <circle cx="24" cy="34.5" r="1.5" fill="#F2F4F6" />
    </svg>
  );
}

export function TossPayIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0064FF" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fill="white" fontSize="22" fontWeight="800" fontFamily="'Pretendard','Apple SD Gothic Neo',sans-serif"
        letterSpacing="-1">
        toss
      </text>
    </svg>
  );
}

export function KakaoPayIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FFEB00" />
      <path
        d="M24 12.5c-6.35 0-11.5 3.86-11.5 8.63 0 3.04 2.09 5.71 5.24 7.25l-1.25 4.6c-.12.44.36.8.75.55l5.5-3.56c.41.03.83.05 1.26.05 6.35 0 11.5-3.87 11.5-8.64S30.35 12.5 24 12.5Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

export function NaverPayIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#03C75A" />
      <path d="M15 15h6.6l5.4 8.1V15H33v18h-6.6l-5.4-8.1V33H15V15Z" fill="white" />
    </svg>
  );
}

export function payMethodIcon(id: PayMethod, size = 48) {
  switch (id) {
    case 'TOSSPAY':
      return <TossPayIcon size={size} />;
    case 'KAKAOPAY':
      return <KakaoPayIcon size={size} />;
    case 'NAVERPAY':
      return <NaverPayIcon size={size} />;
    case 'TRANSFER':
      return <BankTransferIcon size={size} />;
    case 'MOBILE_PHONE':
      return <MobileIcon size={size} />;
    default:
      return <CardIcon size={size} />;
  }
}
