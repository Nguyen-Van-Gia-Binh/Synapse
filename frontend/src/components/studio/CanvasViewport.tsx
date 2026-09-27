import React, { useEffect, useRef, useState } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { CANVAS_CONFIG, PaperDollCanvasEngine, RenderLayerOptions } from '../../canvas';
import { SlotType } from '../../types';
import { Sparkles } from 'lucide-react';

export interface CanvasViewportProps {
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null> | React.RefObject<HTMLCanvasElement | null>;
  zoomScale?: number;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({ 
  canvasRef: externalCanvasRef,
  zoomScale = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PaperDollCanvasEngine | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { gender, slots, setSelectedSlotForColor, loadCulturalFactForItem } = useOutfitStore();

  // Đồng bộ reference Canvas ra ngoài để phục vụ xuất V-Lookbook
  useEffect(() => {
    if (externalCanvasRef && canvasRef.current) {
      (externalCanvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = canvasRef.current;
    }
  }, [externalCanvasRef]);

  // Khởi tạo Canvas Engine một lần duy nhất khi component mount
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      const engine = new PaperDollCanvasEngine(canvasRef.current);
      engine.setupHighDPI();
      engineRef.current = engine;
    } catch (err) {
      console.error('[CanvasViewport] Khởi tạo Canvas Engine thất bại:', err);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Re-render Canvas mỗi khi giới tính hoặc các slot trang phục thay đổi
  useEffect(() => {
    if (!engineRef.current) return;

    setIsLoading(true);

    // 1. Layer nền Mannequin (Z-Index 0)
    const mannequinLayer: RenderLayerOptions = {
      id: `mannequin-${gender}`,
      slot: 'MANNEQUIN',
      imageUrl: gender === 'FEMALE' 
        ? '/assets/mock/mannequin_female.png' 
        : '/assets/mock/mannequin_male.png',
      customizable: false,
    };

    // 2. Các lớp trang phục người dùng đang chọn
    const activeLayers: RenderLayerOptions[] = Object.entries(slots)
      .filter(([_, slotData]) => slotData !== null)
      .map(([slot, slotData]) => ({
        id: slotData!.item.id,
        slot: slot as SlotType,
        imageUrl: slotData!.item.image_url,
        color: slotData!.color,
        customizable: slotData!.item.color_customizable,
      }));

    const layersToDraw = [mannequinLayer, ...activeLayers];

    engineRef.current.renderLayers(layersToDraw)
      .catch((err) => console.error('[CanvasViewport] Lỗi render:', err))
      .finally(() => setIsLoading(false));
  }, [gender, slots]);

  // Click trực tiếp lên vùng cơ thể Mannequin để chọn món đồ tương ứng (Canva style)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const yRatio = (e.clientY - rect.top) / rect.height;

    if (yRatio < 0.28) {
      // Vùng Đầu (HEADWEAR: Mũ, Mấn, Khăn đóng)
      if (slots.HEADWEAR) {
        setSelectedSlotForColor('HEADWEAR');
        loadCulturalFactForItem(slots.HEADWEAR.item);
      }
    } else if (yRatio >= 0.28 && yRatio < 0.65) {
      // Vùng Thân (TOP: Áo tấc, Áo ngũ thân, Áo Nhật bình)
      if (slots.TOP) {
        setSelectedSlotForColor('TOP');
        loadCulturalFactForItem(slots.TOP.item);
      }
    } else {
      // Vùng Chân (BOTTOM: Quần lụa hoặc FOOTWEAR: Giày/Hài)
      if (slots.BOTTOM) {
        setSelectedSlotForColor('BOTTOM');
        loadCulturalFactForItem(slots.BOTTOM.item);
      } else if (slots.FOOTWEAR) {
        setSelectedSlotForColor('FOOTWEAR');
        loadCulturalFactForItem(slots.FOOTWEAR.item);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none">
      {/* Main Canvas Container (Tỉ lệ chuẩn 2:3 - 800 x 1200) */}
      <div
        onClick={handleCanvasClick}
        title="Nhấp vào cơ thể Mannequin để tùy chỉnh trang phục"
        className="relative overflow-hidden rounded-3xl glass-card border border-heritage-cream/15 shadow-2xl flex items-center justify-center transition-transform duration-200 ease-out cursor-pointer hover:border-heritage-yellow/40 group"
        style={{
          width: 'min(100%, 420px)',
          aspectRatio: `${CANVAS_CONFIG.ASPECT_RATIO}`,
          transform: `scale(${zoomScale})`,
        }}
      >
        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs text-heritage-yellow border border-heritage-yellow/20 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Đang xếp lớp...</span>
            </div>
          </div>
        )}

        {/* HTML5 Canvas Element với kích thước pixel thật 800 x 1200 */}
        <canvas
          ref={canvasRef}
          width={CANVAS_CONFIG.WIDTH}
          height={CANVAS_CONFIG.HEIGHT}
          className="w-full h-full object-contain pointer-events-none transition-opacity duration-150"
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        />
      </div>
    </div>
  );
};
