import Navigation from '../../components/layouts/Header';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Globe,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from '../../components/fallback/ImageWithFallback';
import { getSku, getSkuReviews } from '../../../api/sku';
import { addCartItem } from '../../../api/cart';
import { addWishlist, removeWishlist, checkWishlist } from '../../../api/wishlist';

function formatPrice(price?: number) {
  if (!price) return 'Price on Request';
  return `₩${price.toLocaleString()}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sku, setSku] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedImage(0);

    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(id!);
        setSku(res.data.data);

        // 위시리스트 여부 확인
        const token = localStorage.getItem('accessToken');
        if (token) {
          const wishRes = await checkWishlist(id!);
          setIsWishlisted(wishRes.data.data);
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [id]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      window.dispatchEvent(new Event('cart-updated'));
      showToastMessage('장바구니에 담겼습니다.');
    } catch (e: any) {
      showToastMessage(e.response?.data?.message || '장바구니 담기 실패');
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      if (isWishlisted) {
        await removeWishlist(sku.skuCode);
        setIsWishlisted(false);
        showToastMessage('위시리스트에서 삭제됐습니다.');
      } else {
        await addWishlist(sku.skuCode);
        setIsWishlisted(true);
        showToastMessage('위시리스트에 추가됐습니다.');
      }
    } catch (e: any) {
      showToastMessage(e.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-8">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-[32px]" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-12 bg-gray-100 rounded w-1/2" />
              <div className="h-6 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sku) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-8 flex flex-col items-center">
          <h1 className="text-3xl mb-8 font-medium">상품 정보를 찾을 수 없습니다.</h1>
          <Link to="/store" className="px-8 py-4 bg-black text-white rounded-full font-medium">
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const images = sku.mediaList?.length > 0
    ? sku.mediaList.map((m: any) => m.fileUrl)
    : [sku.primaryImageUrl ?? 'https://via.placeholder.com/400'];

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[340px]">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{toastMessage}</p>
              {toastMessage.includes('장바구니') && (
                <Link to="/cart" className="text-xs text-gray-400 underline hover:text-white transition-colors">
                  장바구니로 이동하여 결제하기
                </Link>
              )}
            </div>
            <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-32 pb-32 px-8">
        <div className="max-w-[1600px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            뒤로가기
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* 왼쪽: 이미지 */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[32px] bg-gray-50 aspect-square border border-gray-100">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={sku.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold shadow-sm uppercase tracking-wider text-black border border-gray-100">
                    {sku.genre}
                  </div>
                  {sku.isLimitedEdition && (
                    <div className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase shadow-sm">
                      Limited Edition
                    </div>
                  )}
                </div>
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold shadow-sm ${sku.status === 'ACTIVE' ? 'bg-green-500/90 text-white'
                    : sku.status === 'OUT_OF_STOCK' ? 'bg-gray-900/90 text-white'
                      : 'bg-blue-500/90 text-white'
                    }`}>
                    {sku.status === 'ACTIVE' ? 'Available'
                      : sku.status === 'OUT_OF_STOCK' ? 'Sold Out'
                        : sku.status}
                  </div>
                </div>
              </div>

              {/* 썸네일 이미지 */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 border-2 ${selectedImage === index
                        ? 'border-black scale-[0.98]'
                        : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${sku.name} ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽: 정보 */}
            <div className="flex flex-col">
              <div className="mb-8">
                <div className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">
                  {sku.genre}
                </div>
                <h1 className="text-5xl font-medium tracking-tight mb-4 leading-tight">
                  {sku.name}
                </h1>
                <Link
                  to={`/artist/${sku.artistCode}`}
                  className="text-xl text-gray-500 hover:text-black transition-colors inline-block"
                >
                  by {sku.artistName}
                </Link>
              </div>

              <div className="text-4xl font-bold mb-10 tracking-tight">
                {formatPrice(sku.salePrice ?? sku.listPrice)}
                {sku.salePrice && sku.salePrice < sku.listPrice && (
                  <span className="text-xl text-gray-400 line-through ml-4">
                    {formatPrice(sku.listPrice)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">진품 보증</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">전 세계 배송 가능</span>
                </div>
                {sku.isLimitedEdition && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
                    <span className="text-xs font-medium text-gray-600">
                      {sku.editionNumber} / {sku.editionSize} Edition
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-6 border-t border-gray-100 pt-8 mb-10">
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  {sku.description}
                </p>
                <div className="grid grid-cols-2 gap-y-4 pt-4 max-w-sm">
                  {sku.widthCm && (
                    <>
                      <span className="text-sm text-gray-400 font-medium tracking-wide">크기</span>
                      <span className="text-sm font-semibold">
                        {sku.widthCm}cm × {sku.heightCm}cm
                        {sku.depthCm && ` × ${sku.depthCm}cm`}
                      </span>
                    </>
                  )}
                  {sku.weightKg && (
                    <>
                      <span className="text-sm text-gray-400 font-medium tracking-wide">무게</span>
                      <span className="text-sm font-semibold">{sku.weightKg}kg</span>
                    </>
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="mt-auto flex gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
                  className="flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {sku.status === 'OUT_OF_STOCK' ? '품절' : cartLoading ? '담는 중...' : '장바구니 담기'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
                >
                  <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
