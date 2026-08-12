import { useRef, useState } from 'react';
import { Download, Upload, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  importSkusCsv, downloadSkuCsvTemplate,
  type SkuImportResult,
} from '@/api/adminApi';

/** 오류가 수천 건일 수 있어 화면에는 일부만 — 나머지는 개수로 알린다 */
const MAX_VISIBLE_ERRORS = 100;

type Props = {
  onClose: () => void;
  /** 한 건이라도 등록됐을 때 목록을 새로고침 */
  onImported: () => void;
};

export default function AdminCsvImportModal({ onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<SkuImportResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleTemplate = async () => {
    setMessage(null);
    try {
      await downloadSkuCsvTemplate();
    } catch {
      setMessage('템플릿을 내려받지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    setUploading(true);
    setMessage(null);
    setResult(null);
    try {
      const res = await importSkusCsv(file);
      setResult(res);
      if (res.succeeded > 0) onImported();
    } catch (e: any) {
      // 파일 자체를 못 읽는 경우는 4xx 로 오고 본문에 사유가 담긴다
      setMessage(e?.response?.data?.message
        ?? e?.response?.data?.error?.message
        ?? '업로드에 실패했습니다. 파일 형식을 확인해 주세요.');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setMessage(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const visibleErrors = result?.errors.slice(0, MAX_VISIBLE_ERRORS) ?? [];
  const hiddenCount = (result?.errors.length ?? 0) - visibleErrors.length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">상품 CSV 일괄 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">

          {/* 안내 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-5 text-xs text-gray-600 space-y-1.5">
            <p>· 템플릿을 받아 <b>UTF-8 CSV</b>로 저장한 뒤 올려주세요. 컬럼 순서는 바뀌어도 됩니다.</p>
            <p>· <b>mainCategory · genre</b> 는 카테고리 관리에 등록된 <b>코드</b>로 적어야 합니다. 템플릿 둘째 줄에 사용 가능한 코드가 들어 있습니다(업로드 전 삭제).</p>
            <p>· 한 행이라도 오류가 있으면 <b>아무것도 저장되지 않습니다.</b> 오류를 모두 고쳐 다시 올려주세요.</p>
            <p>· 등록된 상품은 <b>임시저장(DRAFT)</b> 상태입니다. 확인 후 게시해야 고객에게 보입니다.</p>
            <p>· 이미 등록된 slug 는 덮어쓰지 않고 오류로 표시됩니다. <b>같은 파일을 두 번 올리면 안 됩니다.</b></p>
          </div>

          {/* 1단계 — 템플릿 */}
          <button
            onClick={handleTemplate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-4"
          >
            <Download className="w-3.5 h-3.5" />
            템플릿 내려받기
          </button>

          {/* 2단계 — 파일 선택 */}
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); setMessage(null); }}
            className="block w-full text-xs text-gray-600 mb-4
                       file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0
                       file:text-xs file:bg-koala-navy file:text-white
                       hover:file:bg-koala-navy-hover file:cursor-pointer"
          />

          {message && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{message}</p>
            </div>
          )}

          {/* 결과 */}
          {result && (
            <div className="mb-2">
              {result.succeeded > 0 && result.errors.length === 0 ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-800">
                    <b>{result.succeeded}건</b> 등록했습니다. 상품 목록에서 확인 후 게시해 주세요.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <p className="text-xs text-red-700">
                      전체 {result.totalRows}행 중 <b>{result.errors.length}건</b>의 오류가 있어
                      {result.succeeded === 0
                        ? ' 저장하지 않았습니다.'
                        : ` ${result.succeeded}건까지만 저장됐습니다.`}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500">
                          <th className="text-left px-3 py-2 font-medium w-16">행</th>
                          <th className="text-left px-3 py-2 font-medium w-32">항목</th>
                          <th className="text-left px-3 py-2 font-medium w-32">입력값</th>
                          <th className="text-left px-3 py-2 font-medium">사유</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleErrors.map((err, i) => (
                          <tr key={`${err.rowNumber}-${err.field}-${i}`} className="border-t border-gray-100">
                            <td className="px-3 py-2 text-gray-900 font-medium">{err.rowNumber}</td>
                            <td className="px-3 py-2 text-gray-600">{err.field}</td>
                            <td className="px-3 py-2 text-gray-400 truncate max-w-[8rem]">
                              {err.rejectedValue == null ? '(비어 있음)' : String(err.rejectedValue)}
                            </td>
                            <td className="px-3 py-2 text-gray-700">{err.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {hiddenCount > 0 && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      오류가 많아 {MAX_VISIBLE_ERRORS}건만 표시했습니다. (외 {hiddenCount}건)
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          {result && (
            <button
              onClick={reset}
              className="px-4 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              다른 파일 올리기
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            닫기
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-koala-navy text-white rounded-lg
                       hover:bg-koala-navy-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? '등록 중...' : '업로드'}
          </button>
        </div>
      </div>
    </div>
  );
}
