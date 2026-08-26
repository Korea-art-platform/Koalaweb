import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  getAdminArtists,
  getArtistMedia,
  addArtistMedia,
  deleteArtistMedia,
  type ArtistMediaResponse,
} from '@/api/adminApi';

const ROLE = 'EXHIBITION';
const MAX = 5;

interface ArtistRow {
  artistCode: string;
  name: string;
  photos: ArtistMediaResponse[];
}

export default function AdminExhibition() {
  const [rows, setRows] = useState<ArtistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const page = await getAdminArtists(0, 100);
      const artists: { artistCode: string; name: string }[] = page?.content ?? [];

      const withPhotos = await Promise.all(
        artists.map(async (a) => {
          const media = await getArtistMedia(a.artistCode);
          return {
            artistCode: a.artistCode,
            name: a.name,
            photos: media
              .filter((m) => m.mediaRole === ROLE)
              .sort((x, y) => x.sortOrder - y.sortOrder),
          };
        })
      );
      setRows(withPhotos);
    } catch {
      setError('작가 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const upload = async (artistCode: string, file: File, order: number) => {
    setBusy(artistCode);
    setError('');
    try {
      await addArtistMedia(artistCode, file, {
        mediaType: 'IMAGE',
        mediaRole: ROLE,
        sortOrder: order,
      });
      await load();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || '업로드에 실패했습니다.');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (artistCode: string, mediaId: number) => {
    if (!confirm('이 사진을 삭제할까요?')) return;
    setBusy(artistCode);
    try {
      await deleteArtistMedia(artistCode, mediaId);
      await load();
    } catch {
      setError('삭제에 실패했습니다.');
    } finally {
      setBusy(null);
    }
  };

  const total = rows.reduce((s, r) => s + r.photos.length, 0);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-1">전시회</h1>
      <p className="text-sm text-gray-500 mb-8 break-keep">
        작가별 전시회 사진을 등록합니다. 전시 페이지에서 작가마다 하나의 전시실로 묶여 보입니다.
        작가당 <b>최대 {MAX}장</b>입니다.
      </p>

      {error && (
        <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          불러오는 중...
        </div>
      ) : rows.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">등록된 작가가 없습니다.</p>
      ) : (
        <>
          <p className="mb-4 text-xs text-gray-400">
            작가 {rows.length}명 · 사진 {total}장
          </p>
          <div className="space-y-3">
            {rows.map((row) => (
              <ArtistCard
                key={row.artistCode}
                row={row}
                busy={busy === row.artistCode}
                onUpload={(f) => upload(row.artistCode, f, row.photos.length)}
                onRemove={(id) => remove(row.artistCode, id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ArtistCard({
  row,
  busy,
  onUpload,
  onRemove,
}: {
  row: ArtistRow;
  busy: boolean;
  onUpload: (file: File) => void;
  onRemove: (mediaId: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const full = row.photos.length >= MAX;

  return (
    <section className="rounded-2xl border border-gray-200 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">{row.name}</h2>
        <span className={`text-xs font-medium ${full ? 'text-koala-purple' : 'text-gray-400'}`}>
          {row.photos.length} / {MAX}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {row.photos.map((p) => (
          <div key={p.id} className="group relative">
            <img
              src={p.fileUrl}
              alt=""
              className="h-28 w-28 border border-gray-200 object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              aria-label="사진 삭제"
              className="absolute -right-1.5 -top-1.5 rounded-full bg-koala-navy p-1 text-white
                opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {!full && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="flex h-28 w-28 flex-col items-center justify-center gap-1.5
                border-2 border-dashed border-gray-200 text-xs text-gray-400
                transition-colors hover:border-koala-gold hover:text-koala-purple
                disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {busy ? '올리는 중' : '사진 추가'}
            </button>
          </>
        )}

        {row.photos.length === 0 && !busy && (
          <p className="flex h-28 items-center gap-2 pl-2 text-xs text-gray-400">
            <ImageIcon className="h-4 w-4" />
            아직 등록된 사진이 없습니다
          </p>
        )}
      </div>
    </section>
  );
}
