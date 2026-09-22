import React from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { BookOpen, Sparkles } from 'lucide-react';

export const CulturalFactcard: React.FC = () => {
  const { activeFactcard } = useOutfitStore();

  if (!activeFactcard) {
    return (
      <div className="glass-card p-5 rounded-2xl border border-heritage-cream/10 text-center">
        <BookOpen className="w-8 h-8 text-heritage-yellow/60 mx-auto mb-2" />
        <h4 className="font-serif-heritage text-heritage-yellow text-sm">Tri Thức Văn Hóa</h4>
        <p className="text-xs text-heritage-cream/60 mt-1 leading-relaxed">
          Chọn một trang phục hoặc phụ kiện trên người mẫu để khám phá câu chuyện lịch sử và ý nghĩa hoa văn.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 rounded-2xl border border-heritage-yellow/20 space-y-3">
      <div className="flex items-center gap-2 text-heritage-yellow">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{activeFactcard.era}</span>
      </div>
      <div>
        <h5 className="text-xs font-medium text-heritage-cream/50">Nguồn gốc & Xuất xứ</h5>
        <p className="text-xs text-heritage-cream/90 mt-0.5 leading-relaxed">{activeFactcard.origin_story}</p>
      </div>
      <div>
        <h5 className="text-xs font-medium text-heritage-cream/50">Ý nghĩa biểu tượng</h5>
        <p className="text-xs text-heritage-cream/90 mt-0.5 leading-relaxed">{activeFactcard.symbolic_meaning}</p>
      </div>
      <div className="p-2.5 rounded-lg bg-heritage-indigo/30 border border-heritage-indigo/40">
        <h5 className="text-[11px] font-medium text-heritage-yellow flex items-center gap-1">
          💡 Gợi ý phối Gen Z
        </h5>
        <p className="text-xs text-heritage-cream/80 mt-0.5">{activeFactcard.modern_styling_tip}</p>
      </div>
    </div>
  );
};
