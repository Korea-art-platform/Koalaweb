import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Move, ZoomIn, ZoomOut, Maximize2, CheckCircle2, X, Camera } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { Link, useSearchParams } from 'react-router';
import { getSku } from '@/api/sku';
import { addCartItem } from '@/api/cart';
import type { Sku } from '@/api/types';
import { notifyCartUpdated } from '@/app/hooks/useCart';

export default function ARView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const skuCode = searchParams.get('skuCode');

  const [mode, setMode] = useState<'360' | 'ar'>('360');
  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCartLink, setShowCartLink] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!skuCode) return;
    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(skuCode);
        setSku(res.data.data);
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [skuCode]);

  const showToastMessage = (message: string, withCartLink = false) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setShowCartLink(withCartLink);
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = async () => {
    if (!sku) return;
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      notifyCartUpdated();
      showToastMessage(t('product.detail.toast.cartAdded'), true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToastMessage(msg || t('product.detail.toast.cartAddFailed'));
    } finally {
      setCartLoading(false);
    }
  };

  const handleARMode = () => {
    setMode('ar');
    showToastMessage(t('ar.arToast'));
    setTimeout(() => setMode('360'), 1500);
  };

  const displayImage = sku?.primaryImageUrl
    ?? sku?.spinePicturesJson?.[0]
    ?? 'https://image2.1004gundam.com/item_images/explain/1376375896/1484790110.jpg';

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-koala-navy text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{toastMessage}</p>
              {showCartLink && (
                <Link to="/cart" className="text-xs text-gray-400 underline hover:text-white transition-colors">
                  {t('ar.goToCart')}
                </Link>
              )}
            </div>
            <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-24 h-screen flex flex-col">
        <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {mode === 'ar' ? (
              <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center bg-koala-navy rounded-3xl overflow-hidden">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-bold mb-2">{t('ar.comingSoonTitle')}</p>
                  <p className="text-sm text-white/50">{t('ar.comingSoonDesc')}</p>
                </div>
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/60" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/60" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/60" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/60" />
              </div>
            ) : (
              <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
                {loading ? (
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ImageWithFallback
                      src={displayImage}
                      alt={sku?.name ?? t('ar.productImageAlt')}
                      className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-200"
                      style={{ transform: `scale(${zoom})` } as any}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[80%] h-[80%] border-2 border-dashed border-gray-200 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-xs px-4">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
              <button onClick={() => setMode('360')} className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${mode === '360' ? 'bg-koala-navy text-white' : 'text-gray-400 hover:text-black'}`}>{t('ar.tab360')}</button>
              <button onClick={handleARMode} className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${mode === 'ar' ? 'bg-koala-navy text-white' : 'text-gray-400 hover:text-black'}`}>{t('ar.tabAr')}</button>
            </div>
          </div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <div className="flex flex-col gap-4 p-3 rounded-[24px] bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
              <button onClick={() => setZoom(1)} className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title={t('ar.resetZoom')}><RotateCcw className="w-5 h-5" /></button>
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title={t('ar.move')}><Move className="w-5 h-5" /></button>
              <div className="w-full h-px bg-gray-100" />
              <button onClick={() => setZoom((p) => Math.min(p + 0.25, 3))} className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title={t('ar.zoomIn')}><ZoomIn className="w-5 h-5" /></button>
              <button onClick={() => setZoom((p) => Math.max(p - 0.25, 0.5))} className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title={t('ar.zoomOut')}><ZoomOut className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <div className="w-80 p-8 rounded-[32px] bg-white/90 backdrop-blur-md shadow-2xl space-y-8 border border-gray-100">
              {sku ? (
                <>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">{sku.genre}</div>
                    <h3 className="text-2xl font-medium mb-1 leading-tight">{sku.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{sku.artistName} {t('ar.artistSuffix')}</p>
                  </div>
                  <div className="pt-6 border-t border-gray-100 space-y-4 text-xs">
                    {sku.widthCm && (<div className="flex justify-between"><span className="text-gray-400">{t('ar.size')}</span><span className="font-bold text-gray-900">{sku.widthCm}×{sku.heightCm}{sku.depthCm ? `×${sku.depthCm}` : ''}cm</span></div>)}
                    {sku.isLimitedEdition && (<div className="flex justify-between"><span className="text-gray-400">{t('ar.edition')}</span><span className="font-bold text-gray-900">{sku.editionNumber} / {sku.editionSize}</span></div>)}
                    <div className="flex justify-between"><span className="text-gray-400">{t('ar.price')}</span><span className="font-bold text-gray-900">₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/product/${sku.skuCode}`} className="flex-1 py-4 border border-gray-200 text-black text-center rounded-2xl hover:bg-gray-50 transition-colors text-sm font-bold">{t('ar.viewDetail')}</Link>
                    <button onClick={handleAddToCart} disabled={cartLoading || sku.status === 'OUT_OF_STOCK'} className="flex-1 py-4 bg-koala-navy text-white rounded-2xl hover:bg-koala-navy-hover transition-all font-bold text-sm disabled:opacity-50">{sku.status === 'OUT_OF_STOCK' ? t('product.detail.actions.outOfStock') : cartLoading ? t('product.detail.actions.addingToCart') : t('ar.addToCartShort')}</button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Premium Art Toy</div>
                  <h3 className="text-2xl font-medium mb-1 leading-tight">KOALA AR Viewer</h3>
                  <p className="text-sm text-gray-500 font-medium mt-4 leading-relaxed">{t('ar.noSkuDesc')}</p>
                  <Link to="/store" className="block w-full mt-8 py-4 bg-koala-navy text-white text-center rounded-2xl hover:bg-koala-navy-hover transition-all font-bold text-sm">{t('order.history.goStore')}</Link>
                </div>
              )}
            </div>
          </div>
          <button className="absolute bottom-8 right-8 z-10 p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white transition-all border border-gray-100"><Maximize2 className="w-5 h-5 text-gray-700" /></button>
          <div className="absolute bottom-8 left-8 z-10 max-w-[280px] sm:max-w-sm p-6 rounded-[24px] bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
            <div className="text-sm space-y-2">
              <div className="font-bold flex items-center gap-2 text-black">
                {mode === 'ar' ? (<><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />{t('ar.comingSoonTitle')}</>) : (<><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{t('ar.tab360')}</>)}
              </div>
              <div className="text-gray-500 text-xs leading-relaxed">{mode === 'ar' ? t('ar.comingSoonDesc') : t('ar.status360Desc')}</div>
            </div>
          </div>

          {sku && (
            <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
                  <span className="text-lg font-black text-black">₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}</span>
                </div>
                <button onClick={handleAddToCart} disabled={cartLoading || sku.status === 'OUT_OF_STOCK'} className="flex-1 py-4 bg-koala-navy text-white rounded-xl font-bold text-sm disabled:opacity-50">{sku.status === 'OUT_OF_STOCK' ? t('product.detail.actions.outOfStock') : t('product.detail.actions.addToCart')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
