import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AboutHero() {
  return (
    <section data-hero="dark" className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950">
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-white/70 text-xs mb-8 border border-white/10 tracking-[0.2em] uppercase font-medium">
          <Sparkles className="w-3 h-3 text-zinc-400" />
          <span>Korean Art Laboratory</span>
        </div>
        <h1 className="text-6xl md:text-[110px] font-black text-white mb-8 tracking-tighter leading-[0.85]">
          THE ART IN<br />
          <span className="text-zinc-500 font-outline-2">YOUR HANDS</span>
        </h1>
        <p className="text-base md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light break-keep">
          한국 현대미술의 독창성을 세계와 연결하고, 예술가들의 실험적인 정신을 당신의 일상으로 전달합니다.
        </p>
      </motion.div>
    </section>
  );
}