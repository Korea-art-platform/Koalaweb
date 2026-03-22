import { Link, useLocation, useNavigate } from 'react-router';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import AccountSidebar from '../components/layouts/AccountSidebar';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/user';

export default function AccountAddresses() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/login'); return; }
    getMyProfile().then((res) => setUser(res.data.data)).catch(console.error);
  }, []);

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
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors">
                  <Plus className="w-4 h-4" /> 배송지 추가
                </button>
              </div>
              {/* 추후 백엔드 연동 예정 */}
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
                <Plus className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">저장된 배송지가 없습니다.</p>
                <p className="text-sm text-gray-300">결제 시 배송지를 입력하시면 자동으로 저장됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}