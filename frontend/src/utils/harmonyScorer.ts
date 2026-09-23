/**
 * Thuật toán tổng hợp tính điểm hòa sắc mỹ thuật và văn hóa di sản (0 - 100)
 * Tuân thủ 100% đặc tả tại docs/BUSINESS-LOGIC-SPECIFICATION.md (Mục 2)
 */

import {
  hexToRgb,
  hexToHsl,
  calculateDeltaTheta,
  calculateContrastRatio,
} from './colorMetrics';
import { calculateHeritageBonus } from './heritageWuXing';

export interface HarmonyScoreDetail {
  totalScore: number;
  hueScore: number;
  contrastScore: number;
  heritageScore: number;
  hueType: 'ANALOGOUS' | 'COMPLEMENTARY' | 'TRIADIC' | 'NEUTRAL' | 'CLASHING';
  isGeneratingWuXing: boolean;
  title: string;
  comment: string;
}

/**
 * Tính toán điểm hòa sắc tổng thể dựa trên 3 trụ cột:
 * 1. Hue Spread (40%)
 * 2. WCAG Contrast (30%)
 * 3. Heritage WuXing Bonus (30%)
 */
export function calculateColorHarmony(topHex: string, bottomHex: string): HarmonyScoreDetail {
  const hsl1 = hexToHsl(topHex);
  const hsl2 = hexToHsl(bottomHex);
  const rgb1 = hexToRgb(topHex);
  const rgb2 = hexToRgb(bottomHex);

  // 1. Phân bổ góc màu bánh xe (Hue Spread Score - 40%)
  let hueScore = 75;
  let hueType: HarmonyScoreDetail['hueType'] = 'NEUTRAL';

  if (!hsl1 || !hsl2) {
    hueScore = 70;
    hueType = 'NEUTRAL';
  } else if (hsl1.s < 12 || hsl2.s < 12 || hsl1.l > 92 || hsl2.l > 92 || hsl1.l < 10 || hsl2.l < 10) {
    // Một trong hai màu là màu trung tính (trắng, đen, xám hoặc nhạt)
    hueScore = 90;
    hueType = 'NEUTRAL';
  } else {
    const deltaTheta = calculateDeltaTheta(hsl1.h, hsl2.h);

    if (deltaTheta <= 35) {
      hueScore = 95;
      hueType = 'ANALOGOUS';
    } else if (deltaTheta >= 150 && deltaTheta <= 180) {
      hueScore = 95;
      hueType = 'COMPLEMENTARY';
    } else if (deltaTheta >= 110 && deltaTheta <= 130) {
      hueScore = 88;
      hueType = 'TRIADIC';
    } else if (deltaTheta > 40 && deltaTheta < 100) {
      hueScore = 65;
      hueType = 'CLASHING';
    } else {
      hueScore = 75;
      hueType = 'NEUTRAL';
    }
  }

  // 2. Độ tương phản sáng tối (Luminance Contrast Score - 30%)
  let contrastScore = 65;
  if (rgb1 && rgb2) {
    const ratio = calculateContrastRatio(rgb1, rgb2);
    if (ratio >= 2.5) {
      contrastScore = 95;
    } else if (ratio >= 1.8) {
      contrastScore = 80;
    } else if (ratio >= 1.3) {
      contrastScore = 65;
    } else {
      contrastScore = 50;
    }
  }

  // 3. Điểm thưởng Di sản & Ngũ Hành (Heritage Bonus - 30%)
  const heritageResult = calculateHeritageBonus(topHex, bottomHex);
  const heritageScore = heritageResult.bonusScore;
  const isGeneratingWuXing = heritageResult.isGenerating;

  // 4. Tổng hợp điểm số (Total Score: 0 - 100)
  const weightedTotal = Math.round(
    hueScore * 0.4 + contrastScore * 0.3 + heritageScore * 0.3
  );
  const totalScore = Math.min(100, Math.max(0, weightedTotal));

  // 5. Tiêu đề danh xưng & Lời bình phẩm thẩm mỹ
  let title = 'Hài Hòa Nhã Nhặn';
  let comment = 'Bộ phối cân đối về sắc độ và độ tương phản tự nhiên.';

  if (isGeneratingWuXing) {
    title = 'Ngũ Sắc Tương Sinh';
    comment = `${heritageResult.note}. Tác phẩm hội tụ sinh khí di sản và mỹ cảm đương đại.`;
  } else if (hueType === 'COMPLEMENTARY') {
    title = 'Tương Phản Nổi Bật';
    comment = 'Tương phản xuất sắc, tôn vinh khí chất hiện đại nổi bật và phong thái sắc sảo.';
  } else if (hueType === 'ANALOGOUS') {
    title = 'Tone-Sur-Tone Cổ Phong';
    comment = 'Tone-sur-tone thanh thoát, giữ trọn nét nhã nhặn và đoan trang của cổ phục Việt.';
  } else if (hueType === 'TRIADIC') {
    title = 'Tam Sắc Năng Động';
    comment = 'Phối màu tam giác hài hòa, năng động, mang tinh thần trẻ trung tươi mới của Gen Z.';
  } else if (hueType === 'NEUTRAL') {
    title = 'Trung Tính Thanh Tao';
    comment = 'Sắc độ nền nã và thanh lịch, tôn lên cốt cách khiêm cung trang trọng.';
  } else {
    title = 'Sáng Tạo Độc Bản';
    comment = 'Tổ hợp màu sắc phá cách, đậm dấu ấn thẩm mỹ cá nhân và tinh thần Heritage Futurism.';
  }

  return {
    totalScore,
    hueScore,
    contrastScore,
    heritageScore,
    hueType,
    isGeneratingWuXing,
    title,
    comment,
  };
}
