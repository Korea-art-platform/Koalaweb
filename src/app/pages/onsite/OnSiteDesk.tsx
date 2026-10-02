import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Lock, LogOut } from 'lucide-react';
import OnSitePaymentDesk from '@/app/components/onsite/OnSitePaymentDesk';
import {
  createOnSiteDeskPayment,
  getOnSiteDeskPayments,
  getOnSiteStatus,
  openOnSiteSession,
  ONSITE_SESSION_KEY,
  type OnSiteSession,
} from '@/api/onsite';
import type { OnSitePaymentInput } from '@/api/adminApi';

type Gate = 'loading' | 'off' | 'pin' | 'open';

function readSession(): OnSiteSession | null {
  try {
    const raw = localStorage.getItem(ONSITE_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as OnSiteSession;
    return new Date(session.expiresAt).getTime() > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function writeSession(session: OnSiteSession | null) {
  try {
    if (session) localStorage.setItem(ONSITE_SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(ONSITE_SESSION_KEY);
  } catch {
    return;
  }
}

export default function OnSiteDesk() {
  const [gate, setGate] = useState<Gate>('loading');
  const [session, setSession] = useState<OnSiteSession | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getOnSiteStatus()
      .then((enabled) => {
        if (!enabled) {
          writeSession(null);
          setGate('off');
          return;
        }
        const saved = readSession();
        setSession(saved);
        setGate(saved ? 'open' : 'pin');
      })
      .catch(() => setGate('off'));
  }, []);

  const lose = useCallback(() => {
    writeSession(null);
    setSession(null);
    setPin('');
    setError('다시 PIN을 입력해 주세요. 관리자가 PIN을 바꾸거나 페이지를 껐을 수 있습니다.');
    getOnSiteStatus()
      .then((enabled) => setGate(enabled ? 'pin' : 'off'))
      .catch(() => setGate('off'));
  }, []);

  const enter = async () => {
    if (!/^[0-9]{6}$/.test(pin)) {
      setError('PIN 6자리를 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const opened = await openOnSiteSession(pin);
      writeSession(opened);
      setSession(opened);
      setGate('open');
    } catch (e: unknown) {
      const res = (e as { response?: { status?: number; data?: { code?: string; message?: string; error?: { code?: string; message?: string } } } })?.response;
      if (res?.status === 429) setError('너무 여러 번 시도했습니다. 1분 뒤에 다시 해 주세요.');
      else if ((res?.data?.error?.code ?? res?.data?.code) === 'OS001') setGate('off');
      else setError(res?.data?.error?.message ?? 'PIN이 맞지 않습니다.');
    } finally {
      setBusy(false);
      setPin('');
    }
  };

  const create = useCallback(
    (input: OnSitePaymentInput) => createOnSiteDeskPayment(session?.sessionToken ?? '', input),
    [session],
  );
  const loadRecent = useCallback(
    () => getOnSiteDeskPayments(session?.sessionToken ?? ''),
    [session],
  );

  return (
    <div className="flex-1 bg-[#FAFAFA]">
      <Helmet>
        <title>현장결제 — KOALA</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto max-w-xl px-4 pb-20 pt-24">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-koala-purple-light">KOALA</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">현장결제</h1>
          </div>
          {gate === 'open' && (
            <button
              type="button"
              onClick={() => { writeSession(null); setSession(null); setGate('pin'); setError(''); }}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-black"
            >
              <LogOut className="h-3.5 w-3.5" /> 나가기
            </button>
          )}
        </div>

        {gate === 'loading' && <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />}

        {gate === 'off' && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <p className="text-base font-bold text-gray-900">현장결제가 꺼져 있습니다</p>
            <p className="mt-2 text-sm text-gray-500 break-keep">관리자에게 현장결제 페이지를 켜 달라고 요청해 주세요.</p>
          </div>
        )}

        {gate === 'pin' && (
          <form
            onSubmit={(e) => { e.preventDefault(); enter(); }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 text-gray-900">
              <Lock className="h-4 w-4" />
              <p className="text-sm font-bold">직원 PIN</p>
            </div>
            <p className="mt-1 text-xs text-gray-500 break-keep">관리자에게 받은 숫자 6자리를 입력하세요. 한 번 들어가면 12시간 동안 유지됩니다.</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              aria-label="PIN"
              className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-4 text-center text-2xl font-bold tracking-[0.6em] focus:outline-none focus:ring-2 focus:ring-koala-purple/15"
            />
            {error && <p className="mt-3 text-sm text-red-500 break-keep">{error}</p>}
            <button
              type="submit"
              disabled={busy || pin.length !== 6}
              className="mt-4 w-full rounded-xl bg-koala-navy py-4 text-base font-bold text-white hover:bg-koala-navy-hover disabled:opacity-40"
            >
              {busy ? '확인 중...' : '들어가기'}
            </button>
          </form>
        )}

        {gate === 'open' && session && (
          <OnSitePaymentDesk
            create={create}
            loadRecent={loadRecent}
            onSessionLost={lose}
            refundNote="취소·환불은 관리자에게 주문번호를 알려 주세요."
          />
        )}
      </div>
    </div>
  );
}
