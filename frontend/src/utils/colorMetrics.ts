/**
 * Thư viện tính toán không gian màu và tỷ lệ tương phản WCAG 2.1
 * Đáp ứng đặc tả kỹ thuật docs/BUSINESS-LOGIC-SPECIFICATION.md (Mục 2)
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 - 360 độ
  s: number; // 0 - 100 %
  l: number; // 0 - 100 %
}

/**
 * Chuyển đổi mã hex (#RGB hoặc #RRGGBB) sang RGB
 */
export function hexToRgb(hex: string): RGB | null {
  if (!hex) return null;
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

/**
 * Chuyển đổi mã hex sang HSL
 */
export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Tính góc lệch nhỏ nhất giữa 2 góc Hue trên bánh xe màu (0 - 180 độ)
 * Công thức: Δθ = min(|h1 - h2|, 360 - |h1 - h2|)
 */
export function calculateDeltaTheta(hue1: number, hue2: number): number {
  const diff = Math.abs(hue1 - hue2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Tính độ chói tương đối (Relative Luminance) theo chuẩn WCAG 2.1
 * Công thức: L = 0.2126 * R' + 0.7152 * G' + 0.0722 * B'
 */
export function calculateRelativeLuminance(rgb: RGB): number {
  const toLinear = (c: number): number => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const rLin = toLinear(rgb.r);
  const gLin = toLinear(rgb.g);
  const bLin = toLinear(rgb.b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Tính tỷ lệ tương phản (Contrast Ratio) giữa 2 màu theo chuẩn WCAG 2.1 (1:1 đến 21:1)
 * Công thức: (L_max + 0.05) / (L_min + 0.05)
 */
export function calculateContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = calculateRelativeLuminance(rgb1);
  const l2 = calculateRelativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}
