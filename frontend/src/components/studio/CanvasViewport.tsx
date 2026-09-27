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
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialPanX: number;
    initialPanY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
    hasMoved: false,
  });

  const { gender, slots, setSelectedSlotForColor, loadCulturalFactForItem } = useOutfitStore();

  // Reset panOffset khi zoom trở về 100% hoặc nhỏ hơn
  useEffect(() => {
    if (zoomScale <= 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoomScale]);

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

  // Xử lý Pan / Drag khi Zoom > 100%
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: panOffset.x,
        initialPanY: panOffset.y,
        hasMoved: false,
      };
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStartRef.current.hasMoved = true;
    }
    // Giới hạn biên độ pan để không bị trượt mất hút người mẫu khỏi khung
    const maxPan = 350 * (zoomScale - 0.7);
    const nextX = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.initialPanX + dx));
    const nextY = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.initialPanY + dy));
    setPanOffset({ x: nextX, y: nextY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Click ra ngoài khoảng trống background -> Deselect về trạng thái Studio tổng thể
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (dragStartRef.current.hasMoved) {
      dragStartRef.current.hasMoved = false;
      return;
    }
    // Chỉ deselect nếu click trúng background container cha
    if (e.target === e.currentTarget) {
      setSelectedSlotForColor(null);
    }
  };

  // Click trực tiếp lên vùng cơ thể Mannequin để chọn món đồ tương ứng (Canva style)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (dragStartRef.current.hasMoved) {
      dragStartRef.current.hasMoved = false;
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Cơ thể người mẫu nằm ở vùng giữa (khoảng 18% đến 82% chiều ngang).
    // Nếu click vào khoảng trống 2 bên lề trái/phải, xem như click ra ngoài -> Deselect!
    if (xRatio < 0.18 || xRatio > 0.82) {
      setSelectedSlotForColor(null);
      return;
    }

    if (yRatio < 0.28) {
      // Vùng Đầu (HEADWEAR: Mũ, Mấn, Khăn đóng)
      if (slots.HEADWEAR) {
        setSelectedSlotForColor('HEADWEAR');
        loadCulturalFactForItem(slots.HEADWEAR.item);
      } else {
        setSelectedSlotForColor(null);
      }
    } else if (yRatio >= 0.28 && yRatio < 0.65) {
      // Vùng Thân (TOP: Áo tấc, Áo ngũ thân, Áo Nhật bình)
      if (slots.TOP) {
        setSelectedSlotForColor('TOP');
        loadCulturalFactForItem(slots.TOP.item);
      } else {
        setSelectedSlotForColor(null);
      }
    } else {
      // Vùng Chân (BOTTOM: Quần lụa hoặc FOOTWEAR: Giày/Hài)
      if (slots.BOTTOM) {
        setSelectedSlotForColor('BOTTOM');
        loadCulturalFactForItem(slots.BOTTOM.item);
      } else if (slots.FOOTWEAR) {
        setSelectedSlotForColor('FOOTWEAR');
        loadCulturalFactForItem(slots.FOOTWEAR.item);
      } else {
        setSelectedSlotForColor(null);
      }
    }
  };

  return (
    <div 
      onClick={handleBackgroundClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative flex flex-col items-center justify-center w-full h-full select-none ${
        zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
    >
      {/* Main Canvas Container (Tỉ lệ chuẩn 2:3 - 800 x 1200) */}
      <div
        onMouseDown={handleMouseDown}
        onClick={handleCanvasClick}
        title={zoomScale > 1 ? 'Giữ chuột kéo để di chuyển vùng nhìn • Nhấp để chọn trang phục' : 'Nhấp vào trang phục để tùy chỉnh'}
        className="relative overflow-hidden rounded-3xl glass-card border border-heritage-cream/15 shadow-2xl flex items-center justify-center hover:border-heritage-yellow/40 group"
        style={{
          width: 'min(100%, 420px)',
          aspectRatio: `${CANVAS_CONFIG.ASPECT_RATIO}`,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
          transition: isDragging ? 'none' : 'transform 150ms ease-out',
        }}
      >
        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity pointer-events-none">
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
