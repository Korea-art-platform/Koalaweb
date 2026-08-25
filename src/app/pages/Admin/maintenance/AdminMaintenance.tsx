import { useRef, useState } from 'react';
import { Play, Square, Loader2, CheckCircle2 } from 'lucide-react';
import { backfillImageDerivatives, type ImageBackfillResult } from '@/api/adminApi';

const BATCH = 40;

interface Totals {
  scanned: number;
  thumbsCreated: number;
  headersFixed: number;
  skipped: number;
  failed: number;
}

const ZERO: Totals = { scanned: 0, thumbsCreated: 0, headersFixed: 0, skipped: 0, failed: 0 };

export default function AdminMaintenance() {
  const [prefix, setPrefix] = useState('');
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [totals, setTotals] = useState<Totals>(ZERO);
  const [error, setError] = useState('');
  const stopRef = useRef(false);

  const run = async () => {
    setRunning(true);
    setDone(false);
    setError('');
    setTotals(ZERO);
    stopRef.current = false;

    let token: string | null | undefined = undefined;
    try {
      for (;;) {
        if (stopRef.current) break;

        const r: ImageBackfillResult = await backfillImageDerivatives(prefix, BATCH, token);
        setTotals((t) => ({
          scanned: t.scanned + r.scanned,
          thumbsCreated: t.thumbsCreated + r.thumbsCreated,
          headersFixed: t.headersFixed + r.headersFixed,
          skipped: t.skipped + r.skipped,
          failed: t.failed + r.failed,
        }));

        if (r.done || !r.nextToken) {
          setDone(true);
          break;
        }
        token = r.nextToken;
      }
    } catch {
      setError('작업 중 오류가 발생했습니다. 잠시 후 이어서 다시 실행해 주세요.');
    } finally {
      setRunning(false);
    }
  };

  const rows: [string, number, string][] = [
    ['훑어본 파일', totals.scanned, 'text-gray-900'],
    ['축소본 생성', totals.thumbsCreated, 'text-koala-purple'],
    ['캐시 헤더 보정', totals.headersFixed, 'text-koala-purple'],
    ['건너뜀 (이미 처리됨)', totals.skipped, 'text-gray-400'],
    ['실패', totals.failed, totals.failed > 0 ? 'text-red-500' : 'text-gray-400'],
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">유지보수</h1>
      <p className="text-sm text-gray-500 mb-8">평상시에는 쓰지 않는 일회성 작업입니다.</p>

      <section className="border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold mb-1">이미지 축소본 · 캐시 헤더 생성</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5 break-keep">
          목록과 카드에서 쓸 축소본을 만들고, 이미지에 장기 캐시 헤더를 붙입니다.
          이미 처리된 파일은 건너뛰므로 여러 번 실행해도 안전합니다.
          <br />
          작업이 끝난 뒤에 배포 설정의 <b>VITE_IMAGE_THUMBS</b> 를 true 로 바꿔야 실제로 적용됩니다.
        </p>

        <label className="block text-xs text-gray-500 mb-1.5">대상 경로 (비우면 전체)</label>
        <input
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          disabled={running}
          placeholder="예: skus/  ·  banners/  ·  비우면 전체"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-5
            focus:outline-none focus:ring-2 focus:ring-black/10 disabled:bg-gray-50"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-koala-navy text-white
              text-sm font-semibold disabled:opacity-50 hover:brightness-110 transition"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? '처리 중...' : '실행'}
          </button>
          {running && (
            <button
              onClick={() => { stopRef.current = true; }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200
                text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              <Square className="w-4 h-4" />
              중단
            </button>
          )}
          {done && !running && (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              완료
            </span>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {(running || totals.scanned > 0) && (
          <dl className="mt-6 border-t border-gray-100 pt-5 space-y-2">
            {rows.map(([label, value, cls]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">{label}</dt>
                <dd className={`font-bold tabular-nums ${cls}`}>{value.toLocaleString()}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-5 text-[11px] text-gray-400 leading-relaxed break-keep">
          한 번에 {BATCH}개씩 나눠 처리합니다. 원본이 2000px 이라 변환이 무거워 서버가
          오래 붙잡히지 않도록 한 것입니다. 중단해도 다음 실행 때 처리된 파일은 건너뜁니다.
        </p>
      </section>
    </div>
  );
}
