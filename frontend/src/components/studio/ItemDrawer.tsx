import React, { useState, useEffect } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { ItemDto, SlotType } from '../../types';
import { apiClient } from '../../services/api';
import { 
  Shirt, 
  Crown, 
  Sparkles, 
  Check, 
  Trash2, 
  Palette,
  Layers,
  Search
} from 'lucide-react';

interface ItemDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  selectedSlotForColor: SlotType;
  onSelectSlotForColor: (slot: SlotType) => void;
}

export const ItemDrawer: React.FC<ItemDrawerProps> = ({
  isOpen,
  selectedSlotForColor,
  onSelectSlotForColor,
}) => {
  const { gender, slots, selectItem, removeItem, setActiveFactcard } = useOutfitStore();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogItems, setCatalogItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tải danh mục trang phục từ API backend
  useEffect(() => {
    setIsLoading(true);
    apiClient.getItems({ gender })
      .then((items) => setCatalogItems(items))
      .catch(() => {
        // Fallback mock items nếu backend chưa chạy
        setCatalogItems([
          {
            id: '11111111-0000-0000-0000-000000000001',
            name: 'Áo tấc tay thụng',
            gender: 'FEMALE',
            slot: 'TOP',
            layer_order: 30,
            image_url: '/assets/mock/female_ao_tac_top.png',
            color_customizable: true,
            default_color: '#9E2A2B',
            tags: ['nguyen', 'formal', 'ao_tac'],
          },
          {
            id: '11111111-0000-0000-0000-000000000002',
            name: 'Áo ngũ thân tay chẽn',
            gender: 'MALE',
            slot: 'TOP',
            layer_order: 30,
            image_url: '/assets/mock/male_ao_ngu_than_top.png',
            color_customizable: true,
            default_color: '#264653',
            tags: ['nguyen', 'daily', 'ao_ngu_than'],
          },
          {
            id: '11111111-0000-0000-0000-000000000004',
            name: 'Quần lụa ống rộng',
            gender: 'UNISEX',
            slot: 'BOTTOM',
            layer_order: 20,
            image_url: '/assets/mock/unisex_quan_lua.png',
            color_customizable: true,
            default_color: '#F4F1DE',
            tags: ['nguyen', 'basic', 'quan_ong_rong'],
          },
          {
            id: '11111111-0000-0000-0000-000000000005',
            name: 'Khăn đóng xếp nếp',
            gender: 'MALE',
            slot: 'HEADWEAR',
            layer_order: 60,
            image_url: '/assets/mock/male_khan_dong.png',
            color_customizable: true,
            default_color: '#1D1E2C',
            tags: ['nguyen', 'khan_dong'],
          },
          {
            id: '11111111-0000-0000-0000-000000000006',
            name: 'Mấn nhung đính ngọc',
            gender: 'FEMALE',
            slot: 'HEADWEAR',
            layer_order: 60,
            image_url: '/assets/mock/female_man_nhung.png',
            color_customizable: true,
            default_color: '#5A189A',
            tags: ['nguyen', 'man_nhung'],
          },
          {
            id: '11111111-0000-0000-0000-000000000007',
            name: 'Quạt lụa thủy mặc',
            gender: 'UNISEX',
            slot: 'ACCESSORY',
            layer_order: 50,
            image_url: '/assets/mock/unisex_quat_lua.png',
            color_customizable: false,
            default_color: '#E9C46A',
            tags: ['phu_kien', 'quat_lua'],
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, [gender]);

  const handleSelectItem = async (item: ItemDto) => {
    // 1. Mặc đồ vào Store
    selectItem(item.slot, item);
    onSelectSlotForColor(item.slot);

    // 2. Tự động tra cứu Fact văn hóa cho món đồ
    try {
      const fact = await apiClient.getCulturalFact(item.id);
      if (fact) {
        setActiveFactcard(fact);
      }
    } catch {
      // Ignored
    }
  };

  const filteredItems = catalogItems.filter((item) => {
    // Lọc theo giới tính
    if (item.gender !== 'UNISEX' && item.gender !== gender) return false;

    // Lọc theo tab
    if (activeTab !== 'ALL' && item.slot !== activeTab) return false;

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchTag) return false;
    }

    return true;
  });

  const activeSlotsList = Object.entries(slots).filter(([_, data]) => data !== null);

  if (!isOpen) return null;

  return (
    <aside className="w-84 glass-panel border-r border-heritage-cream/10 flex flex-col z-20 overflow-hidden shadow-2xl">
      {/* Drawer Header & Search */}
      <div className="p-4 border-b border-heritage-cream/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heritage text-heritage-yellow text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-heritage-yellow" />
            Tủ Đồ Cổ Phong
          </h3>
          <span className="text-[10px] text-heritage-cream/60 px-2 py-0.5 rounded-full glass-card border border-heritage-cream/10">
            {gender === 'FEMALE' ? 'Nữ Mẫu' : 'Nam Mẫu'}
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-heritage-cream/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm áo ngũ thân, quần lụa, mấn..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 text-xs text-heritage-cream placeholder:text-heritage-cream/40 border border-heritage-cream/15 focus:outline-none focus:border-heritage-yellow/50 transition-colors"
          />
        </div>

        {/* Slot Tabs Filter */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'TOP', label: 'Áo' },
            { id: 'BOTTOM', label: 'Quần' },
            { id: 'HEADWEAR', label: 'Mũ/Mấn' },
            { id: 'ACCESSORY', label: 'Phụ kiện' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-heritage-yellow text-studio-bg font-semibold shadow-sm'
                  : 'text-heritage-cream/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Wearing Section (Đang Mặc Trên Người) */}
      {activeSlotsList.length > 0 && (
        <div className="p-3 bg-heritage-black/40 border-b border-heritage-cream/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-heritage-cream/60 font-medium flex items-center gap-1">
              <Layers className="w-3 h-3 text-heritage-teal" />
              Đang mặc ({activeSlotsList.length})
            </span>
            <span className="text-[10px] text-heritage-yellow">Bấm để chỉnh màu</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {activeSlotsList.map(([slotKey, data]) => {
              const isSelectedForColor = selectedSlotForColor === slotKey;
              return (
                <div
                  key={slotKey}
                  onClick={() => onSelectSlotForColor(slotKey as SlotType)}
                  className={`group flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs cursor-pointer transition-all border ${
                    isSelectedForColor
                      ? 'bg-heritage-yellow/20 border-heritage-yellow text-heritage-yellow shadow-sm'
                      : 'bg-white/5 border-heritage-cream/10 text-heritage-cream/80 hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/40"
                    style={{ backgroundColor: data!.color }}
                  />
                  <span className="text-[11px] truncate max-w-[90px]">{data!.item.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(slotKey as SlotType);
                    }}
                    title="Cởi bỏ món này"
                    className="p-0.5 text-heritage-cream/40 hover:text-heritage-red rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items Catalog Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-xs text-heritage-cream/50 animate-pulse">
            Đang tải tủ đồ...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-heritage-cream/40">
            Không tìm thấy trang phục phù hợp
          </div>
        ) : (
          filteredItems.map((item) => {
            const isWearing = slots[item.slot]?.item.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`group relative p-3 rounded-2xl glass-card border transition-all cursor-pointer flex items-center gap-3 ${
                  isWearing
                    ? 'border-heritage-teal bg-heritage-teal/15 shadow-md ring-1 ring-heritage-teal/50'
                    : 'border-heritage-cream/10 hover:border-heritage-yellow/40 hover:bg-white/5'
                }`}
              >
                {/* Thumbnail Icon Preview */}
                <div className="w-12 h-14 rounded-xl bg-black/40 border border-heritage-cream/10 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain p-1 transform group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      // Fallback icon nếu ảnh lỗi
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    {item.slot === 'HEADWEAR' ? <Crown className="w-5 h-5 text-heritage-yellow" /> : <Shirt className="w-5 h-5 text-heritage-yellow" />}
                  </div>
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-heritage-cream group-hover:text-white truncate">
                      {item.name}
                    </h4>
                    {isWearing && (
                      <span className="p-1 rounded-full bg-heritage-teal text-white flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/30 text-heritage-yellow/80">
                      {item.slot}
                    </span>
                    {item.color_customizable && (
                      <span className="text-[10px] text-heritage-cream/50 flex items-center gap-0.5">
                        <Palette className="w-2.5 h-2.5 text-heritage-teal" /> Đổi màu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
