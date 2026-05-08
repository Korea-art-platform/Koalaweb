import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import { addCartItem } from '@/api/cart';
import { addWishlist, removeWishlist, checkWishlist } from '@/api/wishlist';
import { CART_QUERY_KEY } from '@/app/hooks/useCart';
import type { Sku, Artist } from '@/api/types';

import {
  ProductSkeleton,
  ProductNotFound,
  ProductToast,
  ProductImageGallery,
  ProductInfo,
  ProductActions,
} from '@/app/components/products';

import ProductDetailPage from '@/app/components/products/ProductDetailPage';
import { ArtImages, ArtArtist, ArtInfo, ArtQnA } from '@/app/components/ArtDetail';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [sku, setSku] = useState<Sku | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCartLink, setShowCartLink] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedImage(0);
    setSelectedColor(undefined);

    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(id!);
        const skuData: Sku = res.data.data;
        setSku(skuData);

        if ((skuData as any).artistCode) {
          try {
            const artistRes = await getArtist((skuData as any).artistCode);
            setArtist(artistRes.data.data);
          } catch { /* artist 없으면 이름만 표시 */ }
        }

        try {
          const wishRes = await checkWishlist(id!);
          setIsWishlisted(wishRes.data.data);
        } catch {
          // not authenticated — wishlist state stays false
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [id]);

  const showToastMessage = (message: string, isCart: boolean = false) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setShowCartLink(isCart);
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = async () => {
    if (!sku) return;
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      showToastMessage(t('product.detail.toast.cartAdded'), true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToastMessage(msg || t('product.detail.toast.cartAddFailed'));
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!sku) return;
    try {
      if (isWishlisted) {
        await removeWishlist(sku.skuCode);
        setIsWishlisted(false);
        showToastMessage(t('product.detail.toast.wishlistRemoved'));
      } else {
        await addWishlist(sku.skuCode);
        setIsWishlisted(true);
        showToastMessage(t('product.detail.toast.wishlistAdded'));
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToastMessage(msg || t('product.detail.toast.error'));
    }
  };

  if (loading) return <ProductSkeleton />;
  if (!sku) return <ProductNotFound />;

  const images =
    sku.mediaList && sku.mediaList.length > 0
      ? sku.mediaList.map((m) => m.fileUrl)
      : [sku.primaryImageUrl ?? 'https://via.placeholder.com/400'];

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />

      <ProductToast
        show={showToast}
        message={toastMessage}
        showCartLink={showCartLink}
        onClose={() => setShowToast(false)}
      />

      <div className="pt-28 pb-20 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">

          {/* 뒤로가기 */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('product.detail.back')}
          </button>

          {/* 상품 기본 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14">
            <ProductImageGallery
              sku={sku}
              images={images}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
            <div className="flex flex-col">
              <ProductInfo
                sku={sku}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              <ProductActions
                sku={sku}
                cartLoading={cartLoading}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
              />
            </div>
          </div>

          {/* 상품 상세 이미지 */}
          <div className="mt-20 border-t border-gray-100 pt-16">
            <ProductDetailPage skuCode={sku.skuCode} />
          </div>

          {/* 작품 상세 이미지 그리드 + 작가 / 작품 소개 / QnA */}
          <div className="mt-20 border-t border-gray-100 pt-16 max-w-2xl mx-auto">
            <ArtImages
              images={images.filter((_, i) => i < 3)}
              title={sku.name}
            />
            <ArtArtist
              artistCode={(sku as any).artistCode}
              artistName={sku.artistName}
              artistDescription={artist?.bio}
              artistImageUrl={artist?.profileImageUrl}
            />
            <ArtInfo
              items={[
                { label: '소재', value: sku.genre ?? '-' },
                { label: '크기', value: (sku as any).widthCm ? `${(sku as any).widthCm}cm × ${(sku as any).heightCm}cm` : '-' },
                { label: '무게', value: (sku as any).weightKg ? `${(sku as any).weightKg}kg` : '-' },
                { label: '배달비용', value: '-' },
              ]}
            />
            <ArtQnA />
          </div>

        </div>
      </div>
    </div>
  );
}