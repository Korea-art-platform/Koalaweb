import { Plus, Edit2, Trash2 } from 'lucide-react';
import AddressModal from '@/app/components/modals/AddressModal';
import { useEffect, useState } from 'react';
import { getMyAddresses, deleteAddress } from '@/api/user';
import { useTranslation } from 'react-i18next';
import type { UserAddress } from '@/api/types';

export default function AccountAddresses() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const res = await getMyAddresses();
      setAddresses(res?.data?.data || []);
    } catch (err) {
      console.error('배송지 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditAddress = (addr: UserAddress) => {
    setSelectedAddress(addr);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!window.confirm(t('account.addresses.deleteConfirm'))) return;
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || t('account.addresses.deleteFailed'));
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedAddress(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 px-1">
        <h2 className="text-xl md:text-2xl font-bold italic">{t('account.addresses.title')}</h2>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors text-sm font-bold"
        >
          <Plus className="w-4 h-4" /> {t('account.addresses.addButton')}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-100 rounded w-1/3 mx-auto mb-4" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 md:p-16 text-center border border-dashed border-gray-200">
          <Plus className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-900 mb-2">{t('account.addresses.emptyTitle')}</p>
          <p className="text-sm text-gray-400">{t('account.addresses.emptyDesc')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{address.label}</h3>
                    {address.isDefault && (
                      <span className="px-3 py-1 bg-koala-navy text-white text-[10px] font-bold rounded-full">
                        {t('account.addresses.defaultBadge')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{address.recipientName}</p>
                  <p className="text-sm text-gray-500 mb-3">{address.recipientPhone}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    [{address.zipCode}] {address.address1}
                  </p>
                  {address.address2 && (
                    <p className="text-sm text-gray-500 mt-0.5">{address.address2}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-xs font-bold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> {t('account.addresses.edit')}
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t('account.addresses.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        mode={modalMode}
        address={selectedAddress}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchAddresses()}
      />
    </>
  );
}
