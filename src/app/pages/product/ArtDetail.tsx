import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { getArtist } from '@/api/artist';
import type { Sku, Artist } from '@/api/types';
import { ProductSkeleton, ProductNotFound } from '@/app/components/products';
import {
  ArtDetailHeader,
  ArtImages,
  ArtArtist,
  ArtInfo,
  ArtQnA,
} from '@/app/components/ArtDetail';
import { ShareButton } from '@/app/components/common/ShareButton';

export default function ArtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
          } catch { /* artist 없으면 이름만 표시 */ }
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

  // MAIN(대표) → DETAIL(상세) 순서로 모아서 전달. 없으면 primaryImageUrl 폴백
  const mainImage  = sku.mediaList?.find((m) => m.mediaRole === 'MAIN')?.fileUrl ?? sku.primaryImageUrl;
  const detailImgs = sku.mediaList?.filter((m) => m.mediaRole === 'DETAIL').map((m) => m.fileUrl) ?? [];
  const images     = [mainImage, ...detailImgs].filter(Boolean) as string[];

  const artInfoItems = [
    { label: '소재', value: sku.genre ?? '-' },
    { label: '크기', value: (sku as any).widthCm ? `${(sku as any).widthCm}cm × ${(sku as any).heightCm}cm` : '-' },
    { label: '무게', value: (sku as any).weightKg ? `${(sku as any).weightKg}kg` : '-' },
    { label: '배달비용', value: '-' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-24 px-5 md:px-8 max-w-2xl mx-auto w-full">
        {/* 뒤로가기 + 공유 버튼 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            뒤로가기
          </button>
          <ShareButton
            title={sku.name}
            description={sku.description ?? undefined}
            imageUrl={images[0]}
          />
        </div>

        <ArtDetailHeader
          breadcrumb="작품 소개"
          worldViewTitle={sku.name}
          worldViewDesc={sku.description ?? ''}
        />
        <ArtImages images={images} title={sku.name} />
        <ArtArtist
          artistCode={(sku as any).artistCode}
          artistName={sku.artistName}
          artistDescription={artist?.bio}
          artistImageUrl={artist?.profileImageUrl}
        />
        <ArtInfo items={artInfoItems} />
        <ArtQnA />
      </main>
    </div>
  );
}