import { useQuery } from '@tanstack/react-query';
import { getArtist } from '@/api/artist';
import type { Artist, ArtistMedia } from '@/api/types';

export function useArtistDetail(id: string | undefined) {
  const { data: artist, isLoading: loading } = useQuery<Artist>({
    queryKey: ['artist', id],
    queryFn: async () => {
      const res = await getArtist(id!);
      return res.data.data;
    },
    enabled: !!id,
    retry: false,
  });

  const media = artist?.mediaList ?? [];

  // 각 섹션별 역할로 분류
  const interviewVideo  = media.find((m: ArtistMedia) => m.mediaRole === 'INTERVIEW_VIDEO');
  const interviewImage  = media.find((m: ArtistMedia) => m.mediaRole === 'INTERVIEW_IMAGE');
  const studioImages    = media.filter((m: ArtistMedia) => m.mediaRole === 'STUDIO');
  const handsImages     = media.filter((m: ArtistMedia) => m.mediaRole === 'HANDS');

  return { loading, artist, interviewVideo, interviewImage, studioImages, handsImages };
}
