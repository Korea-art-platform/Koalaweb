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

const BADGE_COLORS: Record<string, string> = {
  green:   'bg-green-50 text-green-700 border-green-200',
  amber:   'bg-amber-50 text-amber-600 border-amber-200',
  blue:    'bg-blue-50 text-blue-600 border-blue-200',
  default: 'bg-gray-50 text-gray-600 border-gray-200',
};

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
          <span className="text-[10px] font-bold px-2.5 py-1 bg-koala-red text-white rounded-full tracking-wide whitespace-nowrap">
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
          <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 rounded-xl px-4 py-3">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${BADGE_COLORS[badge.type] ?? BADGE_COLORS.default}`}
              >
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
