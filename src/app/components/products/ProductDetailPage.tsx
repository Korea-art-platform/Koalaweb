import { useEffect, useState } from 'react';
import { getSku } from '@/api/sku';
import { useTranslation } from 'react-i18next';

interface Props {
  skuCode: string;
}

export default function ProductDetailPage({ skuCode }: Props) {
    const { t } = useTranslation();
    const [detailImage, setDetailImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetailImage = async () => {
            setLoading(true);
            try{
                const res = await getSku(skuCode);
                const mediaList = res.data.data.mediaList?? [];
                const detail = mediaList.find(
                    (m: any) => m.mediaRole === 'DETAIL_PAGE'
                );
                setDetailImage(detail?.fileUrl ?? null);
            }catch (e){
                console.error('상세 이미지 로딩 실패:', e);
            }finally{
                setLoading(false);
            }
        };
        fetchDetailImage();
    }, [skuCode]);
    if(!detailImage) return null;
    return(
        <div className="w-full">
            <img
             src={detailImage}
             alt={t('product.card.detailImage')}
             className="w-full object-contain" />
        </div>
    )
}
