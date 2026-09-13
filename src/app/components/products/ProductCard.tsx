import { useState, useEffect, useMemo, useRef, useId } from 'react';
import { displayPrice, formatWon } from '@/app/lib/price';
import { useThumbSrc } from '@/app/hooks/useThumbSrc';
import { ShoppingCart, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import WishBookmark from '@/app/components/common/WishBookmark';
import OriginalBadge from '@/app/components/common/OriginalBadge';
import { useOriginalCategoryCode } from '@/app/hooks/useOriginalCategory';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { addCartItem } from '@/api/cart';
import { getSku } from '@/api/sku';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/app/components/ui/accordion';
import { toCdnUrl } from '@/app/lib/imageUrl';
import type { Sku } from '@/api/types';
import { notifyCartUpdated } from '@/app/hooks/useCart';

import { useCategories } from '@/app/hooks/useCategories';
interface ProductCardProps {
  sku: Sku;
  viewMode: 'grid' | 'large';
  /**
   * 카드 겉모습.
   *
   * store  — 사진 위에 글씨를 얹는다. 목록을 훑는 자리라 한 칸이 작다.
   * editorial — 사진 아래에 글씨를 둔다. 홈처럼 몇 점을 골라 거는 자리.
   * shop — 둥근 카드에 분류 색을 옅게 깐 사진 칸. 홈 에디션 나열.
   * stage — 원작 무대. 짙은 바탕 위에 한 점을 크게.
   *
   * 겉모습만 다르고 눌렀을 때 열리는 상세 모달은 같은 것을 쓴다.
   */
  variant?: 'store' | 'editorial' | 'shop' | 'stage' | 'gallery';
  /** editorial 에서 등급 표시에 쓴다. */
  mark?: string;
  markTone?: 'gold' | 'purple';
  isWishlisted: boolean;
  isWishlistLoading: boolean;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

export default function ProductCard({
  sku,
  viewMode,
  variant = 'store',
  mark,
  markTone = 'gold',
  isWishlisted,
  isWishlistLoading,
  onWishlistClick,
}: ProductCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const originalCode = useOriginalCategoryCode();
  const isOriginal = Boolean(originalCode) && sku.mainCategory === originalCode;
  const detailPath = `/product/${sku.skuCode}`;

  // 같은 상품이 홈의 여러 섹션(한정판·장르별·카테고리)에 동시에 그려진다.
  // layoutId 를 상품코드로만 만들면 framer-motion 이 그 카드들을 "같은 하나의 요소"로 보고
  // 하나만 남긴 채 나머지를 그쪽으로 끌어당긴다 — 한정판 섹션이 통째로 빈칸이 되던 원인이다.
  // 인스턴스마다 다른 값을 붙여 충돌을 없앤다. 카드와 상세 모달은 같은 컴포넌트 안에 있으므로
  // 공유 레이아웃 애니메이션은 그대로 동작한다.
  const instanceId = useId();
  const layoutId = `product-card-${sku.skuCode}-${instanceId}`;
  // 모바일 팝업 — 손잡이·사진을 잡고 아래로 쓸면 닫힌다
  const dragControls = useDragControls();
  const { src: imageUrl, onError: onImageError } = useThumbSrc(sku.primaryImageUrl);
  const price = formatWon(displayPrice(sku));
  // 분류 이름은 어드민에서 고치는 값이라 DB 것을 쓴다. 번역 파일에 따로
  // 적어 두면 어드민에서 바꿔도 카드만 옛 이름으로 남아 화면마다 달라진다.
  const { subLabel } = useCategories();
  const categoryLabel = subLabel(sku.genre);
  // 할인 — 정가 표시가가 지금 표시가보다 크면
  const nowPrice = displayPrice(sku);
  const listPrice = sku.displayListPrice;
  const discounted = nowPrice != null && listPrice != null && listPrice > nowPrice;
  const discountPct = discounted ? Math.round((1 - nowPrice / listPrice) * 100) : 0;

  const [isOpen, setIsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [detail, setDetail] = useState<Sku | null>(null);

  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) setImgIndex(0);
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !detail) {
      getSku(sku.skuCode)
        .then((res) => setDetail(res.data.data as Sku))
        .catch(() => {  });
    }
  }, [isOpen, detail, sku.skuCode]);

  const images = useMemo(() => {
    const extra = (detail?.mediaList ?? [])
      .filter((m) => m.mediaType === 'IMAGE'
        && m.mediaRole !== 'SPINE_360'
        && m.mediaRole !== 'AR_PREVIEW'
        && m.mediaRole !== 'AR_MODEL')
      .map((m) => toCdnUrl(m.fileUrl));
    return [imageUrl, ...extra.filter((u) => u && u !== imageUrl)].slice(0, 8);
  }, [detail, imageUrl]);

  const paginate = (dir: number) =>
    setImgIndex((i) => (i + dir + images.length) % images.length);

  const d = detail ?? sku;
  // 제목은 모델명만 쓴다. 모델명이 없는 옛 상품은 예전처럼 전체 이름을 보여 준다.
  const title = sku.model ?? d.model ?? sku.name;
  // 세부모델명과 색상은 상세 응답에만 담겨 자세히 보기를 열어야 채워진다.
  const subModelName = d.subModelName;
  const color = d.color;

  const description = d.description ?? sku.description;
  const specs: { label: string; value: string }[] = [];
  if (d.material) specs.push({ label: '소재', value: d.material });
  if (d.widthCm || d.heightCm || d.depthCm) {
    const dims = [d.widthCm, d.heightCm, d.depthCm].filter((v) => v != null).join(' × ');
    specs.push({ label: '크기', value: `${dims} cm` });
  }
  if (d.weightKg) specs.push({ label: '무게', value: `${d.weightKg} kg` });
  if (sku.isLimitedEdition && d.editionSize) {
    specs.push({ label: '에디션', value: d.editionNumber ? `No. ${d.editionNumber} / ${d.editionSize}` : `${d.editionSize} 한정` });
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || added) return;
    setAdding(true);
    try {
      await Promise.all([
        addCartItem(sku.skuCode, 1),
        new Promise((r) => setTimeout(r, 500)),
      ]);
      notifyCartUpdated();
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        navigate('/login', { state: { from: detailPath } });
      } else {
        alert(t('product.detail.toast.cartAddFailed', { defaultValue: '장바구니 담기에 실패했습니다.' }) as string);
      }
    } finally {
      setAdding(false);
    }
  };

  // 이 상품 하나만 결제한다. 예전에는 장바구니에 담고 주문서로 보냈는데,
  // 주문서가 담아 둔 것을 전부 결제해 엉뚱한 물건까지 함께 사졌다.
  // 결제 방식은 장바구니 경로와 같은 화면을 그대로 쓴다.
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (buying) return;
    setBuying(true);
    try {
      navigate('/checkout', { state: { buyNow: { skuCode: sku.skuCode, quantity: 1 } } });
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        navigate('/login', { state: { from: detailPath } });
      } else {
        alert(t('product.detail.toast.cartAddFailed', { defaultValue: '장바구니 담기에 실패했습니다.' }) as string);
      }
    } finally {
      setBuying(false);
    }
  };

  const Badges = (
    <div className="flex flex-wrap gap-1.5">
      {isOriginal && <OriginalBadge />}
      <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[9px] md:text-xs font-bold tracking-tight uppercase shadow-sm text-gray-900">
        {categoryLabel}
      </span>
      {sku.isLimitedEdition && (
        <span className="px-2 py-1 rounded-md bg-koala-purple text-white text-[9px] md:text-xs font-bold uppercase shadow-sm">
          {t('store.product.limited') as string}
        </span>
      )}
      {sku.status !== 'ACTIVE' && (
        <span
          className={`px-2 py-1 rounded-md text-[9px] md:text-xs font-bold shadow-sm ${
            sku.status === 'OUT_OF_STOCK' ? 'bg-gray-900/90 text-white' : 'bg-blue-500/90 text-white'
          }`}
        >
          {sku.status === 'OUT_OF_STOCK' ? t('store.product.status.soldOut') as string : sku.status}
        </span>
      )}
    </div>
  );

  /* 홈에 거는 모양 — 사진 아래에 글씨를 둔다. 누르면 같은 모달이 열린다. */
  const Editorial = (
    <figure className="group m-0">
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        className={`relative cursor-pointer overflow-hidden bg-gray-100 ${
          viewMode === 'large' ? 'aspect-square' : 'aspect-[4/5]'
        }`}
      >
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageUrl}
          onError={onImageError}
          alt={`${sku.artistName} 작 ${title}`}
          className="absolute inset-0 h-full w-full object-cover"
          variants={{ hover: { scale: 1.03 } }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <figcaption className="relative mt-4">
        {mark && (
          <span
            className={`mb-2.5 inline-block px-2 py-0.5 text-[10.5px] font-medium tracking-[0.08em] ${
              markTone === 'gold'
                ? 'text-koala-gold-text ring-1 ring-koala-gold/55'
                : 'bg-koala-purple/8 text-koala-purple'
            }`}
          >
            {mark}
          </span>
        )}
        <motion.h3
          layoutId={`title-${layoutId}`}
          onClick={() => setIsOpen(true)}
          className="font-serif-ko cursor-pointer text-[17px] font-bold text-gray-900
            transition-colors hover:text-koala-purple md:text-[19px]"
        >
          {title}
        </motion.h3>
        <motion.p layoutId={`subtitle-${layoutId}`} className="mt-0.5 text-[13px] text-gray-400">
          {sku.artistName}
        </motion.p>
        <p className="mt-2 text-[15px] font-medium tabular-nums text-gray-900 md:text-base">
          ₩{price}
        </p>

        {/* 찜은 사진 위가 아니라 이름 옆에 둔다. 작품을 가리지 않는다. */}
        <button
          onClick={(e) => onWishlistClick(e, sku.skuCode)}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? `${title} 찜 해제` : `${title} 찜하기`}
          aria-pressed={isWishlisted}
          className={`absolute right-0 p-1.5 transition-colors disabled:cursor-wait
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-koala-purple
            ${mark ? 'top-7' : 'top-0'}
            ${isWishlisted ? 'text-koala-purple' : 'text-gray-300 hover:text-koala-purple'}`}
        >
          {isWishlistLoading ? (
            <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <WishBookmark active={isWishlisted} size={17} className="block" />
          )}
        </button>
      </figcaption>
    </figure>
  );

  const StoreCard = (
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        className={`group relative cursor-pointer overflow-hidden border border-gray-100 shadow-sm bg-gray-100 ${
          viewMode === 'grid' ? 'aspect-[3/4]' : 'aspect-[4/3]'
        }`}
      >
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageUrl}
          onError={onImageError}
          alt={sku.name}
          className="absolute inset-0 h-full w-full object-cover"
          variants={{ hover: { scale: 1.05 } }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 pointer-events-none">{Badges}</div>
        <motion.button
          onClick={(e) => onWishlistClick(e, sku.skuCode)}
          disabled={isWishlistLoading}
          aria-label="찜하기"
          whileTap={{ scale: 0.85 }}
          className={`absolute top-2.5 right-2.5 md:top-4 md:right-4 p-2 md:p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${
            isWishlisted ? 'text-koala-purple' : 'text-gray-400 hover:text-koala-purple'
          } ${isWishlistLoading ? 'cursor-wait' : ''}`}
        >
          {isWishlistLoading ? (
            <span className="block w-4 h-4 md:w-[18px] md:h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <WishBookmark active={isWishlisted} size={17} className="block" />
          )}
        </motion.button>
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <motion.p layoutId={`subtitle-${layoutId}`} className="text-white/70 text-[10px] md:text-xs font-medium tracking-wide uppercase mb-1">
            {sku.artistName}
          </motion.p>
          <motion.h3 layoutId={`title-${layoutId}`} className="text-base md:text-lg font-bold tracking-tight text-white truncate">
            {title}
          </motion.h3>
          <p className="text-white font-black tracking-tight mt-1 text-sm md:text-base">₩{price}</p>
        </div>
      </motion.div>
  );

  /* 홈 에디션 나열 — 둥근 카드, 분류 색을 옅게 깐 사진 칸. 흰 배경 사진은 곱하기로 녹인다 */
  const badge = sku.status === 'OUT_OF_STOCK'
    ? { label: t('store.product.status.soldOut') as string, cls: 'bg-gray-900 text-white' }
    : discounted
      ? { label: `${discountPct}%`, cls: 'bg-koala-purple text-white' }
      : mark
        ? {
            label: mark,
            cls: markTone === 'gold'
              ? 'bg-white text-koala-gold-text ring-1 ring-koala-gold/60'
              : sku.isLimitedEdition ? 'bg-koala-purple text-white' : 'bg-white/90 text-koala-purple',
          }
        : null;

  const Shop = (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white
        transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(62,34,89,0.35)]"
    >
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        className="relative aspect-square cursor-pointer overflow-hidden bg-white"
      >
        {/* 사진만 — 색 바탕에 얹으면 그림 액자처럼 보인다. 자르지 않고 통째로 */}
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageUrl}
          onError={onImageError}
          alt={`${sku.artistName} 작 ${title}`}
          className="absolute inset-0 h-full w-full object-contain"
          variants={{ hover: { scale: 1.03 } }}
          transition={{ duration: 0.5 }}
        />
        {badge && (
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </motion.div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 md:px-5 md:pb-5">
        <motion.h3
          layoutId={`title-${layoutId}`}
          onClick={() => setIsOpen(true)}
          className="cursor-pointer truncate text-[15px] font-bold text-gray-900 transition-colors hover:text-koala-purple"
        >
          {title}
        </motion.h3>
        <motion.p layoutId={`subtitle-${layoutId}`} className="mt-0.5 truncate text-[13px] text-gray-400">
          {sku.artistName}
        </motion.p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="min-w-0">
            <p className="text-base font-bold tabular-nums text-koala-purple">₩{price}</p>
            {discounted && (
              <p className="text-xs tabular-nums text-gray-400 line-through">₩{formatWon(listPrice)}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(e) => onWishlistClick(e, sku.skuCode)}
              disabled={isWishlistLoading}
              aria-label={isWishlisted ? `${title} 찜 해제` : `${title} 찜하기`}
              aria-pressed={isWishlisted}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-wait
                focus-visible:outline-2 focus-visible:outline-koala-purple
                ${isWishlisted ? 'text-koala-purple' : 'text-gray-300 hover:text-koala-purple'}`}
            >
              {isWishlistLoading ? (
                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <WishBookmark active={isWishlisted} size={17} className="block" />
              )}
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || sku.status === 'OUT_OF_STOCK'}
              aria-label={`${title} 장바구니에 담기`}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-[filter,background-color]
                duration-300 hover:brightness-[1.12] disabled:cursor-not-allowed disabled:opacity-40
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-koala-purple
                ${added ? 'bg-green-600' : 'bg-koala-purple'}`}
            >
              {added ? (
                <Check className="h-4 w-4" />
              ) : adding ? (
                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* 원작 무대 — 짙은 바탕 위 밝은 전시 칸에 한 점을 크게 */
  const Stage = (
    <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-14">
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        className="relative aspect-[3/2] cursor-pointer overflow-hidden rounded-2xl bg-[#F4F1F7] max-md:max-h-[30svh] md:aspect-square"
      >
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageUrl}
          onError={onImageError}
          alt={`${sku.artistName} 작 ${title}`}
          className="absolute inset-0 h-full w-full object-contain p-5 mix-blend-multiply md:p-12"
          variants={{ hover: { scale: 1.03 } }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <div>
        {/* 원작 표시와 작가를 한 줄에 */}
        <div className="flex items-center gap-2.5">
          {(isOriginal || (mark && markTone === 'gold')) && <OriginalBadge size="md" />}
          <motion.p layoutId={`subtitle-${layoutId}`} className="text-sm text-white/60">
            {sku.artistName}
          </motion.p>
        </div>
        <motion.h3
          layoutId={`title-${layoutId}`}
          onClick={() => setIsOpen(true)}
          className="font-serif-ko mt-2 cursor-pointer text-2xl font-bold text-white break-keep md:mt-4 md:text-[40px]"
        >
          {title}
        </motion.h3>
        {description && (
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 break-keep line-clamp-3 max-md:hidden md:text-[15px]">
            {description}
          </p>
        )}
        <p className="mt-3 text-xl font-medium tabular-nums text-white md:mt-7 md:text-[28px]">₩{price}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5 md:mt-7">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group/more inline-flex items-center gap-2 rounded-full bg-white py-2.5 pl-5 pr-4 text-[13px] font-bold
              text-black transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.985]"
          >
            자세히 보기
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/more:translate-x-0.5" />
          </button>
          <Link
            to={detailPath}
            className="inline-flex items-center rounded-full border border-white/40 px-5 py-2.5 text-[13px] font-bold text-white
              transition-colors duration-300 hover:border-white/70 hover:bg-white/10"
          >
            작품 페이지
          </Link>
          <button
            type="button"
            onClick={(e) => onWishlistClick(e, sku.skuCode)}
            disabled={isWishlistLoading}
            aria-label={isWishlisted ? `${title} 찜 해제` : `${title} 찜하기`}
            aria-pressed={isWishlisted}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-colors
              disabled:cursor-wait ${isWishlisted ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            {isWishlistLoading ? (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <WishBookmark active={isWishlisted} size={16} className="block" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  /* 스토어 목록 모양 — 사진은 제 비율 그대로(자르지 않음), 아래에 뱃지·작가·작품명·소재·가격. 누르면 같은 모달이 열린다 */
  const Gallery = (
    <div className="group">
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        className="relative cursor-pointer overflow-hidden bg-gray-100"
      >
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageUrl}
          onError={onImageError}
          alt={`${sku.artistName} 작 ${title}`}
          loading="lazy"
          decoding="async"
          className="block h-auto min-h-[120px] w-full"
          variants={{ hover: { scale: 1.02 } }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <div className="flex items-start justify-between gap-2 pt-3 md:pt-3.5">
        <div className="min-w-0">
          {(isOriginal || sku.isLimitedEdition || sku.status === 'OUT_OF_STOCK') && (
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {/* 금색은 원작에만 */}
              {isOriginal && (
                <span className="border border-[#A5813D] px-1.5 py-0.5 text-[11px] font-medium text-[#876A32]">원작</span>
              )}
              {sku.isLimitedEdition && (
                <span className="border border-koala-purple px-1.5 py-0.5 text-[11px] font-medium text-koala-purple">
                  {t('store.product.limited') as string}
                </span>
              )}
              {sku.status === 'OUT_OF_STOCK' && (
                <span className="border border-gray-400 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                  {t('store.product.status.soldOut') as string}
                </span>
              )}
            </div>
          )}
          <motion.p layoutId={`subtitle-${layoutId}`} className="text-[15px] text-gray-900 md:text-base">{sku.artistName}</motion.p>
          <motion.h3
            layoutId={`title-${layoutId}`}
            onClick={() => setIsOpen(true)}
            className="font-serif-ko cursor-pointer text-[15px] text-gray-500 break-keep line-clamp-2 transition-colors hover:text-koala-purple md:text-base"
          >
            {title}
          </motion.h3>
          {sku.material && <p className="text-[13px] text-gray-400 break-keep line-clamp-1 md:text-sm">{sku.material}</p>}
          <p className="mt-1 text-[15px] font-bold tabular-nums text-gray-900 md:text-base">
            ₩{price}
            {discounted && <span className="ml-2 text-xs font-normal text-gray-400 line-through">₩{formatWon(listPrice)}</span>}
          </p>
        </div>
          <button
            type="button"
            onClick={(e) => onWishlistClick(e, sku.skuCode)}
            disabled={isWishlistLoading}
            aria-label={isWishlisted ? `${title} 찜 해제` : `${title} 찜하기`}
            aria-pressed={isWishlisted}
            className={`-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-wait
              focus-visible:outline-2 focus-visible:outline-koala-purple
              ${isWishlisted ? 'text-koala-purple' : 'text-gray-300 hover:text-koala-purple'}`}
          >
            {isWishlistLoading ? (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <WishBookmark active={isWishlisted} size={16} className="block" />
            )}
          </button>
      </div>
    </div>
  );

  const body = variant === 'editorial' ? Editorial
    : variant === 'shop' ? Shop
      : variant === 'stage' ? Stage
        : variant === 'gallery' ? Gallery
          : StoreCard;

  return (
    <>
      {body}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pt-24">
            {/* 헤더 높이만큼 위를 비워 닫기 버튼이 가려지지 않게 */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              layoutId={layoutId}
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                // 100px 넘게 내렸거나 빠르게 튕기면 닫는다
                if (info.offset.y > 100 || info.velocity.y > 500) setIsOpen(false);
              }}
              className="relative w-full max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[calc(100svh-7rem)] md:min-h-[520px] bg-white rounded-2xl overflow-hidden border border-gray-100 z-10 flex flex-col md:flex-row shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center bg-white/70 hover:bg-white rounded-full border border-gray-200 text-gray-700 transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
              {/* 모바일 손잡이 */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex shrink-0 cursor-grab justify-center bg-gray-50 pt-2.5 pb-1 touch-none md:hidden"
              >
                <span className="h-1 w-10 rounded-full bg-gray-300" />
              </div>
              <div
                onPointerDown={(e) => { if (e.pointerType === 'touch') dragControls.start(e); }}
                className="group/img relative h-64 w-full shrink-0 overflow-hidden bg-gray-50 max-md:touch-none md:h-auto md:w-1/2"
              >
                <div
                  className="flex h-full w-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${imgIndex * 100}%)` }}
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    if (touchStartX.current === null || images.length < 2) return;
                    const dx = e.changedTouches[0].clientX - touchStartX.current;
                    if (Math.abs(dx) > 45) paginate(dx < 0 ? 1 : -1);
                    touchStartX.current = null;
                  }}
                >
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${sku.name} ${i + 1}`}
                      className="h-full w-full shrink-0 object-contain select-none"
                      draggable={false}
                    />
                  ))}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                      aria-label="이전 이미지"
                      className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-700 opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); paginate(1); }}
                      aria-label="다음 이미지"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-700 opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                          aria-label={`${i + 1}번 이미지`}
                          className={`rounded-full transition-all duration-300 ${
                            i === imgIndex ? 'w-5 h-1.5 bg-koala-purple' : 'w-1.5 h-1.5 bg-gray-400/60 hover:bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 sm:p-8 lg:p-10 w-full md:w-1/2 flex flex-col overflow-y-auto justify-center">
                <motion.p layoutId={`subtitle-${layoutId}`} className="text-koala-red text-xs font-bold tracking-wide uppercase mb-2">
                  {sku.artistName}
                </motion.p>
                <motion.h3 layoutId={`title-${layoutId}`} className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {title}
                </motion.h3>
                {(subModelName || color) && (
                  <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {subModelName && (
                      <div className="flex gap-1.5">
                        <dt>세부모델:</dt>
                        <dd className="text-gray-700">{subModelName}</dd>
                      </div>
                    )}
                    {color && (
                      <div className="flex gap-1.5">
                        <dt>색상:</dt>
                        <dd className="text-gray-700">{color}</dd>
                      </div>
                    )}
                  </dl>
                )}
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }}
                  className="mt-4 grow"
                >
                  <p className="text-2xl font-black tracking-tight text-gray-900 mb-4">₩{price}</p>
                  <div className="mb-4">{Badges}</div>

                  {(description || specs.length > 0) && (
                    <Accordion type="single" collapsible defaultValue="desc" className="mb-6 border-t border-gray-100">
                      {description && (
                        <AccordionItem value="desc">
                          <AccordionTrigger className="text-gray-900">작품 설명</AccordionTrigger>
                          <AccordionContent className="text-gray-500 leading-relaxed break-keep">
                            {description}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                      {specs.length > 0 && (
                        <AccordionItem value="specs">
                          <AccordionTrigger className="text-gray-900">규격 정보</AccordionTrigger>
                          <AccordionContent>
                            <dl className="space-y-1.5">
                              {specs.map((s) => (
                                <div key={s.label} className="flex gap-3 text-sm">
                                  <dt className="w-14 shrink-0 text-gray-400">{s.label}</dt>
                                  <dd className="text-gray-700 font-medium">{s.value}</dd>
                                </div>
                              ))}
                            </dl>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={adding}
                      whileTap={{ scale: 0.96 }}
                      className={`relative flex-1 min-w-[130px] flex items-center justify-center py-3 rounded-xl text-sm font-bold overflow-hidden transition-colors duration-300 disabled:opacity-90 ${
                        added ? 'bg-green-600 text-white' : 'bg-koala-navy text-white hover:bg-koala-navy-hover'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {added ? (
                          <motion.span key="added" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.18 }} className="flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> 담겼어요
                          </motion.span>
                        ) : adding ? (
                          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5">
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> 담는 중
                          </motion.span>
                        ) : (
                          <motion.span key="idle" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.18 }} className="flex items-center gap-1.5">
                            <ShoppingCart className="w-4 h-4" /> 장바구니
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <button
                      onClick={(e) => onWishlistClick(e, sku.skuCode)}
                      disabled={isWishlistLoading}
                      aria-label="찜하기"
                      className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
                        isWishlisted ? 'border-koala-purple text-koala-purple bg-koala-purple/5' : 'border-gray-200 text-gray-600 hover:border-koala-purple hover:text-koala-purple'
                      }`}
                    >
                      <WishBookmark active={isWishlisted} size={15} /> 찜
                    </button>
                    <Link
                      to={detailPath}
                      className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                    >
                      자세히 보기 <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    disabled={buying || sku.status === 'OUT_OF_STOCK'}
                    className="mt-2.5 w-full py-4 rounded-xl bg-gradient-to-r from-koala-purple to-koala-purple-bright text-white text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[filter,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-[1.12] active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sku.status === 'OUT_OF_STOCK'
                      ? '품절'
                      : buying ? '주문서로 이동 중...' : '구매하기'}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
