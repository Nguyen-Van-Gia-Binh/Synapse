import React, { useState, useEffect } from 'react';
import { useOutfitStore } from '../../store/useOutfitStore';
import { ItemDto, SlotType } from '../../types';
import { apiClient } from '../../services/api';
import { HERITAGE_PALETTE, isValidHexColor, normalizeHex } from '../../constants/heritageColors';
import { getColorWuXing, WUXING_NAMES } from '../../utils/heritageWuXing';
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
  Upload,
  Plus,
  Pipette,
  Lock
} from 'lucide-react';
import { DockTabType } from './LeftDock';

interface ItemDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  activeDockTab?: DockTabType;
  selectedSlotForColor?: SlotType | null;
  onSelectSlotForColor?: (slot: SlotType | null) => void;
}

const EXTENDED_PALETTE = [
  { name: 'Đỏ son', hex: '#E63946' },
  { name: 'Cam san hô', hex: '#F77F00' },
  { name: 'Vàng hổ phách', hex: '#FCBF49' },
  { name: 'Lục ngọc bích', hex: '#2A9D8F' },
  { name: 'Lục bảo', hex: '#10B981' },
  { name: 'Thanh thiên', hex: '#457B9D' },
  { name: 'Lam đậm', hex: '#1D3557' },
  { name: 'Xanh lơ nhạt', hex: '#A8DADC' },
  { name: 'Tía hoa cà', hex: '#7209B7' },
  { name: 'Hồng sen', hex: '#F72585' },
  { name: 'Hồng đào', hex: '#F4A261' },
  { name: 'Trắng tinh khôi', hex: '#FFFFFF' },
  { name: 'Xám khói', hex: '#94A3B8' },
  { name: 'Xám than', hex: '#334155' },
  { name: 'Đen tuyền', hex: '#0F172A' },
];

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
    setItemColor,
    selectedSlotForColor,
    setSelectedSlotForColor,
    activeFactcardItem,
    loadCulturalFactForItem,
  } = useOutfitStore();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogItems, setCatalogItems] = useState<ItemDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // States cho Canva Color Panel
  const [colorSearchQuery, setColorSearchQuery] = useState<string>('');
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);
  const selectedSlotData = selectedSlotForColor ? slots[selectedSlotForColor] : null;
  const selectedSlotItem = selectedSlotData?.item;
  const isSlotCustomizable = selectedSlotItem?.color_customizable ?? true;
  const currentColor = selectedSlotData?.color || '#9E2A2B';
  const [customHexValue, setCustomHexValue] = useState<string>(currentColor);

  useEffect(() => {
    if (selectedSlotData?.color) {
      setCustomHexValue(selectedSlotData.color);
    }
  }, [selectedSlotData?.color, selectedSlotForColor]);

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

  // Handler áp dụng màu cho slot đang chọn (hoặc slot đầu tiên đang mặc)
  const handleApplyColor = (hex: string) => {
    const targetSlot = selectedSlotForColor || (slots.TOP ? 'TOP' : (Object.keys(slots).find((k) => slots[k as SlotType] !== null) as SlotType | undefined));
    if (!targetSlot) return;

    if (!selectedSlotForColor) {
      setSelectedSlotForColor(targetSlot);
      onSelectSlotForColor?.(targetSlot);
    }

    const currentSlot = slots[targetSlot];
    if (currentSlot && currentSlot.item.color_customizable === false) {
      return;
    }

    const normalized = normalizeHex(hex);
    setItemColor(targetSlot, normalized);
    setCustomHexValue(normalized);
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-expect-error EyeDropper is supported in Chromium browsers
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          handleApplyColor(result.sRGBHex);
        }
      } catch {
        // Người dùng hủy thao tác pipette
      }
    } else {
      setShowCustomPicker(true);
    }
  };

  // Trích xuất danh sách màu không trùng lặp từ tất cả các trang phục đang mặc
  const documentColors = Array.from(
    new Map(
      activeSlotsList.map(([_, data]) => [data!.color.toUpperCase(), data!])
    ).values()
  );

  // Lọc bảng màu theo từ khóa tìm kiếm (tên màu hoặc mã hex)
  const filteredHeritagePalette = HERITAGE_PALETTE.filter((c) => {
    if (!colorSearchQuery.trim()) return true;
    const q = colorSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q);
  });

  const filteredExtendedPalette = EXTENDED_PALETTE.filter((c) => {
    if (!colorSearchQuery.trim()) return true;
    const q = colorSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <aside className="w-80 h-full glass-panel border-r border-heritage-cream/10 flex flex-col z-20 overflow-hidden shadow-2xl flex-shrink-0">
      {/* 1. Header Tab Phù Hợp Với LeftDock */}
      <div className="p-4 border-b border-heritage-cream/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heritage text-heritage-yellow text-sm font-semibold flex items-center gap-1.5">
            {activeDockTab === 'TEMPLATES' && <LayoutTemplate className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'WARDROBE' && <Sparkles className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'COLOR' && <Palette className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'TEXT' && <Type className="w-4 h-4 text-heritage-yellow" />}
            {activeDockTab === 'UPLOAD' && <Upload className="w-4 h-4 text-heritage-yellow" />}
            <span>
              {activeDockTab === 'TEMPLATES' && 'Phối Mẫu Sẵn'}
              {activeDockTab === 'WARDROBE' && 'Tủ Đồ Cổ Phong'}
              {activeDockTab === 'COLOR' && 'Màu Sắc'}
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
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-3 space-y-3">
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
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 space-y-4">
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
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 flex flex-col items-center justify-center text-center gap-3">
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

      {/* 4. Canva Color Panel Tab (Màu Sắc Chuẩn Canva) */}
      {activeDockTab === 'COLOR' && (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-4 space-y-4">
          {/* Ô Tìm Kiếm Mã Màu hoặc Tên Màu */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-heritage-cream/40" />
            <input
              type="text"
              value={colorSearchQuery}
              onChange={(e) => setColorSearchQuery(e.target.value)}
              placeholder='Thử "màu lam" hoặc "#9E2A2B"'
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 text-xs text-heritage-cream placeholder:text-heritage-cream/40 border border-heritage-cream/15 focus:outline-none focus:border-heritage-yellow/50 transition-colors"
            />
          </div>

          {/* Quick Apply nếu tìm theo mã hex hợp lệ */}
          {isValidHexColor(colorSearchQuery.trim()) && (
            <button
              onClick={() => handleApplyColor(colorSearchQuery.trim())}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-heritage-yellow/15 border border-heritage-yellow/40 text-xs text-heritage-cream hover:bg-heritage-yellow/25 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span 
                  className="w-5 h-5 rounded-full border border-white/50 shadow" 
                  style={{ backgroundColor: normalizeHex(colorSearchQuery.trim()) }} 
                />
                <span className="font-mono font-medium">Áp dụng {normalizeHex(colorSearchQuery.trim())}</span>
              </div>
              <Check className="w-4 h-4 text-heritage-yellow" />
            </button>
          )}

          {/* Nhóm: Màu Đồ Họa / Trang Phục Đang Chọn */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-heritage-cream flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-heritage-yellow" />
                <span>Màu đồ họa</span>
              </h4>
              {selectedSlotItem && (
                <span className="text-[10px] text-heritage-cream/60 truncate max-w-[130px]">
                  {selectedSlotItem.name}
                </span>
              )}
            </div>

            {/* Chưa chọn món nào trên mannequin */}
            {!selectedSlotForColor || !selectedSlotData ? (
              <div className="p-3 rounded-2xl bg-white/5 border border-heritage-cream/10 space-y-2">
                <p className="text-[11px] text-heritage-cream/70 italic">
                  Chọn một món đồ đang mặc để bắt đầu nhuộm màu:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeSlotsList.map(([slotKey, data]) => (
                    <button
                      key={slotKey}
                      onClick={() => {
                        setSelectedSlotForColor(slotKey as SlotType);
                        onSelectSlotForColor?.(slotKey as SlotType);
                      }}
                      className="px-2 py-1 rounded-lg text-[11px] bg-black/40 border border-heritage-cream/15 hover:border-heritage-yellow/50 text-heritage-cream flex items-center gap-1.5 transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: data!.color }} />
                      <span className="truncate max-w-[90px]">{data!.item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : !isSlotCustomizable ? (
              /* Món đồ bị khóa theo quy chế triều đình */
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-heritage-yellow flex-shrink-0" />
                <span className="italic text-[11px] leading-relaxed">
                  Món đồ này giữ màu nguyên bản hoàng cung theo quy chế triều đình.
                </span>
              </div>
            ) : (
              /* Các nút màu đồ họa Canva: (+) Add Custom, Pipette, Current Color Swatch */
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  {/* Nút (+) Thêm màu mới với vòng gradient 7 sắc cầu vồng */}
                  <button
                    onClick={() => setShowCustomPicker((prev) => !prev)}
                    title="Thêm màu mới (Hex / Color Picker)"
                    className="w-8 h-8 rounded-full p-[2px] shadow-md hover:scale-110 transition-transform flex-shrink-0 relative group"
                    style={{
                      background: 'conic-gradient(from 0deg, #ff0000, #ff7700, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-[#181926] flex items-center justify-center text-white">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>

                  {/* Nút Bút Hút Màu (Eyedropper Pipette) */}
                  <button
                    onClick={handleEyeDropper}
                    title="Lấy màu từ màn hình (Eyedropper)"
                    className="w-8 h-8 rounded-full border border-heritage-cream/20 bg-white/5 hover:bg-white/10 hover:border-heritage-cream/40 flex items-center justify-center transition-all flex-shrink-0 group"
                  >
                    <Pipette className="w-4 h-4 text-heritage-cream/80 group-hover:text-white" />
                  </button>

                  {/* Swatch màu hiện tại của món đồ đang chọn */}
                  <div
                    title={`Màu hiện tại: ${currentColor}`}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg ring-2 ring-heritage-yellow/60 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: currentColor }}
                  >
                    <Check className="w-3.5 h-3.5 text-white drop-shadow stroke-[3]" />
                  </div>

                  <div className="flex-1 min-w-0 pl-1">
                    <span className="text-[11px] font-mono text-heritage-cream/70 block uppercase">
                      {currentColor}
                    </span>
                    <span className="text-[10px] text-heritage-cream/50 truncate block">
                      {selectedSlotItem?.name}
                    </span>
                  </div>
                </div>

                {/* Khung Chỉnh Màu Mở Rộng Khi Bấm (+) */}
                {showCustomPicker && (
                  <div className="p-3 rounded-2xl bg-black/50 border border-heritage-cream/20 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-heritage-cream/70 font-medium">Bảng màu tùy chỉnh</span>
                      <span className="text-[10px] font-mono text-heritage-yellow">{customHexValue}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={isValidHexColor(customHexValue) ? normalizeHex(customHexValue) : '#9E2A2B'}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setCustomHexValue(val);
                          handleApplyColor(val);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={customHexValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomHexValue(val);
                          if (isValidHexColor(val)) {
                            handleApplyColor(normalizeHex(val));
                          }
                        }}
                        placeholder="#9E2A2B"
                        className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/60 text-xs font-mono text-heritage-cream border border-heritage-cream/20 uppercase focus:outline-none focus:border-heritage-yellow"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nhóm: Màu Trong Thiết Kế Này (Document Colors) */}
          {documentColors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-heritage-cream/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-heritage-cream">
                  Màu trong thiết kế này
                </h4>
                <span className="text-[10px] text-heritage-cream/50">
                  {documentColors.length} màu
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {documentColors.map((docColor, idx) => {
                  const isMatching = currentColor.toUpperCase() === docColor.color.toUpperCase();
                  return (
                    <button
                      key={`${docColor.color}-${idx}`}
                      onClick={() => handleApplyColor(docColor.color)}
                      title={`${docColor.item.name} (${docColor.color})`}
                      className={`w-7 h-7 rounded-full border shadow-sm transition-all hover:scale-110 relative ${
                        isMatching
                          ? 'border-white ring-2 ring-heritage-yellow scale-105'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                      style={{ backgroundColor: docColor.color }}
                    >
                      {isMatching && (
                        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nhóm: 8 Màu Cổ Phong Việt Nam */}
          <div className="space-y-2 pt-2 border-t border-heritage-cream/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-heritage-cream">
                8 Màu Cổ Phong Việt Nam
              </h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-heritage-yellow/15 text-heritage-yellow font-serif-heritage">
                Triều Nguyễn
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {filteredHeritagePalette.map((color) => {
                const isMatching = currentColor.toUpperCase() === color.hex.toUpperCase();
                const elem = getColorWuXing(color.hex);
                const elemName = elem ? WUXING_NAMES[elem] : '';

                return (
                  <button
                    key={color.id}
                    onClick={() => handleApplyColor(color.hex)}
                    title={`${color.name} (${color.hex}) • Hành ${elemName}`}
                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-all text-center group ${
                      isMatching
                        ? 'bg-heritage-yellow/15 border-heritage-yellow shadow-md'
                        : 'bg-white/5 border-heritage-cream/10 hover:border-heritage-cream/30 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border shadow-sm transition-transform group-hover:scale-110 flex items-center justify-center relative ${
                        isMatching ? 'border-white ring-1 ring-heritage-yellow' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isMatching && (
                        <Check className="w-3 h-3 text-white drop-shadow stroke-[3]" />
                      )}
                    </div>
                    <span className="text-[9px] text-heritage-cream/80 truncate w-full mt-1">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nhóm: Dải Màu Mở Rộng */}
          <div className="space-y-2 pt-2 border-t border-heritage-cream/10">
            <h4 className="text-xs font-semibold text-heritage-cream">
              Dải màu mở rộng
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {filteredExtendedPalette.map((col, idx) => {
                const isMatching = currentColor.toUpperCase() === col.hex.toUpperCase();
                return (
                  <button
                    key={`${col.hex}-${idx}`}
                    onClick={() => handleApplyColor(col.hex)}
                    title={`${col.name} (${col.hex})`}
                    className={`w-7 h-7 rounded-full border shadow-sm transition-all hover:scale-110 relative mx-auto ${
                      isMatching
                        ? 'border-white ring-2 ring-heritage-yellow scale-105'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isMatching && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeDockTab === 'WARDROBE' && (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-3 space-y-2.5">
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
