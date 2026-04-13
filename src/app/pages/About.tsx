import { Link } from 'react-router';
import { Palette, Users, Globe, Award, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Palette,
      title: '예술의 가치',
      description: '한국 현대 미술의 우수성을 세계에 알리고, 아티스트와 컬렉터를 연결합니다.'
    },
    {
      icon: Users,
      title: '아티스트 중심',
      description: '작가의 창작 활동을 지원하고, 공정한 수익 분배를 통해 지속 가능한 생태계를 만듭니다.'
    },
    {
      icon: Globe,
      title: '글로벌 플랫폼',
      description: 'K-Art를 전 세계로 확장하며, 문화적 경계를 넘어 예술을 공유합니다.'
    },
    {
      icon: Award,
      title: '큐레이션 품질',
      description: '엄선된 작품만을 소개하여 컬렉터에게 신뢰할 수 있는 경험을 제공합니다.'
    }
  ];

  const team = [
    {
      name: '김지훈',
      role: 'Founder & CEO',
      description: '현대미술 큐레이터 출신, 글로벌 아트 마켓 10년 경력',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      name: '이서연',
      role: 'Chief Curator',
      description: '서울대 미술사학 박사, 국내외 주요 미술관 큐레이터',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      name: '박준영',
      role: 'Head of Technology',
      description: '실리콘밸리 스타트업 CTO 출신, AR/VR 기술 전문가',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    },
    {
      name: '최민아',
      role: 'Artist Relations',
      description: '아티스트 매니지먼트 15년, 국내외 아트페어 디렉터',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    }
  ];

  const milestones = [
    { year: '2023', title: 'KoALa 설립', description: '프리미엄 K-Art 플랫폼 론칭' },
    { year: '2023', title: '첫 전시 개최', description: '20명의 아티스트와 함께 시작' },
    { year: '2024', title: '글로벌 확장', description: '일본, 미국 시장 진출' },
    { year: '2025', title: 'AR Gallery 오픈', description: '세계 최초 AR 기반 갤러리 론칭' },
    { year: '2026', title: 'Resell Market', description: '한정판 작품 재판매 플랫폼 출시' },
  ];

  // 공통 애니메이션 설정 (타입 에러 방지를 위한 as const)
  const fadeInVariant = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  return (
    <div className="bg-white pb-24 md:pb-0 font-sans">
      
      {/* 1. Hero Section */}
      <section
        data-hero="dark"
        className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-zinc-950" />
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" as const }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-white/70 text-[10px] md:text-xs mb-8 border border-white/10 tracking-[0.2em] uppercase font-medium">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span>Korean Art Laboratory</span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-black text-white mb-8 tracking-tighter leading-[0.85]">
            THE ART IN<br />
            <span className="text-zinc-500 font-outline-2">YOUR HANDS</span>
          </h1>

          <p className="text-base md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light break-keep">
            한국 현대미술의 독창성을 세계와 연결하고,<br /> 
            예술가들의 실험적인 정신을 당신의 일상으로 전달합니다.
          </p>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <span className="text-[10px] text-zinc-600 tracking-widest uppercase mb-2">Scroll</span>
            <motion.div 
              className="w-px h-20 bg-gradient-to-b from-zinc-500 to-transparent"
              animate={{ height: [0, 80, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
            />
          </div>
        </motion.div>
      </section>

      {/* 2. Mission Section */}
      <section className="py-32 md:py-48 px-6 bg-white relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            className="flex flex-col lg:flex-row gap-16 items-start mb-32"
            {...fadeInVariant}
          >
            <div className="lg:w-1/3">
              <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none uppercase">
                Our<br/>Mission
              </h2>
            </div>
            <div className="lg:w-2/3 pt-4">
              <p className="text-xl md:text-3xl text-zinc-500 leading-snug font-medium break-keep">
                KoALa는 기술과 예술의 경계를 허물고, 누구나 컬렉터가 될 수 있는 새로운 아트 에코시스템을 구축합니다.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="group border-t border-zinc-100 pt-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" as const }}
              >
                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-black transition-all duration-500">
                    <value.icon className="w-7 h-7 text-black group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-4">{value.title}</h3>
                    <p className="text-zinc-500 leading-relaxed break-keep text-lg font-light">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Team Section */}
      <section className="py-32 md:py-48 px-6 bg-zinc-50">
        <motion.div 
          className="max-w-[1200px] mx-auto text-center mb-24"
          {...fadeInVariant}
        >
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-6 uppercase">The Creators</h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-medium break-keep">
            K-Art의 새로운 미래를 만들어가는 아티스트와 기술 전문가들입니다.
          </p>
        </motion.div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div 
              key={index} 
              className="group bg-white p-5 rounded-[40px] border border-zinc-200 hover:border-black transition-all duration-500"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" as const }}
            >
              <div className="aspect-[4/5] rounded-[30px] overflow-hidden mb-8">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="px-3 pb-3">
                <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-5">{member.role}</p>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Timeline Section */}
      <section className="py-32 md:py-48 px-6 bg-white overflow-hidden">
        <div className="max-w-[1000px] mx-auto">
          <motion.div className="text-center mb-32" {...fadeInVariant}>
            <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-6 uppercase">Our Journey</h2>
          </motion.div>

          <div className="space-y-40">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index} 
                className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" as const }}
              >
                <div className="flex-1 text-center md:text-left">
                  <span className="text-9xl md:text-[150px] font-black text-zinc-100 block leading-none">{milestone.year}</span>
                </div>
                <div className="flex-1 border-l-4 border-black pl-10 md:pl-16">
                  <h3 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">{milestone.title}</h3>
                  <p className="text-zinc-500 text-xl font-light leading-relaxed break-keep">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-32 md:py-48 px-6 bg-black">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" as const }}
        >
          <Heart className="w-16 h-16 text-zinc-700 mx-auto mb-12" />
          <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-none uppercase">
            Start Your<br/>Collection
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link to="/artist-lab" className="px-12 py-6 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group">
              작가 탐색 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/store" className="px-12 py-6 bg-zinc-900 text-white font-black rounded-full border border-zinc-800 hover:bg-zinc-800 transition-all">
              작품 쇼핑
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}