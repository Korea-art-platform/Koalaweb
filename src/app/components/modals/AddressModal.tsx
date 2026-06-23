import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Search, Check } from 'lucide-react';
import { createAddress, updateAddress } from '@/api/user';
import type { UserAddress } from '@/api/types';

interface AddressModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  address?: UserAddress;
  onClose: () => void;
  onSuccess: () => void;
}

type AddressFormData = {
  label: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2: string;
  isDefault: boolean;
};

export default function AddressModal({ isOpen, mode, address, onClose, onSuccess }: AddressModalProps) {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPostcode, setShowPostcode] = useState(false);
  const postcodeContainerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AddressFormData>();

  // 모드별 폼 초기화
  useEffect(() => {
    if (!isOpen) return;
    setServerError('');
    setSuccess('');

    if (mode === 'edit' && address) {
      reset({
        label: address.label ?? '',
        recipientName: address.recipientName,
        recipientPhone: address.recipientPhone,
        zipCode: address.zipCode,
        address1: address.address1,
        address2: address.address2 ?? '',
        isDefault: address.isDefault ?? false,
      });
    } else {
      reset({ label: '', recipientName: '', recipientPhone: '', zipCode: '', address1: '', address2: '', isDefault: false });
    }
  }, [isOpen, mode, address, reset]);

  const handleAddressSearch = () => {
    setShowPostcode(true);
  };

  useEffect(() => {
    if (!showPostcode) return;

    const initEmbed = () => {
      if (!postcodeContainerRef.current) return;
      postcodeContainerRef.current.innerHTML = '';
      new (window as any).daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: (data: DaumPostcodeResult) => {
          let fullAddress = data.address;
          let extra = '';
          if (data.addressType === 'R') {
            if (data.bname?.trim()) extra += data.bname;
            if (data.buildingName?.trim()) extra += (extra ? `, ${data.buildingName}` : data.buildingName);
            if (extra) fullAddress += ` (${extra})`;
          }
          setValue('zipCode', data.zonecode);
          setValue('address1', fullAddress);
          setShowPostcode(false);
        },
      }).embed(postcodeContainerRef.current);
    };

    if ((window as any).daum?.Postcode) {
      initEmbed();
    } else {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = initEmbed;
      document.head.appendChild(script);
    }
  }, [showPostcode]);

  const onSubmit = async (data: AddressFormData) => {
    setServerError('');
    setSuccess('');
    const payload = {
      label: data.label || undefined,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      zipCode: data.zipCode,
      address1: data.address1,
      address2: data.address2 || undefined,
      isDefault: data.isDefault,
    };

    try {
      if (mode === 'create') {
        await createAddress(payload);
        setSuccess('배송지가 추가되었습니다.');
      } else {
        await updateAddress(address!.id!, payload);
        setSuccess('배송지가 수정되었습니다.');
      }
      setTimeout(() => { onSuccess(); handleClose(); }, 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || `배송지 ${mode === 'create' ? '추가' : '수정'}에 실패했습니다.`);
    }
  };

  const handleClose = () => {
    reset();
    setServerError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* 우편번호 검색 오버레이 */}
      {showPostcode && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-medium text-gray-900">주소 검색</span>
              <button
                onClick={() => setShowPostcode(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
              >✕</button>
            </div>
            <div ref={postcodeContainerRef} style={{ width: '100%', height: '460px' }} />
          </div>
        </div>
      )}
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-medium">{isEditMode ? '배송지 수정' : '배송지 추가'}</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{serverError}</div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 flex items-center gap-2">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}

          <div>
            <label htmlFor="addr-label" className="block text-sm font-medium text-gray-700 mb-2">
              배송지 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="addr-label"
              type="text"
              placeholder="집, 회사 등"
              {...register('label', { required: '배송지 이름을 입력해주세요.' })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
            {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>}
          </div>

          <div>
            <label htmlFor="addr-name" className="block text-sm font-medium text-gray-700 mb-2">
              수령인 <span className="text-red-500">*</span>
            </label>
            <input
              id="addr-name"
              type="text"
              placeholder="홍길동"
              {...register('recipientName', { required: '수령인 이름을 입력해주세요.' })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
            {errors.recipientName && <p className="mt-1 text-xs text-red-500">{errors.recipientName.message}</p>}
          </div>

          <div>
            <label htmlFor="addr-phone" className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              id="addr-phone"
              type="tel"
              placeholder="010-1234-5678"
              {...register('recipientPhone', { required: '전화번호를 입력해주세요.' })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
            {errors.recipientPhone && <p className="mt-1 text-xs text-red-500">{errors.recipientPhone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              우편번호 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                placeholder="06234"
                {...register('zipCode', { required: true })}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-transparent text-gray-500 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="px-4 py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" /> 찾기
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="서울시 강남구 테헤란로 123"
              {...register('address1', { required: true })}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="addr-detail" className="block text-sm font-medium text-gray-700 mb-2">상세 주소</label>
            <input
              id="addr-detail"
              type="text"
              placeholder="456호"
              {...register('address2')}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="addr-default"
              type="checkbox"
              {...register('isDefault')}
              className="w-5 h-5 rounded border-gray-300 cursor-pointer"
            />
            <label htmlFor="addr-default" className="text-sm text-gray-700 cursor-pointer">
              기본 배송지로 설정
            </label>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? '수정 중...' : '추가 중...'}
                </>
              ) : (
                isEditMode ? '배송지 수정' : '배송지 추가'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 다음 우편번호 API 응답 타입
interface DaumPostcodeResult {
  address: string;
  addressType: 'R' | 'J';
  zonecode: string;
  bname?: string;
  buildingName?: string;
}
