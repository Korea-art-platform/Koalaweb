import { useSearchParams, useNavigate } from 'react-router';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message') || '결제가 취소되었습니다.';

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center p-8 max-w-sm">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✕</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
        <p className="text-gray-500 text-sm mb-1">{errorMessage}</p>
        {errorCode && (
          <p className="text-gray-300 text-xs mb-8">({errorCode})</p>
        )}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            장바구니로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
