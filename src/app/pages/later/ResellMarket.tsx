import Navigation from '@/app/components/layouts/Header';
import { Filter, TrendingUp, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

const filters = ['전체', '아트 토이', '조각', '세라믹', '리미티드 에디션'];

const resellItems = [
  {
    id: '1',
    name: '하모니 스피릿',
    artist: '박지영',
    category: '프리미엄 아트 토이',
    originalPrice: 450000,
    currentPrice: 680000,
    priceChange: 51,
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '125/500',
    condition: '미사용 신품 (Mint)',
    owners: [
      { name: '수집가 A', date: '2024-01-15' },
      { name: '수집가 B', date: '2025-06-20' },
    ],
    hasBlockchain: true,
  },
  {
    id: '2',
    name: '고요한 형상',
    artist: '이민호',
    category: '장식용 오브제',
    originalPrice: 890000,
    currentPrice: 1250000,
    priceChange: 40,
    image: 'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2N1bHB0dXJlJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '45/100',
    condition: '상태 우수 (Excellent)',
    owners: [
      { name: '갤러리 서울', date: '2023-08-10' },
      { name: '개인 소장가', date: '2024-11-05' },
    ],
    hasBlockchain: true,
  },
  {
    id: '3',
    name: '미래의 유산',
    artist: '정우성',
    category: '리미티드 에디션',
    originalPrice: 1250000,
    currentPrice: 1890000,
    priceChange: 51,
    image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2xsZWN0aWJsZSUyMGZpZ3VyaW5lfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '12/50',
    condition: '미사용 신품 (Mint)',
    owners: [
      { name: '초기 후원자', date: '2023-03-01' },
    ],
    hasBlockchain: true,
  },
  {
    id: '4',
    name: '세라믹 드림',
    artist: '최혜원',
    category: '하이엔드 아트 액세서리',
    originalPrice: 320000,
    currentPrice: 425000,
    priceChange: 33,
    image: 'https://images.unsplash.com/photo-1706821856764-4e85de5482d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNlcmFtaWMlMjBhcnQlMjBwaWVjZXxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '210/300',
    condition: '상태 우수 (Excellent)',
    owners: [
      { name: '아트 매니아', date: '2024-05-12' },
      { name: '전문 리셀러', date: '2025-12-18' },
    ],
    hasBlockchain: false,
  },
];

export default function ResellMarket() {
  const [selectedFilter, setSelectedFilter] = useState('전체');

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="pt-32 pb-12 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
              리셀 마켓
            </div>
            <h1 className="text-6xl mb-6 tracking-tight">
              프리미엄 아트 리셀
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              인증된 아트 굿즈와 블록체인 검증을 통한 투명한 소유권 이력을 제공하는 신뢰할 수 있는 마켓플레이스입니다.
            </p>
          </div>
        </div>
      </section>
      <section className="px-8 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 pb-8 border-b border-gray-100">
            <Filter className="w-5 h-5 text-gray-400" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedFilter === filter
                    ? 'bg-koala-navy text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resellItems.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 border border-gray-50 hover:border-gray-200 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {item.hasBlockchain && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                            <Shield className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-[10px] font-medium">블록체인 인증됨</span>
                          </div>
                        )}
                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                          <span className="text-[10px] font-medium">{item.condition}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-6">
                      <div>
                        <div className="text-xs text-gray-400 tracking-wide uppercase mb-2">
                          {item.category}
                        </div>
                        <h3 className="text-2xl mb-2 group-hover:text-gray-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">작가: {item.artist}</p>
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-3">
                            <div className="text-2xl font-semibold">
                              ₩{item.currentPrice.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                              <TrendingUp className="w-4 h-4" />
                              +{item.priceChange}%
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            초기 발매가: ₩{item.originalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-200">
                          <span className="text-gray-500">에디션 넘버</span>
                          <span className="font-medium">{item.edition}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Globe className="w-4 h-4 text-blue-400" />
                          전 세계 배송 가능
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                          소유권 이력 (History)
                        </div>
                        <div className="space-y-2">
                          {item.owners.map((owner, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{owner.name}</span>
                              <span className="text-gray-400 text-xs">{owner.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-16 border border-gray-100">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl mb-6 tracking-tight">
                안심하고 거래하세요
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-12">
                리셀 마켓의 모든 아이템은 전문가의 감정과 블록체인 검증을 거치며,
                전체 소유권 이력이 투명하게 공개됩니다. 전 세계 배송, 전액 보험
                및 구매자 보호 프로그램이 기본으로 포함되어 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6">
                  <Shield className="w-8 h-8 mx-auto mb-4 text-green-500" />
                  <div className="font-medium mb-2">블록체인 검증</div>
                  <div className="text-sm text-gray-500">
                    100% 정품 인증 보장
                  </div>
                </div>
                <div className="p-6">
                  <Globe className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                  <div className="font-medium mb-2">글로벌 배송</div>
                  <div className="text-sm text-gray-500">
                    전 세계 안전 특송 지원
                  </div>
                </div>
                <div className="p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-4 text-purple-500" />
                  <div className="font-medium mb-2">마켓 인사이트</div>
                  <div className="text-sm text-gray-500">
                    실시간 시세 추적 및 분석
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
