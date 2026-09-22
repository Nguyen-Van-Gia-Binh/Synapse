import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  shareUrl?: string;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  title = 'Tác Phẩm V-Lookbook',
  shareUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-card p-6 rounded-3xl border border-heritage-cream/20 shadow-2xl flex flex-col items-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-heritage-cream/60 hover:text-white rounded-full transition-colors"
          aria-label="Đóng modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif-heritage text-xl text-heritage-yellow mb-1">{title}</h3>
        <span className="text-xs text-heritage-cream/50 mb-4 tracking-wider uppercase">Tỉ lệ chuẩn 9:16 Story / Reel</span>

        {/* Card Placeholder */}
        <div className="w-48 aspect-[9/16] rounded-xl bg-heritage-black/80 border border-heritage-cream/15 flex flex-col items-center justify-center p-4 text-center mb-5">
          <span className="font-serif-heritage text-heritage-yellow text-sm font-semibold">SYNAPSE</span>
          <span className="text-[10px] text-heritage-cream/60 mt-1">V-Heritage Lookbook</span>
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="primary" className="flex-1 gap-1.5" onClick={() => alert('Sẽ tải ảnh trong Sprint 2!')}>
            <Download className="w-4 h-4" />
            <span>Tải ảnh PNG</span>
          </Button>
          <Button variant="outline" className="flex-1 gap-1.5" onClick={() => alert(shareUrl || 'Link chia sẻ')}>
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
