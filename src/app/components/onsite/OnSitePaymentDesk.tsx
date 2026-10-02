import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import QRCode from 'qrcode';
import { Check, Copy, CreditCard, Plus, QrCode, RefreshCw } from 'lucide-react';
import type { OnSitePayment, OnSitePaymentInput } from '@/api/adminApi';
import { getArtists } from '@/api/artist';
import { getOnSitePayment, onSitePayUrl } from '@/api/onsite';
import type { Artist, PageResponse } from '@/api/types';

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: '결제 대기',
  DELIVERED: '결제 완료',
  PAID: '결제 완료',
  CANCELLED: '취소',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  PAID: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const EMPTY = {
  itemName: '',
  artistCode: '',
  amount: '',
  taxExempt: false,
  buyerName: '',
  buyerPhone: '',
  buyerEmail: '',
  memo: '',
};

const inputCls =
  'w-full rounded-xl border border-gray-200 px-3.5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-koala-purple/15 focus:border-koala-purple/40';

const won = (n: number) => `₩${n.toLocaleString()}`;

interface DeskProps {
  create: (input: OnSitePaymentInput) => Promise<OnSitePayment>;
  loadRecent: () => Promise<OnSitePayment[]>;
  onSessionLost?: () => void;
  refundNote?: string;
}

const SESSION_CODES = new Set(['OS001', 'OS003']);

function errorOf(e: unknown): { code?: string; message?: string } {
  const data = (e as { response?: { data?: { code?: string; message?: string; error?: { code?: string; message?: string } } } })
    ?.response?.data;
  return { code: data?.error?.code ?? data?.code, message: data?.error?.message ?? data?.message };
}

