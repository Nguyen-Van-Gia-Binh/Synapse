import React from 'react';
import { Sparkles } from 'lucide-react';
import { calculatePaletteList } from '../../canvas/export';
import { Gender } from '../../types';

export interface LookbookCardProps {
  title: string;
  gender: Gender;
  previewImageUrl: string | null;
  paletteUsed: string[];
  factQuote?: {
    title: string;
    era: string;
    quote: string;
  } | null;
  harmonyScore: number;
  harmonyTitle?: string;
  className?: string;
}

/**
 * Component hiển thị thẻ V-Lookbook tỉ lệ chuẩn dọc 9:16 (Story / TikTok / Reels)
 * Phong cách thiết kế "Heritage Futurism":
 * - Kính mờ (Glassmorphism), viền vàng hoàng cung
 * - 7 thành phần bắt buộc theo docs/PLAN.md (Mục 3.5)
 */
export const LookbookCard: React.FC<LookbookCardProps> = ({
  title,
  gender,
  previewImageUrl,
  paletteUsed,
  factQuote,
  harmonyScore,
  harmonyTitle = 'Ngũ Sắc Tương Sinh',
  className = '',
}) => {
  const paletteList = calculatePaletteList(paletteUsed);

  return (
    <div
      className={`aspect-[9/16] w-full max-w-[340px] rounded-3xl border-2 border-amber-500/35 bg-gradient-to-b from-[#0B0C11] via-[#12131D] to-[#08080C] p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden text-stone-200 select-none ${className}`}
    >
      {/* 4 Góc dát vàng hoa văn hoàng gia */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

      {/* 1. Header: Logo & Định danh Studio */}
      <div className="text-center pt-1 pb-1 border-b border-amber-500/20">
        <h3 className="font-serif font-bold text-lg tracking-widest text-amber-300 leading-none">
          SYNAPSE
        </h3>
        <p className="text-[8px] font-sans tracking-widest text-amber-100/60 uppercase mt-0.5">
          V-Heritage Studio • Cổ Phục Gen Z
        </p>
      </div>

      {/* 2. Mẫu Phối Trung Tâm (Mannequin Frame) */}
      <div className="flex-1 my-2 rounded-xl bg-stone-900/50 border border-amber-500/15 overflow-hidden flex items-center justify-center relative shadow-inner">
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt={title}
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        ) : (
          <div className="text-stone-500 text-xs flex flex-col items-center gap-1">
            <Sparkles className="w-5 h-5 animate-spin text-amber-400/60" />
            <span>Đang nạp hình ảnh phối đồ...</span>
          </div>
        )}
      </div>

      {/* 3. Tên Tác Phẩm & Phái Tính */}
      <div className="text-center mb-1">
        <h4 className="font-serif font-bold text-sm text-stone-100 line-clamp-1 tracking-wide">
          {title.trim() || 'Tác Phẩm Cổ Phục Synapse'}
        </h4>
        <span className="text-[9px] uppercase tracking-wider text-amber-400/90 font-medium">
          {gender === 'FEMALE' ? 'Cổ Phục Nữ Mẫu' : 'Cổ Phục Nam Mẫu'}
        </span>
      </div>

      {/* 4. Dải Bảng Màu Cổ Phong Đã Dùng */}
      {paletteList.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-1 border-y border-stone-800/80 my-1">
          {paletteList.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span
                className="w-4 h-4 rounded-full border border-stone-400/50 shadow-sm"
                style={{ backgroundColor: item.hex }}
              />
              <span className="text-[8px] text-stone-300 mt-0.5 max-w-[50px] truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 5. Footer: Thẻ Tri Thức Văn Hóa & Điểm Hòa Sắc */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* Box Trích Dẫn Di Sản */}
        <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <span className="text-[8px] uppercase tracking-wider text-amber-400/90 font-semibold block">
              {factQuote?.era ? `Triều ${factQuote.era.toUpperCase()}` : 'Di Sản Triều Nguyễn'}
            </span>
            <p className="text-[10px] font-serif font-bold text-stone-100 line-clamp-1 mt-0.5">
              {factQuote?.title || 'Áo Tấc & Ngũ Thân'}
            </p>
          </div>
          <p className="text-[8px] text-stone-400 italic line-clamp-2 mt-0.5 leading-tight">
            {factQuote?.quote || 'Đoan trang, chuẩn mực, lưu giữ tinh hoa lễ nghi cổ truyền dân tộc.'}
          </p>
        </div>

        {/* Box Điểm Hòa Sắc */}
        <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-500/20 flex flex-col items-center justify-center text-center">
          <span className="text-[8px] uppercase tracking-wider text-stone-400 font-medium">
            Điểm Hòa Sắc
          </span>
          <div className="text-xl font-bold font-mono text-amber-300 leading-none my-0.5">
            {harmonyScore}
            <span className="text-[9px] text-amber-400/60 font-sans">/100</span>
          </div>
          <span className="text-[8px] text-emerald-400 font-medium line-clamp-1">
            {harmonyTitle}
          </span>
        </div>
      </div>

      {/* 6. Chân Trang / Watermark */}
      <div className="text-center pt-1.5 mt-1 border-t border-stone-800/60">
        <span className="text-[8px] text-stone-500 tracking-wider">
          synapse-studio.vercel.app • #VHeritage #GenZCoPhuc
        </span>
      </div>
    </div>
  );
};
export default LookbookCard;
