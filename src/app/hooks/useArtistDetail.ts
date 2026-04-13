import { useState, useEffect } from 'react';
import { getArtist } from '@/api/artist';
import type { Artist, ArtistMedia } from '@/api/types';

export function useArtistDetail(id: string | undefined) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const artistRes = await getArtist(id);
        setArtist(artistRes.data.data);
      } catch (e) {
        console.error('아티스트 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const videos = artist?.mediaList?.filter((m: ArtistMedia) => m.mediaType === 'VIDEO') ?? [];
  const images = artist?.mediaList?.filter((m: ArtistMedia) => m.mediaType === 'IMAGE') ?? [];

  return { loading, artist, videos, images };
}