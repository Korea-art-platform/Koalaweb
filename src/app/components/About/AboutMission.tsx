import { motion } from 'framer-motion';
import { Palette, Users, Globe, Award } from 'lucide-react';

const values = [
  { icon: Palette, title: '예술의 가치', description: '한국 현대 미술의 우수성을 세계에 알리고 아티스트와 컬렉터를 연결합니다.' },
  { icon: Users, title: '아티스트 중심', description: '작가의 창작 활동을 지원하고 공정한 수익 분배 시스템을 만듭니다.' },
  { icon: Globe, title: '글로벌 플랫폼', description: 'K-Art를 전 세계로 확장하며 문화적 경계를 넘어 예술을 공유합니다.' },
  { icon: Award, title: '큐레이션 품질', description: '엄선된 작품만을 소개하여 컬렉터에게 신뢰할 수 있는 경험을 제공합니다.' }
];

export default function AboutMission() {
  return (
    <section className="py-32 md:py-48 px-6 bg-white relative z-20">
      <div className="max-w-[1200px] mx-auto">
        <motion.div className="flex flex-col lg:flex-row gap-16 items-start mb-32" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="lg:w-1/3">
            <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none uppercase">Our<br/>Mission</h2>
          </div>
          <div className="lg:w-2/3 pt-4 text-xl md:text-3xl text-zinc-500 leading-snug font-medium">
            KOALA는 기술과 예술의 경계를 허물고, 누구나 컬렉터가 될 수 있는 새로운 아트 에코시스템을 구축합니다.
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
          {values.map((v, i) => (
            <motion.div key={i} className="group border-t border-zinc-100 pt-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-black transition-all">
                <v.icon className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-black mt-6 mb-4">{v.title}</h3>
              <p className="text-zinc-500 text-lg font-light break-keep">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}