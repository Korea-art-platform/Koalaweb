import Navigation from '../components/layouts/Header';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Package,
  Shield,
  Globe,
  Box,
  ExternalLink,
  CheckCircle2, // Toast용 아이콘 추가
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { artworks } from '../../data/artworks/artworks';
import type { Artwork } from './type/artwork';

// --- 유틸리티 함수 (기존과 동일) ---
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
  const [showToast, setShowToast] = useState(false); // Toast 노출 상태

  const productData = useMemo(() => artworks.find((item) => item.id === id), [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSelectedImage(0);
  }, [id]);

  const relatedOriginalArtwork = useMemo(() => {
    if (!productData) return undefined;
    return findRelatedOriginalArtwork(productData);
  }, [productData]);

  // --- 장바구니 담기 핵심 로직 ---
  const handleAddToCart = () => {
    if (!productData) return;

    // 1. 저장할 아이템 객체 생성
    const newItem = {
      id: productData.id,
      name: productData.title,
      artist: productData.artistName,
      price: productData.price || 0,
      quantity: 1,
      image: productData.thumbnailImage,
      size: formatDimensions(productData),
    };

    // 2. localStorage에서 기존 카트 데이터 가져오기
    const savedCart = localStorage.getItem('cart');
    let cartList = savedCart ? JSON.parse(savedCart) : [];

    // 3. 중복 확인
    const existingItemIndex = cartList.findIndex((item: any) => item.id === newItem.id);
    if (existingItemIndex > -1) {
      cartList[existingItemIndex].quantity += 1;
    } else {
      cartList.push(newItem);
    }

    // 4. localStorage에 다시 저장
    localStorage.setItem('cart', JSON.stringify(cartList));

    // 5. Toast 메시지 표시
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // 3초 후 사라짐
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-8 flex flex-col items-center">
          <h1 className="text-3xl mb-8">상품 정보를 찾을 수 없습니다.</h1>
          <Link to="/store" className="px-6 py-3 bg-black text-white rounded-full">스토어로 돌아가기</Link>
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
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <p className="text-sm font-medium">장바구니에 담겼습니다.</p>
              <Link to="/cart" className="text-xs text-gray-400 underline hover:text-white transition-colors">
                장바구니로 이동하기
              </Link>
            </div>
            <button onClick={() => setShowToast(false)}>
              <X className="w-4 h-4 text-gray-500 hover:text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-32 pb-32 px-8">
        <div className="max-w-[1600px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Images Left */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-square">
                <ImageWithFallback src={images[selectedImage]} alt={productData.title} className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium">{saleTypeLabel}</div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2.5 rounded-full backdrop-blur-sm text-sm ${statusBadge.className}`}>{statusBadge.label}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <button
                    key={`${productData.id}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-xl aspect-square ${selectedImage === index ? 'ring-2 ring-black' : 'opacity-60'}`}
                  >
                    <ImageWithFallback src={image} alt={`${productData.title} ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info Right */}
            <div className="space-y-8">
              <div>
                <div className="text-sm text-gray-400 tracking-wide uppercase mb-3">{productData.category}</div>
                <h1 className="text-4xl mb-4">{productData.title}</h1>
                <Link to={`/artist/${productData.artistId}`} className="text-lg text-gray-500 hover:text-black transition-colors">
                  by {productData.artistName}
                </Link>
              </div>

              <div className="text-3xl font-medium">{formatPrice(productData.price, productData.currency)}</div>

              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{saleTypeLabel}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Global Shipping</span>
                </div>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
                {productData.description}
              </p>

              {/* Specs */}
              <div className="space-y-3 pt-6">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Materials</span><span>{productData.material ?? 'Preparing info'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Dimensions</span><span>{formatDimensions(productData)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Year</span><span>{productData.year ?? '2024'}</span></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-10">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-black text-white rounded-full hover:bg-gray-800 transition-transform active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="p-5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Related Artwork (기존 로직 유지) */}
          {relatedOriginalArtwork && (
             <div className="mt-32">
                <h2 className="text-3xl mb-8">View Related Artwork</h2>
                <div className="bg-gray-50 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white">
                        <ImageWithFallback src={relatedOriginalArtwork.thumbnailImage} alt={relatedOriginalArtwork.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-2xl mb-2">{relatedOriginalArtwork.title}</h3>
                        <p className="text-gray-500 mb-6">by {relatedOriginalArtwork.artistName}</p>
                        <Link to={`/product/${relatedOriginalArtwork.id}`} className="px-6 py-3 bg-black text-white rounded-full inline-flex items-center gap-2">
                            View Details <ExternalLink className="w-4 h-4" />
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