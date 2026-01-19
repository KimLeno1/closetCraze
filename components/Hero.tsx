import React from 'react';
import { View } from '../types';

interface HeroProps {
  onNavigate: (view: View) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[90vh] md:h-[100vh] w-full overflow-hidden flex flex-col justify-end">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ filter: 'brightness(0.6)' }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-34241-large.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 px-6 py-12 md:p-20 md:pb-32 space-y-8 md:space-y-10">
        <div className="max-w-4xl space-y-6">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-amber-500/80">Personalized for you</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif leading-[1.1] md:leading-tight">
            Designed for those who <br /><span className="italic">don’t blend in.</span>
          </h1>
          <p className="text-stone-300 max-w-lg text-sm sm:text-lg font-light leading-relaxed">
            Curated pieces engineered for identity. 
            <span className="block mt-2 font-medium text-white underline decoration-stone-500 underline-offset-8">
              Trending among Icons like you.
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-8">
          <button 
            onClick={() => onNavigate('famous-products')}
            className="w-full sm:w-auto bg-white text-black px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-stone-200 transition-colors duration-300"
          >
            Unlock This Look
          </button>
          <button 
            onClick={() => onNavigate('drops')}
            className="w-full sm:w-auto border border-white/20 bg-black/20 backdrop-blur-md text-white px-10 py-5 text-xs font-black uppercase tracking-widest hover:border-white transition-colors duration-300"
          >
            View Drops
          </button>
        </div>
      </div>
    </section>
  );
};