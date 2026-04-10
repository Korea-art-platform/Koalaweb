import { Link } from 'react-router';
import { Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProductInfo({ sku }: { sku: any }) {
  const { t } = useTranslation('koala');

  const formatPrice = (price?: number) => {
    if (!price) return t('product.detail.info.priceOnRequest');
    return `₩${price.toLocaleString()}`;
  };

  return (
    <>
      <div className="mb-8">
        <div className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">{sku.genre}</div>
        <h1 className="text-5xl font-medium tracking-tight mb-4 leading-tight">{sku.name}</h1>
        <Link to={`/artist/${sku.artistCode}`} className="text-xl text-gray-500 hover:text-black transition-colors inline-block">
          {t('product.detail.info.by')} {sku.artistName}
        </Link>
      </div>

      <div className="text-4xl font-bold mb-10 tracking-tight">
        {formatPrice(sku.salePrice ?? sku.listPrice)}
        {sku.salePrice && sku.salePrice < sku.listPrice && (
          <span className="text-xl text-gray-400 line-through ml-4">{formatPrice(sku.listPrice)}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">{t('product.detail.info.authentic')}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">{t('product.detail.info.globalShipping')}</span>
        </div>
        {sku.isLimitedEdition && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-600">
              {t('product.detail.info.edition', { current: sku.editionNumber, total: sku.editionSize })}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6 border-t border-gray-100 pt-8 mb-10">
        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">{sku.description}</p>
        <div className="grid grid-cols-2 gap-y-4 pt-4 max-w-sm">
          {sku.widthCm && (
            <><span className="text-sm text-gray-400 font-medium tracking-wide">{t('product.detail.info.size')}</span><span className="text-sm font-semibold">{sku.widthCm}cm × {sku.heightCm}cm{sku.depthCm && ` × ${sku.depthCm}cm`}</span></>
          )}
          {sku.weightKg && (
            <><span className="text-sm text-gray-400 font-medium tracking-wide">{t('product.detail.info.weight')}</span><span className="text-sm font-semibold">{sku.weightKg}kg</span></>
          )}
        </div>
      </div>
    </>
  );
}