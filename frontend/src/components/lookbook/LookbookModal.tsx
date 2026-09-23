import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Check, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { LookbookCard } from './LookbookCard';
import { useOutfitStore } from '../../store/useOutfitStore';
import { apiClient } from '../../services/api';
import { renderLookbookCard916 } from '../../canvas/export';
import { SlotType } from '../../types';

export interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
}) => {
  const {
    gender,
    slots,
    harmonyScore,
    harmonyDetail,
    activeFactcard,
    activeFactcardItem,
  } = useOutfitStore();

  const [title, setTitle] = useState<string>('Dạo Phố Đông Kinh 2026');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Tạo ảnh snapshot từ Canvas viewport khi modal mở
  useEffect(() => {
    if (isOpen) {
      setShareUrl(null);
      setCopiedToast(false);
      if (canvasRef?.current) {
        try {
          const dataUrl = canvasRef.current.toDataURL('image/png');
          setPreviewImageUrl(dataUrl);
        } catch {
          setPreviewImageUrl(null);
        }
      }
    }
  }, [isOpen, canvasRef]);

  if (!isOpen) return null;

  // Lấy các màu sắc thực tế đang mặc trên người mẫu
  const activeColors: string[] = [];
  (['HEADWEAR', 'TOP', 'BOTTOM', 'PATTERN', 'ACCESSORY', 'FOOTWEAR'] as SlotType[]).forEach(
    (slot) => {
      const slotState = slots[slot];
      if (slotState?.color) {
        activeColors.push(slotState.color);
      }
    }
  );

  const factQuote = activeFactcard
    ? {
        title: activeFactcardItem?.name || 'Cổ Phục Việt Nam',
        era: activeFactcard.era,
        quote: activeFactcard.origin_story,
      }
    : null;

  // Xử lý xuất file ảnh PNG 1080x1920 px (Chuẩn dọc 9:16)
  const handleDownloadPng = async () => {
    if (!canvasRef?.current) {
      alert('Không tìm thấy khung vẽ Canvas.');
      return;
    }

    try {
      setIsExporting(true);
      const blob = await renderLookbookCard916({
        title,
        gender,
        mannequinCanvas: canvasRef.current,
        paletteUsed: activeColors,
        factQuote,
        harmonyScore,
        harmonyTitle: harmonyDetail?.title,
      });

      if (!blob) {
        throw new Error('Lỗi render ảnh thẻ Lookbook');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeTitle = title.trim().replace(/\s+/g, '_') || 'V_Lookbook';
      link.download = `Synapse_${safeTitle}_9x16.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err);
      alert('Đã xảy ra lỗi khi tạo ảnh xuất bản.');
    } finally {
      setIsExporting(false);
    }
  };

  // Xử lý lưu Lookbook và lấy link chia sẻ công khai
  const handleShareLookbook = async () => {
    try {
      setIsSharing(true);

      const slotsPayload: Record<SlotType, { item_id: string; color: string } | null> = {
        HEADWEAR: slots.HEADWEAR ? { item_id: slots.HEADWEAR.item.id, color: slots.HEADWEAR.color } : null,
        TOP: slots.TOP ? { item_id: slots.TOP.item.id, color: slots.TOP.color } : null,
        BOTTOM: slots.BOTTOM ? { item_id: slots.BOTTOM.item.id, color: slots.BOTTOM.color } : null,
        PATTERN: slots.PATTERN ? { item_id: slots.PATTERN.item.id, color: slots.PATTERN.color } : null,
        ACCESSORY: slots.ACCESSORY ? { item_id: slots.ACCESSORY.item.id, color: slots.ACCESSORY.color } : null,
        FOOTWEAR: slots.FOOTWEAR ? { item_id: slots.FOOTWEAR.item.id, color: slots.FOOTWEAR.color } : null,
      };

      const result = await apiClient.createLookbook({
        title,
        gender,
        harmony_score: harmonyScore,
        outfit_data: {
          slots: slotsPayload,
          palette_used: activeColors,
        },
      });

      setShareUrl(result.share_url);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(result.share_url);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      }
    } catch {
      // Fallback khi offline
      const mockShareUrl = `https://synapse-studio.vercel.app/lookbook/lb-${Date.now()}`;
      setShareUrl(mockShareUrl);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(mockShareUrl);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-card p-6 md:p-8 rounded-3xl border border-amber-500/30 shadow-2xl overflow-y-auto flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Nút đóng modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full bg-stone-900/60 border border-stone-800 transition-colors"
          aria-label="Đóng modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cột trái: Thẻ Lookbook tỉ lệ 9:16 xem trước */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <LookbookCard
            title={title}
            gender={gender}
            previewImageUrl={previewImageUrl}
            paletteUsed={activeColors}
            factQuote={factQuote}
            harmonyScore={harmonyScore}
            harmonyTitle={harmonyDetail?.title}
          />
        </div>

        {/* Cột phải: Bảng điều khiển xuất bản & Chia sẻ */}
        <div className="flex-1 w-full max-w-md flex flex-col justify-between py-2 space-y-6">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>V-Lookbook Studio</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-amber-100 tracking-wide">
              Xuất Bản Tác Phẩm Cổ Phục
            </h2>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Thẻ ảnh được tối ưu hóa chuẩn tỷ lệ dọc 9:16 (1080x1920 px), sẵn sàng để đăng tải Story, TikTok và chia sẻ trên mạng xã hội.
            </p>
          </div>

          {/* Ô nhập tên tác phẩm */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-amber-200/90 flex items-center justify-between">
              <span>Tên tác phẩm của bạn:</span>
              <span className="text-[10px] text-stone-500 font-mono">
                {title.length}/40 ký tự
              </span>
            </label>
            <input
              type="text"
              maxLength={40}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên tác phẩm..."
              className="w-full px-4 py-2.5 rounded-xl bg-stone-900/80 border border-amber-500/30 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 font-serif text-sm transition-all"
            />
          </div>

          {/* Khối chia sẻ liên kết */}
          {shareUrl && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> Link chia sẻ công khai:
                </span>
                {copiedToast && (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Đã sao chép!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-stone-800 text-[11px] font-mono text-stone-300 select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 3000);
                  }}
                  className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                  title="Sao chép lại link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Các nút hành động chính */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/20"
              onClick={handleDownloadPng}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý xuất ảnh 9:16...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải Ảnh PNG Độ Nét Cao (9:16)</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center gap-2 py-2.5 border-amber-500/40 text-amber-200 hover:bg-amber-500/10"
              onClick={handleShareLookbook}
              disabled={isSharing}
            >
              {isSharing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang tạo liên kết chia sẻ...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{shareUrl ? 'Tạo Lại Link Chia Sẻ' : 'Tạo Link Chia Sẻ Công Khai'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LookbookModal;
