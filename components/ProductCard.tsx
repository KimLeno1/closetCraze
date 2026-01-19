import React from 'react';
import { Product } from '../types';
import { Users, AlertCircle, Bookmark, Zap, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onVaultToggle?: (e: React.MouseEvent, id: string) => void;
  isInVault?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onVaultToggle, isInVault = false }) => {
  const isStale = (product.lastMonthSales || 0) < 5 && (product.scarcityCount || 0) > 10;
  const fakeRequests = isStale ? 1240 + Math.floor(Math.random() * 500) : null;
  
  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer relative bg-[#111] overflow-hidden rounded-sm transition-all duration-500 hover:shadow-2xl flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
        
        {/* Scarcity Overlay */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2 z-20">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-white/10">
            <AlertCircle size={10} className="text-amber-500" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-white">
              {product.scarcityCount} left
            </span>
          </div>
          
          {discountPercent > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/90 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-amber-400/50">
              <Zap size={10} className="text-black fill-black" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-black">
                -{discountPercent}% Status
              </span>
            </div>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onVaultToggle?.(e, product.id);
          }}
          className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all z-20 ${
            isInVault ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60'
          }`}
        >
          <Bookmark size={14} fill={isInVault ? "currentColor" : "none"} />
        </button>

        {/* Social Proof */}
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Users size={12} className="text-stone-300" />
            <span className="text-[10px] text-stone-300 font-light">
              {product.socialCount} cited
            </span>
          </div>
          {isStale && (
            <div className="flex items-center gap-2 text-red-400">
              <TrendingUp size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">+{fakeRequests} reqs</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-black flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-serif text-lg md:text-2xl group-hover:text-white transition-colors leading-tight line-clamp-1">{product.name}</h3>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-sm md:text-lg font-light text-stone-200">GH₵{product.price}</span>
          </div>
        </div>
        <p className="text-stone-600 text-[11px] md:text-sm font-light italic mb-4 line-clamp-1">"{product.statement}"</p>
        
        <div className="mt-auto">
          <div className="w-full h-px bg-white/5 mb-4" />
          <div className="flex justify-between items-center text-[8px] md:text-[10px] uppercase tracking-widest text-stone-700">
            <span className="font-black">{product.mood}</span>
            <span className={isStale ? 'text-amber-500 font-black' : 'font-bold'}>
              {isStale ? 'SURGE MATCH' : `${product.fitConfidence}% Match`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};