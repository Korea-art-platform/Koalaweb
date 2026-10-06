import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Check, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { startPayment, isUserCancel, PAY_METHODS, PG_PROVIDER_CODE, type PayMethod } from '@/app/lib/pg';
import { preparePayment } from '@/api/payment';
import { payMethodIcon } from '@/app/components/common/PayMethodIcons';
import PageMeta from '@/app/components/common/PageMeta';
import { getOnSitePayment, ONSITE_TOKEN_KEY, type OnSitePublic } from '@/api/onsite';

type Load = 'loading' | 'ready' | 'missing';

export default function PayOnSite() {
  const { t } = useTranslation();
  const { token = '' } = useParams();
  const [searchParams] = useSearchParams();
  const failed = searchParams.get('failed');
  const [load, setLoad] = useState<Load>('loading');
  const [info, setInfo] = useState<OnSitePublic | null>(null);
  const [selected, setSelected] = useState<PayMethod>(PAY_METHODS[0].id);
  const [processing, setProcessing] = useState(false);

  const fetchInfo = useCallback(async () => {
    try {
      const data = await getOnSitePayment(token);
      setInfo(data);
      setLoad('ready');
    } catch {
      setLoad('missing');
    }
  }, [token]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const handlePay = async () => {
    if (!info) return;
    setProcessing(true);
    rememberToken(token);
    try {
      const prepared = await preparePayment(info.orderNo, PG_PROVIDER_CODE, selected);
      const chargeAmount = Number(prepared.data?.data?.amount);
      if (!Number.isFinite(chargeAmount) || chargeAmount <= 0) {
        throw new Error(t('checkout.errors.amount'));
      }
      await startPayment({
        method: selected,
        orderNo: info.orderNo,
        amount: chargeAmount,
        orderName: info.itemName ?? 'KOALA',
        onError: (message) => {
          setProcessing(false);
          alert(message);
        },
      });
    } catch (e: unknown) {
      if (!isUserCancel(e)) {
        const data = (e as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data;
        alert(data?.error?.message ?? data?.message ?? (e as { message?: string })?.message ?? t('payment.requestFailed'));
      }
      fetchInfo();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-1">
      <PageMeta title={t('onsite.title')} />
      <div className="mx-auto max-w-[480px] px-4 pb-24 pt-24">
        {load === 'loading' && (
          <div className="space-y-3">
            <div className="h-6 w-32 animate-pulse rounded-none bg-gray-100" />
            <div className="h-40 animate-pulse rounded-3xl bg-gray-100" />
          </div>
        )}

        {load === 'missing' && (
          <Notice title={t('onsite.missingTitle')} body={t('onsite.missingBody')} />
        )}

        {load === 'ready' && info && info.paid && (
          <div className="flex flex-col items-center rounded-none border border-gray-100 bg-white px-6 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-xl font-bold text-gray-900">{t('onsite.paidTitle')}</h1>
            <p className="mt-2 text-sm text-gray-500 break-keep">{t('onsite.paidBody')}</p>
            <div className="mt-6 w-full rounded-2xl bg-gray-50 px-5 py-4 text-left">
              <p className="truncate text-xs text-gray-500">{info.artistName}</p>
              <p className="truncate text-sm font-bold text-gray-900">{info.itemName}</p>
              <p className="mt-1 text-lg font-black tabular-nums">₩{info.amount.toLocaleString()}</p>
              <p className="mt-2 font-mono text-[11px] text-gray-400">{info.orderNo}</p>
            </div>
          </div>
        )}

        {load === 'ready' && info && !info.paid && !info.payable && (
          <Notice title={t('onsite.closedTitle')} body={t('onsite.closedBody')} />
        )}

        {load === 'ready' && info && !info.paid && info.payable && (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-koala-purple-light">{t('onsite.eyebrow')}</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{t('onsite.title')}</h1>

            {failed && (
              <div role="alert" className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
                <p className="font-bold">{t('onsite.failedTitle')}</p>
                <p className="mt-1 break-keep">{failed}</p>
              </div>
            )}

            <div className="mt-6 rounded-none border border-gray-100 bg-white p-6">
              <p className="truncate text-sm text-gray-500">{info.artistName}</p>
              <p className="mt-0.5 text-lg font-bold text-gray-900 break-keep">{info.itemName}</p>
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">{t('checkout.total')}</span>
                <span className="text-2xl font-black tracking-tight tabular-nums">₩{info.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 rounded-none border border-gray-100 bg-white p-6">
              <h2 className="mb-4 text-sm font-bold text-gray-500">{t('checkout.method')}</h2>
              <div className="grid grid-cols-3 gap-3">
                {PAY_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelected(m.id)}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                      selected === m.id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {payMethodIcon(m.id, 40)}
                    <span className="text-center text-xs font-bold leading-tight text-gray-900">
                      {t(`payment.methods.${m.id}.label`)}
                    </span>
                    {selected === m.id && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-koala-navy">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={processing}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-5 text-base font-bold transition-all ${
                processing
                  ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                  : 'bg-koala-navy text-white shadow-lg shadow-black/10 hover:bg-koala-navy-hover active:scale-[0.98]'
              }`}
            >
              {processing ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
                  {t('checkout.processing')}
                </>
              ) : (
                <>
                  {t('payment.payAmount', { amount: info.amount.toLocaleString() })}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[11px] text-gray-400 break-keep">{t('onsite.note')}</p>
          </>
        )}
      </div>
    </div>
  );
}

function rememberToken(token: string): boolean {
  try {
    sessionStorage.setItem(ONSITE_TOKEN_KEY, token);
    return true;
  } catch {
    return false;
  }
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-none border border-gray-100 bg-white px-6 py-12 text-center">
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500 break-keep">{body}</p>
    </div>
  );
}
