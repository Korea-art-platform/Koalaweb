import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { createAddress, updateAddress } from '../../../api/user';

interface AddressModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  address?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddressModal({ isOpen, mode, address, onClose, onSuccess }: AddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    label: '',
    recipientName: '',
    recipientPhone: '',
    zipCode: '',
    address1: '',
    address2: '',
    isDefault: false,
  });

  // 모드별 초기화
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && address) {
      setForm({
        label: address.label || '',
        recipientName: address.recipientName || '',
        recipientPhone: address.recipientPhone || '',
        zipCode: address.zipCode || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        isDefault: address.isDefault || false,
      });
    } else {
      // create 모드 초기화
      setForm({
        label: '',
        recipientName: '',
        recipientPhone: '',
        zipCode: '',
        address1: '',
        address2: '',
        isDefault: false,
      });
    }
    setError('');
    setSuccess('');
  }, [isOpen, mode, address]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = () => {
    // 다음 우편번호 API 로드
    if ((window as any).daum && (window as any).daum.Postcode) {
      openAddressSearch();
    } else {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        openAddressSearch();
      };
      document.head.appendChild(script);
    }
  };

  const openAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        console.log('📍 다음 API 응답:', data);  // 디버깅용

        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname && data.bname.trim() !== '') {
            extraAddress += data.bname;
          }
          // buildingName, apartment 등 다양한 필드 확인
          if (data.buildingName && data.buildingName.trim() !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          if (extraAddress.trim() !== '') {
            fullAddress += ` (${extraAddress})`;
          }
        }

        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address1: fullAddress,
        }));
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 필수 필드 검증
    if (!form.label.trim()) {
      setError('배송지 이름을 입력해주세요.');
      return;
    }
    if (!form.recipientName.trim()) {
      setError('수령인 이름을 입력해주세요.');
      return;
    }
    if (!form.recipientPhone.trim()) {
      setError('수령인 전화번호를 입력해주세요.');
      return;
    }
    if (!form.zipCode.trim()) {
      setError('우편번호를 입력해주세요.');
      return;
    }
    if (!form.address1.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        label: form.label,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        zipCode: form.zipCode,
        address1: form.address1,
        address2: form.address2,
        isDefault: form.isDefault,
      };

      if (mode === 'create') {
        await createAddress(payload);
        setSuccess('배송지가 추가되었습니다.');
      } else {
        await updateAddress(address.id, payload);
        setSuccess('배송지가 수정되었습니다.');
      }

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || `배송지 ${mode === 'create' ? '추가' : '수정'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      label: '',
      recipientName: '',
      recipientPhone: '',
      zipCode: '',
      address1: '',
      address2: '',
      isDefault: false,
    });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const title = isEditMode ? '배송지 수정' : '배송지 추가';
  const buttonText = isEditMode ? '배송지 수정' : '배송지 추가';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-medium">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 성공 메시지 */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 flex items-center gap-2">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}

          {/* 배송지 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배송지 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleFormChange}
              placeholder="집, 회사 등"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          {/* 수령인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수령인 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="recipientName"
              value={form.recipientName}
              onChange={handleFormChange}
              placeholder="홍길동"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="recipientPhone"
              value={form.recipientPhone}
              onChange={handleFormChange}
              placeholder="010-1234-5678"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          {/* 우편번호 + 주소 찾기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              우편번호 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                name="zipCode"
                value={form.zipCode}
                onChange={handleFormChange}
                placeholder="06234"
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-transparent text-gray-500 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" /> 찾기
              </button>
            </div>
          </div>

          {/* 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address1"
              value={form.address1}
              onChange={handleFormChange}
              placeholder="서울시 강남구 테헤란로 123"
              readOnly
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* 상세 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 주소
            </label>
            <input
              type="text"
              name="address2"
              value={form.address2}
              onChange={handleFormChange}
              placeholder="456호"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>

          {/* 기본 배송지 설정 */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleFormChange}
              className="w-5 h-5 rounded border-gray-300 cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer">
              기본 배송지로 설정
            </label>
          </div>

          {/* 버튼 */}
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
              disabled={loading}
              className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? '수정 중...' : '추가 중...'}
                </>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
