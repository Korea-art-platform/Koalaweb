import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createReturnRequest } from '@/api/order';

interface ReturnRequestModalProps {
  orderNo: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RETURN_REASON_KEYS = ['SIMPLE_CHANGE', 'DEFECT', 'WRONG_DELIVERY', 'OTHER'] as const;

export function ReturnRequestModal({ orderNo, onClose, onSuccess }: ReturnRequestModalProps) {
  const { t } = useTranslation();
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
      setError(e?.response?.data?.message ?? t('order.detail.returnModal.errorDefault'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{t('order.detail.returnModal.title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 유형 선택 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              {t('order.detail.returnModal.typeLabel')}
            </label>
            <div className="flex gap-3">
              {(['RETURN', 'EXCHANGE'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReturnType(type)}
                  className={`flex-1 py-2.5 text-sm rounded-xl border transition-colors font-medium ${
                    returnType === type
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {type === 'RETURN'
                    ? t('order.detail.returnModal.typeReturn')
                    : t('order.detail.returnModal.typeExchange')}
                </button>
              ))}
            </div>
          </div>

          {/* 사유 선택 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              {t('order.detail.returnModal.reasonLabel')} <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
            >
              {RETURN_REASON_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`order.detail.returnModal.reasons.${key}`)}
                </option>
              ))}
            </select>
          </div>

          {/* 상세 사유 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              {t('order.detail.returnModal.detailLabel')}{' '}
              <span className="text-xs font-normal text-gray-400">
                {t('order.detail.returnModal.detailOptional')}
              </span>
            </label>
            <textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              rows={3}
              placeholder={t('order.detail.returnModal.detailPlaceholder')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
            />
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5 leading-relaxed">
            {t('order.detail.returnModal.noticeDefault')}
            {returnType === 'RETURN'
              ? t('order.detail.returnModal.noticeReturn')
              : t('order.detail.returnModal.noticeExchange')}
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
            {t('order.detail.returnModal.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 text-sm bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          >
            {submitting
              ? t('order.detail.returnModal.submitting')
              : t('order.detail.returnModal.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
