import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Bell,
  Headset,
  Home,
  Menu,
  Palette,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  X,
} from 'lucide-react';

export type WheelItem = {
  key: string;
  label: string;
  to: string;
  icon: typeof Home;
  auth?: boolean;
};

export const WHEEL_ITEMS: WheelItem[] = [
  { key: 'home', label: '홈', to: '/', icon: Home },
  { key: 'lab', label: '작가의 연구소', to: '/artist-lab', icon: Palette },
  { key: 'store', label: '스마트 스토어', to: '/store', icon: ShoppingBag },
  { key: 'stores', label: '입점 매장', to: '/stores', icon: Store },
  { key: 'notice', label: '공지사항', to: '/notice', icon: Bell },
  { key: 'contact', label: '고객센터', to: '/contact', icon: Headset },
  { key: 'cart', label: '장바구니', to: '/cart', icon: ShoppingCart, auth: true },
  { key: 'account', label: '마이페이지', to: '/account/orders', icon: User, auth: true },
];

const N = WHEEL_ITEMS.length;
const STEP = 360 / N;

const norm = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

export default function WheelNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [turn, setTurn] = useState(0);
  const snapTimer = useRef<number | null>(null);
  const dragging = useRef(false);
  const lastNav = useRef<string | null>(null);

  const index = ((Math.round(turn) % N) + N) % N;

  useEffect(() => {
    const at = WHEEL_ITEMS.findIndex((i) => i.to === location.pathname);
    if (at >= 0) {
      lastNav.current = location.pathname;
      if (!dragging.current) setTurn(at);
    }
  }, [location.pathname]);

  const snap = useCallback(() => {
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      setTurn((t) => {
        const r = Math.round(t);
        const item = WHEEL_ITEMS[((r % N) + N) % N];
        if (!item.auth && item.to !== lastNav.current) {
          lastNav.current = item.to;
          navigate(item.to);
        }
        return r;
      });
    }, 220);
  }, [navigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowUp') { setTurn((t) => Math.round(t) - 1); snap(); }
      if (e.key === 'ArrowDown') { setTurn((t) => Math.round(t) + 1); snap(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, snap]);

  const onWheel = (e: React.WheelEvent) => {
    if (!open) return;
    setTurn((t) => t + e.deltaY * 0.005);
    snap();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!open) return;
    const startY = e.clientY;
    let startTurn = 0;
    setTurn((t) => { startTurn = t; return t; });
    dragging.current = true;
    let moved = false;

    const move = (ev: PointerEvent) => {
      const d = (ev.clientY - startY) * 0.012;
      if (Math.abs(ev.clientY - startY) > 3) moved = true;
      setTurn(startTurn + d);
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (moved) snap();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[200] pointer-events-none
      [--wn-r:8rem] sm:[--wn-r:10rem] lg:[--wn-r:11.5rem]">
      <div
        className={open ? 'relative pointer-events-auto touch-none' : 'relative pointer-events-none'}
        style={{
          width: 'calc(var(--wn-r) * 2)',
          height: 'calc(var(--wn-r) * 2)',
          marginRight: 'calc(1.75rem - var(--wn-r))',
        }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
      >
        <div
          aria-hidden
          className={`absolute inset-0 rounded-full transition-all duration-500 ease-out
            ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{
            background:
              'radial-gradient(circle at 68% 50%, rgba(74,43,105,.97), rgba(48,25,72,.95) 70%)',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 24px 70px rgba(31,16,46,.45)',
          }}
        />

        <div className="absolute" style={{ left: '50%', top: '50%', width: 0, height: 0 }}>
        <div
          aria-hidden
          className={`absolute rounded-full border border-dashed border-koala-gold/30 transition-all duration-500
            ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{
            width: 'calc(var(--wn-r) * 1.42)',
            height: 'calc(var(--wn-r) * 1.42)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {WHEEL_ITEMS.map((item, i) => {
          const deg = (i - turn) * STEP;
          const n = norm(deg);
          const away = Math.abs(n) / 100;
          const fade = Math.max(0, Math.min(1, 1 - Math.pow(away, 1.6) * 0.95));
          const active = i === index;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              tabIndex={open ? 0 : -1}
              aria-label={item.label}
              onClick={() => {
                setTurn(i);
                lastNav.current = item.to;
                navigate(item.to);
              }}
              className="absolute group focus-visible:outline-none"
              style={{
                transform: `rotate(${deg}deg) translateX(calc(-0.71 * var(--wn-r) * ${open ? 1 : 0.001}))`,
                opacity: open ? fade : 0,
                pointerEvents: open && away <= 1 ? 'auto' : 'none',
                transition: 'transform .5s cubic-bezier(.22,.68,.32,1), opacity .4s ease',
              }}
            >
              <span
                className="flex items-center gap-2.5 flex-row-reverse"
                style={{ transform: `rotate(${-deg}deg) translate(-50%, -50%)` }}
              >
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors
                    ${active
                      ? 'bg-koala-gold text-koala-navy border-koala-gold'
                      : 'bg-white/12 text-white/75 border-white/25 group-hover:border-koala-gold/70 group-hover:text-koala-gold'}`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span
                  className={`whitespace-nowrap text-[13px] font-semibold transition-colors
                    ${active ? 'text-white' : 'text-white/55 group-hover:text-white/85'}`}
                >
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          className="!pointer-events-auto absolute w-14 h-14 rounded-full flex items-center justify-center
            bg-koala-navy text-white ring-2 ring-koala-gold/70 shadow-[0_10px_30px_rgba(62,34,89,.4)]
            transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        </div>
      </div>
    </div>
  );
}
