import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getAdminReturn, processReturn, completeReturn } from '@/api/adminApi';
import { ArrowLeft, Check, X } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: '신청됨',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  COMPLETED: '완료',
};

const STATUS_COLOR: Record<string, string> = {
  REQUESTED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
};

const TYPE_LABEL: Record<string, string> = { RETURN: '반품', EXCHANGE: '교환' };
const REASON_LABEL: Record<string, string> = {
  SIMPLE_CHANGE: '단순 변심',
  DEFECT: '상품 불량/파손',
  WRONG_DELIVERY: '오배송',
  OTHER: '기타',
};

export default function AdminReturnDetail() {
  const { returnNo } = useParams<{ returnNo: string }>();
  const navigate = useNavigate();
  const [ret, setRet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [processOpen, setProcessOpen] = useState(false);
  const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [refundAmount, setRefundAmount] = useState('');
  const [adminMemo, setAdminMemo] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState('');

  const reload = useCallback(() => {
    if (!returnNo) return;
    setLoading(true);
    getAdminReturn(returnNo).then(setRet).finally(() => setLoading(false));
  }, [returnNo]);

  useEffect(() => { reload(); }, [reload]);

  const handleProcess = async () => {
    if (!returnNo) return;
    if (action === 'APPROVE' && refundAmount && Number(refundAmount) <= 0) {
      setProcessError('환불 금액을 올바르게 입력해주세요.');
      return;
    }
    setProcessing(true);
    setProcessError('');
    try {
      await processReturn(
        returnNo,
        action,
        refundAmount ? Number(refundAmount) : undefined,
        adminMemo.trim() || undefined
      );
      setProcessOpen(false);
      setAdminMemo('');
      setRefundAmount('');
      reload();
    } catch (e: any) {
      setProcessError(e?.response?.data?.message ?? '처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!returnNo || !window.confirm('완료 처리하시겠습니까?')) return;
    await completeReturn(returnNo);
    reload();
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  if (!ret) return <div className="p-8 text-sm text-gray-400">요청을 찾을 수 없습니다.</div>;

  const isRequested = ret.status === 'REQUESTED';
  const isApproved = ret.status === 'APPROVED';

  return (
    <div className="p-8 max-w-2xl">
      <button
        onClick={() => navigate('/admin/returns')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> 목록으로
      </button>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">{ret.returnNo}</p>
          <h1 className="text-xl font-bold text-gray-900">
            {TYPE_LABEL[ret.returnType] ?? ret.returnType} 상세
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
          {isRequested && (
            <>
              <button
                onClick={() => { setAction('APPROVE'); setProcessOpen(true); setProcessError(''); }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> 승인
              </button>
              <button
                onClick={() => { setAction('REJECT'); setProcessOpen(true); setProcessError(''); }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> 거절
              </button>
            </>
          )}
          {isApproved && ret.returnType === 'EXCHANGE' && (
            <button
              onClick={handleComplete}
              className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
            >
              교환 완료 처리
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Section title="처리 상태">
          <Row label="현재 상태" value={
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[ret.status] ?? ''}`}>
              {STATUS_LABEL[ret.status] ?? ret.status}
            </span>
          } />
          <Row label="신청일" value={new Date(ret.createdAt).toLocaleString('ko-KR')} />
          {ret.processedAt && (
            <Row label="처리일" value={new Date(ret.processedAt).toLocaleString('ko-KR')} />
          )}
        </Section>
        <Section title="신청 정보">
          <Row label="유형" value={TYPE_LABEL[ret.returnType] ?? ret.returnType} />
          <Row label="사유" value={REASON_LABEL[ret.reason] ?? ret.reason} />
          {ret.reasonDetail && <Row label="상세 내용" value={ret.reasonDetail} />}
        </Section>
        <Section title="주문 정보">
          <Row label="주문번호" value={ret.orderNo} mono />
          <Row label="회원 ID" value={String(ret.userId ?? '-')} />
          <Row label="주문자" value={ret.ordererName ?? '-'} />
          <Row label="연락처" value={ret.ordererPhone ?? '-'} />
        </Section>

        {(ret.refundAmount != null || ret.adminMemo) && (
          <Section title="처리 결과">
            {ret.refundAmount != null && (
              <Row label="환불 금액" value={Number(ret.refundAmount).toLocaleString() + '원'} />
            )}
            {ret.adminMemo && <Row label="처리 메모" value={ret.adminMemo} />}
          </Section>
        )}
      </div>

      {processOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-1">
              {action === 'APPROVE' ? '반품/교환 승인' : '반품/교환 거절'}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              {action === 'APPROVE'
                ? '승인 시 결제 완료 건은 자동 환불이 시도됩니다.'
                : '거절 사유를 메모에 남겨주세요.'}
            </p>
            <div className="space-y-4">
              {action === 'APPROVE' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    환불 금액 <span className="text-gray-400">(비우면 전액 환불)</span>
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    min={1}
                    placeholder="환불 금액 입력 (선택)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">처리 메모 (선택)</label>
                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  rows={3}
                  placeholder="처리 내용이나 고객 안내 메시지 입력"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                />
              </div>

              {processError && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{processError}</p>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setProcessOpen(false); setAdminMemo(''); setRefundAmount(''); }}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={handleProcess}
                disabled={processing}
                className={`flex-1 py-2.5 text-sm text-white rounded-lg disabled:opacity-50 ${
                  action === 'APPROVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {processing ? '처리 중...' : action === 'APPROVE' ? '승인 확정' : '거절 확정'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start py-1.5 text-sm border-b border-gray-50 last:border-0 gap-4">
      <span className="text-gray-400 flex-shrink-0">{label}</span>
      <span className={`text-gray-800 font-medium text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
