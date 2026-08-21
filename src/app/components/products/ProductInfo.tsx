import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface ColorOption {
  name: string;
  hex: string;
}

interface BadgeItem {
  text: string;
  type: string;
}

const GLASS_CHIP =
  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ' +
  'text-gray-700 border border-white/80 backdrop-blur-md ' +
  'bg-gradient-to-b from-white/90 to-koala-navy/[0.05] ' +
  'shadow-[0_2px_10px_-3px_rgba(62,34,89,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]';

interface Props {
  sku: any;
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
}

export function ProductInfo({ sku, selectedColor, onColorSelect }: Props) {
  const { t } = useTranslation();

  const price = sku.salePrice ?? sku.listPrice;
  const hasDiscount = sku.salePrice && sku.salePrice < sku.listPrice;

  const formatPrice = (val?: number) =>
    val ? val.toLocaleString() : t('product.detail.info.priceOnRequest');

  const colorOptions: ColorOption[] = sku.colorOptions ?? [];

  const badges: BadgeItem[] = (() => {
    try { return sku.badges ? JSON.parse(sku.badges) : []; }
    catch { return []; }
  })();

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          {sku.genre}
        </span>
        {sku.isLimitedEdition && (
          <span className="text-[10px] font-bold px-2.5 py-1 bg-koala-gold text-koala-purple rounded-full tracking-wide whitespace-nowrap">
            {t('product.detail.gallery.limitedEdition')}
          </span>
        )}
      </div>
      <h1 className="text-xl font-bold tracking-tight leading-snug mb-1.5 text-gray-900">
        {sku.name}
      </h1>
      <Link
        to={`/artist/${sku.artistCode}`}
        className="text-sm text-gray-500 hover:text-black transition-colors mb-5 w-fit"
      >
        {sku.artistName}
      </Link>
      <div className="mb-5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={`text-2xl font-bold tracking-tight ${hasDiscount ? 'text-koala-red' : 'text-gray-900'}`}>
            {formatPrice(price)}
          </span>
          <span className={`text-sm font-semibold ${hasDiscount ? 'text-koala-red' : 'text-gray-500'}`}>KRW</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(sku.listPrice)}
            </span>
          )}
        </div>

        {sku.isLimitedEdition && sku.editionNumber && sku.editionSize && (
          <p className="text-xs text-gray-400 mt-1.5">
            {t('product.detail.info.edition', {
              current: sku.editionNumber,
              total: sku.editionSize,
            })}
          </p>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((badge, idx) => (
              <span key={idx} className={GLASS_CHIP}>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-koala-navy to-koala-red/70"
                  aria-hidden
                />
                {badge.text}
              </span>
            ))}
          </div>
        )}
      </div>

      {colorOptions.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            {colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorSelect?.(color.name)}
                title={color.name}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
                  selectedColor === color.name
                    ? 'border-gray-900 scale-110 shadow'
                    : 'border-gray-200 hover:scale-105 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 mb-5" />

      {sku.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{sku.description}</p>
      )}

      {(sku.widthCm || sku.weightKg) && (
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
          {sku.widthCm && (
            <>
              <span className="text-gray-400 whitespace-nowrap">{t('product.detail.info.size')}</span>
              <span className="font-medium text-gray-700">
                {sku.widthCm}cm × {sku.heightCm}cm
                {sku.depthCm && ` × ${sku.depthCm}cm`}
              </span>
            </>
          )}
          {sku.weightKg && (
            <>
              <span className="text-gray-400">{t('product.detail.info.weight')}</span>
              <span className="font-medium text-gray-700">{sku.weightKg}kg</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
