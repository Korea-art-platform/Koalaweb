import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';

const BTN =
  `w-10 h-10 rounded-full bg-white/95 backdrop-blur border border-gray-200 shadow-sm
   text-gray-500 flex items-center justify-center transition-all
   hover:text-koala-purple hover:border-koala-gold hover:shadow-md
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koala-gold`;

function Tip({ children }: { children: string }) {
  return (
    <span
      className="absolute right-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md
        bg-koala-navy px-2 py-1 text-[11px] font-medium text-white opacity-0 translate-x-1
        transition-all group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none"
    >
      {children}
    </span>
  );
}

export default function QuickMenu() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 400);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div className="fixed z-40 bottom-6 right-6 flex flex-col items-end gap-2">
      <div className="group relative">
        <Tip>1:1 문의</Tip>
        <Link to="/account/inquiry" aria-label="1:1 문의" className={BTN}>
          <MessageCircle className="w-[18px] h-[18px]" />
        </Link>
      </div>

      <div className="group relative">
        <Tip>전화 상담 1833-2817</Tip>
        <a href="tel:18332817" aria-label="전화 상담" className={BTN}>
          <Phone className="w-[18px] h-[18px]" />
        </a>
      </div>

      <div className={`group relative transition-all ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none translate-y-1'}`}>
        <Tip>맨 위로</Tip>
        <button
          type="button"
          aria-label="맨 위로"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={BTN}
        >
          <ArrowUp className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
