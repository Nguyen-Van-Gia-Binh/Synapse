import React, { useEffect, useState } from 'react';
import { useOutfitStore } from './store/useOutfitStore';
import { CanvasViewport } from './components/studio/CanvasViewport';
import { CulturalFactcard } from './components/cultural/CulturalFactcard';
import { LookbookModal } from './components/lookbook/LookbookModal';
import { Button } from './components/ui/Button';
import { apiClient } from './services/api';
import { 
  Sparkles, 
  RotateCcw, 
  RotateCw, 
  Share2, 
  Layers, 
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
    setActiveFactcard,
    harmonyScore
  } = useOutfitStore();

  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
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

  const heritagePalette = [
    { name: 'Đỏ điều', hex: '#9E2A2B' },
    { name: 'Vàng mướp', hex: '#E9C46A' },
    { name: 'Xanh chàm', hex: '#264653' },
    { name: 'Xanh cổ vịt', hex: '#2A9D8F' },
    { name: 'Tía ngọc', hex: '#5A189A' },
    { name: 'Trắng ngà', hex: '#F4F1DE' },
    { name: 'Đen mun', hex: '#1D1E2C' },
    { name: 'Nâu sồng', hex: '#6F4E37' },
  ];

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
      <div className="flex flex-1 overflow-hidden">
        {/* Left Dock Icon Bar (70px) */}
        <nav className="w-16 glass-panel border-r border-heritage-cream/10 flex flex-col items-center py-5 gap-6 z-20">
          <button 
            title="Trang phục (TOP/BOTTOM)"
            className="p-3 rounded-xl glass-card text-heritage-yellow hover:bg-heritage-yellow/10 transition-colors"
          >
            <Shirt className="w-5 h-5" />
          </button>
          <button 
            title="Mũ & Mấn (HEADWEAR)"
            className="p-3 rounded-xl text-heritage-cream/60 hover:text-heritage-yellow hover:bg-heritage-yellow/10 transition-colors"
          >
            <Crown className="w-5 h-5" />
          </button>
          <button 
            title="Xếp lớp Layers"
            className="p-3 rounded-xl text-heritage-cream/60 hover:text-heritage-yellow hover:bg-heritage-yellow/10 transition-colors"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button 
            title="Bảng màu Cổ phong"
            className="p-3 rounded-xl text-heritage-cream/60 hover:text-heritage-yellow hover:bg-heritage-yellow/10 transition-colors"
          >
            <Palette className="w-5 h-5" />
          </button>
        </nav>

        {/* Center Canvas Workspace */}
        <main className="flex-1 flex flex-col items-center justify-between p-6 relative overflow-hidden bg-radial-gradient">
          {/* Quick Undo / Redo / Reset toolbar */}
          <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-heritage-cream/15 z-10 shadow-lg">
            <button 
              onClick={undo}
              className="p-1.5 text-heritage-cream/70 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              title="Hoàn tác (Undo)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={redo}
              className="p-1.5 text-heritage-cream/70 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              title="Làm lại (Redo)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-heritage-cream/20 mx-1" />
            <button 
              onClick={resetOutfit}
              className="text-xs text-heritage-cream/70 hover:text-heritage-red px-2 py-1 rounded transition-colors"
            >
              Đặt lại
            </button>
          </div>

          {/* Canvas Viewport Component */}
          <div className="w-full flex-1 flex items-center justify-center my-3">
            <CanvasViewport />
          </div>

          {/* Color Palette Bar */}
          <div className="glass-card px-5 py-3 rounded-2xl border border-heritage-cream/15 flex items-center gap-3 z-10 shadow-xl">
            <span className="text-xs text-heritage-cream/60 font-medium">Bảng 8 Màu Cổ Phong:</span>
            <div className="flex items-center gap-2">
              {heritagePalette.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  className="w-6 h-6 rounded-full border border-white/20 shadow-md transform hover:scale-125 transition-transform"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Right Inspector Sidebar (320px) */}
        <aside className="w-80 glass-panel border-l border-heritage-cream/10 p-5 flex flex-col gap-5 z-20 overflow-y-auto">
          {/* Quick Demo Item Injector */}
          <div className="glass-card p-4 rounded-2xl border border-heritage-cream/15 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif-heritage text-heritage-yellow text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Mẫu Thử Nghiệm Sprint 0
              </h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-heritage-teal/30 text-heritage-teal font-medium">
                Zustand Store
              </span>
            </div>
            <p className="text-xs text-heritage-cream/70 leading-relaxed">
              Nhấn để thử nghiệm cập nhật Store xếp lớp trang phục và kích hoạt Thẻ tri thức văn hóa.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  selectItem('TOP', {
                    id: 'mock-ao-ngu-than',
                    name: 'Áo ngũ thân tay chẽn',
                    gender,
                    slot: 'TOP',
                    layer_order: 30,
                    image_url: '/assets/fallback/ao_ngu_than.png',
                    color_customizable: true,
                    default_color: '#9E2A2B',
                    tags: ['nguyen', 'daily'],
                  });
                  setActiveFactcard({
                    id: 'fact-01',
                    item_id: 'mock-ao-ngu-than',
                    era: 'Triều Nguyễn (Thế kỷ 19)',
                    origin_story: 'Áo ngũ thân tượng trưng cho tứ thân phụ mẫu ôm ấp lấy thân con (tà con bên trong).',
                    symbolic_meaning: 'Năm cúc áo đại diện cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) của người quân tử.',
                    modern_styling_tip: 'Phối cùng kính râm mắt tròn và sneaker trắng để tạo nét cá tính Heritage Futurism đương đại.',
                  });
                }}
              >
                + Mặc Áo ngũ thân (TOP)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectItem('BOTTOM', {
                    id: 'mock-quan-lua',
                    name: 'Quần lụa trắng ngà',
                    gender,
                    slot: 'BOTTOM',
                    layer_order: 20,
                    image_url: '/assets/fallback/quan_lua.png',
                    color_customizable: false,
                    default_color: '#F4F1DE',
                    tags: ['nguyen', 'silk'],
                  });
                }}
              >
                + Mặc Quần lụa (BOTTOM)
              </Button>
            </div>
          </div>

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
              Chuẩn Ngũ Sắc
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
