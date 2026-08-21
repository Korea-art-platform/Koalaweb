import { useState, useEffect, useCallback } from 'react';
import { Store, MapPin, X, Search, Lock } from 'lucide-react';
import {
  getAdminStores, createStore, updateStore,
  activateStore, deactivateStore, deleteStore,
  type PartnerStore, type StoreInput,
} from '@/api/adminApi';
import { openAddressSearch } from '@/app/lib/daumPostcode';

const EMPTY: StoreInput = {
  name: '', zipCode: '', address: '', addressDetail: '',
  phone: '', phone2: '', email: '', description: '', mapUrl: '', sortOrder: 0,
};

export default function AdminStoreList() {
  const [stores, setStores] = useState<PartnerStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PartnerStore | null>(null);
  const [form, setForm] = useState<StoreInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getAdminStores().then(setStores).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (patch: Partial<StoreInput>) => setForm((f) => ({ ...f, ...patch }));

  const openCreate = () => {
    setForm(EMPTY);
    setEditTarget(null);
    setError('');
    setOpen(true);
  };

  const openEdit = (s: PartnerStore) => {
    setForm({
      name: s.name, zipCode: s.zipCode ?? '', address: s.address,
      addressDetail: s.addressDetail ?? '', phone: s.phone, phone2: s.phone2 ?? '',
      email: s.email ?? '', description: s.description ?? '', mapUrl: s.mapUrl ?? '',
      sortOrder: s.sortOrder,
    });
    setEditTarget(s);
    setError('');
    setOpen(true);
  };

  const searchAddress = () => {
    openAddressSearch(({ zipCode, address }) => set({ zipCode, address }))
      .catch(() => setError('주소 검색을 여는 데 실패했습니다. 잠시 후 다시 시도해 주세요.'));
  };

  const submit = async () => {
    if (!form.name.trim()) { setError('매장명은 필수입니다.'); return; }
    if (!form.address.trim()) { setError('주소는 필수입니다. 주소 검색으로 입력해 주세요.'); return; }
    if (!form.phone.trim()) { setError('연락처는 필수입니다.'); return; }
    setError('');
    setSubmitting(true);
    try {
      if (editTarget) await updateStore(editTarget.storeCode, form);
      else await createStore(form);
      setOpen(false);
      load();
    } catch {
      setError(editTarget ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = async (s: PartnerStore) => {
    if (s.isActive) await deactivateStore(s.storeCode);
    else await activateStore(s.storeCode);
    load();
  };

  const remove = async (s: PartnerStore) => {
    if (!window.confirm(`"${s.name}" 매장을 삭제하시겠습니까?`)) return;
    await deleteStore(s.storeCode);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Store className="w-3.5 h-3.5" />
        <span>입점 매장 관리</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900">매장 목록</h1>
        <button
          onClick={openCreate}
          className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
        >
          + 매장 등록
        </button>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-6">
        <Lock className="w-3 h-3" />
        주소·연락처·이메일은 저장 시 암호화됩니다.
      </p>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          등록된 매장이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {stores.map((s) => (
            <div key={s.storeCode} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm truncate">{s.name}</span>
                  {s.mapUrl && <MapPin className="w-3.5 h-3.5 text-koala-gold-deep flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {s.zipCode && `(${s.zipCode}) `}{s.address} {s.addressDetail}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.phone}{s.phone2 && ` · ${s.phone2}`}{s.email && ` · ${s.email}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggle(s)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${
                    s.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s.isActive ? '노출중' : '숨김'}
                </button>
                <button onClick={() => openEdit(s)} className="text-xs text-gray-500 hover:text-gray-900 font-medium">수정</button>
                <button onClick={() => remove(s)} className="text-xs text-red-400 hover:text-red-600 font-medium">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{editTarget ? '매장 수정' : '매장 등록'}</h2>
              <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-700" /></button>
            </div>

            <div className="space-y-4">
              <Field label="매장명 *">
                <input value={form.name} onChange={(e) => set({ name: e.target.value })}
                  className={inputCls} placeholder="예) KOALA 강남점" />
              </Field>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">주소 *</label>
                <div className="flex gap-2">
                  <input value={form.zipCode} readOnly placeholder="우편번호"
                    className={`${inputCls} w-28 bg-gray-50`} />
                  <button type="button" onClick={searchAddress}
                    className="px-3 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Search className="w-4 h-4" /> 주소 검색
                  </button>
                </div>
                <input value={form.address} readOnly placeholder="주소 검색으로 입력"
                  className={`${inputCls} bg-gray-50 mt-2`} />
                <input value={form.addressDetail} onChange={(e) => set({ addressDetail: e.target.value })}
                  placeholder="상세주소 (동/호수 등)" className={`${inputCls} mt-2`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="연락처 *">
                  <input value={form.phone} onChange={(e) => set({ phone: e.target.value })}
                    className={inputCls} placeholder="02-000-0000" />
                </Field>
                <Field label="연락처 2">
                  <input value={form.phone2} onChange={(e) => set({ phone2: e.target.value })}
                    className={inputCls} placeholder="선택" />
                </Field>
              </div>

              <Field label="이메일">
                <input value={form.email} onChange={(e) => set({ email: e.target.value })}
                  className={inputCls} placeholder="store@example.com" />
              </Field>

              <Field label="사업장 소개글">
                <textarea value={form.description} onChange={(e) => set({ description: e.target.value })}
                  rows={4} className={`${inputCls} resize-y`} placeholder="매장 소개를 입력하세요..." />
              </Field>

              <Field label="네이버 플레이스 / 위치 링크 URL">
                <input value={form.mapUrl} onChange={(e) => set({ mapUrl: e.target.value })}
                  className={inputCls} placeholder="https://naver.me/..." />
              </Field>

              <Field label="정렬 순서 (작을수록 위)">
                <input type="number" value={form.sortOrder ?? 0}
                  onChange={(e) => set({ sortOrder: Number(e.target.value) })}
                  className={`${inputCls} w-28`} />
              </Field>
            </div>

            {error && <p className="text-xs text-red-500 mt-3 whitespace-pre-line">{error}</p>}

            <div className="flex gap-2 mt-5">
              <button onClick={() => setOpen(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={submit} disabled={submitting}
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50">
                {submitting ? '저장 중...' : editTarget ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
