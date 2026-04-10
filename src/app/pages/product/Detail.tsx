import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { addCartItem } from '@/api/cart';
import { addWishlist, removeWishlist, checkWishlist } from '@/api/wishlist';

import {
  ProductSkeleton,
  ProductNotFound,
  ProductToast,
  ProductImageGallery,
  ProductInfo,
  ProductActions
} from '@/app/components/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('koala');

  const [sku, setSku] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCartLink, setShowCartLink] = useState(false);
  
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

  const showToastMessage = (message: string, isCart: boolean = false) => {
    setToastMessage(message);
    setShowCartLink(isCart);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      window.dispatchEvent(new Event('cart-updated'));
      showToastMessage(t('product.detail.toast.cartAdded'), true);
    } catch (e: any) {
      showToastMessage(e.response?.data?.message || t('product.detail.toast.cartAddFailed'));
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

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
    } catch (e: any) {
      showToastMessage(e.response?.data?.message || t('product.detail.toast.error'));
    }
  };

  if (loading) return <ProductSkeleton />;
  if (!sku) return <ProductNotFound />;

  const images = sku.mediaList?.length > 0
    ? sku.mediaList.map((m: any) => m.fileUrl)
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

      <div className="pt-32 pb-32 px-8">
        <div className="max-w-[1600px] mx-auto">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('product.detail.back')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <ProductImageGallery sku={sku} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            <div className="flex flex-col">
              <ProductInfo sku={sku} />
              <ProductActions sku={sku} cartLoading={cartLoading} isWishlisted={isWishlisted} onAddToCart={handleAddToCart} onWishlist={handleWishlist} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}