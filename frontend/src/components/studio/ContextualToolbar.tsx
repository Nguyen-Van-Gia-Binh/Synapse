import React from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { normalizeHex } from '../../constants/heritageColors';
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
  Layers
} from 'lucide-react';

export interface ContextualToolbarProps {
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExportSnapshot: () => void;
  onOpenColorPanel?: () => void;
}

const QUICK_BASIC_COLORS = [
  { name: 'Đỏ điều', hex: '#9E2A2B' },
  { name: 'Vàng hoa mướp', hex: '#E9C46A' },
  { name: 'Trắng ngà', hex: '#F4F1DE' },
];

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
  zoomScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onExportSnapshot,
  onOpenColorPanel,
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

  const handleSelectColor = (hex: string) => {
    if (!isCustomizable || !selectedSlotForColor) return;
    const normalized = normalizeHex(hex);
    setItemColor(selectedSlotForColor, normalized);
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

      {/* 2. VÙNG Ở GIỮA: DYNAMIC THEO MÓN ĐỒ HOẶC TỔNG THỂ */}
      {!isItemSelected || !selectedSlotForColor ? (
        /* Trạng Thái Studio Tổng Thể (Deselect) */
        <div className="flex-1 min-w-0 flex items-center justify-center mx-4">
          <span className="text-[11px] text-heritage-cream/40 italic">
            Chọn trang phục trên người mẫu để tùy chỉnh màu sắc & phụ kiện
          </span>
        </div>
      ) : (
        /* Trạng Thái Khi Đang Chọn 1 Món Đồ */
        <div className="flex-1 min-w-0 flex items-center justify-center mx-2 overflow-hidden">
          <div className="flex items-center gap-2.5 animate-fade-in flex-nowrap whitespace-nowrap py-0.5">
            {!isCustomizable ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex-shrink-0">
                <Lock className="w-3 h-3 text-heritage-yellow flex-shrink-0" />
                <span className="font-serif-heritage italic text-[11px]">
                  Giữ màu gốc theo quy chế triều đình
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Nút Ô Màu Hiện Tại (Bấm để mở Canva Color Panel bên trái) */}
                <button
                  onClick={onOpenColorPanel}
                  title="Mở bảng màu đầy đủ bên trái (phong cách Canva)"
                  className="group flex items-center gap-2 px-2.5 py-1 rounded-xl glass-card border border-heritage-cream/20 hover:border-heritage-yellow/60 hover:bg-white/10 transition-all text-xs shadow-sm cursor-pointer"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/60 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: currentColor }}
                  />
                  <span className="font-mono text-[11px] text-heritage-cream font-medium uppercase">
                    {currentColor}
                  </span>
                  <Palette className="w-3.5 h-3.5 text-heritage-yellow/80 group-hover:text-heritage-yellow transition-colors" />
                </button>

                {/* 3 Màu Cơ Bản Nhanh */}
                <div className="flex items-center gap-1 px-1.5 py-1 rounded-xl glass-card border border-heritage-cream/10">
                  {QUICK_BASIC_COLORS.map((col) => {
                    const isAct = currentColor.toUpperCase() === col.hex.toUpperCase();
                    return (
                      <button
                        key={col.hex}
                        onClick={() => handleSelectColor(col.hex)}
                        title={`${col.name} (${col.hex})`}
                        className={`w-4 h-4 rounded-full border shadow-sm transition-all hover:scale-125 relative cursor-pointer ${
                          isAct
                            ? 'border-white scale-110 ring-1 ring-heritage-yellow shadow-heritage-yellow/30'
                            : 'border-white/20 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isAct && (
                          <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                            <Check className="w-2 h-2 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="w-[1px] h-4 bg-heritage-cream/20 flex-shrink-0 mx-0.5" />

            {/* Nút Cởi Bỏ Món Đang Chọn */}
            <button
              onClick={() => selectedSlotForColor && removeItem(selectedSlotForColor)}
              title="Cởi bỏ món đồ này"
              className="px-2.5 py-1 rounded-xl glass-card border border-heritage-cream/15 hover:border-rose-500/40 text-heritage-cream/80 hover:text-rose-400 text-xs flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Cởi bỏ</span>
            </button>
          </div>
        </div>
      )}

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
