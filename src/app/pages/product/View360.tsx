import { useState, useRef, useEffect } from 'react';
import { displayPrice, displayListPrice, hasDiscount, formatWon } from '@/app/lib/price';
import { useParams, Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, RotateCw, ZoomIn, ZoomOut, Maximize2, X, Info, ShoppingCart } from 'lucide-react';
import { getSku } from '@/api/sku';
import { addCartItem } from '@/api/cart';
import type { Sku } from '@/api/types';
import { notifyCartUpdated } from '@/app/hooks/useCart';

export default function Product360View() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [sku, setSku] = useState<Sku | null>(null);
  const [images360, setImages360] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(id!);
        const data = res.data.data;
        setSku(data);

        if (data.spinePicturesJson && data.spinePicturesJson.length > 0) {
          setImages360(data.spinePicturesJson);
        } else if (data.mediaList && data.mediaList.length > 0) {
          setImages360(
            data.mediaList
              .filter((m: any) => m.mediaType === 'IMAGE')
              .map((m: any) => m.fileUrl)
          );
        } else if (data.primaryImageUrl) {
          setImages360([data.primaryImageUrl]);
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [id]);

  const totalFrames = images360.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotate && totalFrames > 1) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAutoRotate, totalFrames]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || totalFrames <= 1) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 5) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let next = prev + direction;
        if (next < 0) next = totalFrames - 1;
        if (next >= totalFrames) next = 0;
        return next;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoRotate(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || totalFrames <= 1) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 5) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let next = prev + direction;
        if (next < 0) next = totalFrames - 1;
        if (next >= totalFrames) next = 0;
        return next;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      await addCartItem(sku!.skuCode, 1);
      notifyCartUpdated();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || t('product.detail.toast.cartAddFailed'));
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-koala-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sku || images360.length === 0) {
    return (
      <div className="min-h-screen bg-koala-navy flex flex-col items-center justify-center text-white">
        <p className="text-gray-400 mb-6">{t('view360.notFound')}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-white text-black rounded-full font-bold"
        >
          {t('view360.goBack')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-koala-navy">

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]">
            <ShoppingCart className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{t('product.detail.toast.cartAdded')}</p>
              <Link to="/cart" className="text-xs text-gray-400 underline hover:text-black transition-colors">
                {t('view360.goToCart')}
              </Link>
            </div>
            <button onClick={() => setShowToast(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} className="fixed inset-0 pt-20 bg-koala-navy">
        <div className="absolute top-20 left-0 right-0 z-20 px-8 py-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-white">
                <h1 className="text-xl">{sku.name}</h1>
                <p className="text-sm text-white/60">by {sku.artistName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>
          </div>
        </div>
        <div className="h-full flex items-center justify-center px-8 py-32">
          <div className="relative max-w-5xl w-full aspect-square">
            <div
              className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images360[currentFrame]}
                alt={`${sku.name} - ${currentFrame + 1}/${totalFrames}`}
                className="w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />

              {!isDragging && currentFrame === 0 && totalFrames > 1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-8 py-4 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm flex items-center gap-3">
                    <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                    {t('view360.dragHint')}
                  </div>
                </div>
              )}

              {totalFrames === 1 && (
                <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
                  <div className="px-6 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white/60 text-xs">
                    {t('view360.noImagesRegistered')}
                  </div>
                </div>
              )}

              {totalFrames > 1 && (
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                  {currentFrame + 1} / {totalFrames}
                </div>
              )}

              {zoom !== 1 && (
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                  {Math.round(zoom * 100)}%
                </div>
              )}
            </div>

            {totalFrames > 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${((currentFrame + 1) / totalFrames) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              disabled={totalFrames <= 1}
              className={`p-3 rounded-full transition-colors disabled:opacity-30 ${isAutoRotate ? 'bg-white text-black' : 'hover:bg-white/20 text-white'}`}
              title={t('view360.autoRotate')}
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-white/20" />
            <button onClick={handleZoomOut} className="p-3 hover:bg-white/20 text-white rounded-full transition-colors">
              <ZoomOut className="w-5 h-5" />
            </button>
            <button onClick={handleZoomIn} className="p-3 hover:bg-white/20 text-white rounded-full transition-colors">
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-white/20" />
            <button onClick={toggleFullscreen} className="p-3 hover:bg-white/20 text-white rounded-full transition-colors">
              {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="absolute top-32 right-8 w-80 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-white">
            <h3 className="text-lg mb-4">{t('view360.productInfo')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">{t('view360.category')}</span>
                <span>{sku.genre}</span>
              </div>
              {sku.widthCm && (
                <div className="flex justify-between">
                  <span className="text-white/60">{t('product.detail.info.size')}</span>
                  <span>
                    {sku.widthCm}×{sku.heightCm}
                    {sku.depthCm ? `×${sku.depthCm}` : ''}cm
                  </span>
                </div>
              )}
              {sku.weightKg && (
                <div className="flex justify-between">
                  <span className="text-white/60">{t('product.detail.info.weight')}</span>
                  <span>{sku.weightKg}kg</span>
                </div>
              )}
              {sku.isLimitedEdition && (
                <div className="flex justify-between">
                  <span className="text-white/60">{t('view360.edition')}</span>
                  <span>{sku.editionNumber} / {sku.editionSize}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/20">
                <span className="text-white/60 text-xs">{t('view360.price')}</span>
                <p className={`text-2xl mt-1 font-bold ${hasDiscount(sku) ? 'text-koala-red' : ''}`}>
                  ₩{formatWon(displayPrice(sku))}
                </p>
                {hasDiscount(sku) && (
                  <p className="text-sm text-white/40 line-through">
                    ₩{formatWon(displayListPrice(sku))}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Link
                to={`/product/${id}`}
                className="flex-1 py-3 bg-white/10 text-white text-center rounded-xl hover:bg-white/20 transition-colors text-sm font-bold"
              >
                {t('view360.viewDetail')}
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
                className="flex-1 py-3 bg-white text-black text-center rounded-xl hover:bg-white/90 transition-colors text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {sku.status === 'OUT_OF_STOCK' ? t('product.detail.actions.outOfStock') : cartLoading ? t('product.detail.actions.addingToCart') : t('view360.addToCartShort')}
              </button>
            </div>
          </div>
        )}

        <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-lg border-t border-white/10 z-20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase">Price</span>
              <p className="text-lg font-black text-white">
                ₩{formatWon(displayPrice(sku))}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
              className="flex-1 py-4 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {sku.status === 'OUT_OF_STOCK' ? t('product.detail.actions.outOfStock') : t('product.detail.actions.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
