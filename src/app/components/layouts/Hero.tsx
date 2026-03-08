import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-24 px-6 md:px-8 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="relative bg-gray-900 rounded-3xl overflow-hidden group">
          {/* 21:9 Aspect Ratio Container */}
          <div className="relative w-full" style={{ paddingBottom: '42.857%' }}>
            
            {/* Background Image & Overlay */}
            <div className="absolute inset-0">
              <img
                src="https://cdn.iusm.co.kr/news/photo/202501/1048414_600697_3834.jpg"
                alt="Featured Art"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Black Semi-transparent Overlay */}
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-8 md:px-16">
              <div className="max-w-3xl z-10 text-white">
                <div className="inline-block px-4 py-1.5 bg-white text-black text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                  신작품!
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight font-bold leading-tight">
                  예술작품이
                  <br />
                  당신의 손에
                </h1>
                
                <p className="text-lg md:text-xl text-gray-100 leading-relaxed mb-8 opacity-90 max-w-2xl mx-auto">
                  한국 유명 작가들의 작품을 보고 한정판 작품과 굿즈를 지금 바로 구경하세요!
                </p>
                
                <Link
                  to="/smart-store"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 hover:gap-4 font-semibold"
                >
                  쇼핑하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;