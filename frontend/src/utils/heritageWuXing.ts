/**
 * Hệ thống ánh xạ Ngũ hành Tương sinh và Điểm thưởng Di sản (Heritage Bonus)
 * Tuân thủ quy chuẩn mỹ thuật cổ truyền Việt Nam trong docs/BUSINESS-LOGIC-SPECIFICATION.md (Mục 2.4)
 */

import { normalizeHex } from '../constants/heritageColors';

export type WuXingElement = 'KIM' | 'MOC' | 'THUY' | 'HOA' | 'THO';

export interface HeritageBonusResult {
  bonusScore: number;
  isGenerating: boolean;
  note: string;
}

// Bảng ánh xạ 8 màu Cổ phong sang Ngũ hành
const HERITAGE_WUXING_MAP: Record<string, WuXingElement> = {
  '#F4F1DE': 'KIM',  // Trắng ngà (Kim)
  '#2A9D8F': 'MOC',  // Xanh cổ vịt (Mộc)
  '#264653': 'THUY', // Xanh chàm (Thủy)
  '#1D1E2C': 'THUY', // Đen mun (Thủy)
  '#9E2A2B': 'HOA',  // Đỏ điều (Hỏa)
  '#5A189A': 'HOA',  // Tía ngọc (Hỏa)
  '#E9C46A': 'THO',  // Vàng hoa mướp (Thổ)
  '#6F4E37': 'THO',  // Nâu sồng (Thổ)
};

const WUXING_NAMES: Record<WuXingElement, string> = {
  KIM: 'Hành Kim',
  MOC: 'Hành Mộc',
  THUY: 'Hành Thủy',
  HOA: 'Hành Hỏa',
  THO: 'Hành Thổ',
};

// Vòng tương sinh: Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim
const GENERATING_PAIRS: Record<WuXingElement, WuXingElement> = {
  KIM: 'THUY',
  THUY: 'MOC',
  MOC: 'HOA',
  HOA: 'THO',
  THO: 'KIM',
};

/**
 * Tra cứu hành của màu sắc dựa trên mã hex
 */
export function getColorWuXing(hex: string): WuXingElement | null {
  if (!hex) return null;
  const clean = normalizeHex(hex);
  return HERITAGE_WUXING_MAP[clean] || null;
}

/**
 * Kiểm tra xem 2 hành có quan hệ Tương sinh hay không (A sinh B hoặc B sinh A)
 */
export function checkGeneratingRelationship(elem1: WuXingElement, elem2: WuXingElement): boolean {
  if (!elem1 || !elem2) return false;
  return GENERATING_PAIRS[elem1] === elem2 || GENERATING_PAIRS[elem2] === elem1;
}

/**
 * Tính điểm thưởng di sản (Heritage Bonus) giữa 2 màu trang phục chính (vd: TOP và BOTTOM)
 */
export function calculateHeritageBonus(hex1: string, hex2: string): HeritageBonusResult {
  const elem1 = getColorWuXing(hex1);
  const elem2 = getColorWuXing(hex2);

  // Cả hai màu đều thuộc bảng 8 màu Cổ phong di sản
  if (elem1 && elem2) {
    if (checkGeneratingRelationship(elem1, elem2)) {
      return {
        bonusScore: 100,
        isGenerating: true,
        note: `Ngũ hành tương sinh (${WUXING_NAMES[elem1]} - ${WUXING_NAMES[elem2]}) mang lại sinh khí và hài hòa tuyệt hảo`,
      };
    }

    if (elem1 === elem2) {
      return {
        bonusScore: 85,
        isGenerating: false,
        note: `Đồng khí tương cầu (${WUXING_NAMES[elem1]}), tone-sur-tone tôn quý và nhất quán`,
      };
    }

    return {
      bonusScore: 70,
      isGenerating: false,
      note: 'Hòa sắc cổ phong nhã nhặn, tôn vinh vẻ đẹp truyền thống',
    };
  }

  // Một màu cổ phong kết hợp một màu hiện đại sáng tạo
  if (elem1 || elem2) {
    return {
      bonusScore: 50,
      isGenerating: false,
      note: 'Giao thoa cổ kim cách tân, hòa quyện nét di sản và cá tính Gen Z',
    };
  }

  // Cả hai màu đều là màu hiện đại do người dùng tự chọn
  return {
    bonusScore: 30,
    isGenerating: false,
    note: 'Sắc màu sáng tạo tự do theo phong cách Heritage Futurism phá cách',
  };
}
