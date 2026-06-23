import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, BellOff } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { followArtist, unfollowArtist } from '@/api/artist';
import { ShareButton } from '@/app/components/common/ShareButton';

interface ArtistProfileSectionProps {
  name: string;
  description?: string;
  profileImageUrl?: string;
  artistCode?: string;
  followCount?: number;
  isFollowing?: boolean;
}

export function ArtistProfileSection({
  name,
  description,
  profileImageUrl,
  artistCode,
  followCount = 0,
  isFollowing: initialFollowing = false,
}: ArtistProfileSectionProps) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(followCount);
  const [loading, setLoading] = useState(false);

  // API 응답 후 prop 변경 시 로컬 상태 동기화
  useEffect(() => { setIsFollowing(initialFollowing); }, [initialFollowing]);
  useEffect(() => { setCount(followCount); }, [followCount]);

  const handleFollow = async () => {
    if (!artistCode) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowArtist(artistCode);
        setIsFollowing(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await followArtist(artistCode);
        setIsFollowing(true);
        setCount((c) => c + 1);
      }
    } catch (e: any) {
      if (e?.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-6">작가 - ARTIST</p>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 flex-shrink-0 aspect-[3/4] bg-gray-100 overflow-hidden">
          <ImageWithFallback
            src={profileImageUrl ?? '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed break-keep">
            {description ?? '작가에 대한 설명'}
          </p>

          {/* 팔로우 + 공유 버튼 */}
          {artistCode && (
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-50 ${
                  isFollowing
                    ? 'bg-koala-navy text-white hover:bg-koala-navy-hover'
                    : 'border border-gray-300 text-gray-700 hover:border-black hover:text-black'
                }`}
              >
                {isFollowing ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                {isFollowing ? '팔로잉' : '팔로우'}
              </button>
              <span className="text-sm text-gray-400">{count.toLocaleString()}명</span>
              <ShareButton
                title={`${name} — KOALA 작가`}
                description={description}
                imageUrl={profileImageUrl}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}