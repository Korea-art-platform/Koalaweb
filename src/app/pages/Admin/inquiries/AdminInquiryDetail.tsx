import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MessageCircle, Send, CheckCircle } from 'lucide-react';
import {
  getAdminInquiry,
  answerInquiry,
  closeInquiry,
  type AdminInquiryResponse,
} from '@/api/adminApi';

const STATUS_LABELS: Record<string, string> = {
  PENDING:  '미답변',
  ANSWERED: '답변완료',
  CLOSED:   '종결',
};
const STATUS_STYLES: Record<string, string> = {
  PENDING:  'bg-yellow-50 text-yellow-700',
  ANSWERED: 'bg-green-50 text-green-700',
  CLOSED:   'bg-gray-100 text-gray-500',
};
const CATEGORY_LABELS: Record<string, string> = {
  ORDER:    '주문 문의',
  PRODUCT:  '상품 문의',
  PAYMENT:  '결제 문의',
  DELIVERY: '배송 문의',
  RETURN:   '반품/교환',
  OTHER:    '기타',
};

export default function AdminInquiryDetail() {
  const { inquiryCode } = useParams<{ inquiryCode: string }>();
  const navigate = useNavigate();

  const [inquiry, setInquiry]   = useState<AdminInquiryResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [answer, setAnswer]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!inquiryCode) return;
    setLoading(true);
    getAdminInquiry(inquiryCode)
      .then((data) => {
        setInquiry(data);
        setAnswer(data.answerContent ?? '');
      })
      .finally(() => setLoading(false));
  }, [inquiryCode]);

  const handleAnswer = async () => {
    if (!answer.trim()) { setError('답변 내용을 입력해주세요.'); return; }
    if (!inquiryCode) return;
    setError('');
    setSubmitting(true);
    try {
      const updated = await answerInquiry(inquiryCode, answer);
      setInquiry(updated);
    } catch {
      setError('답변 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!inquiryCode) return;
    if (!window.confirm('이 문의를 종결 처리하시겠습니까?')) return;
    await closeInquiry(inquiryCode);
    setInquiry((prev) => prev ? { ...prev, status: 'CLOSED' } : prev);
  };

  if (loading) {
    return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  }
  if (!inquiry) {
    return <div className="p-8 text-sm text-gray-400">문의를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate('/admin/inquiries')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        목록으로
      </button>

      {/* 헤더 */}
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <MessageCircle className="w-3.5 h-3.5" />
        <span>1:1 문의</span>
      </div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          {inquiry.isSecret && <span className="text-gray-400 mr-1.5">🔒</span>}
          {inquiry.title}
        </h1>
        <span className={`px-2.5 py-1 text-xs rounded-full font-medium whitespace-nowrap flex-shrink-0 ${STATUS_STYLES[inquiry.status]}`}>
          {STATUS_LABELS[inquiry.status]}
        </span>
      </div>

      {/* 메타 정보 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-gray-400">작성자</span>
          <p className="text-gray-800 font-medium mt-0.5">{inquiry.userName}</p>
          <p className="text-gray-400">{inquiry.userEmail}</p>
        </div>
        <div>
          <span className="text-gray-400">분류</span>
          <p className="text-gray-800 font-medium mt-0.5">{CATEGORY_LABELS[inquiry.category] ?? inquiry.category}</p>
        </div>
        {inquiry.orderNo && (
          <div>
            <span className="text-gray-400">연결 주문</span>
            <p className="text-gray-800 font-medium mt-0.5 font-mono">{inquiry.orderNo}</p>
          </div>
        )}
        <div>
          <span className="text-gray-400">등록일</span>
          <p className="text-gray-800 font-medium mt-0.5">
            {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>

      {/* 문의 내용 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="text-xs font-medium text-gray-400 mb-3">문의 내용</h2>
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{inquiry.content}</p>
      </div>

      {/* 기존 답변 */}
      {inquiry.status !== 'PENDING' && inquiry.answerContent && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-medium text-blue-600">
              등록된 답변
              {inquiry.answeredByName && (
                <span className="text-blue-400 ml-1.5">— {inquiry.answeredByName}</span>
              )}
              {inquiry.answeredAt && (
                <span className="text-blue-300 ml-1.5">
                  {new Date(inquiry.answeredAt).toLocaleDateString('ko-KR')}
                </span>
              )}
            </h2>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{inquiry.answerContent}</p>
        </div>
      )}

      {/* 답변 작성/수정 (종결 전까지) */}
      {inquiry.status !== 'CLOSED' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-xs font-medium text-gray-500 mb-3">
            {inquiry.status === 'ANSWERED' ? '답변 수정' : '답변 작성'}
          </h2>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            placeholder="고객에게 전달할 답변을 입력하세요..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <div className="flex gap-2 mt-4">
            {inquiry.status === 'ANSWERED' && (
              <button
                onClick={handleClose}
                className="px-4 py-2.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
              >
                종결 처리
              </button>
            )}
            <button
              onClick={handleAnswer}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? '저장 중...' : inquiry.status === 'ANSWERED' ? '답변 수정' : '답변 등록'}
            </button>
          </div>
        </div>
      )}

      {inquiry.status === 'CLOSED' && (
        <div className="mt-4 text-center text-xs text-gray-400 py-4">이 문의는 종결 처리되었습니다.</div>
      )}
    </div>
  );
}
