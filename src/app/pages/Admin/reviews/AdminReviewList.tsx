import { useState, useEffect, useCallback } from 'react';
import { getPendingReviews, moderateReview, setFeaturedReview } from '@/api/adminApi';
import { Star } from 'lucide-react';

export default function AdminReviewList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getPendingReviews(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleModerate = async (reviewCode: string, action: 'APPROVE' | 'HIDE' | 'REJECT') => {
    await moderateReview(reviewCode, action);
    load();
  };

  const handleFeatured = async (reviewCode: string, currentFeatured: boolean) => {
    await setFeaturedReview(reviewCode, !currentFeatured);
    load();
  };

  const reviews: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Star className="w-3.5 h-3.5" />
        <span>리뷰 관리</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">승인 대기 리뷰</h1>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          승인 대기 중인 리뷰가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <div key={r.reviewCode} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{r.skuName}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${r.isVisible ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.reviewStatus}
                    </span>
                  </div>
                  {r.title && (
                    <p className="text-sm font-semibold text-gray-900 mb-1">{r.title}</p>
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed break-keep">{r.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {r.userName} · {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                    {r.likeCount > 0 && ` · 좋아요 ${r.likeCount}`}
                    {r.reportCount > 0 && ` · 신고 ${r.reportCount}`}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleModerate(r.reviewCode, 'APPROVE')}
                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleModerate(r.reviewCode, 'HIDE')}
                    className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    숨김
                  </button>
                  <button
                    onClick={() => handleModerate(r.reviewCode, 'REJECT')}
                    className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    거절
                  </button>
                  <button
                    onClick={() => handleFeatured(r.reviewCode, r.isFeatured)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${r.isFeatured ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-600'}`}
                  >
                    {r.isFeatured ? '★ 추천중' : '☆ 추천'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">이전</button>
          <span className="text-xs text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">다음</button>
        </div>
      )}
    </div>
  );
}
