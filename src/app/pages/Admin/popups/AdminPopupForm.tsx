import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X } from 'lucide-react';
import {
  getAdminPopup, createPopup, updatePopup, uploadPopupImage,
  type PopupRequest,
} from '@/api/adminApi';
import { downscaleImage } from '@/utils/downscaleImage';
import { isInternalPath } from '@/app/lib/popup';
import { safeHttpUrl } from '@/app/lib/safeUrl';

const BODY_MAX = 2000;

const EMPTY: PopupRequest = {
  title: '',
  active: true,
  showDismiss: true,
  language: 'ko',
  displayType: 'IMAGE',
  imageUrl: null,
  body: null,
  showLinkButton: false,
  placement: 'HOME',
  landingUrl: null,
};

type ErrorKey = 'title' | 'image' | 'body' | 'landingUrl';
type Errors = Partial<Record<ErrorKey, string>>;

function validate(form: PopupRequest): Errors {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = '제목을 입력해 주세요.';
  if (form.displayType === 'IMAGE' && !form.imageUrl) errors.image = '이미지 방식은 이미지를 첨부해야 합니다.';
  if ((form.body ?? '').length > BODY_MAX) errors.body = `본문은 ${BODY_MAX}자 이하로 입력해 주세요.`;
  const landing = (form.landingUrl ?? '').trim();
  if (landing && !isInternalPath(landing) && !safeHttpUrl(landing)) {
    errors.landingUrl = '랜딩 URL은 http(s):// 로 시작하는 주소이거나 / 로 시작하는 경로여야 합니다.';
  } else if (form.showLinkButton && !landing) {
    errors.landingUrl = '이동 버튼을 노출하려면 랜딩 URL을 입력해 주세요.';
  }
  return errors;
}

