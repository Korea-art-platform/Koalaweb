import { useState, useEffect, useCallback } from 'react';
import { Wallet, Lock, Check } from 'lucide-react';
import {
  getSettlementPeriod, confirmSettlement, markSettlementPaid, changeCommissionRate,
  type SettlementPeriod, type ArtistSettlement,
} from '@/api/adminApi';

const EMPTY: SettlementPeriod = {
  periodYm: '', confirmed: false, artistCount: 0,
  totalGross: '0', totalRefund: '0', totalCommission: '0', totalPayout: '0', items: [],
};

/** 지난달 — 확정할 수 있는 가장 최근 달 */
function lastMonth() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const won = (v: string | number) => Number(v).toLocaleString() + '원';
const percent = (rate: string) => (Number(rate) * 100).toFixed(1) + '%';

export default function AdminSettlementList() {
  const [period, setPeriod] = useState(lastMonth());
  const [data, setData] = useState<SettlementPeriod>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getSettlementPeriod(period)
      .then(setData)
      .catch(() => setError('정산을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const handleConfirm = async () => {
    const message =
      `${period} 정산을 확정합니다.\n\n` +
      `작가 ${data.artistCount}명 · 지급 합계 ${won(data.totalPayout)}\n\n` +
      `확정하면 금액이 굳어 이후 반품이 들어와도 바뀌지 않습니다.\n되돌릴 수 없습니다. 진행할까요?`;
    if (!confirm(message)) return;

    setBusy(true);
    try {
      setData(await confirmSettlement(period));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '확정에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handlePaid = async (item: ArtistSettlement) => {
    if (!item.settlementId) return;
    if (!confirm(`${item.artistName} 님께 ${won(item.payoutAmount)} 지급 완료로 기록할까요?`)) return;

    setBusy(true);
    try {
      await markSettlementPaid(item.settlementId);
      load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '처리에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleRateChange = async (item: ArtistSettlement) => {
    const input = prompt(
      `${item.artistName} 님의 수수료율(%)을 입력하세요.\n지금: ${percent(item.commissionRate)}`,
      (Number(item.commissionRate) * 100).toString(),
    );
    if (input === null) return;

    const rate = Number(input) / 100;
    if (Number.isNaN(rate) || rate < 0 || rate >= 1) {
      alert('0 이상 100 미만의 숫자를 입력해 주세요.');
      return;
    }

    setBusy(true);
    try {
      await changeCommissionRate(item.artistId, rate);
      load();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? '변경에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Wallet className="w-3.5 h-3.5" />
        <span>정산</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">작가 정산</h1>
      <p className="text-xs text-gray-400 mb-6">
        해당 월에 <b>배송완료된</b> 주문이 대상입니다. 그 달에 승인된 반품은 차감됩니다.
        송금은 직접 하시고, 여기에는 보냈다는 기록만 남깁니다.
      </p>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="month"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
        {data.confirmed ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
            <Lock className="w-3.5 h-3.5" />
            확정됨 — 금액이 굳어 있습니다
          </span>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={busy || data.items.length === 0}
            className="px-4 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-40"
          >
            이 달 정산 확정
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : data.items.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-400">
          {period} 에 정산할 내역이 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <SummaryCard label="매출" value={won(data.totalGross)} />
            <SummaryCard label="반품 차감" value={'-' + won(data.totalRefund)} />
            <SummaryCard label="수수료" value={won(data.totalCommission)} />
            <SummaryCard label="지급 합계" value={won(data.totalPayout)} strong />
          </div>

          <div className="border border-gray-100 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <Th className="text-left">작가</Th>
                  <Th>매출</Th>
                  <Th>반품</Th>
                  <Th>순매출</Th>
                  <Th>수수료율</Th>
                  <Th>수수료</Th>
                  <Th>지급액</Th>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.artistId} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-gray-900 font-medium">{item.artistName}</td>
                    <Td>{won(item.grossAmount)}</Td>
                    <Td muted>{Number(item.refundAmount) > 0 ? '-' + won(item.refundAmount) : '-'}</Td>
                    <Td>{won(item.netAmount)}</Td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {data.confirmed ? (
                        <span className="text-gray-500">{percent(item.commissionRate)}</span>
                      ) : (
                        <button
                          onClick={() => handleRateChange(item)}
                          className="text-gray-500 underline decoration-dotted hover:text-gray-900"
                        >
                          {percent(item.commissionRate)}
                        </button>
                      )}
                    </td>
                    <Td muted>{won(item.commissionAmount)}</Td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-900">
                      {won(item.payoutAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!item.confirmed ? (
                        <span className="text-xs text-gray-300">확정 전</span>
                      ) : item.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <Check className="w-3.5 h-3.5" />지급 완료
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePaid(item)}
                          disabled={busy}
                          className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                        >
                          지급 완료
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!data.confirmed && (
            <p className="text-xs text-gray-400 mt-3">
              아직 확정 전이라 금액이 바뀔 수 있습니다. 반품이 더 승인되면 다시 계산됩니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="border border-gray-100 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`tabular-nums ${strong ? 'text-base font-bold text-gray-900' : 'text-sm text-gray-700'}`}>
        {value}
      </p>
    </div>
  );
}

function Th({ children, className = 'text-right' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 font-normal ${className}`}>{children}</th>;
}

function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className={`px-4 py-3 text-right tabular-nums ${muted ? 'text-gray-400' : 'text-gray-700'}`}>
      {children}
    </td>
  );
}
