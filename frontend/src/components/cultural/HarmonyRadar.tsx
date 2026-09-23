import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { HarmonyScoreDetail } from '../../utils/harmonyScorer';

interface HarmonyRadarProps {
  harmony: HarmonyScoreDetail | null;
  className?: string;
}

/**
 * Component hiển thị Điểm hòa sắc và Biểu đồ Radar 3 trục mini (SVG)
 * Thiết kế theo ngôn ngữ thẩm mỹ "Heritage Futurism":
 * - Kính mờ (glassmorphism) sang trọng tone đen mun & hổ phách
 * - Biểu đồ hình học 3 trục: Sắc độ (Hue), Tương phản (Contrast), Di sản (Heritage)
 */
export const HarmonyRadar: React.FC<HarmonyRadarProps> = ({ harmony, className = '' }) => {
  if (!harmony) {
    return (
      <div
        className={`p-4 rounded-xl border border-stone-800/80 bg-stone-900/40 backdrop-blur-md text-stone-400 text-center ${className}`}
      >
        <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-stone-800 bg-stone-900/60 flex items-center justify-center text-stone-500">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <p className="text-xs font-serif tracking-wide text-stone-400">
          Chờ phối trang phục
        </p>
        <p className="text-[11px] text-stone-500 mt-1">
          Mặc áo (TOP) và quần (BOTTOM) để khởi động bộ đo hòa sắc di sản.
        </p>
      </div>
    );
  }

  // Tọa độ biểu đồ tam giác Radar 3 trục (cx=70, cy=65, radius=45)
  const cx = 70;
  const cy = 60;
  const r = 42;

  // 3 trục: Đỉnh trên (Hue), Dưới trái (Contrast), Dưới phải (Heritage)
  // Góc 90 deg (trên), 210 deg (trái dưới), 330 deg (phải dưới)
  const p1Base = { x: cx, y: cy - r };
  const p2Base = {
    x: cx - r * Math.cos(Math.PI / 6),
    y: cy + r * Math.sin(Math.PI / 6),
  };
  const p3Base = {
    x: cx + r * Math.cos(Math.PI / 6),
    y: cy + r * Math.sin(Math.PI / 6),
  };

  // Giá trị thực tế chuẩn hóa (0 - 1)
  const vHue = Math.max(0.2, harmony.hueScore / 100);
  const vContrast = Math.max(0.2, harmony.contrastScore / 100);
  const vHeritage = Math.max(0.2, harmony.heritageScore / 100);

  const p1 = { x: cx, y: cy - r * vHue };
  const p2 = {
    x: cx - r * vContrast * Math.cos(Math.PI / 6),
    y: cy + r * vContrast * Math.sin(Math.PI / 6),
  };
  const p3 = {
    x: cx + r * vHeritage * Math.cos(Math.PI / 6),
    y: cy + r * vHeritage * Math.sin(Math.PI / 6),
  };

  const polyPoints = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  const baseTriangle = `${p1Base.x},${p1Base.y} ${p2Base.x},${p2Base.y} ${p3Base.x},${p3Base.y}`;
  const midTriangle = `${cx},${cy - r * 0.5} ${cx - r * 0.5 * Math.cos(Math.PI / 6)},${cy + r * 0.5 * Math.sin(Math.PI / 6)} ${cx + r * 0.5 * Math.cos(Math.PI / 6)},${cy + r * 0.5 * Math.sin(Math.PI / 6)}`;

  // Màu sắc badge điểm
  const isExcellent = harmony.totalScore >= 85;

  return (
    <div
      className={`rounded-2xl border border-amber-500/25 bg-gradient-to-b from-stone-900/90 to-black/90 backdrop-blur-md p-4 shadow-xl shadow-black/50 transition-all duration-300 ${className}`}
    >
      {/* Header: Tiêu đề và Điểm tròn */}
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-amber-500/15 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chỉ Số Hòa Sắc</span>
          </div>
          <h4 className="text-base font-serif font-bold text-amber-100 tracking-wide mt-0.5">
            {harmony.title}
          </h4>
        </div>

        {/* Badge Điểm số Radial */}
        <div
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 transition-transform duration-300 hover:scale-105 ${
            isExcellent
              ? 'border-amber-400/80 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/20'
              : 'border-stone-600/80 bg-stone-800/40 text-stone-200'
          }`}
        >
          <span className="text-lg font-bold font-mono leading-none">
            {harmony.totalScore}
          </span>
          <span className="text-[9px] uppercase tracking-tighter text-amber-400/70 font-sans mt-0.5">
            /100
          </span>
        </div>
      </div>

      {/* Biểu đồ Radar 3 Trục SVG & Chỉ số chi tiết */}
      <div className="flex items-center gap-3 py-1">
        {/* SVG Mini Radar */}
        <div className="relative w-36 h-32 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 140 120" className="w-full h-full overflow-visible">
            {/* Lưới tam giác chuẩn 100% & 50% */}
            <polygon
              points={baseTriangle}
              fill="none"
              stroke="#57534E"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.4"
            />
            <polygon
              points={midTriangle}
              fill="none"
              stroke="#78716C"
              strokeWidth="0.6"
              strokeDasharray="2 2"
              opacity="0.3"
            />

            {/* Các trục từ tâm */}
            <line x1={cx} y1={cy} x2={p1Base.x} y2={p1Base.y} stroke="#78716C" strokeWidth="0.8" opacity="0.4" />
            <line x1={cx} y1={cy} x2={p2Base.x} y2={p2Base.y} stroke="#78716C" strokeWidth="0.8" opacity="0.4" />
            <line x1={cx} y1={cy} x2={p3Base.x} y2={p3Base.y} stroke="#78716C" strokeWidth="0.8" opacity="0.4" />

            {/* Vùng diện tích điểm thực tế */}
            <polygon
              points={polyPoints}
              fill="rgba(233, 196, 106, 0.3)"
              stroke="#E9C46A"
              strokeWidth="1.8"
              className="transition-all duration-300"
            />

            {/* 3 Đỉnh chốt điểm */}
            <circle cx={p1.x} cy={p1.y} r="2.5" fill="#E9C46A" />
            <circle cx={p2.x} cy={p2.y} r="2.5" fill="#E9C46A" />
            <circle cx={p3.x} cy={p3.y} r="2.5" fill="#E9C46A" />

            {/* Nhãn trục */}
            <text x={cx} y={p1Base.y - 4} textAnchor="middle" fill="#D6D3D1" fontSize="8" fontFamily="sans-serif">
              Sắc độ
            </text>
            <text x={p2Base.x - 4} y={p2Base.y + 10} textAnchor="middle" fill="#D6D3D1" fontSize="8" fontFamily="sans-serif">
              Tương phản
            </text>
            <text x={p3Base.x + 4} y={p3Base.y + 10} textAnchor="middle" fill="#D6D3D1" fontSize="8" fontFamily="sans-serif">
              Di sản
            </text>
          </svg>
        </div>

        {/* 3 Cột điểm số trực quan */}
        <div className="flex-1 space-y-1.5 text-xs">
          <div>
            <div className="flex justify-between text-stone-400 text-[11px] mb-0.5">
              <span>Sắc độ (Hue)</span>
              <span className="font-mono text-amber-200">{harmony.hueScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${harmony.hueScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-stone-400 text-[11px] mb-0.5">
              <span>Tương phản (WCAG)</span>
              <span className="font-mono text-amber-200">{harmony.contrastScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${harmony.contrastScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-stone-400 text-[11px] mb-0.5">
              <span>Di sản (Ngũ Hành)</span>
              <span className="font-mono text-amber-200">{harmony.heritageScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${harmony.heritageScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lời bình phẩm thẩm mỹ */}
      <div className="mt-3 pt-2.5 border-t border-stone-800/80">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400/80 mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-stone-300/90 leading-relaxed font-sans">
            {harmony.comment}
          </p>
        </div>
      </div>
    </div>
  );
};
export default HarmonyRadar;
