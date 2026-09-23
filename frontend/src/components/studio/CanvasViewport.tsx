import React, { useEffect, useRef, useState } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { CANVAS_CONFIG, PaperDollCanvasEngine, RenderLayerOptions } from '../../canvas';
import { ZoomIn, ZoomOut, RotateCcw, Download, Sparkles } from 'lucide-react';

export interface CanvasViewportProps {
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null> | React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({ canvasRef: externalCanvasRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PaperDollCanvasEngine | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { gender, slots } = useOutfitStore();

  // Đồng bộ reference Canvas ra ngoài để phục vụ xuất V-Lookbook
  useEffect(() => {
    if (externalCanvasRef && canvasRef.current) {
      (externalCanvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = canvasRef.current;
    }
  }, [externalCanvasRef]);

  // Khởi tạo Canvas Engine một lần duy nhất khi component mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new PaperDollCanvasEngine(canvasRef.current);
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
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
        slot: slot as any,
        imageUrl: slotData!.item.image_url,
        color: slotData!.color,
        customizable: slotData!.item.color_customizable,
      }));

    const layersToDraw = [mannequinLayer, ...activeLayers];

    engineRef.current.renderLayers(layersToDraw)
      .catch((err) => console.error('[CanvasViewport] Lỗi render:', err))
      .finally(() => setIsLoading(false));
  }, [gender, slots]);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomScale(1);

  const handleExportQuickSnapshot = async () => {
    if (!engineRef.current) return;
    const blob = await engineRef.current.exportImageBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `synapse-snapshot-${Date.now()}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeLayersCount = Object.values(slots).filter(Boolean).length;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full p-2 select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-full border border-heritage-cream/15 shadow-xl">
        <button
          onClick={handleZoomOut}
          title="Thu nhỏ"
          className="p-1.5 text-heritage-cream/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-medium text-heritage-cream/80 min-w-[42px] text-center font-mono">
          {Math.round(zoomScale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          title="Phóng to"
          className="p-1.5 text-heritage-cream/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-3.5 bg-heritage-cream/20 mx-1" />
        <button
          onClick={handleResetZoom}
          title="Vừa khung nhìn (100%)"
          className="p-1.5 text-heritage-cream/70 hover:text-heritage-yellow rounded-full hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleExportQuickSnapshot}
          title="Tải nhanh ảnh Canvas PNG"
          className="p-1.5 text-heritage-cream/70 hover:text-heritage-teal rounded-full hover:bg-white/10 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Canvas Container (Tỉ lệ chuẩn 2:3) */}
      <div
        className="relative overflow-hidden rounded-3xl glass-card border border-heritage-cream/15 shadow-2xl flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          width: 'min(100%, 380px)',
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
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Slot Active Badges (Phía dưới Canvas) */}
        <div className="absolute bottom-3 left-3 right-3 glass-panel p-2 rounded-xl text-xs flex justify-between items-center border border-heritage-cream/10 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.entries(slots).map(([slotKey, slotData]) => (
              <span
                key={slotKey}
                title={slotData ? `${slotKey}: ${slotData.item.name}` : `${slotKey}: Trống`}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  slotData
                    ? 'bg-heritage-teal text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-black/50 text-heritage-cream/35'
                }`}
              >
                {slotKey}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-heritage-cream/50 pl-2 font-mono whitespace-nowrap">
            {activeLayersCount}/6 lớp
          </span>
        </div>
      </div>
    </div>
  );
};
