import Navigation from '@/app/components/layouts/Header';
import { Bell } from 'lucide-react';

export default function Notice() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Notice</p>
          <h1 className="text-3xl font-bold tracking-tight">공지사항</h1>
        </div>

        {/* 공지 없음 상태 */}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">아직 등록된 공지사항이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
