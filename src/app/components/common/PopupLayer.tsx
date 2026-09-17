import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getPopups } from '@/api/popup';
import type { PublicPopup } from '@/api/types';
import { useIsEnglish } from '@/app/lib/lang';
import { hidePopupForToday, isPopupHiddenToday, resolveLandingUrl } from '@/app/lib/popup';

const SKIP_PATH = /^\/(checkout|payment|oauth2|onboarding)(\/|$)/;

export default function PopupLayer() {
  const location = useLocation();
  const isEnglish = useIsEnglish();
  const lang = isEnglish ? 'en' : 'ko';
  const page = location.pathname === '/' ? 'home' : 'other';
  const skip = SKIP_PATH.test(location.pathname);

  const { data } = useQuery<PublicPopup[]>({
    queryKey: ['popups', lang, page],
    queryFn: () => getPopups(lang, page),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !skip,
  });

  const [closed, setClosed] = useState<Set<string>>(() => new Set());

  const current = useMemo(
    () => (data ?? []).find((p) => !closed.has(p.popupCode) && !isPopupHiddenToday(p.popupCode)) ?? null,
    [data, closed],
  );

  const close = useCallback((popupCode: string) => {
    setClosed((prev) => new Set(prev).add(popupCode));
  }, []);

  return (
    <AnimatePresence mode="wait">
      {current && !skip && <PopupDialog key={current.popupCode} popup={current} onClose={close} />}
    </AnimatePresence>
  );
}

function PopupDialog({ popup, onClose }: { popup: PublicPopup; onClose: (popupCode: string) => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const landing = resolveLandingUrl(popup.landingUrl);
  const close = useCallback(() => onClose(popup.popupCode), [onClose, popup.popupCode]);

  const follow = () => {
    if (!landing) return;
    if (landing.kind === 'internal') navigate(landing.path);
    else window.open(landing.url, '_blank', 'noopener,noreferrer');
    close();
  };

  const hideToday = () => {
    hidePopupForToday(popup.popupCode);
    close();
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  const isTemplate = popup.displayType === 'TEMPLATE';
  const image = popup.imageUrl ? (
    landing ? (
      <button type="button" onClick={follow} className="block w-full cursor-pointer" aria-label={popup.title}>
        <img src={popup.imageUrl} alt="" className="block w-full h-auto object-cover" />
      </button>
    ) : (
      <img src={popup.imageUrl} alt={isTemplate ? '' : popup.title} className="block w-full h-auto object-cover" />
    )
  ) : null;

  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-[min(420px,calc(100vw-32px))] max-h-full flex-col"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
      >
        <div className="flex min-h-0 flex-col overflow-hidden rounded-md bg-white shadow-2xl">
          <div className="min-h-0 overflow-y-auto overscroll-contain">
          {isTemplate ? (
            <div className="bg-[#3E2259] text-white">
              {image}
              <div className="px-6 py-7">
                <h2 id={titleId} className="text-xl font-bold leading-snug break-keep">{popup.title}</h2>
                {popup.body && (
                  <p className="mt-3 text-sm leading-relaxed text-white/85 whitespace-pre-line break-keep">
                    {popup.body}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <h2 id={titleId} className="sr-only">{popup.title}</h2>
              {image}
            </>
          )}
          </div>

          <div className="flex shrink-0 flex-col gap-2 p-4">
            {popup.showLinkButton && landing && (
              <button
                type="button"
                onClick={follow}
                className="w-full rounded-md bg-koala-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-koala-navy-hover"
              >
                {t('popup.viewMore')}
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="w-full rounded-md border border-gray-900 bg-white py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              {t('popup.close')}
            </button>
          </div>
        </div>

        {popup.showDismiss && (
          <label className="mt-3 inline-flex shrink-0 cursor-pointer items-center gap-2 self-start text-sm font-bold text-white">
            <input
              type="checkbox"
              checked={false}
              onChange={hideToday}
              className="h-4 w-4 cursor-pointer accent-white"
            />
            {t('popup.hideToday')}
          </label>
        )}
      </motion.div>
    </motion.div>
  );
}
