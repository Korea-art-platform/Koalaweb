import { useState, useEffect, useCallback } from 'react';
import { getAdminSkus, publishSku, discontinueSku, deleteSku, adjustStock } from '@/api/adminApi';
import { Package } from 'lucide-react';

const SKU_STATUS_COLOR: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-500',
  PUBLISHED: 'bg-green-50 text-green-700',
  DISCONTINUED: 'bg-red-50 text-red-600',
};
const SKU_STATUS_LABEL: Record<string, string> = {
  DRAFT: '임시저장', PUBLISHED: '판매중', DISCONTINUED: '판매중단',
};

export default function AdminProductList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stockModal, setStockModal] = useState<{ skuCode: string; current: number } | null>(null);
  const [delta, setDelta] = useState('');
  const [memo, setMemo] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getAdminSkus(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handlePublish = async (skuCode: string) => {
    await publishSku(skuCode);
    load();
  };

  const handleDiscontinue = async (skuCode: string) => {
    if (!window.confirm('판매 중단하시겠습니까?')) return;
    await discontinueSku(skuCode);
    load();
  };

  const handleDelete = async (skuCode: string) => {
    if (!window.confirm('삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    await deleteSku(skuCode);
    load();
  };

  const handleStockAdjust = async () => {
    if (!stockModal || !delta) return;
    setAdjusting(true);
    try {
      await adjustStock(stockModal.skuCode, Number(delta), memo || undefined);
      setStockModal(null);
      setDelta('');
      setMemo('');
      load();
    } finally {
      setAdjusting(false);
    }
  };

  const skus: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Package className="w-3.5 h-3.5" />
        <span>상품 관리</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">상품 (SKU) 목록</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : skus.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">등록된 상품이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">상품명</th>
                  <th className="text-left px-5 py-3 font-medium">아티스트</th>
                  <th className="text-left px-5 py-3 font-medium">판매가</th>
                  <th className="text-left px-5 py-3 font-medium">재고</th>
                  <th className="text-left px-5 py-3 font-medium">상태</th>
                  <th className="text-left px-5 py-3 font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {skus.map((sku: any) => (
                  <tr key={sku.skuCode} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{sku.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{sku.skuCode}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{sku.artistName}</td>
                    <td className="px-5 py-4 text-gray-700 tabular-nums whitespace-nowrap">
                      {Number(sku.effectivePrice).toLocaleString()}원
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setStockModal({ skuCode: sku.skuCode, current: sku.stockQuantity })}
                        className="font-medium text-gray-700 hover:text-black tabular-nums underline decoration-dashed underline-offset-2"
                        title="클릭하여 재고 조정"
                      >
                        {sku.stockQuantity}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${SKU_STATUS_COLOR[sku.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {SKU_STATUS_LABEL[sku.status] ?? sku.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        {sku.status === 'DRAFT' && (
                          <button onClick={() => handlePublish(sku.skuCode)} className="text-xs text-green-600 hover:text-green-800 font-medium">게시</button>
                        )}
                        {sku.status === 'PUBLISHED' && (
                          <button onClick={() => handleDiscontinue(sku.skuCode)} className="text-xs text-orange-500 hover:text-orange-700 font-medium">중단</button>
                        )}
                        {sku.status === 'DISCONTINUED' && (
                          <button onClick={() => handlePublish(sku.skuCode)} className="text-xs text-blue-500 hover:text-blue-700 font-medium">재게시</button>
                        )}
                        <button onClick={() => handleDelete(sku.skuCode)} className="text-xs text-red-400 hover:text-red-600 font-medium">삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">이전</button>
          <span className="text-xs text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">다음</button>
        </div>
      )}

      {stockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-1">재고 조정</h2>
            <p className="text-xs text-gray-400 mb-4">현재 재고: {stockModal.current}개</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">조정 수량 (양수: 입고, 음수: 차감)</label>
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="예: 10 또는 -5"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">메모 (선택)</label>
                <input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="조정 사유 입력"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setStockModal(null); setDelta(''); setMemo(''); }} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleStockAdjust} disabled={adjusting || !delta || isNaN(Number(delta))} className="flex-1 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">{adjusting ? '처리 중...' : '적용'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
