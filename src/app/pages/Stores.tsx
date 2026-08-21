import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/app/components/layouts/Header';
import { MapPin, Phone, Mail, Store as StoreIcon, ArrowUpRight, Instagram } from 'lucide-react';
import { getStores, type StoreItem } from '@/api/store';

export default function Stores() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores()
      .then((res) => setStores(res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Helmet>
        <title>입점 매장 — KOALA</title>
        <meta name="description" content="KOALA 작품을 직접 만나보실 수 있는 공식 입점 매장 안내." />
      </Helmet>
      <Navigation />

      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-bold text-koala-gold-deep tracking-[0.24em] uppercase mb-2">Stores</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">입점 매장</h1>
          <p className="text-sm md:text-base text-gray-500 mt-3 break-keep">
            KOALA 작품을 직접 만나보실 수 있는 공식 입점 매장입니다.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <StoreIcon className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">아직 등록된 입점 매장이 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {stores.map((s) => (
              <article
                key={s.storeCode}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_-20px_rgba(62,34,89,0.35)] overflow-hidden"
              >
                {s.imageUrl && (
                  <img src={s.imageUrl} alt={s.name} className="w-full h-48 md:h-56 object-cover" />
                )}
                <div className="p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">{s.name}</h2>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.snsUrl && (
                      <a
                        href={s.snsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="SNS"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-koala-purple hover:border-koala-purple transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {s.mapUrl && (
                      <a
                        href={s.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-koala-purple text-white text-xs md:text-sm font-bold hover:bg-koala-purple-hover transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        위치 보기
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {s.description && (
                  <p className="text-sm text-gray-600 leading-relaxed break-keep mt-3">{s.description}</p>
                )}

                <div className="mt-5 pt-5 border-t border-gray-100 grid gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-koala-gold-deep mt-0.5 shrink-0" />
                    <span className="text-gray-700 break-keep">
                      {s.zipCode && <span className="text-gray-400">({s.zipCode}) </span>}
                      {s.address}
                      {s.addressDetail && <span> {s.addressDetail}</span>}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-koala-gold-deep mt-0.5 shrink-0" />
                    <span className="text-gray-700">
                      <a href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-koala-purple transition-colors">{s.phone}</a>
                      {s.phone2 && (
                        <>
                          <span className="text-gray-300 mx-2">|</span>
                          <a href={`tel:${s.phone2.replace(/[^0-9+]/g, '')}`} className="hover:text-koala-purple transition-colors">{s.phone2}</a>
                        </>
                      )}
                    </span>
                  </div>
                  {s.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-koala-gold-deep mt-0.5 shrink-0" />
                      <a href={`mailto:${s.email}`} className="text-gray-700 hover:text-koala-purple transition-colors break-all">{s.email}</a>
                    </div>
                  )}
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
