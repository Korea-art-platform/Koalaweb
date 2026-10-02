import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Power } from 'lucide-react';
import {
  createOnSitePayment,
  getOnSitePayments,
  getOnSiteSetting,
  updateOnSiteSetting,
  type OnSiteSetting,
} from '@/api/adminApi';
import OnSitePaymentDesk from '@/app/components/onsite/OnSitePaymentDesk';

const DESK_PATH = '/onsite';

export default function AdminOnSitePayment() {
  const [setting, setSetting] = useState<OnSiteSetting | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOnSiteSetting()
      .then(setSetting)
      .catch(() => setBlocked(true));
  }, []);

  const save = async (body: { enabled?: boolean; pin?: string }, done: string) => {
    setSaving(true);
    setMessage('');
    try {
      const next = await updateOnSiteSetting(body);
      setSetting(next);
      setPin('');
      setMessage(done);
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data;
      setMessage(data?.error?.message ?? '설정을 바꾸지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const pinValid = /^[0-9]{6}$/.test(pin);
  const deskUrl = `${window.location.origin}${DESK_PATH}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(deskUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const create = useCallback(createOnSitePayment, []);
  const loadRecent = useCallback(getOnSitePayments, []);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">현장결제</h1>
        <p className="mt-1 text-sm text-gray-500 break-keep">
          품목명·금액·작가만 입력하면 결제 링크와 QR이 만들어집니다. 상품 등록이나 재고와 상관없이 결제할 수 있습니다.
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">현장결제 페이지 (관리자 계정 없이 사용)</p>
            <p className="mt-0.5 text-xs text-gray-500 break-keep">
              켜 두면 직원이 PIN만으로 결제를 만들 수 있습니다. 행사가 끝나면 꺼 주세요.
            </p>
          </div>
          {setting && (
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${setting.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              {setting.enabled ? '켜짐' : '꺼짐'}
            </span>
          )}
        </div>

        {blocked && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700 break-keep">
            설정은 사무실(등록된 IP)에서만 바꿀 수 있습니다. 아래 결제 만들기는 그대로 쓸 수 있습니다.
          </p>
        )}

        {setting && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                inputMode="numeric"
                placeholder={setting.pinSet ? '새 PIN 6자리 (바꿀 때만)' : 'PIN 6자리 정하기'}
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-koala-purple/15"
              />
              <button
                type="button"
                disabled={!pinValid || saving}
                onClick={() => save({ pin }, 'PIN을 바꿨습니다. 현장에서 쓰던 기기는 새 PIN으로 다시 들어가야 합니다.')}
                className="shrink-0 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                PIN 저장
              </button>
            </div>

            <button
              type="button"
              disabled={saving || (!setting.enabled && !setting.pinSet && !pinValid)}
              onClick={() =>
                setting.enabled
                  ? save({ enabled: false }, '꺼졌습니다. 현장결제 페이지에서 새 결제를 만들 수 없습니다.')
                  : save(pinValid ? { enabled: true, pin } : { enabled: true }, '켜졌습니다. 아래 주소와 PIN을 현장 직원에게 알려 주세요.')
              }
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-40 ${
                setting.enabled
                  ? 'border border-red-200 text-red-600 hover:bg-red-50'
                  : 'bg-koala-navy text-white hover:bg-koala-navy-hover'
              }`}
            >
              <Power className="h-4 w-4" />
              {setting.enabled ? '현장결제 페이지 끄기' : '현장결제 페이지 켜기'}
            </button>

            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3.5 py-2.5">
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-gray-600">{deskUrl}</span>
              <button type="button" onClick={copyUrl} className="flex shrink-0 items-center gap-1 text-xs font-medium text-gray-600 hover:text-black">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? '복사됨' : '주소 복사'}
              </button>
            </div>

            {message && <p className="text-xs text-gray-600 break-keep">{message}</p>}
          </div>
        )}
      </section>

      <OnSitePaymentDesk
        create={create}
        loadRecent={loadRecent}
        refundNote="취소·환불은 주문 메뉴에서 해당 주문번호로 처리합니다(사무실 IP에서만 가능)."
      />
    </div>
  );
}