export default function OnSitePaymentDesk({ create, loadRecent: fetchRecent, onSessionLost, refundNote }: DeskProps) {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [more, setMore] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState<OnSitePayment | null>(null);
  const [qr, setQr] = useState('');
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recent, setRecent] = useState<OnSitePayment[]>([]);

  const loadRecent = useCallback(() => {
    fetchRecent().then(setRecent).catch((e) => {
      if (SESSION_CODES.has(errorOf(e).code ?? '')) onSessionLost?.();
    });
  }, [fetchRecent, onSessionLost]);

  useEffect(() => {
    getArtists(0, 100)
      .then((res) => setArtists((res.data.data as PageResponse<Artist>).content ?? []))
      .catch(() => {});
    loadRecent();
  }, [loadRecent]);

  const open = useCallback(async (p: OnSitePayment) => {
    setCurrent(p);
    setPaid(p.orderStatus === 'DELIVERED' || p.orderStatus === 'PAID');
    setCopied(false);
    setQr(await QRCode.toDataURL(onSitePayUrl(p.payToken), { width: 360, margin: 1 }));
  }, []);

  useEffect(() => {
    if (!current || paid) return;
    const timer = window.setInterval(async () => {
      try {
        const info = await getOnSitePayment(current.payToken);
        if (info.paid) {
          setPaid(true);
          loadRecent();
        }
      } catch {
        return;
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [current, paid, loadRecent]);

  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  const amount = Number(form.amount.replace(/[^0-9]/g, '')) || 0;

  const handleCreate = async () => {
    if (!form.itemName.trim()) { setError('품목명을 입력해 주세요.'); return; }
    if (!form.artistCode) { setError('작가를 골라 주세요. 정산에 쓰입니다.'); return; }
    if (amount < 100) { setError('금액을 100원 이상 입력해 주세요.'); return; }
    if (form.buyerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail.trim())) {
      setError('구매자 이메일 형식을 확인해 주세요.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const created = await create({
        itemName: form.itemName.trim(),
        artistCode: form.artistCode,
        amount,
        taxExempt: form.taxExempt,
        buyerName: form.buyerName.trim() || undefined,
        buyerPhone: form.buyerPhone.trim() || undefined,
        buyerEmail: form.buyerEmail.trim() || undefined,
        memo: form.memo.trim() || undefined,
      });
      await open(created);
      setForm(EMPTY);
      setMore(false);
      loadRecent();
    } catch (e: unknown) {
      const { code, message } = errorOf(e);
      if (SESSION_CODES.has(code ?? '')) {
        onSessionLost?.();
        return;
      }
      setError(message ?? '결제를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(onSitePayUrl(current.payToken));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      {current ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-gray-500">{current.artistName}</p>
              <p className="truncate text-lg font-bold text-gray-900">{current.itemName}</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-gray-900">{won(current.amount)}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${paid ? STATUS_COLOR.DELIVERED : STATUS_COLOR.PENDING_PAYMENT}`}>
              {paid ? '결제 완료' : '결제 대기'}
            </span>
          </div>

          {paid ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 py-10 text-emerald-700">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-7 w-7" />
              </span>
              <p className="text-base font-bold">결제가 완료됐습니다</p>
              <p className="font-mono text-xs text-emerald-700/70">{current.orderNo}</p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-col items-center">
                {qr && <img src={qr} alt="결제 QR" className="h-64 w-64 rounded-xl border border-gray-100" />}
                <p className="mt-3 text-center text-xs text-gray-400 break-keep">
                  고객 휴대폰 카메라로 QR을 찍으면 결제 화면이 열립니다. 30분 안에 결제하지 않으면 자동 취소됩니다.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/pay/${current.payToken}`)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-koala-navy py-3.5 text-sm font-bold text-white hover:bg-koala-navy-hover"
                >
                  <CreditCard className="h-4 w-4" /> 이 기기에서 결제
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? '복사됨' : '링크 복사'}
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => { setCurrent(null); setQr(''); setPaid(false); }}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" /> 새 결제 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">품목명 *</label>
            <input value={form.itemName} onChange={(e) => set({ itemName: e.target.value })}
              className={inputCls} placeholder="예) 버즈 원작 — 전시 DP" maxLength={200} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">작가 *</label>
            <select value={form.artistCode} onChange={(e) => set({ artistCode: e.target.value })}
              className={`${inputCls} bg-white`}>
              <option value="">작가 선택</option>
              {artists.map((a) => (
                <option key={a.artistCode} value={a.artistCode}>{a.nameKo ?? a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">결제 금액 (고객이 내는 금액) *</label>
            <input
              value={form.amount ? Number(form.amount.replace(/[^0-9]/g, '')).toLocaleString() : ''}
              onChange={(e) => set({ amount: e.target.value.replace(/[^0-9]/g, '') })}
              inputMode="numeric"
              className={`${inputCls} text-right text-lg font-bold tabular-nums`}
              placeholder="0"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 select-none">
            <input type="checkbox" checked={form.taxExempt} onChange={(e) => set({ taxExempt: e.target.checked })}
              className="h-4 w-4 rounded" />
            면세 품목 (원작 등 부가세 없음)
          </label>

          <button type="button" onClick={() => setMore((v) => !v)}
            className="text-xs font-medium text-gray-500 underline underline-offset-2">
            {more ? '구매자 정보 접기' : '구매자 정보 입력 (선택)'}
          </button>
          {more && (
            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              <input value={form.buyerName} onChange={(e) => set({ buyerName: e.target.value })}
                className={inputCls} placeholder="구매자 이름" maxLength={50} />
              <input value={form.buyerPhone} onChange={(e) => set({ buyerPhone: e.target.value })}
                className={inputCls} placeholder="연락처 (예: 010-1234-5678)" inputMode="tel" maxLength={30} />
              <input value={form.buyerEmail} onChange={(e) => set({ buyerEmail: e.target.value })}
                className={inputCls} placeholder="이메일 (주문 확인 메일 받을 곳)" inputMode="email" maxLength={200} />
              <input value={form.memo} onChange={(e) => set({ memo: e.target.value })}
                className={inputCls} placeholder="메모 (예: 액자 포함, 현장 수령)" maxLength={255} />
              <p className="text-[11px] text-gray-400 break-keep">비워 두면 회사 연락처로 기록되고 주문 확인 메일도 회사로 갑니다.</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="button" onClick={handleCreate} disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-koala-navy py-4 text-base font-bold text-white hover:bg-koala-navy-hover disabled:opacity-50">
            <QrCode className="h-5 w-5" />
            {submitting ? '만드는 중...' : amount ? `${won(amount)} 결제 만들기` : '결제 만들기'}
          </button>
        </div>
      )}

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">최근 현장결제</h2>
          <button type="button" onClick={loadRecent} className="text-gray-400 hover:text-gray-700" aria-label="새로고침">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">아직 현장결제가 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
            {recent.map((p) => (
              <li key={p.orderNo}>
                <button
                  type="button"
                  disabled={p.orderStatus === 'CANCELLED'}
                  onClick={() => open(p)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 disabled:cursor-default disabled:hover:bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{p.itemName}</p>
                    <p className="truncate text-xs text-gray-400">
                      {p.artistName} · {new Date(p.createdAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums">{won(p.amount)}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_COLOR[p.orderStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABEL[p.orderStatus] ?? p.orderStatus}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {refundNote && <p className="mt-2 text-[11px] text-gray-400 break-keep">{refundNote}</p>}
      </div>
    </div>
  );
}
