import React from 'react';
import { LayoutTemplate, Shirt, Palette, Type, Upload } from 'lucide-react';

export type DockTabType = 'TEMPLATES' | 'WARDROBE' | 'COLOR' | 'TEXT' | 'UPLOAD';

export interface LeftDockProps {
  activeTab: DockTabType;
  onSelectTab: (tab: DockTabType) => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

interface DockItem {
  id: DockTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isComingSoon?: boolean;
}

const DOCK_ITEMS: DockItem[] = [
  {
    id: 'TEMPLATES',
    label: 'Mẫu',
    icon: LayoutTemplate,
  },
  {
    id: 'WARDROBE',
    label: 'Tủ đồ',
    icon: Shirt,
  },
  {
    id: 'COLOR',
    label: 'Màu sắc',
    icon: Palette,
  },
  {
    id: 'TEXT',
    label: 'Văn bản',
    icon: Type,
  },
  {
    id: 'UPLOAD',
    label: 'Tải lên',
    icon: Upload,
    isComingSoon: true,
  },
];

export const LeftDock: React.FC<LeftDockProps> = ({
  activeTab,
  onSelectTab,
  isDrawerOpen,
  onToggleDrawer,
}) => {
  const handleItemClick = (id: DockTabType) => {
    if (activeTab === id && isDrawerOpen) {
      // Nhấp lại vào tab đang mở sẽ đóng drawer
      onToggleDrawer();
    } else {
      onSelectTab(id);
      if (!isDrawerOpen) {
        onToggleDrawer();
      }
    }
  };

  return (
    <nav className="w-18 glass-panel border-r border-heritage-cream/10 flex flex-col items-center py-4 gap-3 z-30 flex-shrink-0 select-none">
      {DOCK_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id && isDrawerOpen;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            title={item.isComingSoon ? `${item.label} (Tính năng đang phát triển)` : item.label}
            className={`group relative w-14 py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              isActive
                ? 'bg-heritage-yellow/15 text-heritage-yellow shadow-md border border-heritage-yellow/40'
                : 'text-heritage-cream/60 hover:text-heritage-cream hover:bg-white/5 border border-transparent'
            }`}
          >
            {/* Active Indicator Bar on the left */}
            {isActive && (
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-heritage-yellow rounded-r-full shadow-lg shadow-heritage-yellow/50" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-heritage-yellow' : ''}`} />
              {item.isComingSoon && (
                <span className="absolute -top-1.5 -right-3 text-[8px] bg-heritage-red/80 text-white px-1 py-0.2 rounded-full font-mono uppercase scale-90 border border-white/20">
                  Sắp có
                </span>
              )}
            </div>

            <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'text-heritage-yellow font-semibold' : 'text-heritage-cream/60 group-hover:text-heritage-cream'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
