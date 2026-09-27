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
  Search,
  Info,
  LayoutTemplate,
  Type,
  Upload
} from 'lucide-react';
import { DockTabType } from './LeftDock';

interface ItemDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  activeDockTab?: DockTabType;
  selectedSlotForColor?: SlotType;
  onSelectSlotForColor?: (slot: SlotType) => void;
}

export const ItemDrawer: React.FC<ItemDrawerProps> = ({
  isOpen,
  onClose,
  activeDockTab = 'WARDROBE',
  onSelectSlotForColor,
}) => {
  const { 
    gender, 
    slots, 
    selectItem, 
    removeItem, 
    selectedSlotForColor,
    setSelectedSlotForColor,
    activeFactcardItem,
    loadCulturalFactForItem,
  } = useOutfitStore();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogItems, setCatalogItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Danh mục 8 trang phục mẫu chuẩn 100% theo docs/shared/DATABASE-SCHEMA.sql
  const fallbackItems: ItemDto[] = [
    {
      id: '11111111-0000-0000-0000-000000000001',
      name: 'Áo tấc tay thụng thời Nguyễn',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_tac_top.png',
      color_customizable: true,
      default_color: '#9E2A2B',
      tags: ['nguyen', 'formal', 'ao_tac', 'le_hoi'],
    },
    {
      id: '11111111-0000-0000-0000-000000000002',
      name: 'Áo ngũ thân tay chẽn Nam',
      gender: 'MALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/male_ao_ngu_than_top.png',
      color_customizable: true,
      default_color: '#264653',
      tags: ['nguyen', 'daily', 'ao_ngu_than', 'nam'],
    },
    {
      id: '11111111-0000-0000-0000-000000000003',
      name: 'Áo Nhật bình thêu ngũ sắc',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_nhat_binh.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['nguyen', 'royal', 'ao_nhat_binh', 'hoang_cung'],
    },
    {
      id: '11111111-0000-0000-0000-000000000004',
      name: 'Quần lụa ống rộng truyền thống',
      gender: 'UNISEX',
      slot: 'BOTTOM',
      layer_order: 20,
      image_url: '/assets/mock/unisex_quan_lua.png',
      color_customizable: true,
      default_color: '#F4F1DE',
      tags: ['nguyen', 'basic', 'quan_ong_rong', 'silk'],
    },
    {
      id: '11111111-0000-0000-0000-000000000005',
      name: 'Khăn đóng xếp nếp truyền thống',
      gender: 'MALE',
      slot: 'HEADWEAR',
      layer_order: 60,
      image_url: '/assets/mock/male_khan_dong.png',
      color_customizable: true,
      default_color: '#1D1E2C',
      tags: ['nguyen', 'formal', 'khan_dong'],
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
      tags: ['nguyen', 'royal', 'man_nhung'],
    },
    {
      id: '11111111-0000-0000-0000-000000000007',
      name: 'Quạt lụa vẽ tranh thủy mặc',
      gender: 'UNISEX',
      slot: 'ACCESSORY',
      layer_order: 50,
      image_url: '/assets/mock/unisex_quat_lua.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['phu_kien', 'quat_lua', 'nghe_thuat'],
    },
    {
      id: '11111111-0000-0000-0000-000000000008',
      name: 'Giày Sneaker tối giản Gen Z',
      gender: 'UNISEX',
      slot: 'FOOTWEAR',
      layer_order: 10,
      image_url: '/assets/mock/unisex_sneaker.png',
      color_customizable: false,
      default_color: '#FFFFFF',
      tags: ['modern', 'streetwear', 'sneaker'],
    },
  ];

  // Tải danh mục trang phục từ API backend
  useEffect(() => {
    setIsLoading(true);
    apiClient.getItems({ gender })
      .then((items) => {
        if (items && items.length > 0) {
          setCatalogItems(items);
        } else {
          setCatalogItems(fallbackItems);
        }
      })
      .catch(() => {
        setCatalogItems(fallbackItems);
      })
      .finally(() => setIsLoading(false));
  }, [gender]);

  const handleSelectItem = (item: ItemDto) => {
    // 1. Mặc đồ vào Canvas Store (tự động kích hoạt loadCulturalFactForItem bên trong store)
    selectItem(item.slot, item);
    setSelectedSlotForColor(item.slot);
    onSelectSlotForColor?.(item.slot);
  };

  const handleInspectFactOnly = (item: ItemDto, e: React.MouseEvent) => {
    e.stopPropagation();
    loadCulturalFactForItem(item);
  };

  // Helper sinh Micro-Tooltip ngắn gọn
  const getMicroTooltipText = (item: ItemDto): string => {
    if (item.tags.includes('royal')) return '🏛️ Cung đình Huế • Quý tộc';
    if (item.tags.includes('formal')) return '✨ Lễ phục trang trọng Triều Nguyễn';
    if (item.tags.includes('daily')) return '🌿 Thường phục truyền thống';
    if (item.tags.includes('modern')) return '⚡ Điểm nhấn Gen Z đương đại';
    return '📜 Di sản cổ phục Việt Nam';
  };

  const filteredItems = catalogItems.filter((item) => {
    // Lọc theo giới tính (UNISEX luôn hiển thị)
    if (item.gender !== 'UNISEX' && item.gender !== gender) return false;

    // Lọc theo tab slot
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
    <aside className="w-80 glass-panel border-r border-heritage-cream/10 flex flex-col z-20 overflow-hidden shadow-2xl flex-shrink-0">
      {/* 1. Header Tab Phù Hợp Với LeftDock */}
      <div className="p-4 border-b border-heritage-cream/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heritage text-heritage-yellow text-sm font-semibold flex items-center gap-1.5">
            {activeDockTab === 'TEMPLATES' && <LayoutTemplate className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'WARDROBE' && <Sparkles className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'TEXT' && <Type className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'UPLOAD' && <Upload className="w-4 h-4 text-heritage-yellow" />}
            <span>
              {activeDockTab === 'TEMPLATES' && 'Phối Mẫu Sẵn'}
              {activeDockTab === 'WARDROBE' && 'Tủ Đồ Cổ Phong'}
              {activeDockTab === 'TEXT' && 'Thư Pháp & Chú Thích'}
              {activeDockTab === 'UPLOAD' && 'Tải Lên Hoa Văn'}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-heritage-cream/60 px-2 py-0.5 rounded-full glass-card border border-heritage-cream/10">
              {gender === 'FEMALE' ? 'Nữ Mẫu' : 'Nam Mẫu'}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-heritage-cream/50 hover:text-white text-xs px-1.5 py-0.5 rounded-md hover:bg-white/10 transition-colors"
                title="Đóng bảng bên"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search & Tabs chỉ hiển thị khi ở tab Tủ Đồ WARDROBE */}
        {activeDockTab === 'WARDROBE' && (
          <>
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
                { id: 'FOOTWEAR', label: 'Giày/Hài' },
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
          </>
        )}
      </div>

      {/* 2. Active Wearing Section (Đang Mặc Trên Người - Thiết Kế Chống Tràn Ngang 2 Cột) */}
      {activeSlotsList.length > 0 && activeDockTab === 'WARDROBE' && (
        <div className="p-3 bg-heritage-black/50 border-b border-heritage-cream/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-heritage-cream/70 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-heritage-teal" />
              Đang mặc ({activeSlotsList.length})
            </span>
            <span className="text-[10px] text-heritage-yellow/80">Bấm để sửa thuộc tính</span>
          </div>

          {/* Grid 2 Cột cố định, không bao giờ phình to thanh bên */}
          <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto scrollbar-none pr-0.5">
            {activeSlotsList.map(([slotKey, data]) => {
              const isSelectedForColor = selectedSlotForColor === slotKey;
              const isInspecting = activeFactcardItem?.id === data!.item.id;
              return (
                <div
                  key={slotKey}
                  onClick={() => {
                    setSelectedSlotForColor(slotKey as SlotType);
                    onSelectSlotForColor?.(slotKey as SlotType);
                    loadCulturalFactForItem(data!.item);
                  }}
                  className={`group flex items-center justify-between gap-1 px-2 py-1 rounded-lg text-xs cursor-pointer transition-all border ${
                    isSelectedForColor || isInspecting
                      ? 'bg-heritage-yellow/20 border-heritage-yellow text-heritage-yellow shadow-sm ring-1 ring-heritage-yellow/50'
                      : 'bg-white/5 border-heritage-cream/10 text-heritage-cream/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: data!.color }}
                    />
                    <span className="text-[10px] truncate max-w-[85px]">{data!.item.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(slotKey as SlotType);
                    }}
                    title="Cởi bỏ món này"
                    className="p-0.5 text-heritage-cream/40 hover:text-heritage-red rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Nội Dung Tab Tương Ứng */}
      {activeDockTab === 'TEMPLATES' && (
        <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-3">
          <p className="text-[11px] text-heritage-cream/60 italic">
            Các bộ phối cổ phục chuẩn mực cung đình & đương đại được thiết kế sẵn:
          </p>
          {[
            {
              id: 'set-le-hoi',
              title: 'Lễ Phục Trang Trọng Triều Nguyễn',
              desc: 'Áo tấc tay thụng đỏ điều, quần lụa trắng, mấn nhung đính ngọc quý phái.',
              badge: 'Lễ hội Cung đình',
              itemIds: ['11111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000007'],
            },
            {
              id: 'set-hoang-toc',
              title: 'Hoàng Tộc Quý Phái Áo Nhật Bình',
              desc: 'Áo Nhật bình thêu ngũ sắc hoàng cung, quần lụa, mấn nhung quý tộc.',
              badge: 'Hoàng Cung Huế',
              itemIds: ['11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000006'],
            },
            {
              id: 'set-genz',
              title: 'Cổ Phong Dạo Phố Gen Z',
              desc: 'Áo ngũ thân kết hợp giày sneaker năng động và quạt lụa nghệ thuật.',
              badge: 'Gen Z Heritage',
              itemIds: ['11111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000007'],
            },
          ].map((preset) => (
            <div
              key={preset.id}
              className="p-3.5 rounded-2xl glass-card border border-heritage-cream/15 hover:border-heritage-yellow/50 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-heritage-yellow/20 text-heritage-yellow border border-heritage-yellow/30 font-medium">
                  {preset.badge}
                </span>
              </div>
              <h4 className="font-serif-heritage text-xs font-semibold text-white">
                {preset.title}
              </h4>
              <p className="text-[10px] text-heritage-cream/60 leading-relaxed">
                {preset.desc}
              </p>
              <button
                onClick={() => {
                  preset.itemIds.forEach((id) => {
                    const found = fallbackItems.find((it) => it.id === id);
                    if (found) selectItem(found.slot, found);
                  });
                }}
                className="mt-1 py-1.5 px-3 rounded-xl bg-heritage-yellow text-studio-bg font-semibold text-xs hover:brightness-110 transition-all shadow-md"
              >
                Mặc Thử Set Này
              </button>
            </div>
          ))}
        </div>
      )}

      {activeDockTab === 'TEXT' && (
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
          <div className="p-4 rounded-2xl glass-card border border-heritage-cream/15 space-y-2">
            <h4 className="font-serif-heritage text-xs font-bold text-heritage-yellow flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Thư Pháp & Ngữ Cảnh
            </h4>
            <p className="text-[11px] text-heritage-cream/70 leading-relaxed">
              Trong không gian Synapse Studio, mỗi bộ cổ phục đều mang một câu chuyện văn hóa gắn liền với niên đại và tầng lớp xã hội thời Nguyễn.
            </p>
            <p className="text-[11px] text-heritage-cream/50 italic">
              Khi xuất V-Lookbook (9:16), bạn có thể đặt tiêu đề tác phẩm cá nhân hóa để lưu giữ dấu ấn phong cách riêng.
            </p>
          </div>
        </div>
      )}

      {activeDockTab === 'UPLOAD' && (
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-dashed border-heritage-cream/30 flex items-center justify-center text-heritage-yellow/60">
            <Upload className="w-6 h-6 animate-bounce" />
          </div>
          <h4 className="font-serif-heritage text-xs font-semibold text-heritage-cream">
            Tải Lên Hoa Văn Tùy Biến
          </h4>
          <p className="text-[10px] text-heritage-cream/50 max-w-[220px]">
            Tính năng cho phép bạn tải lên họa tiết thủy ba, vân mây hoặc texture thổ cẩm cá nhân sẽ ra mắt trong phiên bản tiếp theo.
          </p>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-heritage-red/20 text-heritage-red border border-heritage-red/30">
            Giai đoạn thử nghiệm
          </span>
        </div>
      )}

      {activeDockTab === 'WARDROBE' && (
        <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-xs text-heritage-cream/50 animate-pulse">
            Đang tải tủ đồ cổ phong...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-heritage-cream/40">
            Không tìm thấy trang phục phù hợp
          </div>
        ) : (
          filteredItems.map((item) => {
            const isWearing = slots[item.slot]?.item.id === item.id;
            const isInspecting = activeFactcardItem?.id === item.id;
            const tooltipText = getMicroTooltipText(item);

            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`group relative p-3 rounded-2xl glass-card border transition-all cursor-pointer flex items-center gap-3 ${
                  isInspecting
                    ? 'border-heritage-yellow bg-heritage-yellow/10 shadow-lg ring-1 ring-heritage-yellow/60'
                    : isWearing
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
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    {item.slot === 'HEADWEAR' ? <Crown className="w-5 h-5 text-heritage-yellow" /> : <Shirt className="w-5 h-5 text-heritage-yellow" />}
                  </div>
                </div>

                {/* Item Info & Micro-Tooltip */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-medium text-heritage-cream group-hover:text-white truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Info Button (Xem trước Factcard không bắt buộc thay đồ) */}
                      <button
                        onClick={(e) => handleInspectFactOnly(item, e)}
                        title="Xem Thẻ Tri Thức Văn Hóa"
                        className="p-1 text-heritage-cream/40 hover:text-heritage-yellow hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                      {isWearing && (
                        <span className="p-0.5 rounded-full bg-heritage-teal text-white flex-shrink-0" title="Đang mặc">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Micro-Tooltip / Subtitle badge */}
                  <div className="text-[10px] text-heritage-cream/60 truncate mt-0.5">
                    {tooltipText}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/30 text-heritage-yellow/80">
                      {item.slot}
                    </span>
                    {item.color_customizable ? (
                      <span className="text-[10px] text-heritage-cream/50 flex items-center gap-0.5">
                        <Palette className="w-2.5 h-2.5 text-heritage-teal" /> Đổi màu
                      </span>
                    ) : (
                      <span className="text-[10px] text-heritage-cream/40 italic">
                        Màu nguyên bản
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}
    </aside>
  );
};
