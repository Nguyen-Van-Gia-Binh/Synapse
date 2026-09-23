/**
 * Cỗ máy render thẻ V-Lookbook chuẩn 9:16 (1080 x 1920 px)
 * Tuân thủ quy chuẩn mỹ thuật "Heritage Futurism" và docs/PLAN.md (Mục 3.5)
 */

import { HERITAGE_PALETTE, normalizeHex } from '../constants/heritageColors';

export const LOOKBOOK_CONFIG = {
  WIDTH: 1080,
  HEIGHT: 1920,
};

export interface PaletteItem {
  name: string;
  hex: string;
}

export interface LookbookRenderOptions {
  title: string;
  gender: 'MALE' | 'FEMALE';
  mannequinCanvas: HTMLCanvasElement;
  paletteUsed: string[];
  factQuote?: {
    title: string;
    era: string;
    quote: string;
  } | null;
  harmonyScore: number;
  harmonyTitle?: string;
}

/**
 * Phân bổ bố cục các vùng hiển thị trên thẻ 1080 x 1920
 */
export function getLookbookLayout() {
  return {
    header: { x: 0, y: 0, width: 1080, height: 180 },
    viewport: { x: 150, y: 190, width: 780, height: 1170 },
    info: { x: 80, y: 1380, width: 920, height: 100 },
    palette: { x: 80, y: 1490, width: 920, height: 90 },
    footer: { x: 80, y: 1600, width: 920, height: 260 },
  };
}

/**
 * Trích xuất danh sách màu không trùng lặp kèm tên Cổ phong
 */
export function calculatePaletteList(rawColors: string[]): PaletteItem[] {
  const uniqueHexes = Array.from(
    new Set(rawColors.filter(Boolean).map((hex) => normalizeHex(hex)))
  );

  return uniqueHexes.map((hex) => {
    const heritage = HERITAGE_PALETTE.find(
      (p) => normalizeHex(p.hex) === hex
    );
    return {
      name: heritage ? heritage.name : 'Sáng tạo',
      hex,
    };
  });
}

/**
 * Render thẻ V-Lookbook tỷ lệ 9:16 chất lượng cao thành Blob PNG
 */
