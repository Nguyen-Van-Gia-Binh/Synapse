import React, { useEffect, useState } from 'react';
import { useOutfitStore } from './store/useOutfitStore';
import { CanvasViewport } from './components/studio/CanvasViewport';
import { ItemDrawer } from './components/studio/ItemDrawer';
import { ColorBar } from './components/studio/ColorBar';
import { CulturalFactcard } from './components/cultural/CulturalFactcard';
import { GuardrailToast } from './components/cultural/GuardrailToast';
import { LookbookModal } from './components/lookbook/LookbookModal';
import { Button } from './components/ui/Button';
import { apiClient } from './services/api';
import { SlotType } from './types';
import { 
  Sparkles, 
  RotateCcw, 
  RotateCw, 
  Share2, 
  Palette, 
  Crown, 
  Shirt, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const { 
    gender, 
    setGender, 
    selectItem,
    resetOutfit, 
    undo, 
    redo,
    harmonyScore,
    setSelectedSlotForColor
  } = useOutfitStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

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
    <div className="flex flex-col min-h-screen bg-[#0F1016] text-[#F4F1DE]">
      {/* Topbar Header */}
      <header className="h-16 px-6 glass-panel border-b border-heritage-cream/10 flex items-center justify-between z-30 sticky top-0">
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

      {/* Main Studio Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Dock Icon Bar (70px) */}
        <nav className="w-16 glass-panel border-r border-heritage-cream/10 flex flex-col items-center py-5 gap-5 z-20 flex-shrink-0">
          <button 
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            title="Tủ đồ cổ phục (Nhấn để đóng/mở)"
            className={`p-3 rounded-2xl transition-all ${
              isDrawerOpen 
                ? 'bg-heritage-yellow text-studio-bg shadow-lg shadow-heritage-yellow/20' 
                : 'text-heritage-cream/60 hover:text-heritage-yellow hover:bg-white/5'
            }`}
          >
            <Shirt className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedSlotForColor('HEADWEAR');
            }}
            title="Mũ & Mấn (HEADWEAR)"
            className="p-3 rounded-2xl text-heritage-cream/60 hover:text-heritage-yellow hover:bg-white/5 transition-colors"
          >
            <Crown className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedSlotForColor('TOP');
            }}
            title="Bảng màu nhuộm vải"
            className="p-3 rounded-2xl text-heritage-cream/60 hover:text-heritage-yellow hover:bg-white/5 transition-colors"
          >
            <Palette className="w-5 h-5" />
          </button>
        </nav>

        {/* Slide-out Item Drawer (Canva Style) */}
        <ItemDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Center Canvas Workspace Viewport */}
        <main className="flex-1 flex flex-col items-center justify-between p-4 relative overflow-hidden bg-radial-gradient">
          {/* Quick Undo / Redo / Reset toolbar */}
          <div className="flex items-center gap-2 glass-card px-3.5 py-1.5 rounded-full border border-heritage-cream/15 z-10 shadow-lg">
            <button 
              onClick={undo}
              className="p-1.5 text-heritage-cream/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Hoàn tác (Undo)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={redo}
              className="p-1.5 text-heritage-cream/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Làm lại (Redo)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-heritage-cream/20 mx-1" />
            <button 
              onClick={resetOutfit}
              className="text-xs text-heritage-cream/70 hover:text-heritage-red px-2 py-0.5 rounded transition-colors"
            >
              Đặt lại
            </button>
          </div>

          {/* Canvas Viewport Component (Paper-Doll Overlay 800x1200) */}
          <div className="w-full flex-1 flex items-center justify-center my-1 overflow-hidden">
            <CanvasViewport />
          </div>

          {/* Interactive Heritage Color Bar (Dual Offscreen Canvas Tinting Controller) */}
          <ColorBar />
        </main>

        {/* Right Inspector Sidebar (Cultural Factcard & Harmony Score) */}
        <aside className="w-80 glass-panel border-l border-heritage-cream/10 p-5 flex flex-col gap-4 z-20 overflow-y-auto flex-shrink-0">
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

          {/* Color Harmony Score Badge */}
          <div className="glass-card p-4 rounded-2xl border border-heritage-cream/15 flex items-center justify-between">
            <div>
              <span className="text-xs text-heritage-cream/60">Điểm hòa sắc:</span>
              <div className="font-serif-heritage text-lg text-heritage-yellow font-bold">
                {harmonyScore} / 100
              </div>
            </div>
            <span className="px-2 py-1 rounded-md text-[11px] bg-heritage-yellow/20 text-heritage-yellow font-medium">
              Ngũ Sắc Tương Sinh
            </span>
          </div>
        </aside>
      </div>

      {/* Lookbook Export Modal */}
      <LookbookModal 
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
      />
    </div>
  );
};

export default App;
