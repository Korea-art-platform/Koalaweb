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

  const videos = artist?.mediaList?.filter((m: ArtistMedia) => m.mediaType === 'VIDEO') ?? [];
  const images = artist?.mediaList?.filter((m: ArtistMedia) => m.mediaType === 'IMAGE') ?? [];

  return { loading, artist, videos, images };
}
