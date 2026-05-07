import { useEffect, useState } from 'react';
import { getSku } from '@/api/sku';

interface Props {
  skuCode: string;
}

export default function ProductDetailPag({ skuCode}: Props){
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
             src = {detailImage}
             alt = "상품 상세 설명"
             className= "w-full object-contail"/>
        </div>
    )

}
