import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

export default function AboutCTA() {
  return (
    <section className="py-32 md:py-48 px-6 bg-black text-center">
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Heart className="w-16 h-16 text-zinc-700 mx-auto mb-12" />
        <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-none uppercase">Start Your<br/>Collection</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link to="/artist-lab" className="px-12 py-6 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group">
            작가 탐색 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/store" className="px-12 py-6 bg-zinc-900 text-white font-black rounded-full border border-zinc-800 hover:bg-zinc-800 transition-all">작품 쇼핑</Link>
        </div>
      </motion.div>
    </section>
  );
}