import Navigation from '../components/layouts/Header';
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
import { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { artworks } from '../../data/artworks/artworks';
import type { Artwork } from './type/artwork';

// --- 유틸리티 함수 ---
function formatPrice(price?: number, currency: 'KRW' | 'USD' = 'KRW') {
  if (!price) return 'Price on Request';
  return currency === 'KRW' ? `₩${price.toLocaleString()}` : `$${price.toLocaleString()}`;
}

function formatDimensions(product: Artwork) {
  const sizes = [product.widthCm, product.heightCm, product.depthCm].filter(
    (value): value is number => typeof value === 'number'
  );
  if (sizes.length === 3) return `${product.widthCm}cm × ${product.heightCm}cm × ${product.depthCm}cm`;
  if (sizes.length === 2) return `${product.widthCm}cm × ${product.heightCm}cm`;
  if (sizes.length === 1) return `${sizes[0]}cm`;
  return '정보 준비 중';
}

function getStatusBadge(status: Artwork['status']) {
  switch (status) {
    case 'available': return { label: 'Available', className: 'bg-green-500/90 text-white' };
    case 'sold': return { label: 'Sold', className: 'bg-gray-900/90 text-white' };
    case 'exhibition': return { label: 'On Exhibition', className: 'bg-blue-500/90 text-white' };
    default: return { label: 'Unknown', className: 'bg-black/80 text-white' };
  }
}

function getSaleTypeLabel(saleType: Artwork['saleType']) {
  switch (saleType) {
    case 'original': return 'Original Artwork';
    case 'limited': return 'Limited Edition';
    case 'goods': return 'Art Goods';
    case 'sculpture': return 'Sculpture';
    case 'digital': return 'Digital';
    default: return 'Artwork';
  }
}

function findRelatedOriginalArtwork(currentProduct: Artwork) {
  const priorityOrder: Artwork['saleType'][] = ['original', 'sculpture', 'limited'];
  return artworks
    .filter(item => item.artistId === currentProduct.artistId && item.id !== currentProduct.id && priorityOrder.includes(item.saleType))
    .sort((a, b) => priorityOrder.indexOf(a.saleType) - priorityOrder.indexOf(b.saleType))[0];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const productData = useMemo(() => artworks.find((item) => item.id === id), [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedImage(0);
  }, [id]);

  const relatedOriginalArtwork = useMemo(() => {
    if (!productData) return undefined;
    return findRelatedOriginalArtwork(productData);
  }, [productData]);

  // --- 장바구니 담기 핵심 로직 수정 ---
  const handleAddToCart = () => {
    if (!productData) return;

    const newItem = {
      id: productData.id,
      name: productData.title,
      artist: productData.artistName,
      price: productData.price || 0,
      quantity: 1,
      image: productData.thumbnailImage,
      size: formatDimensions(productData),
    };

    const savedCart = localStorage.getItem('cart');
    let cartList = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = cartList.findIndex((item: any) => item.id === newItem.id);
    if (existingItemIndex > -1) {
      cartList[existingItemIndex].quantity += 1;
    } else {
      cartList.push(newItem);
    }

    localStorage.setItem('cart', JSON.stringify(cartList));

    // ⭐ 핵심: 헤더에게 장바구니가 업데이트되었음을 알림
    window.dispatchEvent(new Event('cart-updated'));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-8 flex flex-col items-center">
          <h1 className="text-3xl mb-8 font-medium">상품 정보를 찾을 수 없습니다.</h1>
          <Link to="/store" className="px-8 py-4 bg-black text-white rounded-full font-medium transition-transform active:scale-95">
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(productData.status);
  const saleTypeLabel = getSaleTypeLabel(productData.saleType);
  const images = productData.detailImages.length > 0 ? productData.detailImages : [productData.thumbnailImage];

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />

      {/* --- Toast UI --- */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[340px]">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">장바구니에 담겼습니다.</p>
              <Link to="/cart" className="text-xs text-gray-400 underline hover:text-white transition-colors">
                장바구니로 이동하여 결제하기
              </Link>
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
            {/* 왼쪽: 이미지 영역 */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[32px] bg-gray-50 aspect-square border border-gray-100">
                <ImageWithFallback src={images[selectedImage]} alt={productData.title} className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold shadow-sm uppercase tracking-wider text-black border border-gray-100">
                    {saleTypeLabel}
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold shadow-sm border border-white/20 ${statusBadge.className}`}>
                    {statusBadge.label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={`${productData.id}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 border-2 ${
                      selectedImage === index ? 'border-black scale-[0.98]' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback src={image} alt={`${productData.title} ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 오른쪽: 정보 및 구매 영역 */}
            <div className="flex flex-col">
              <div className="mb-8">
                <div className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">{productData.category}</div>
                <h1 className="text-5xl font-medium tracking-tight mb-4 leading-tight">{productData.title}</h1>
                <Link to={`/artist/${productData.artistId}`} className="text-xl text-gray-500 hover:text-black transition-colors inline-block">
                  by {productData.artistName}
                </Link>
              </div>

              <div className="text-4xl font-bold mb-10 tracking-tight">{formatPrice(productData.price, productData.currency)}</div>

              <div className="flex flex-wrap gap-3 mb-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">진품 보증</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">전 세계 배송 가능</span>
                </div>
              </div>

              <div className="space-y-6 border-t border-gray-100 pt-8 mb-10">
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  {productData.description}
                </p>
                <div className="grid grid-cols-2 gap-y-4 pt-4 max-w-sm">
                  <span className="text-sm text-gray-400 font-medium tracking-wide">소재</span>
                  <span className="text-sm font-semibold">{productData.material ?? '정보 준비 중'}</span>
                  <span className="text-sm text-gray-400 font-medium tracking-wide">크기</span>
                  <span className="text-sm font-semibold">{formatDimensions(productData)}</span>
                  <span className="text-sm text-gray-400 font-medium tracking-wide">제작 연도</span>
                  <span className="text-sm font-semibold">{productData.year ?? '2024'}</span>
                </div>
              </div>

              <div className="mt-auto flex gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                >
                  <ShoppingCart className="w-5 h-5" />
                  장바구니 담기
                </button>
                <button className="p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
                  <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
          
          {/* 연관 작품 추천 */}
          {relatedOriginalArtwork && (
            <div className="mt-40 border-t border-gray-100 pt-24">
              <h2 className="text-3xl font-medium tracking-tight mb-12">작가의 다른 작품 둘러보기</h2>
              <div className="bg-gray-50 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback src={relatedOriginalArtwork.thumbnailImage} alt={relatedOriginalArtwork.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-medium mb-2 leading-tight">{relatedOriginalArtwork.title}</h3>
                    <p className="text-lg text-gray-400 font-medium">by {relatedOriginalArtwork.artistName}</p>
                  </div>
                  <Link to={`/product/${relatedOriginalArtwork.id}`} className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 text-black font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                    작품 상세보기 <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}