export async function renderLookbookCard916(
  options: LookbookRenderOptions
): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = LOOKBOOK_CONFIG.WIDTH;
  canvas.height = LOOKBOOK_CONFIG.HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const { WIDTH, HEIGHT } = LOOKBOOK_CONFIG;
  const layout = getLookbookLayout();

  // 1. Phủ nền Gradient tối sâu thẳm (Deep Heritage Charcoal)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bgGrad.addColorStop(0, '#0B0C11');
  bgGrad.addColorStop(0.5, '#12131C');
  bgGrad.addColorStop(1, '#08080C');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2. Vẽ viền khung hoa văn dát vàng tinh xảo
  ctx.strokeStyle = 'rgba(233, 196, 106, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);

  ctx.strokeStyle = 'rgba(233, 196, 106, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, WIDTH - 96, HEIGHT - 96);

  // 4 góc trang trí phong cách hoàng cung
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#E9C46A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.lineTo(0, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(44, 44, 0);
  drawCorner(WIDTH - 44, 44, Math.PI / 2);
  drawCorner(WIDTH - 44, HEIGHT - 44, Math.PI);
  drawCorner(44, HEIGHT - 44, -Math.PI / 2);

  // 3. Header: Logo & Định danh Synapse
  ctx.textAlign = 'center';
  ctx.fillStyle = '#E9C46A';
  ctx.font = 'bold 36px "Cinzel", "Playfair Display", serif';
  ctx.fillText('SYNAPSE', WIDTH / 2, 105);

  ctx.fillStyle = 'rgba(244, 241, 222, 0.7)';
  ctx.font = '500 16px "Be Vietnam Pro", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('V-HERITAGE STUDIO • CỔ PHỤC GEN Z', WIDTH / 2, 138);

  // Đường kẻ phân cách Header
  const headDiv = ctx.createLinearGradient(WIDTH / 2 - 200, 0, WIDTH / 2 + 200, 0);
  headDiv.addColorStop(0, 'rgba(233, 196, 106, 0)');
  headDiv.addColorStop(0.5, 'rgba(233, 196, 106, 0.5)');
  headDiv.addColorStop(1, 'rgba(233, 196, 106, 0)');
  ctx.strokeStyle = headDiv;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 200, 155);
  ctx.lineTo(WIDTH / 2 + 200, 155);
  ctx.stroke();

  // 4. Mannequin Canvas ở vị trí trung tâm
  const vp = layout.viewport;
  // Khung nền đệm người mẫu
  ctx.fillStyle = 'rgba(26, 27, 38, 0.4)';
  ctx.fillRect(vp.x, vp.y, vp.width, vp.height);
  ctx.strokeStyle = 'rgba(244, 241, 222, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(vp.x, vp.y, vp.width, vp.height);

  // Vẽ Canvas người mẫu đã phối
  if (options.mannequinCanvas) {
    ctx.drawImage(options.mannequinCanvas, vp.x, vp.y, vp.width, vp.height);
  }

  // 5. Tên tác phẩm & Phái tính
  const titleY = layout.info.y;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F4F1DE';
  ctx.font = 'bold 38px "Playfair Display", "Cinzel", serif';
  const displayTitle = options.title.trim() || 'Tác Phẩm Cổ Phục Synapse';
  ctx.fillText(displayTitle, WIDTH / 2, titleY + 40);

  // Badge giới tính
  const genderLabel = options.gender === 'FEMALE' ? 'CỔ PHỤC NỮ MẪU' : 'CỔ PHỤC NAM MẪU';
  ctx.fillStyle = '#E9C46A';
  ctx.font = '600 14px "Be Vietnam Pro", sans-serif';
  ctx.fillText(genderLabel, WIDTH / 2, titleY + 75);

  // 6. Dải bảng màu Cổ phong đã dùng
  const paletteList = calculatePaletteList(options.paletteUsed);
  const palY = layout.palette.y;
  if (paletteList.length > 0) {
    const itemWidth = 100;
    const startX = WIDTH / 2 - ((paletteList.length - 1) * itemWidth) / 2;

    paletteList.forEach((pal, idx) => {
      const cx = startX + idx * itemWidth;
      const cy = palY + 20;

      // Vòng tròn màu
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = pal.hex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 241, 222, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tên màu
      ctx.fillStyle = '#F4F1DE';
      ctx.font = '500 13px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pal.name, cx, cy + 34);

      // Mã hex
      ctx.fillStyle = 'rgba(244, 241, 222, 0.5)';
      ctx.font = '11px monospace';
      ctx.fillText(pal.hex.toUpperCase(), cx, cy + 50);
    });
  }

  // 7. Footer: Thẻ tri thức văn hóa trích dẫn & Điểm hòa sắc
  const ftr = layout.footer;
  const cardW = (ftr.width - 24) / 2;

  // Hộp bên trái: Trích dẫn văn hóa
  ctx.fillStyle = 'rgba(26, 27, 38, 0.7)';
  ctx.fillRect(ftr.x, ftr.y, cardW + 100, 160);
  ctx.strokeStyle = 'rgba(233, 196, 106, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(ftr.x, ftr.y, cardW + 100, 160);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E9C46A';
  ctx.font = 'bold 15px "Be Vietnam Pro", sans-serif';
  const factEra = options.factQuote?.era ? `TRIỀU ${options.factQuote.era.toUpperCase()}` : 'DI SẢN TRIỀU NGUYỄN';
  ctx.fillText(factEra, ftr.x + 24, ftr.y + 36);

  ctx.fillStyle = '#F4F1DE';
  ctx.font = 'bold 18px "Playfair Display", serif';
  const factTitle = options.factQuote?.title || 'Áo Tấc & Ngũ Thân';
  ctx.fillText(factTitle, ftr.x + 24, ftr.y + 68);

  ctx.fillStyle = 'rgba(244, 241, 222, 0.75)';
  ctx.font = 'italic 14px "Be Vietnam Pro", sans-serif';
  const factQuote = options.factQuote?.quote || 'Đoan trang, chuẩn mực, lưu giữ tinh hoa lễ nghi cổ truyền dân tộc.';
  // Wrap text đơn giản
  ctx.fillText(factQuote.slice(0, 50) + (factQuote.length > 50 ? '...' : ''), ftr.x + 24, ftr.y + 105);

  // Hộp bên phải: Điểm hòa sắc
  const rightBoxX = ftr.x + cardW + 120;
  const rightBoxW = cardW - 120;
  ctx.fillStyle = 'rgba(26, 27, 38, 0.7)';
  ctx.fillRect(rightBoxX, ftr.y, rightBoxW, 160);
  ctx.strokeStyle = 'rgba(233, 196, 106, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(rightBoxX, ftr.y, rightBoxW, 160);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(244, 241, 222, 0.7)';
  ctx.font = '600 13px "Be Vietnam Pro", sans-serif';
  ctx.fillText('ĐIỂM HÒA SẮC', rightBoxX + rightBoxW / 2, ftr.y + 36);

  ctx.fillStyle = '#E9C46A';
  ctx.font = 'bold 44px monospace';
  ctx.fillText(`${options.harmonyScore}`, rightBoxX + rightBoxW / 2, ftr.y + 88);

  ctx.fillStyle = '#2A9D8F';
  ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
  ctx.fillText(options.harmonyTitle || 'Hài Hòa Di Sản', rightBoxX + rightBoxW / 2, ftr.y + 124);

  // 8. Dòng Watermark chân trang
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(244, 241, 222, 0.4)';
  ctx.font = '12px "Be Vietnam Pro", sans-serif';
  ctx.fillText('synapse-studio.vercel.app • #VHeritage #GenZCoPhuc', WIDTH / 2, HEIGHT - 65);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
  });
}
