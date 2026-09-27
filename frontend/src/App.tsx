import React, { useEffect, useState, useRef } from 'react';
import { useOutfitStore } from './store/useOutfitStore';
import { CanvasViewport } from './components/studio/CanvasViewport';
import { ItemDrawer } from './components/studio/ItemDrawer';
import { LeftDock, DockTabType } from './components/studio/LeftDock';
import { ContextualToolbar } from './components/studio/ContextualToolbar';
import { CulturalFactcard } from './components/cultural/CulturalFactcard';
import { GuardrailToast } from './components/cultural/GuardrailToast';
import { HarmonyRadar } from './components/cultural/HarmonyRadar';
import { LookbookModal } from './components/lookbook/LookbookModal';
import { Button } from './components/ui/Button';
import { ServerWakeupBanner } from './components/ui/ServerWakeupBanner';
import { apiClient } from './services/api';
import { SlotType } from './types';
import { 
  Sparkles, 
  Share2, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const { 
    gender, 
    setGender, 
    selectItem,
    harmonyDetail,
    setSelectedSlotForColor,
  } = useOutfitStore();

  const [activeDockTab, setActiveDockTab] = useState<DockTabType>('WARDROBE');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const studioCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Kiểm tra kết nối API Backend
  useEffect(() => {
    apiClient.getHealth()
      .then((res) => {
        if (res.success) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      })
      .catch(() => setBackendStatus('disconnected'));
  }, []);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomScale(1);

  const handleExportQuickSnapshot = () => {
    if (!studioCanvasRef.current) return;
    studioCanvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `synapse-snapshot-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
  };

  const handleQuickSelectTag = (slot: SlotType, tags: string[]) => {
    apiClient.getItems({ gender, slot })
      .then((items) => {
        const matching = items.find((item) => 
          item.tags?.some((t) => tags.map((tg) => tg.toLowerCase()).includes(t.toLowerCase()))
        ) || items[0];

        if (matching) {
          selectItem(slot, matching);
        }
      })
      .catch(() => {
        if (slot === 'BOTTOM') {
          selectItem('BOTTOM', {
            id: '22222222-0000-0000-0000-000000000001',
            name: 'Quần lụa trắng ống rộng',
            gender: 'UNISEX',
            slot: 'BOTTOM',
            layer_order: 20,
            image_url: '/assets/mock/unisex_quan_lua.png',
            color_customizable: true,
            default_color: '#F4F1DE',
            tags: ['silk', 'quan_lua', 'quan_ong_rong'],
          });
        }
      });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0F1016] text-[#F4F1DE]">
      <ServerWakeupBanner />

      {/* Topbar Header (Cố định trên cùng - h-16) */}
      <header className="h-16 px-6 glass-panel border-b border-heritage-cream/10 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-heritage-black border border-heritage-yellow flex items-center justify-center shadow-lg">
            <span className="font-serif-heritage text-heritage-yellow font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="font-serif-heritage text-lg font-bold tracking-wide heritage-gradient-text">
              SYNAPSE
            </h1>
            <p className="text-[10px] text-heritage-cream/50 -mt-1 tracking-wider uppercase">
              V-Heritage Studio
            </p>
          </div>
        </div>

        {/* Gender Selector Switch */}
        <div className="flex items-center glass-card p-1 rounded-full border border-heritage-cream/15">
          <button
            onClick={() => setGender('FEMALE')}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              gender === 'FEMALE' 
                ? 'bg-heritage-red text-white shadow-md' 
                : 'text-heritage-cream/60 hover:text-white'
            }`}
          >
            Nữ Mẫu
          </button>
          <button
            onClick={() => setGender('MALE')}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              gender === 'MALE' 
                ? 'bg-heritage-indigo text-white shadow-md' 
                : 'text-heritage-cream/60 hover:text-white'
            }`}
          >
            Nam Mẫu
          </button>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-card text-[11px] border border-heritage-cream/10">
            <Activity className="w-3.5 h-3.5 text-heritage-yellow animate-pulse" />
            <span className="text-heritage-cream/60">Backend:</span>
            {backendStatus === 'connected' && (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Sẵn sàng
              </span>
            )}
            {backendStatus === 'disconnected' && (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> Offline (Port 5000)
              </span>
            )}
            {backendStatus === 'checking' && (
              <span className="text-heritage-yellow">Đang kết nối...</span>
            )}
          </div>

          <Button 
            variant="primary" 
            size="sm" 
            className="gap-1.5"
            onClick={() => setIsLookbookOpen(true)}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Xuất V-Lookbook</span>
          </Button>
        </div>
      </header>

      {/* Main Studio Body (Chiếm trọn viewport bên dưới Header) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 1. Left Canva Dock (64px) */}
        <LeftDock
          activeTab={activeDockTab}
          onSelectTab={setActiveDockTab}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        />

        {/* 2. Slide-out Item Drawer (Cố định 320px, chống phình ngang) */}
        <ItemDrawer
          isOpen={isDrawerOpen}
          activeDockTab={activeDockTab}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* 3. Center Canvas Workspace Viewport */}
        <main 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSlotForColor(null);
          }}
          className="flex-1 flex flex-col items-center justify-start relative overflow-hidden bg-radial-gradient"
        >
          {/* Contextual Top Toolbar (Canva Style) */}
          <ContextualToolbar
            zoomScale={zoomScale}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            onExportSnapshot={handleExportQuickSnapshot}
            onOpenColorPanel={() => {
              setActiveDockTab('COLOR');
              setIsDrawerOpen(true);
            }}
          />

          {/* Canvas Viewport Component (Paper-Doll Overlay 800x1200) */}
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedSlotForColor(null);
            }}
            className="w-full flex-1 flex items-center justify-center p-4 overflow-hidden"
          >
            <CanvasViewport 
              canvasRef={studioCanvasRef} 
              zoomScale={zoomScale} 
            />
          </div>
        </main>

        {/* 4. Right Inspector Sidebar (Cultural Factcard & Harmony Score) */}
        <aside className="w-80 glass-panel border-l border-heritage-cream/10 p-5 flex flex-col gap-4 z-20 overflow-y-auto scrollbar-none flex-shrink-0">
          <div className="flex items-center justify-between pb-1 border-b border-heritage-cream/10">
            <h4 className="font-serif-heritage text-heritage-yellow text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Cultural Inspector
            </h4>
            <span className="text-[10px] text-heritage-cream/50 uppercase tracking-wider">
              Hồn Xưa Dáng Nay
            </span>
          </div>

          {/* Cultural Guardrail Toast Alert (US-06) */}
          <GuardrailToast onQuickSelectTag={handleQuickSelectTag} />

          {/* Cultural Factcard */}
          <CulturalFactcard />

          {/* Real-time Color Harmony Radar (US-07, UC-06) */}
          <HarmonyRadar harmony={harmonyDetail} />
        </aside>
      </div>

      {/* Lookbook Export Modal (9:16) */}
      <LookbookModal 
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        canvasRef={studioCanvasRef}
      />
    </div>
  );
};

export default App;
