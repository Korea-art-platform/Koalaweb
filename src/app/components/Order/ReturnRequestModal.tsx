import { useState } from 'react';
import { X } from 'lucide-react';
import { createReturnRequest } from '@/api/order';

interface ReturnRequestModalProps {
  orderNo: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RETURN_REASONS = [
  { value: 'SIMPLE_CHANGE', label: '단순 변심' },
  { value: 'DEFECT', label: '상품 불량/파손' },
  { value: 'WRONG_DELIVERY', label: '오배송' },
  { value: 'OTHER', label: '기타' },
] as const;

export function ReturnRequestModal({ orderNo, onClose, onSuccess }: ReturnRequestModalProps) {
  const [returnType, setReturnType] = useState<'RETURN' | 'EXCHANGE'>('RETURN');
  const [reason, setReason] = useState<string>('SIMPLE_CHANGE');
  const [reasonDetail, setReasonDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await createReturnRequest({
        orderNo,
        returnType,
        reason: reason as 'SIMPLE_CHANGE' | 'DEFECT' | 'WRONG_DELIVERY' | 'OTHER',
        reasonDetail: reasonDetail.trim() || undefined,
      });
      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">반품 / 교환 신청</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 유형 선택 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">신청 유형</label>
            <div className="flex gap-3">
              {(['RETURN', 'EXCHANGE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setReturnType(t)}
                  className={`flex-1 py-2.5 text-sm rounded-xl border transition-colors font-medium ${
                    returnType === t
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {t === 'RETURN' ? '반품' : '교환'}
                </button>
              ))}
            </div>
          </div>

          {/* 사유 선택 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              사유 <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* 상세 사유 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              상세 내용 <span className="text-xs font-normal text-gray-400">(선택)</span>
            </label>
            <textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              rows={3}
              placeholder="자세한 사유를 입력해 주세요"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
            />
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5 leading-relaxed">
            신청 후 영업일 기준 1~3일 내 처리됩니다.
            {returnType === 'RETURN'
              ? ' 반품 승인 시 결제 금액이 자동 환불됩니다.'
              : ' 교환 승인 후 안내에 따라 상품을 발송해 주세요.'}
          </p>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 text-sm bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          >
            {submitting ? '신청 중...' : '신청하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
