import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import { addCartItem } from '@/api/cart';
import { addWishlist, removeWishlist, checkWishlist } from '@/api/wishlist';
import { CART_QUERY_KEY } from '@/app/hooks/useCart';
import { useAuth } from '@/app/context/AuthContext';
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
import TrendingArtists from '@/app/components/Artist/TrendingArtists';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuth();

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

        // 위시리스트 여부는 isAuthenticated + sku 둘 다 준비된 뒤 별도 useEffect에서 처리
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

    // 비로그인 사용자 → 로그인 페이지로
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
      const status = (e as { response?: { status?: number } })?.response?.status;
      // 401 → 세션 만료, 로그인 페이지로
      if (status === 401) {
        navigate('/login');
        return;
      }
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToastMessage(msg || t('product.detail.toast.error'));
    }
  };

  // 로그인 상태 변경 시 위시리스트 여부 재확인
  useEffect(() => {
    if (isAuthenticated === true && sku) {
      checkWishlist(sku.skuCode)
        .then((res) => setIsWishlisted(res.data.data))
        .catch(() => setIsWishlisted(false));
    } else if (isAuthenticated === false) {
      setIsWishlisted(false);
    }
  }, [isAuthenticated, sku?.skuCode]);

  if (loading) return <ProductSkeleton />;
  if (!sku) return <ProductNotFound />;

  // 갤러리: 전체 미디어 최대 5장 (MAIN + DETAIL 합산)
  const images =
    sku.mediaList && sku.mediaList.length > 0
      ? sku.mediaList.map((m) => m.fileUrl).slice(0, 5)
      : [sku.primaryImageUrl ?? 'https://via.placeholder.com/400'];

  // '작품 - 상세' 섹션: DETAIL 롤 이미지만 (제한 없음)
  const detailImgs = (sku.mediaList ?? [])
    .filter((m) => m.mediaRole === 'DETAIL')
    .map((m) => m.fileUrl);

  const pageDescription = sku.description
    ? sku.description.slice(0, 155) + (sku.description.length > 155 ? '…' : '')
    : `${sku.name} — KOALA에서 만나는 한국 작가의 작품`;
  const pageImage = sku.primaryImageUrl ?? 'https://koala-art.co.kr/og-image.svg';
  const pageUrl = `https://koala-art.co.kr/products/${sku.skuCode}`;

  return (
    <div className="min-h-screen bg-white relative">
      <Helmet>
        <title>{sku.name} — KOALA</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph — 카카오톡·SNS 공유 시 상품 이미지+이름 노출 */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${sku.name} — KOALA`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:url" content={pageUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${sku.name} — KOALA`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

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
              images={detailImgs}
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

          {/* Trending Artists */}
          <TrendingArtists excludeArtistCode={(sku as any).artistCode} />

        </div>
      </div>
    </div>
  );
}