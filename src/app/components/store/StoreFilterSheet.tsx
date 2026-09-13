import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/app/hooks/useCategories';
import type { SkuOrder } from '@/api/sku';
import { ALL, ORDERS, PRICE_BANDS } from './storeOptions';

export interface SheetValue {
  category: string;
  price: string;
  order: SkuOrder;
}

interface StoreFilterSheetProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  value: SheetValue;
  onApply: (value: SheetValue) => void;
}

const RESET: SheetValue = { category: ALL, price: ALL, order: 'RECOMMENDED' };

// 모바일 거르기 창 — 고른 뒤 "작품 보기"를 눌러야 걸린다. 손잡이를 잡고 아래로 쓸면 닫힌다
export default function StoreFilterSheet({ open, onClose, categories, value, onApply }: StoreFilterSheetProps) {
  const { t } = useTranslation();
  const { subLabel } = useCategories();
  const dragControls = useDragControls();
  const [draft, setDraft] = useState<SheetValue>(value);

  // 열 때마다 지금 걸린 조건에서 시작한다
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const allLabel = t('store.categories.All') as string;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="거르기">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1A1420]/45"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              // 100px 넘게 내렸거나 빠르게 튕기면 닫는다
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-[20px] bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))]"
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="sticky top-0 -mx-5 flex cursor-grab justify-center bg-white pt-2.5 pb-3 touch-none"
            >
              <span className="h-1 w-10 rounded-full bg-gray-300" />
            </div>

            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-bold text-gray-900">거르기</h2>
              <button type="button" onClick={() => setDraft(RESET)} className="text-xs text-gray-400 hover:text-gray-900">
                초기화
              </button>
            </div>

            <Group label="분류">
              {categories.map((code) => (
                <Chip key={code} active={draft.category === code} onClick={() => setDraft({ ...draft, category: code })}>
                  {code === ALL ? allLabel : subLabel(code)}
                </Chip>
              ))}
            </Group>

            <Group label="가격대">
              <Chip active={draft.price === ALL} onClick={() => setDraft({ ...draft, price: ALL })}>전체</Chip>
              {PRICE_BANDS.map((b) => (
                <Chip key={b.key} active={draft.price === b.key} onClick={() => setDraft({ ...draft, price: b.key })}>
                  {b.label}
                </Chip>
              ))}
            </Group>

            <Group label="정렬">
              {ORDERS.map((o) => (
                <Chip key={o.key} active={draft.order === o.key} onClick={() => setDraft({ ...draft, order: o.key })}>
                  {o.label}
                </Chip>
              ))}
            </Group>

            <div className="mt-6 grid grid-cols-[1fr_2fr] gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-900"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => { onApply(draft); onClose(); }}
                className="rounded-xl bg-gradient-to-r from-koala-purple to-koala-purple-bright py-3.5 text-sm font-bold text-white
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-[0.985]"
              >
                작품 보기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.2em] text-gray-400">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-[13px] transition-colors
        ${active ? 'border-koala-purple font-semibold text-koala-purple' : 'border-gray-200 text-gray-500'}`}
    >
      {children}
    </button>
  );
}
