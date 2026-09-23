/**
 * Thuật toán nhuộm màu vải Dual Offscreen Canvas
 * Tuân thủ 100% đặc tả tại docs/BUSINESS-LOGIC-SPECIFICATION.md
 */

import { CANVAS_CONFIG } from './index';
import { isValidHexColor, normalizeHex } from '../constants/heritageColors';

// Reusable offscreen canvas to avoid GC overhead during 60 FPS slider dragging
let cachedOffscreenCanvas: HTMLCanvasElement | null = null;

function getOffscreenCanvas(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  if (!cachedOffscreenCanvas) {
    cachedOffscreenCanvas = document.createElement('canvas');
    cachedOffscreenCanvas.width = CANVAS_CONFIG.WIDTH;
    cachedOffscreenCanvas.height = CANVAS_CONFIG.HEIGHT;
  }
  return cachedOffscreenCanvas;
}

/**
 * Chuyển đổi mã màu hex (#RRGGBB hoặc #RGB) sang RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
 * Render một lớp trang phục đã được nhuộm màu lên Canvas chính
 * @param mainCtx CanvasRenderingContext2D của Canvas chính (800x1200)
 * @param image HTMLImageElement ảnh trang phục PNG trong suốt
 * @param hexColor Mã màu hex cần nhuộm (vd: '#9E2A2B')
 * @param customizable Cờ cho phép đổi màu hay không
 */
export function renderTintedLayer(
  mainCtx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  hexColor: string,
  customizable: boolean
): void {
  const { WIDTH, HEIGHT } = CANVAS_CONFIG;

  // Nếu không cho phép đổi màu hoặc không có mã màu hợp lệ, vẽ trực tiếp ảnh gốc
  if (!customizable || !hexColor || !isValidHexColor(hexColor)) {
    mainCtx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    return;
  }

  const validHex = normalizeHex(hexColor);
  const offscreen = getOffscreenCanvas();
  if (!offscreen) {
    mainCtx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    return;
  }

  const offCtx = offscreen.getContext('2d');
  if (!offCtx) {
    mainCtx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    return;
  }

  // 1. Dọn sạch offscreen canvas
  offCtx.globalCompositeOperation = 'source-over';
  offCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // 2. Phủ màu nền đã chọn
  offCtx.fillStyle = validHex;
  offCtx.fillRect(0, 0, WIDTH, HEIGHT);

  // 3. Hòa trộn Multiply với ảnh gốc để giữ nếp gấp vải và bóng tự nhiên
  offCtx.globalCompositeOperation = 'multiply';
  offCtx.drawImage(image, 0, 0, WIDTH, HEIGHT);

  // 4. Cắt theo Alpha channel của ảnh gốc (loại bỏ màu tràn ra ngoài)
  offCtx.globalCompositeOperation = 'destination-in';
  offCtx.drawImage(image, 0, 0, WIDTH, HEIGHT);

  // 5. Vẽ layer hoàn chỉnh đã nhuộm lên Canvas chính
  mainCtx.drawImage(offscreen, 0, 0, WIDTH, HEIGHT);
}