export default function AdminPopupForm() {
  const { popupCode } = useParams<{ popupCode: string }>();
  const isEdit = Boolean(popupCode);
  const navigate = useNavigate();

  const [form, setForm] = useState<PopupRequest>(EMPTY);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!popupCode) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    getAdminPopup(popupCode)
      .then((p) => {
        if (cancelled) return;
        setForm({
          title: p.title ?? '',
          active: p.active,
          showDismiss: p.showDismiss,
          language: p.language,
          displayType: p.displayType,
          imageUrl: p.imageUrl ?? null,
          body: p.body ?? null,
          showLinkButton: p.showLinkButton,
          placement: p.placement,
          landingUrl: p.landingUrl ?? null,
          sortOrder: p.sortOrder,
        });
      })
      .catch(() => { if (!cancelled) setLoadError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [popupCode]);

  const set = (patch: Partial<PopupRequest>) => {
    setForm((f) => ({ ...f, ...patch }));
    setSubmitError('');
  };

  const clearError = (key: ErrorKey) => setErrors((e) => {
    if (!e[key]) return e;
    const next = { ...e };
    delete next[key];
    return next;
  });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.files?.[0];
    e.target.value = '';
    if (!original) return;
    if (!original.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: '이미지 파일만 첨부할 수 있습니다.' }));
      return;
    }
    setUploading(true);
    try {
      const file = await downscaleImage(original);
      const url = await uploadPopupImage(file);
      set({ imageUrl: url });
      setFileName(original.name);
      clearError('image');
    } catch {
      setErrors((prev) => ({ ...prev, image: '이미지 업로드에 실패했습니다.' }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    set({ imageUrl: null });
    setFileName('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const landing = (form.landingUrl ?? '').trim();
    const body = form.displayType === 'TEMPLATE' ? (form.body ?? '').trim() : '';
    const payload: PopupRequest = {
      ...form,
      title: form.title.trim(),
      body: body || null,
      landingUrl: landing || null,
    };

    setSubmitting(true);
    setSubmitError('');
    try {
      if (popupCode) await updatePopup(popupCode, payload);
      else await createPopup(payload);
      navigate('/admin/popups');
    } catch {
      setSubmitError(isEdit ? '팝업 수정에 실패했습니다.' : '팝업 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 py-20 text-center text-sm text-gray-400">불러오는 중...</div>;
  }

  if (loadError) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          <p>팝업 정보를 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => navigate('/admin/popups')}
            className="mt-3 text-xs text-gray-600 underline hover:text-gray-900"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const imageDisplayName = fileName || (form.imageUrl ? '첨부된 이미지' : '선택된 파일 없음');

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <h1 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-200">
        {isEdit ? '팝업 수정' : '팝업 등록'}
      </h1>

      <form onSubmit={submit} noValidate className="mt-6 space-y-6">
        <section className="bg-gray-50 rounded-xl border border-gray-200 p-5 md:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">기본 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <RadioGroup
              label="사용 여부"
              name="active"
              value={form.active}
              options={[{ value: true, label: '노출' }, { value: false, label: '숨김' }]}
              onChange={(v) => set({ active: v })}
            />
            <RadioGroup
              label="다시보지않기 노출 여부"
              name="showDismiss"
              value={form.showDismiss}
              options={[{ value: true, label: '노출' }, { value: false, label: '숨김' }]}
              onChange={(v) => set({ showDismiss: v })}
            />
            <RadioGroup
              label="언어"
              name="language"
              value={form.language}
              options={[{ value: 'ko', label: '국문' }, { value: 'en', label: '영문' }]}
              onChange={(v) => set({ language: v })}
            />
            <RadioGroup
              label="팝업 방식"
              name="displayType"
              value={form.displayType}
              options={[{ value: 'IMAGE', label: '직접 등록' }, { value: 'TEMPLATE', label: '템플릿으로 등록' }]}
              onChange={(v) => { set({ displayType: v }); clearError('image'); clearError('body'); }}
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">팝업 내용</h2>
          <div className="space-y-5">
            <div>
              <FieldLabel htmlFor="popup-title" required>제목</FieldLabel>
              <input
                id="popup-title"
                value={form.title}
                onChange={(e) => { set({ title: e.target.value }); clearError('title'); }}
                maxLength={200}
                aria-invalid={Boolean(errors.title)}
                className={`${inputCls} ${errors.title ? errorBorder : ''}`}
                placeholder="팝업 제목을 입력하세요"
              />
              <FieldError message={errors.title} />
            </div>

            <div>
              <FieldLabel>이미지 첨부</FieldLabel>
              <div className="flex flex-wrap items-center gap-3">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploading ? '업로드 중...' : '파일 선택'}
                </button>
                <span className={`text-sm truncate max-w-[16rem] ${form.imageUrl ? 'text-gray-800' : 'text-gray-400'}`}>
                  {imageDisplayName}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                첨부파일은 1개만 등록할 수 있으며 이미지만 허용됩니다. 이미지 방식은 이미지가 필수입니다.
              </p>
              {form.imageUrl && (
                <div className="relative mt-3 w-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img src={form.imageUrl} alt="첨부 이미지 미리보기" className="w-full h-auto block" />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="이미지 제거"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <FieldError message={errors.image} />
            </div>

            {form.displayType === 'TEMPLATE' && (
              <div>
                <FieldLabel htmlFor="popup-body">본문</FieldLabel>
                <textarea
                  id="popup-body"
                  value={form.body ?? ''}
                  onChange={(e) => { set({ body: e.target.value }); clearError('body'); }}
                  maxLength={BODY_MAX}
                  rows={6}
                  aria-invalid={Boolean(errors.body)}
                  className={`${inputCls} resize-y ${errors.body ? errorBorder : ''}`}
                  placeholder="팝업 본문을 입력하세요"
                />
                <div className="flex justify-between items-start mt-1">
                  <FieldError message={errors.body} />
                  <span className="ml-auto text-xs text-gray-400">
                    {(form.body ?? '').length} / {BODY_MAX}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-gray-50 rounded-xl border border-gray-200 p-5 md:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">이동 및 노출 위치</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <RadioGroup
              label="이동 버튼 노출 여부"
              name="showLinkButton"
              value={form.showLinkButton}
              options={[{ value: true, label: '노출' }, { value: false, label: '숨김' }]}
              onChange={(v) => { set({ showLinkButton: v }); clearError('landingUrl'); }}
            />
            <RadioGroup
              label="노출 위치"
              name="placement"
              value={form.placement}
              options={[{ value: 'HOME', label: '홈' }, { value: 'ALL', label: '전체 페이지' }]}
              onChange={(v) => set({ placement: v })}
            />
            <div className="md:col-span-2">
              <FieldLabel htmlFor="popup-landing">랜딩 URL</FieldLabel>
              <input
                id="popup-landing"
                value={form.landingUrl ?? ''}
                onChange={(e) => { set({ landingUrl: e.target.value }); clearError('landingUrl'); }}
                aria-invalid={Boolean(errors.landingUrl)}
                className={`${inputCls} bg-white ${errors.landingUrl ? errorBorder : ''}`}
                placeholder="https://example.com 또는 /store"
              />
              <FieldError message={errors.landingUrl} />
            </div>
          </div>
        </section>

        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <div className="flex justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/popups')}
            className="min-w-[120px] px-5 py-2.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="min-w-[120px] px-5 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10';
const errorBorder = 'border-red-400';

function FieldLabel({ children, required, htmlFor }: { children: React.ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-800 mb-2">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1.5" role="alert">{message}</p>;
}

interface RadioOption<T> {
  value: T;
  label: string;
}

function RadioGroup<T extends string | boolean>({
  label, name, value, options, onChange,
}: {
  label: string;
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-800 mb-2">
        {label}
        <span className="text-red-500 ml-0.5">*</span>
      </legend>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {options.map((o) => (
          <label key={String(o.value)} className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="w-4 h-4 accent-koala-purple cursor-pointer"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
