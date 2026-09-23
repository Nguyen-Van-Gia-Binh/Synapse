import React, { useState } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { SlotType } from '../../types';

interface GuardrailToastProps {
  onQuickSelectTag?: (slot: SlotType, tags: string[]) => void;
}

export const GuardrailToast: React.FC<GuardrailToastProps> = ({ onQuickSelectTag }) => {
  const { violations } = useOutfitStore();
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Nếu không có vi phạm hoặc người dùng đã tạm đóng
  if (violations.length === 0 || isDismissed) {
    return null;
  }

  const activeViolation = violations[0];

  const handleApplySuggestion = () => {
    if (activeViolation.suggestion && onQuickSelectTag) {
      onQuickSelectTag(
        activeViolation.suggestion.target_slot,
        activeViolation.suggestion.recommended_tags || []
      );
    }
  };

  return (
    <div className="w-full animate-fade-in transition-all duration-200">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-amber-950/70 p-3.5 shadow-2xl backdrop-blur-md">
        {/* Glow effect background */}
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-heritage-yellow/10 blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-heritage-yellow border border-amber-500/30 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-heritage-yellow" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-serif-heritage text-xs font-semibold text-heritage-yellow tracking-wide">
                  Gợi Ý Hòa Hợp Di Sản
                </h5>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-medium text-amber-300 border border-amber-500/20">
                  {activeViolation.severity === 'WARNING' ? 'Gợi ý phom dáng' : 'Mẹo phối nhã nhặn'}
                </span>
              </div>

              <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                {activeViolation.message}
              </p>

              {/* Nút hành động nhanh Quick Fix (US-06 Scenario 6.2) */}
              {activeViolation.suggestion && onQuickSelectTag && (
                <div className="pt-1.5">
                  <button
                    onClick={handleApplySuggestion}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-heritage-yellow/20 px-2.5 py-1 text-[11px] font-medium text-heritage-yellow border border-heritage-yellow/40 hover:bg-heritage-yellow hover:text-studio-bg transition-colors shadow-sm"
                  >
                    <span>Thử kết hợp ngay</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="rounded-full p-1 text-amber-200/50 hover:bg-white/10 hover:text-white transition-colors"
            title="Tạm đóng gợi ý"
            aria-label="Đóng gợi ý"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default GuardrailToast;
