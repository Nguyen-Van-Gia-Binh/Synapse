import React, { useState, useEffect } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { HERITAGE_PALETTE, isValidHexColor, normalizeHex } from '../../constants/heritageColors';
import { SlotType } from '../../types';
import { Palette, Lock, Pipette, Check, AlertCircle } from 'lucide-react';

const SLOT_NAMES: Record<SlotType, string> = {
  HEADWEAR: 'Mũ & Mấn',
  TOP: 'Áo',
  BOTTOM: 'Quần',
  PATTERN: 'Họa tiết',
  ACCESSORY: 'Phụ kiện',
  FOOTWEAR: 'Hài & Guốc',
};

export const ColorBar: React.FC = () => {
  const { slots, selectedSlotForColor, setSelectedSlotForColor, setItemColor } = useOutfitStore();

  const currentSlotData = slots[selectedSlotForColor];
  const isCustomizable = currentSlotData?.item.color_customizable ?? true;
  const currentColor = currentSlotData?.color || '#9E2A2B';

  const [hexInput, setHexInput] = useState<string>(currentColor);
  const [hexError, setHexError] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Đồng bộ ô nhập hex khi màu hiện tại thay đổi từ store
  useEffect(() => {
    setHexInput(currentColor);
    setHexError(false);
  }, [currentColor, selectedSlotForColor]);

  // Danh sách các slot đang có trang phục trên người
  const equippedSlots = (Object.keys(slots) as SlotType[]).filter(
    (slot) => slots[slot] !== null
  );

  const handleSelectColor = (hex: string) => {
    if (!isCustomizable) return;
    const normalized = normalizeHex(hex);
    setItemColor(selectedSlotForColor, normalized);
    setHexInput(normalized);
    setHexError(false);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHexColor(val)) {
      setHexError(false);
      setItemColor(selectedSlotForColor, normalizeHex(val));
    } else {
      setHexError(true);
    }
  };

  const handleApplyHex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCustomizable) return;
    if (isValidHexColor(hexInput)) {
      const normalized = normalizeHex(hexInput);
      setItemColor(selectedSlotForColor, normalized);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 max-w-full z-10">
      {/* 1. Selector chọn Slot đang mặc để nhuộm màu */}
      {equippedSlots.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-heritage-cream/10 text-xs">
          <span className="text-[10px] text-heritage-cream/50 uppercase tracking-wider font-semibold mr-1">
            Nhuộm Slot:
          </span>
          {equippedSlots.map((slot) => {
            const isSelected = selectedSlotForColor === slot;
            const slotItem = slots[slot]?.item;
            const canDye = slotItem?.color_customizable ?? true;

            return (
              <button
                key={slot}
                onClick={() => setSelectedSlotForColor(slot)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-heritage-yellow text-studio-bg font-semibold shadow-md shadow-heritage-yellow/20'
                    : 'text-heritage-cream/70 hover:text-white hover:bg-white/5'
                }`}
                title={`${SLOT_NAMES[slot]}: ${slotItem?.name || ''}`}
              >
                {!canDye && <Lock className="w-2.5 h-2.5 opacity-70" />}
                <span>{SLOT_NAMES[slot]}</span>
                {slots[slot]?.color && canDye && (
                  <span
                    className="w-2 h-2 rounded-full border border-black/30"
                    style={{ backgroundColor: slots[slot]?.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Thanh Bảng Màu & Nhuộm Canvas Chính */}
      <div className="glass-card px-5 py-2.5 rounded-2xl border border-heritage-cream/15 flex items-center gap-4 shadow-2xl backdrop-blur-md max-w-full overflow-x-auto">
        {/* Nhãn hiển thị Slot & Trạng thái */}
        <div className="flex items-center gap-1.5 text-xs text-heritage-cream/80 font-medium whitespace-nowrap">
          <Palette className="w-4 h-4 text-heritage-yellow" />
          <span>Bảng màu:</span>
        </div>

        {/* Xử lý Cultural Guardrail (US-03 Scenario 3.2): Khi trang phục bị khóa theo quy chế triều đình */}
        {!isCustomizable ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-fade-in">
            <Lock className="w-3.5 h-3.5 text-heritage-yellow flex-shrink-0" />
            <span className="font-serif-heritage italic">
              Trang phục giữ nguyên màu gốc theo quy chế triều đình
            </span>
          </div>
        ) : (
          /* Bảng 8 Màu Cổ Phong Việt Nam + Custom Hex Picker */
          <div className="flex items-center gap-2.5">
            {/* 8 Màu Cổ Phong Chuẩn GEMINI.md */}
            <div className="flex items-center gap-2">
              {HERITAGE_PALETTE.map((color) => {
                const isActive = currentColor.toUpperCase() === color.hex.toUpperCase();

                return (
                  <button
                    key={color.id}
                    onClick={() => handleSelectColor(color.hex)}
                    title={`${color.name} (${color.hex})\n${color.meaning} - ${color.description}`}
                    className={`w-6 h-6 rounded-full border shadow-md transform hover:scale-125 transition-all relative ${
                      isActive
                        ? 'border-white scale-110 ring-2 ring-heritage-yellow shadow-heritage-yellow/30'
                        : 'border-white/20 hover:border-white/60'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="w-[1px] h-5 bg-heritage-cream/20 mx-1" />

            {/* Custom Hex Color Picker (US-04) */}
            <div className="flex items-center gap-2">
              {/* Native Eyedropper / Color Picker Button */}
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={isValidHexColor(currentColor) ? normalizeHex(currentColor) : '#9E2A2B'}
                  onChange={(e) => handleSelectColor(e.target.value)}
                  className="w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-white/40 p-0 bg-transparent opacity-0 absolute inset-0 z-10"
                  title="Mở bảng chọn phổ màu tự do (Hex Picker)"
                />
                <button
                  type="button"
                  className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-white/90 hover:border-heritage-yellow hover:scale-110 transition-transform shadow-md"
                  style={{ backgroundColor: currentColor }}
                  title="Mở bảng chọn phổ màu tự do"
                >
                  <Pipette className="w-3 h-3 drop-shadow" />
                </button>
              </div>

              {/* Toggle Nút Gõ Mã Hex Tùy Chọn */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="text-[11px] text-heritage-cream/60 hover:text-heritage-yellow font-mono px-1.5 py-0.5 rounded border border-heritage-cream/10 hover:border-heritage-yellow/30 transition-colors"
                  title="Nhập mã Hex thủ công (vd: #00F5D4)"
                >
                  {currentColor.toUpperCase()}
                </button>
              ) : (
                <form onSubmit={handleApplyHex} className="flex items-center gap-1">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={hexInput}
                      onChange={handleHexInputChange}
                      placeholder="#00F5D4"
                      maxLength={7}
                      className={`w-20 px-2 py-0.5 text-xs font-mono rounded bg-black/40 border ${
                        hexError
                          ? 'border-rose-500 text-rose-300'
                          : 'border-heritage-cream/30 text-heritage-yellow focus:border-heritage-yellow'
                      } outline-none`}
                      autoFocus
                    />
                    {hexError && (
                      <AlertCircle className="w-3 h-3 text-rose-400 absolute right-1.5 pointer-events-none" />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-2 py-0.5 text-[10px] rounded bg-heritage-yellow/20 text-heritage-yellow hover:bg-heritage-yellow hover:text-studio-bg font-medium transition-colors"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false);
                      setHexInput(currentColor);
                      setHexError(false);
                    }}
                    className="text-[10px] text-heritage-cream/50 hover:text-white px-1"
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ColorBar;
