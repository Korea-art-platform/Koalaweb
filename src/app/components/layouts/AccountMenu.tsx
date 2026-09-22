import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { User, Package, Search, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/context/AuthContext';
import { useLogout } from '@/app/hooks/useLogout';

type Item = {
  key: string;
  label: string;
  to?: string;
  icon: typeof User;
  danger?: boolean;
  onClick?: () => void | Promise<void>;
};

export function useAccountItems(onNavigate?: () => void) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const handleLogout = useLogout();

  const items: Item[] = [
    { key: 'orderLookup', label: t('header.accountMenu.orderLookup'), to: '/order-lookup', icon: Search },
  ];

  if (isAuthenticated) {
    items.unshift(
      { key: 'account', label: t('header.accountMenu.account'), to: '/account', icon: User },
      { key: 'orders', label: t('header.accountMenu.orders'), to: '/account/orders', icon: Package },
    );
    items.push({
      key: 'logout',
      label: t('header.logout'),
      icon: LogOut,
      danger: true,
      onClick: async () => {
        onNavigate?.();
        await handleLogout();
      },
    });
  } else {
    items.unshift({ key: 'login', label: t('header.accountMenu.login'), to: '/login', icon: LogIn });
  }

  return items;
}

export default function AccountMenu({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const items = useAccountItems(() => setOpen(false));

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('header.accountMenu.menu')}
        className={`flex items-center gap-1 ${className}`}
      >
        <User className="w-5 h-5" />
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[130] mt-3 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-[0_12px_28px_-12px_rgba(27,20,32,0.35)]"
        >
          {items.map((item) => {
            const content = (
              <>
                <item.icon className={`w-4 h-4 ${item.danger ? 'text-red-400' : 'text-gray-400'}`} />
                {item.label}
              </>
            );
            const rowClass = `flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
            }`;

            return item.to ? (
              <Link key={item.key} to={item.to} role="menuitem" className={rowClass} onClick={() => setOpen(false)}>
                {content}
              </Link>
            ) : (
              <button key={item.key} type="button" role="menuitem" className={rowClass} onClick={item.onClick}>
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
