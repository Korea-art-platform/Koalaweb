import { Link, useLocation, useNavigate } from 'react-router';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import AccountSidebar from '@/app/components/layouts/AccountSidebar';
import AddressModal from '@/app/components/modals/AddressModal';
import { useEffect, useState } from 'react';
import { getMyProfile, getMyAddresses, deleteAddress } from '@/api/user';

export default function AccountAddresses() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const profileRes = await getMyProfile();
      setUser(profileRes?.data?.data);

      const addressRes = await getMyAddresses();
      setAddresses(addressRes?.data?.data || []);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditAddress = (addr: any) => {
    setSelectedAddress(addr);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('이 배송지를 삭제하시겠습니까?')) return;
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    } catch (err: any) {
      alert(err.response?.data?.message || '배송지 삭제에 실패했습니다.');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedAddress(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl tracking-tight mb-2">My Account</h1>
            <p className="text-sm text-gray-400">배송지를 관리하세요</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar currentPath={location.pathname} user={user} />
            </div>
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl">배송지 관리</h2>
                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" /> 배송지 추가
                </button>
              </div>

              {loading ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 animate-pulse">
                  <div className="h-8 bg-gray-100 rounded w-1/3 mx-auto mb-4" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
                  <Plus className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">저장된 배송지가 없습니다.</p>
                  <p className="text-sm text-gray-300">배송지를 추가하여 더 편리하게 쇼핑하세요.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address: any) => (
                    <div
                      key={address.id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{address.label}</h3>
                            {address.isDefault && (
                              <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                                기본 배송지
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{address.recipientName}</p>
                          <p className="text-sm text-gray-600 mb-3">{address.recipientPhone}</p>
                          <p className="text-sm text-gray-700">
                            [{address.zipCode}] {address.address1}
                          </p>
                          {address.address2 && (
                            <p className="text-sm text-gray-600">{address.address2}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" /> 수정
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-900 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> 삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 배송지 추가/수정 모달 */}
      <AddressModal
        isOpen={isModalOpen}
        mode={modalMode}
        address={selectedAddress}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchData()}
      />
    </div>
  );
}
