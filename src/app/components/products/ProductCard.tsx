import { useState, useEffect, useMemo, useRef, useId } from 'react';
import { Heart, ShoppingCart, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { addCartItem } from '@/api/cart';
import { getSku } from '@/api/sku';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/app/components/ui/accordion';
import { toCdnUrl } from '@/app/lib/imageUrl';
import type { Sku } from '@/api/types';
import { notifyCartUpdated } from '@/app/hooks/useCart';

interface ProductCardProps {
  sku: Sku;
  viewMode: 'grid' | 'large';
  isWishlisted: boolean;
  isWishlistLoading: boolean;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

export default function ProductCard({
  sku,
  viewMode,
  isWishlisted,
  isWishlistLoading,
  onWishlistClick,
}: ProductCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const detailPath = `/product/${sku.skuCode}`;

  // 같은 상품이 홈의 여러 섹션(한정판·장르별·카테고리)에 동시에 그려진다.
  // layoutId 를 상품코드로만 만들면 framer-motion 이 그 카드들을 "같은 하나의 요소"로 보고
  // 하나만 남긴 채 나머지를 그쪽으로 끌어당긴다 — 한정판 섹션이 통째로 빈칸이 되던 원인이다.
  // 인스턴스마다 다른 값을 붙여 충돌을 없앤다. 카드와 상세 모달은 같은 컴포넌트 안에 있으므로
  // 공유 레이아웃 애니메이션은 그대로 동작한다.
  const instanceId = useId();
  const layoutId = `product-card-${sku.skuCode}-${instanceId}`;
  const imageUrl = toCdnUrl(sku.primaryImageUrl) ?? '/placeholder.svg';
  const price = (sku.salePrice ?? sku.listPrice).toLocaleString();
  const categoryLabel = t(`store.categories.${sku.genre}`, { defaultValue: sku.genre }) as string;

  const [isOpen, setIsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
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

  const Badges = (
    <div className="flex flex-wrap gap-1.5">
      <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[9px] md:text-xs font-bold tracking-tight uppercase shadow-sm text-gray-900">
        {categoryLabel}
      </span>
      {sku.isLimitedEdition && (
        <span className="px-2 py-1 rounded-md bg-koala-gold text-koala-purple text-[9px] md:text-xs font-bold uppercase shadow-sm">
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

  return (
    <>
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        className={`group relative cursor-pointer overflow-hidden rounded-xl md:rounded-2xl border border-gray-100 shadow-sm bg-gray-100 ${
          viewMode === 'grid' ? 'aspect-[3/4]' : 'aspect-[4/3]'
        }`}
      >
        <motion.img
          layoutId={`image-${layoutId}`}
          src={imageUrl}
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
          className={`absolute top-2.5 right-2.5 md:top-4 md:right-4 p-2 md:p-2.5 rounded-full backdrop-blur-sm shadow-sm transition-colors ${
            isWishlisted ? 'bg-koala-red text-white' : 'bg-white/90 text-gray-500 hover:text-koala-red'
          } ${isWishlistLoading ? 'cursor-wait' : ''}`}
        >
          {isWishlistLoading ? (
            <span className="block w-4 h-4 md:w-[18px] md:h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <motion.span key={isWishlisted ? 'on' : 'off'} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 13 }} className="block">
              <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.span>
          )}
        </motion.button>
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <motion.p layoutId={`subtitle-${layoutId}`} className="text-white/70 text-[10px] md:text-xs font-medium tracking-wide uppercase mb-1">
            {sku.artistName}
          </motion.p>
          <motion.h3 layoutId={`title-${layoutId}`} className="text-base md:text-lg font-bold tracking-tight text-white truncate">
            {sku.name}
          </motion.h3>
          <p className="text-white font-black tracking-tight mt-1 text-sm md:text-base">₩{price}</p>
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-4xl md:max-w-6xl lg:max-w-7xl xl:max-w-[1500px] max-h-[85vh] md:max-h-[90vh] md:min-h-[600px] lg:min-h-[700px] bg-white rounded-2xl overflow-hidden border border-gray-100 z-10 flex flex-col md:flex-row shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center bg-white/70 hover:bg-white rounded-full border border-gray-200 text-gray-700 transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="group/img relative h-64 w-full shrink-0 overflow-hidden bg-gray-50 md:h-auto md:w-1/2">
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
                  {sku.name}
                </motion.h3>
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
                        isWishlisted ? 'border-koala-red text-koala-red bg-koala-red/5' : 'border-gray-200 text-gray-600 hover:border-koala-red hover:text-koala-red'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} /> 찜
                    </button>
                    <Link
                      to={detailPath}
                      className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                    >
                      자세히 보기 <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
