import React, { useState, useEffect, useRef } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { HERITAGE_PALETTE, isValidHexColor, normalizeHex } from '../../constants/heritageColors';
import { getColorWuXing, WUXING_NAMES } from '../../utils/heritageWuXing';
import { SlotType } from '../../types';
import { 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Palette, 
  Lock, 
  Check, 
  Trash2, 
  Pipette,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface ContextualToolbarProps {
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExportSnapshot: () => void;
}

const SLOT_NAMES: Record<SlotType, string> = {
  HEADWEAR: 'Mũ & Mấn',
  TOP: 'Áo',
  BOTTOM: 'Quần',
  PATTERN: 'Họa tiết',
  ACCESSORY: 'Phụ kiện',
  FOOTWEAR: 'Giày/Hài',
};

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
  zoomScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onExportSnapshot,
}) => {
  const { 
    slots, 
    selectedSlotForColor, 
    setItemColor, 
    removeItem, 
    undo, 
    redo, 
    resetOutfit,
  } = useOutfitStore();

  const currentSlotData = selectedSlotForColor ? slots[selectedSlotForColor] : null;
  const isItemSelected = currentSlotData !== null && currentSlotData !== undefined;
  const currentItem = currentSlotData?.item;
  const isCustomizable = currentItem?.color_customizable ?? true;
  const currentColor = currentSlotData?.color || '#9E2A2B';

  const [hexInput, setHexInput] = useState<string>(currentColor);
  const [showHexPicker, setShowHexPicker] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(currentColor);
  }, [currentColor, selectedSlotForColor]);

  const handleSelectColor = (hex: string) => {
    if (!isCustomizable || !selectedSlotForColor) return;
    const normalized = normalizeHex(hex);
    setItemColor(selectedSlotForColor, normalized);
    setHexInput(normalized);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHexColor(val) && selectedSlotForColor && isCustomizable) {
      setItemColor(selectedSlotForColor, normalizeHex(val));
    }
  };

  // Hỗ trợ cuộn ngang bằng con lăn chuột (Mouse Wheel to Horizontal Scroll)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -140, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 140, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex items-center justify-between px-6 py-2 glass-panel border-b border-heritage-cream/10 z-20 min-h-[52px] select-none flex-nowrap">
      {/* 1. KHỐI TRÁI CỐ ĐỊNH 100%: STUDIO CONTROLS */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] text-heritage-cream/60 flex items-center gap-1 font-medium mr-1">
          <Layers className="w-3.5 h-3.5 text-heritage-yellow" />
          <span>Studio:</span>
        </span>

        {/* Lịch sử Undo / Redo */}
        <div className="flex items-center glass-card px-1.5 py-1 rounded-xl border border-heritage-cream/15">
          <button
            onClick={undo}
            title="Hoàn tác (Undo)"
            className="p-1 text-heritage-cream/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            title="Làm lại (Redo)"
            className="p-1 text-heritage-cream/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Đặt lại trang phục */}
        <button
          onClick={resetOutfit}
          title="Cởi bỏ toàn bộ trang phục đang mặc"
          className="text-xs text-heritage-cream/70 hover:text-heritage-red px-2.5 py-1 rounded-xl glass-card border border-heritage-cream/10 hover:border-heritage-red/30 transition-all font-medium"
        >
          Đặt lại
        </button>
      </div>

      {/* 2. VÙNG Ở GIỮA: DYNAMIC THEO MÓN ĐỒ, CUỘN NGANG NỘI BỘ, KHÔNG HIỆN THANH CUỘN */}
      <div className="flex-1 min-w-0 flex items-center mx-2 relative overflow-hidden">
        {isItemSelected && (
          <>
            {/* Nút Cuộn Trái Nhanh */}
            <button
              onClick={handleScrollLeft}
              title="Cuộn sang trái"
              className="p-1 rounded-lg text-heritage-cream/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 mr-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Container Cuộn Ngang Ẩn Scrollbar */}
            <div 
              ref={scrollContainerRef}
              onWheel={handleWheel}
              className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center scroll-smooth"
            >
              <div className="flex items-center gap-2.5 animate-fade-in flex-nowrap whitespace-nowrap py-0.5 mx-auto">
                {/* Tên & Slot Món Đồ */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-heritage-yellow/15 border border-heritage-yellow/40 text-heritage-yellow text-xs font-medium shadow-sm flex-shrink-0">
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-black/40 text-heritage-yellow">
                    {selectedSlotForColor ? SLOT_NAMES[selectedSlotForColor] : ''}
                  </span>
                  <span className="font-serif-heritage font-semibold max-w-[140px] truncate text-white">
                    {currentItem?.name}
                  </span>
                </div>

                <div className="w-[1px] h-4 bg-heritage-cream/20 flex-shrink-0" />

                {/* Bảng Màu & Nhuộm */}
                {!isCustomizable ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex-shrink-0">
                    <Lock className="w-3 h-3 text-heritage-yellow flex-shrink-0" />
                    <span className="font-serif-heritage italic text-[11px]">
                      Giữ màu gốc theo quy chế triều đình
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 glass-card px-2.5 py-1 rounded-xl border border-heritage-cream/15 flex-shrink-0">
                      <Palette className="w-3.5 h-3.5 text-heritage-yellow mr-1" />
                      {HERITAGE_PALETTE.map((color) => {
                        const isActive = currentColor.toUpperCase() === color.hex.toUpperCase();
                        const elem = getColorWuXing(color.hex);
                        const elemText = elem ? ` • ${WUXING_NAMES[elem]}` : '';

                        return (
                          <button
                            key={color.id}
                            onClick={() => handleSelectColor(color.hex)}
                            title={`${color.name} (${color.hex})${elemText}`}
                            className={`w-5 h-5 rounded-full border shadow-sm transform hover:scale-125 transition-all relative ${
                              isActive
                                ? 'border-white scale-110 ring-2 ring-heritage-yellow shadow-heritage-yellow/30'
                                : 'border-white/20 hover:border-white/60'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isActive && (
                              <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </button>
                        );
                      })}

                      <div className="w-[1px] h-3.5 bg-heritage-cream/20 mx-1" />

                      {/* Nút Mở Hex Picker Mở Rộng */}
                      <button
                        onClick={() => setShowHexPicker((prev) => !prev)}
                        title="Mở bảng màu Hex tùy chỉnh"
                        className={`p-1 rounded-lg transition-colors ${
                          showHexPicker ? 'bg-heritage-yellow/20 text-heritage-yellow' : 'text-heritage-cream/60 hover:text-white'
                        }`}
                      >
                        <Pipette className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Hex Picker Input Popover Inline */}
                    {showHexPicker && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl glass-card border border-heritage-cream/20 animate-fade-in text-xs flex-shrink-0">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => handleSelectColor(e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                          title="Chọn màu tự do"
                        />
                        <input
                          type="text"
                          value={hexInput}
                          onChange={handleHexInputChange}
                          placeholder="#9E2A2B"
                          className="w-18 px-1.5 py-0.5 rounded bg-black/50 text-[11px] font-mono text-heritage-cream border border-heritage-cream/20 uppercase focus:outline-none focus:border-heritage-yellow"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="w-[1px] h-4 bg-heritage-cream/20 flex-shrink-0" />

                {/* Nút Cởi Bỏ Món Đang Chọn */}
                <button
                  onClick={() => selectedSlotForColor && removeItem(selectedSlotForColor)}
                  title="Cởi bỏ món đồ này"
                  className="px-2.5 py-1 rounded-xl glass-card border border-heritage-cream/15 hover:border-rose-500/40 text-heritage-cream/80 hover:text-rose-400 text-xs flex items-center gap-1 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="text-[11px]">Cởi bỏ</span>
                </button>
              </div>
            </div>

            {/* Nút Cuộn Phải Nhanh */}
            <button
              onClick={handleScrollRight}
              title="Cuộn sang phải"
              className="p-1 rounded-lg text-heritage-cream/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 ml-1"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* 3. KHỐI PHẢI CỐ ĐỊNH 100%: ZOOM & DOWNLOAD */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 glass-card px-2.5 py-1 rounded-xl border border-heritage-cream/15 text-xs">
          <button
            onClick={onZoomOut}
            title="Thu nhỏ Canvas"
            className="p-1 text-heritage-cream/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-heritage-cream/80 min-w-[38px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            title="Phóng to Canvas"
            className="p-1 text-heritage-cream/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-heritage-cream/20 mx-1" />
          <button
            onClick={onResetZoom}
            title="Vừa khung nhìn (100%)"
            className="text-[10px] text-heritage-cream/60 hover:text-heritage-yellow transition-colors font-medium px-1"
          >
            100%
          </button>
        </div>

        {/* Nút Tải Nhanh Ảnh Canvas PNG */}
        <button
          onClick={onExportSnapshot}
          title="Tải nhanh ảnh Canvas PNG độ phân giải 800x1200"
          className="p-1.5 rounded-xl glass-card border border-heritage-cream/15 hover:border-heritage-teal/50 text-heritage-cream/80 hover:text-heritage-teal transition-all"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
