import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Plus, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {
  createInquiry,
  getMyInquiries,
  deleteMyInquiry,
  INQUIRY_CATEGORIES,
  type InquiryResponse,
  type CreateInquiryRequest,
} from '@/api/inquiry';
import { useTranslation } from 'react-i18next';
import i18n from '@/locales/i18n';

const STATUS_STYLES: Record<string, string> = {
  PENDING:  'bg-yellow-50 text-yellow-600',
  ANSWERED: 'bg-green-50 text-green-700',
  CLOSED:   'bg-gray-100 text-gray-400',
};

const DEFAULT_FORM: CreateInquiryRequest = {
  title: '',
  content: '',
  category: 'ORDER',
  orderNo: '',
  isSecret: false,
};

export default function AccountInquiry() {
  const { t } = useTranslation();
  const [inquiries, setInquiries]   = useState<InquiryResponse[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState<CreateInquiryRequest>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');

  const [expanded, setExpanded]     = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getMyInquiries(page, 10)
      .then((res) => {
        setInquiries(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    if (!form.title.trim())   { setFormError(t('inquiry.errors.subjectRequired')); return; }
    if (!form.content.trim()) { setFormError(t('inquiry.errors.contentRequired')); return; }
    setFormError('');
    setSubmitting(true);
    try {
      await createInquiry({
        ...form,
        orderNo: form.orderNo?.trim() || undefined,
      });
      setShowForm(false);
      setForm(DEFAULT_FORM);
      setPage(0);
      load();
    } catch {
      setFormError(t('inquiry.errors.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (q: InquiryResponse) => {
    if (!window.confirm(t('inquiry.errors.deleteConfirm'))) return;
    try {
      await deleteMyInquiry(q.inquiryCode);
      load();
    } catch {
      alert(t('inquiry.errors.deleteFailed'));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">{t('inquiry.title')}</h2>
        </div>
        <button
          onClick={() => { setShowForm(true); setForm(DEFAULT_FORM); setFormError(''); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-koala-navy text-white text-xs font-medium rounded-lg hover:bg-koala-navy-hover transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('inquiry.new')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">{t('inquiry.formTitle')}</h3>
            <button onClick={() => setShowForm(false)}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">{t('inquiry.category')}</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
              >
                {INQUIRY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{t(`inquiry.categories.${c.value}`, { defaultValue: c.label })}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">{t('inquiry.subject')}</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                maxLength={200}
                placeholder={t('inquiry.subjectPlaceholder')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">{t('inquiry.content')}</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={5}
                placeholder={t('inquiry.contentPlaceholder')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                {t('inquiry.orderNo')} <span className="text-gray-400">{t('inquiry.orderNoHint')}</span>
              </label>
              <input
                value={form.orderNo}
                onChange={(e) => setForm((f) => ({ ...f, orderNo: e.target.value }))}
                placeholder={t('inquiry.orderNoPlaceholder')}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 font-mono"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!form.isSecret}
                onChange={(e) => setForm((f) => ({ ...f, isSecret: e.target.checked }))}
                className="w-4 h-4 rounded-none"
              />
              <span className="text-sm text-gray-700">{t('inquiry.secret')}</span>
            </label>
          </div>

          {formError && <p className="text-xs text-red-500 mt-3">{formError}</p>}

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
            >
              {submitting ? t('inquiry.submitting') : t('inquiry.submit')}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-400">{t('inquiry.loading')}</div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">{t('inquiry.emptyTitle')}</p>
          <p className="text-xs text-gray-300 mt-1">{t('inquiry.emptyDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((q) => (
            <div key={q.inquiryCode} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === q.inquiryCode ? null : q.inquiryCode)}
                className="w-full p-4 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {t(`inquiry.categories.${q.category}`, { defaultValue: q.category })}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[q.status]}`}>
                      {t(`inquiry.status.${q.status}`, { defaultValue: q.status })}
                    </span>
                    {q.isSecret && <span className="text-xs text-gray-400">🔒</span>}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{q.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(q.createdAt).toLocaleDateString(i18n.language)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  {q.status === 'PENDING' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(q); }}
                      className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                      title={t('inquiry.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {expanded === q.inquiryCode
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </button>

              {expanded === q.inquiryCode && (
                <div className="border-t border-gray-100">
                  <div className="p-4 bg-gray-50">
                    <p className="text-xs text-gray-400 mb-2">{t('inquiry.contentLabel')}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{q.content}</p>
                    {q.orderNo && (
                      <p className="text-xs text-gray-400 mt-3 font-mono">{t('inquiry.orderNoLine', { orderNo: q.orderNo })}</p>
                    )}
                  </div>

                  {q.answerContent && (
                    <div className="p-4 bg-blue-50 border-t border-blue-100">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs font-medium text-blue-600">
                          {t('inquiry.answer')}
                          {q.answeredByName && <span className="text-blue-400 ml-1">— {q.answeredByName}</span>}
                        </span>
                        {q.answeredAt && (
                          <span className="text-xs text-blue-300">
                            {new Date(q.answeredAt).toLocaleDateString(i18n.language)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{q.answerContent}</p>
                    </div>
                  )}

                  {q.status === 'PENDING' && (
                    <div className="p-3 border-t border-gray-100 bg-yellow-50">
                      <p className="text-xs text-yellow-600 text-center">{t('inquiry.pendingNote')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 text-xs rounded-lg transition-colors
                ${page === i ? 'bg-koala-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
