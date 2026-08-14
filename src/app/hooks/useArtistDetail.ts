import { useQuery } from '@tanstack/react-query';
import { getArtist, getArtistFollowStatus } from '@/api/artist';
import { useAuth } from '@/app/context/AuthContext';
import type { Artist, ArtistMedia } from '@/api/types';

export function useArtistDetail(id: string | undefined) {
  const { isAuthenticated } = useAuth();

  const { data: artist, isLoading: loading } = useQuery<Artist>({
    queryKey: ['artist', id],
    queryFn: async () => {
      const res = await getArtist(id!);
      return res.data.data;
    },
    enabled: !!id,
    retry: false,
    staleTime: 0,
  });

  const { data: isFollowing } = useQuery<boolean>({
    queryKey: ['artist-following', id],
    queryFn: async () => {
      const res = await getArtistFollowStatus(id!);
      return res.data.data;
    },
    enabled: !!id && !!isAuthenticated,
    staleTime: 0,
  });

  const media = artist?.mediaList ?? [];

  const interviewVideo  = media.find((m: ArtistMedia) => m.mediaRole === 'INTERVIEW_VIDEO');
  const interviewImage  = media.find((m: ArtistMedia) => m.mediaRole === 'INTERVIEW_IMAGE');
  const studioImages    = media.filter((m: ArtistMedia) => m.mediaRole === 'STUDIO');
  const handsImages     = media.filter((m: ArtistMedia) => m.mediaRole === 'HANDS');

  const followStatus = isAuthenticated ? (isFollowing ?? false) : false;

  return { loading, artist, interviewVideo, interviewImage, studioImages, handsImages, isFollowing: followStatus };
}
