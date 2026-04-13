import { motion } from 'framer-motion';

const milestones = [
  { year: '2023', title: 'KoALa 설립', description: '프리미엄 K-Art 플랫폼 론칭' },
  { year: '2023', title: '첫 전시 개최', description: '20명의 아티스트와 함께 시작' },
  { year: '2024', title: '글로벌 확장', description: '일본, 미국 시장 진출' },
  { year: '2025', title: 'AR Gallery 오픈', description: '세계 최초 AR 기반 갤러리 론칭' },
  { year: '2026', title: 'Resell Market', description: '한정판 작품 재판매 플랫폼 출시' },
];

export default function AboutTimeline() {
  return (
    <section className="py-32 md:py-48 px-6 bg-white overflow-hidden">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-4xl md:text-6xl font-black text-black text-center mb-32 uppercase">Our Journey</h2>
        <div className="space-y-40">
          {milestones.map((m, i) => (
            <motion.div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="flex-1 text-center md:text-left">
                <span className="text-9xl md:text-[150px] font-black text-zinc-100 block leading-none">{m.year}</span>
              </div>
              <div className="flex-1 border-l-4 border-black pl-10 md:pl-16">
                <h3 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">{m.title}</h3>
                <p className="text-zinc-500 text-xl font-light leading-relaxed break-keep">{m.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}