import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import type { Sku, Artist } from '@/api/types';
import { ProductSkeleton, ProductNotFound } from '@/app/components/products';
import {
  ArtDetailHeader,
  ArtImages,
  ArtMaterial,
  ArtPackaging,
  ArtArtist,
  ArtInfo,
  ArtQnA,
} from '@/app/components/ArtDetail';
import { ShareButton } from '@/app/components/common/ShareButton';
import { useCategories } from '@/app/hooks/useCategories';
import { sizeText, weightText } from '@/app/lib/skuSpec';
import { useTranslation } from 'react-i18next';
import { FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT, SHIPPING_FEE_AMOUNT_TEXT } from '@/app/lib/shipping';

export default function ArtDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { subLabel } = useCategories();
  const [sku, setSku] = useState<Sku | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const fetchData = async () => {
      setLoading(true);
      try {
        const skuRes = await getSku(id!);
        const skuData: Sku = skuRes.data.data;
        setSku(skuData);
        if ((skuData as any).artistCode) {
          try {
            const artistRes = await getArtist((skuData as any).artistCode);
            setArtist(artistRes.data.data);
          } catch {  }
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <ProductSkeleton />;
  if (!sku) return <ProductNotFound />;

  const mainImage = sku.mediaList?.find((m) => m.mediaRole === 'MAIN')?.fileUrl ?? sku.primaryImageUrl;

  const detailImgs = sku.mediaList
    ?.filter((m) => m.mediaRole === 'DETAIL')
    .map((m) => m.fileUrl) ?? [];

  const materialImgs = sku.mediaList
    ?.filter((m) => m.mediaRole === 'MATERIAL')
    .map((m) => m.fileUrl) ?? [];

  const packagingImgs = sku.mediaList
    ?.filter((m) => m.mediaRole === 'PACKAGING')
    .map((m) => m.fileUrl) ?? [];

  const artInfoItems = [
    { label: t('product.info.genre'), value: subLabel(sku.genre) || '-' },
    { label: t('product.card.material'), value: sku.material || '-' },
    { label: t('product.card.size'), value: sizeText(sku.widthCm, (sku as any).depthCm, sku.heightCm) ?? '-' },
    { label: t('product.card.weight'), value: weightText((sku as any).weightG, sku.weightKg) ?? '-' },
    { label: t('product.info.shipping'), value: t('product.info.shippingSummary', { fee: SHIPPING_FEE_AMOUNT_TEXT, thresholdAmount: FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT }) },
  ];

  return (
    <div className="flex-1">
      <main className="pt-24 pb-24 px-5 md:px-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('product.info.back')}
          </button>
          <ShareButton
            title={sku.name}
            description={sku.description ?? undefined}
            imageUrl={mainImage ?? undefined}
          />
        </div>
        <ArtDetailHeader
          breadcrumb={t('art.header.breadcrumb')}
          worldViewTitle={sku.name}
          worldViewDesc={sku.description ?? ''}
        />
        <ArtImages images={detailImgs} title={sku.name} />
        <ArtMaterial
          images={materialImgs}
          description={sku.materialDescription}
          title={sku.name}
        />
        <ArtPackaging
          images={packagingImgs}
          packagingTitle={sku.packagingTitle}
          packagingDescription={sku.packagingDescription}
          title={sku.name}
        />
        <ArtArtist
          artistCode={(sku as any).artistCode}
          artistName={sku.artistName}
          artistDescription={artist?.description}
          artistImageUrl={artist?.profileImageUrl}
        />
        <ArtInfo items={artInfoItems} />
        <ArtQnA />
      </main>
    </div>
  );
}
