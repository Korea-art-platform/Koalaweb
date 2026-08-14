import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/app/hooks/useCart';
import { CartSkeleton } from '@/app/components/Cart';
import { EmptyCart } from '@/app/components/Cart';
import { CartItem } from '@/app/components/Cart';
import { OrderSummary } from '@/app/components/Cart';

export default function Cart() {
  const { t } = useTranslation();

  const {
    loading,
    cartItems,
    subtotal,
    shipping,
    total,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart
  } = useCart();

  if (loading) return <CartSkeleton />;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-medium tracking-tight mb-2">{t('cart.title')}</h1>
            <p className="text-sm text-gray-400">
              {cartItems.length === 0
                ? t('cart.emptyMessage')
                : t('cart.itemCount', { count: cartItems.length })}
            </p>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}

                <div className="flex items-center justify-between pt-4">
                  <Link
                    to="/store"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />

                    {t('cart.emptyState.continueShopping')}
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                    {t('cart.clearAll')}
                  </button>
                </div>
              </div>
              <div className="lg:col-span-1">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
