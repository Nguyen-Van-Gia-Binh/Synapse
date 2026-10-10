import React from 'react';
import { useOutfitStore, FALLBACK_CULTURAL_FACTS } from '../../store/useOutfitStore';
import { BookOpen, Sparkles, Feather, Compass, Lightbulb, ShieldCheck, Check } from 'lucide-react';
import { SlotType } from '../../types';

const SLOT_ICONS: Record<SlotType, string> = {
  HEADWEAR: '👑',
  TOP: '👘',
  BOTTOM: '👖',
  PATTERN: '🌸',
  ACCESSORY: '📿',
  FOOTWEAR: '👟',
};

const SLOT_LABELS: Record<SlotType, string> = {
  HEADWEAR: 'Mũ/Mấn',
  TOP: 'Áo',
  BOTTOM: 'Quần/Váy',
  PATTERN: 'Hoa văn',
  ACCESSORY: 'Phụ kiện',
  FOOTWEAR: 'Giày/Hài',
};

export const CulturalFactcard: React.FC = () => {
  const { 
    slots,
    activeFactcard, 
    activeFactcardItem, 
    isFactcardLoading,
    loadCulturalFactForItem 
  } = useOutfitStore();

  // Xác định món đồ mục tiêu đang soi (ưu tiên món được chọn, hoặc món TOP/BOTTOM/HEADWEAR đang mặc)
  const targetItem = activeFactcardItem || slots.TOP?.item || slots.BOTTOM?.item || slots.HEADWEAR?.item || null;
  
  // Fact dữ liệu: ưu tiên activeFactcard, nếu chưa có thì lấy ngay lập tức từ từ điển fallback
  const fact = activeFactcard || (targetItem ? FALLBACK_CULTURAL_FACTS[targetItem.id] : null);

  // Danh sách các món đang mặc trên người mẫu để làm thanh chọn nhanh
  const equippedList = (['TOP', 'BOTTOM', 'HEADWEAR', 'PATTERN', 'ACCESSORY', 'FOOTWEAR'] as SlotType[])
    .filter((slot) => slots[slot] !== null)
    .map((slot) => ({ slot, item: slots[slot]!.item }));

  // 1. Shimmer Skeleton Loading State (chỉ hiển thị khi đang tải mà chưa có dữ liệu fallback)
  if (isFactcardLoading && !fact) {
    return (
      <div className="glass-card p-5 rounded-2xl border border-heritage-yellow/20 space-y-4 animate-pulse flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-heritage-yellow/20 rounded w-1/3" />
          <div className="h-3 bg-heritage-cream/10 rounded w-1/4" />
        </div>
        <div className="h-5 bg-heritage-cream/15 rounded w-3/4" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-heritage-cream/10 rounded w-1/4" />
          <div className="h-10 bg-heritage-cream/5 rounded w-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-heritage-cream/10 rounded w-1/4" />
          <div className="h-10 bg-heritage-cream/5 rounded w-full" />
        </div>
        <div className="h-14 bg-heritage-indigo/20 border border-heritage-indigo/30 rounded-xl" />
      </div>
    );
  }

  // 2. Empty State (Chưa mặc và chưa chọn món đồ nào)
  if (!fact || !targetItem) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-heritage-cream/10 text-center flex flex-col items-center justify-center space-y-3 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-heritage-yellow/10 border border-heritage-yellow/20 flex items-center justify-center shadow-inner">
          <BookOpen className="w-6 h-6 text-heritage-yellow/80" />
        </div>
        <div>
          <h4 className="font-serif-heritage text-heritage-yellow text-sm font-semibold tracking-wide">
            Tri Thức Văn Hóa & Lịch Sử
          </h4>
          <p className="text-xs text-heritage-cream/60 mt-1.5 leading-relaxed max-w-[220px] mx-auto">
            Chọn một trang phục trong tủ đồ hoặc trên người mẫu để khám phá niên đại, ý nghĩa cổ truyền và mẹo phối Gen Z.
          </p>
        </div>
      </div>
    );
  }

  // 3. Active Factcard State
  return (
    <div className="space-y-3 flex-shrink-0">
      {/* Quick Item Switcher: Thanh chọn nhanh các món đang mặc trên người mẫu */}
      {equippedList.length > 1 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] text-heritage-cream/50 uppercase tracking-wider font-semibold">
              Đang soi chi tiết món ({equippedList.length})
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 pt-0.5">
            {equippedList.map(({ slot, item }) => {
              const isSelected = targetItem.id === item.id;
              return (
                <button
                  key={slot}
                  onClick={() => loadCulturalFactForItem(item)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-heritage-yellow/20 text-heritage-yellow border-heritage-yellow/50 shadow-md font-semibold'
                      : 'bg-black/30 text-heritage-cream/60 border-heritage-cream/10 hover:border-heritage-yellow/30 hover:text-heritage-cream/90'
                  }`}
                  title={`${SLOT_LABELS[slot]}: ${item.name}`}
                >
                  <span className="text-xs">{SLOT_ICONS[slot]}</span>
                  <span className="max-w-[85px] truncate">{item.name}</span>
                  {isSelected && <Check className="w-2.5 h-2.5 text-heritage-yellow" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Factcard Panel */}
      <div className="glass-card p-5 rounded-2xl border border-heritage-yellow/25 space-y-4 shadow-xl relative transition-all duration-300 min-h-fit">
        {/* Decorative Heritage Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-heritage-yellow to-transparent opacity-70" />

        {/* Header: Item Name & Badges */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-heritage-yellow/15 text-heritage-yellow border border-heritage-yellow/30">
              <Sparkles className="w-3 h-3 text-heritage-yellow" />
              {fact.era}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-heritage-cream/60 border border-heritage-cream/10">
              {targetItem.slot}
            </span>
          </div>
          <h3 className="font-serif-heritage text-base text-heritage-yellow font-bold tracking-wide leading-snug">
            {targetItem.name}
          </h3>
        </div>

        {/* Section 1: Nguồn gốc & Xuất xứ */}
        <div className="space-y-1.5">
          <h5 className="text-[11px] font-semibold text-heritage-cream/60 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-heritage-teal" />
            Nguồn gốc & Xuất xứ
          </h5>
          <p className="text-xs text-heritage-cream/90 leading-relaxed font-sans pl-3.5 border-l-2 border-heritage-teal/40">
            {fact.origin_story}
          </p>
        </div>

        {/* Section 2: Ý nghĩa biểu tượng */}
        <div className="space-y-1.5">
          <h5 className="text-[11px] font-semibold text-heritage-cream/60 uppercase tracking-wider flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-heritage-yellow" />
            Ý nghĩa biểu tượng
          </h5>
          <p className="text-xs text-heritage-cream/90 leading-relaxed font-sans pl-3.5 border-l-2 border-heritage-yellow/40">
            {fact.symbolic_meaning}
          </p>
        </div>

        {/* Section 3: Gợi ý phối Gen Z (Modern Styling Tip) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-heritage-indigo/35 via-heritage-indigo/20 to-black/40 border border-heritage-yellow/30 shadow-inner space-y-1.5">
          <h5 className="text-xs font-bold text-heritage-yellow flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-heritage-yellow" />
            Mẹo Phối Đồ Gen Z
          </h5>
          <p className="text-xs text-heritage-cream/85 leading-relaxed font-sans">
            {fact.modern_styling_tip}
          </p>
        </div>

        {/* Footer Cultural Integrity Badge */}
        <div className="pt-2 border-t border-heritage-cream/10 flex items-center justify-between text-[10px] text-heritage-cream/40">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-heritage-teal" />
            Sử liệu đã đối chiếu
          </span>
          <span className="font-serif-heritage italic">Synapse V-Heritage</span>
        </div>
      </div>
    </div>
  );
};
