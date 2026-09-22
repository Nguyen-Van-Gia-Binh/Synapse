import React from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { CANVAS_CONFIG } from '../../canvas';

export const CanvasViewport: React.FC = () => {
  const { gender, slots } = useOutfitStore();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      {/* Canvas Paper-Doll Frame (Tỉ lệ 2:3) */}
      <div 
        className="relative overflow-hidden rounded-2xl glass-card shadow-2xl flex items-center justify-center border border-heritage-cream/15"
        style={{
          width: 'min(100%, 360px)',
          aspectRatio: `${CANVAS_CONFIG.ASPECT_RATIO}`,
        }}
      >
        {/* Background silhouette watermark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
          <span className="font-serif-heritage text-3xl text-heritage-yellow/40">
            {gender === 'FEMALE' ? 'NỮ MẪU' : 'NAM MẪU'}
          </span>
          <span className="text-xs text-heritage-cream/50 mt-1 tracking-widest uppercase">
            800 x 1200 px Canvas
          </span>
        </div>

        {/* Slot Layer Status Indicators */}
        <div className="absolute bottom-3 left-3 right-3 glass-panel p-2.5 rounded-lg text-xs flex justify-between items-center">
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(slots).map(([slot, item]) => (
              <span 
                key={slot}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  item ? 'bg-heritage-teal text-white' : 'bg-heritage-black/60 text-heritage-cream/40'
                }`}
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
