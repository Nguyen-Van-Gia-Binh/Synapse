import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTH = 800;
const HEIGHT = 1200;

// CRC32 implementation for PNG chunks
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}
const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, crcPayload, crcBuf]);
}

function encodeRawRgbaToPng(rgbaBuffer, width, height) {
  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // Deflate
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with Filter Type 0 (None)
  const rowLength = width * 4;
  const rawData = Buffer.alloc(height * (rowLength + 1));
  for (let y = 0; y < height; y++) {
    const rawOffset = y * (rowLength + 1);
    rawData[rawOffset] = 0; // Filter: None
    rgbaBuffer.copy(rawData, rawOffset + 1, y * rowLength, (y + 1) * rowLength);
  }

  // IDAT Chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Pixel helper
class CanvasBuffer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buf = Buffer.alloc(width * height * 4, 0); // Transparent 0
  }

  setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (Math.floor(y) * this.width + Math.floor(x)) * 4;
    // Alpha blending
    const srcA = a / 255;
    const dstA = this.buf[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA <= 0) return;

    this.buf[idx] = Math.round((r * srcA + this.buf[idx] * dstA * (1 - srcA)) / outA);
    this.buf[idx + 1] = Math.round((g * srcA + this.buf[idx + 1] * dstA * (1 - srcA)) / outA);
    this.buf[idx + 2] = Math.round((b * srcA + this.buf[idx + 2] * dstA * (1 - srcA)) / outA);
    this.buf[idx + 3] = Math.round(outA * 255);
  }

  fillEllipse(cx, cy, rx, ry, r, g, b, a) {
    for (let y = Math.max(0, cy - ry); y <= Math.min(this.height - 1, cy + ry); y++) {
      for (let x = Math.max(0, cx - rx); x <= Math.min(this.width - 1, cx + rx); x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) {
          // Antialiased border feathering
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alphaFade = dist > 0.85 ? Math.round(a * (1 - (dist - 0.85) / 0.15)) : a;
          this.setPixel(x, y, r, g, b, alphaFade);
        }
      }
    }
  }

  fillPolygon(points, r, g, b, a) {
    let minX = this.width, maxX = 0, minY = this.height, maxY = 0;
    for (const [px, py] of points) {
      if (px < minX) minX = Math.floor(px);
      if (px > maxX) maxX = Math.ceil(px);
      if (py < minY) minY = Math.floor(py);
      if (py > maxY) maxY = Math.ceil(py);
    }
    minX = Math.max(0, minX);
    maxX = Math.min(this.width - 1, maxX);
    minY = Math.max(0, minY);
    maxY = Math.min(this.height - 1, maxY);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (pointInPoly(x, y, points)) {
          this.setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  toPngBuffer() {
    return encodeRawRgbaToPng(this.buf, this.width, this.height);
  }
}

function pointInPoly(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0], yi = points[i][1];
    const xj = points[j][0], yj = points[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// --------------------------------------------------------------------------
// 1. Mannequin Female (800 x 1200 px)
function generateMannequinFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Head
  c.fillEllipse(400, 210, 50, 65, 230, 215, 195, 255);
  // Neck
  c.fillPolygon([[385, 260], [415, 260], [420, 310], [380, 310]], 220, 205, 185, 255);
  // Shoulders & Torso
  c.fillPolygon([
    [320, 320], [480, 320], [450, 480], [440, 590], [360, 590], [350, 480]
  ], 225, 210, 190, 255);
  // Arms
  c.fillPolygon([[320, 320], [350, 320], [315, 580], [290, 580]], 220, 205, 185, 255);
  c.fillPolygon([[450, 320], [480, 320], [510, 580], [485, 580]], 220, 205, 185, 255);
  // Hands
  c.fillEllipse(300, 600, 18, 25, 220, 205, 185, 255);
  c.fillEllipse(500, 600, 18, 25, 220, 205, 185, 255);
  // Legs
  c.fillPolygon([[365, 590], [395, 590], [385, 1100], [360, 1100]], 215, 200, 180, 255);
  c.fillPolygon([[405, 590], [435, 590], [440, 1100], [415, 1100]], 215, 200, 180, 255);
  return c.toPngBuffer();
}

// 2. Mannequin Male (800 x 1200 px)
function generateMannequinMale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Head
  c.fillEllipse(400, 200, 54, 70, 225, 205, 185, 255);
  // Neck
  c.fillPolygon([[380, 255], [420, 255], [425, 305], [375, 305]], 215, 195, 175, 255);
  // Broad Shoulders & Torso
  c.fillPolygon([
    [295, 315], [505, 315], [475, 490], [455, 600], [345, 600], [325, 490]
  ], 220, 200, 180, 255);
  // Arms
  c.fillPolygon([[295, 315], [330, 315], [290, 590], [260, 590]], 215, 195, 175, 255);
  c.fillPolygon([[470, 315], [505, 315], [540, 590], [510, 590]], 215, 195, 175, 255);
  // Hands
  c.fillEllipse(275, 610, 20, 28, 215, 195, 175, 255);
  c.fillEllipse(525, 610, 20, 28, 215, 195, 175, 255);
  // Legs
  c.fillPolygon([[350, 600], [395, 600], [385, 1110], [345, 1110]], 210, 190, 170, 255);
  c.fillPolygon([[405, 600], [450, 600], [455, 1110], [415, 1110]], 210, 190, 170, 255);
  return c.toPngBuffer();
}

// 3. Áo Tấc Nữ (TOP - 800 x 1200 px) - Tay thụng rộng, cổ đứng
function generateAoTacFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // High Collar
  c.fillPolygon([[378, 275], [422, 275], [426, 310], [374, 310]], 240, 240, 240, 255);
  // Wide Sleeves (Tay thụng) & Body
  c.fillPolygon([
    [374, 310], [426, 310], [530, 335], [570, 610], [470, 660],
    [470, 850], [330, 850], [330, 660], [230, 610], [270, 335]
  ], 250, 245, 240, 255);
  // Subtle fold lines (for multiply effect)
  c.fillPolygon([[397, 310], [403, 310], [405, 845], [395, 845]], 200, 195, 190, 255);
  c.fillPolygon([[375, 450], [425, 460], [423, 466], [373, 456]], 210, 205, 200, 255);
  return c.toPngBuffer();
}

// 4. Áo Ngũ Thân Nam (TOP - 800 x 1200 px) - Tay chẽn gọn gàng, cổ đứng
function generateAoNguThanMale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // High Collar
  c.fillPolygon([[375, 270], [425, 270], [430, 308], [370, 308]], 245, 245, 245, 255);
  // Fitted Sleeves (Tay chẽn) & 5-panel Body
  c.fillPolygon([
    [370, 308], [430, 308], [515, 330], [545, 595], [495, 605], [480, 520],
    [485, 870], [315, 870], [320, 520], [305, 605], [255, 595], [285, 330]
  ], 250, 245, 240, 255);
  // Fold lines & buttons (Ngũ thường buttons)
  c.fillPolygon([[410, 308], [420, 308], [428, 470], [402, 865], [396, 865]], 200, 190, 180, 255);
  // 5 buttons
  [320, 350, 385, 420, 455].forEach(y => {
    c.fillEllipse(418, y, 5, 5, 180, 150, 90, 255);
  });
  return c.toPngBuffer();
}

// 5. Quần Lụa Trắng Ống Rộng (BOTTOM - 800 x 1200 px)
function generateQuanLua() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Wide silk pants from waist to floor
  c.fillPolygon([
    [340, 580], [460, 580], [475, 1090], [405, 1090],
    [400, 680], [395, 1090], [325, 1090]
  ], 245, 242, 235, 255);
  // Vertical drape shadows
  c.fillPolygon([[360, 620], [365, 620], [363, 1080], [358, 1080]], 215, 210, 200, 255);
  c.fillPolygon([[435, 620], [440, 620], [442, 1080], [437, 1080]], 215, 210, 200, 255);
  return c.toPngBuffer();
}

// 6. Khăn Đóng Nam (HEADWEAR - 800 x 1200 px)
function generateKhanDongMale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Oval wrap on head
  c.fillEllipse(400, 175, 62, 38, 40, 42, 55, 255);
  // Front fold (nếp chữ Nhất / chữ Nhân)
  c.fillPolygon([[385, 155], [415, 155], [408, 195], [392, 195]], 75, 78, 95, 255);
  return c.toPngBuffer();
}

// 7. Mấn Nhung Triều Nguyễn Nữ (HEADWEAR - 800 x 1200 px)
function generateManNhungFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Elevated arched headdress
  c.fillEllipse(400, 170, 68, 45, 110, 35, 140, 255);
  c.fillEllipse(400, 185, 48, 25, 0, 0, 0, 0); // cut center
  // Center jewel
  c.fillEllipse(400, 160, 7, 7, 245, 215, 130, 255);
  return c.toPngBuffer();
}

// 8. Quạt Lụa Phụ Kiện (ACCESSORY - 800 x 1200 px)
function generateQuatLua() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Fan arc in hand area
  c.fillEllipse(540, 660, 65, 45, 240, 210, 130, 240);
  // Fan ribs
  c.fillPolygon([[538, 660], [542, 660], [545, 715], [535, 715]], 120, 80, 50, 255);
  return c.toPngBuffer();
}

// 9. Áo Nhật Bình Cung Đình (TOP - 800 x 1200 px) - Cổ hình chữ nhật ngũ sắc
function generateAoNhatBinhFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Thân áo gấm vàng hoa mướp
  c.fillPolygon([
    [374, 308], [426, 308], [535, 335], [575, 615], [475, 665],
    [475, 860], [325, 860], [325, 665], [225, 615], [265, 335]
  ], 233, 196, 106, 255);

  // Cổ áo Nhật Bình to bản hình chữ nhật trước ngực
  c.fillPolygon([[362, 305], [438, 305], [438, 540], [362, 540]], 158, 42, 43, 255); // Nền đỏ điều
  // Dải viền ngũ sắc trên cổ áo (Xanh lam, vàng, xanh ngọc, trắng, tía)
  c.fillPolygon([[370, 310], [376, 310], [376, 535], [370, 535]], 38, 70, 83, 255);
  c.fillPolygon([[380, 310], [386, 310], [386, 535], [380, 535]], 244, 215, 100, 255);
  c.fillPolygon([[414, 310], [420, 310], [420, 535], [414, 535]], 42, 157, 143, 255);
  c.fillPolygon([[424, 310], [430, 310], [430, 535], [424, 535]], 90, 24, 154, 255);

  // Viền ngũ sắc tay áo trái & phải
  c.fillPolygon([[225, 600], [250, 600], [245, 625], [220, 625]], 158, 42, 43, 255);
  c.fillPolygon([[230, 605], [255, 605], [250, 630], [225, 630]], 42, 157, 143, 255);
  c.fillPolygon([[550, 600], [575, 600], [580, 625], [555, 625]], 158, 42, 43, 255);
  c.fillPolygon([[545, 605], [570, 605], [575, 630], [550, 630]], 42, 157, 143, 255);

  return c.toPngBuffer();
}

// 10. Giày Sneaker Tối Giản Gen Z (FOOTWEAR - 800 x 1200 px)
function generateSneakerUnisex() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Chân trái
  c.fillPolygon([[355, 1075], [395, 1075], [398, 1115], [350, 1115]], 248, 249, 250, 255);
  c.fillPolygon([[350, 1108], [398, 1108], [398, 1116], [350, 1116]], 215, 218, 222, 255); // Đế giày
  c.fillPolygon([[365, 1080], [385, 1080], [387, 1085], [367, 1085]], 180, 185, 190, 255); // Dây giày

  // Chân phải
  c.fillPolygon([[405, 1075], [445, 1075], [450, 1115], [402, 1115]], 248, 249, 250, 255);
  c.fillPolygon([[402, 1108], [450, 1108], [450, 1116], [402, 1116]], 215, 218, 222, 255); // Đế giày
  c.fillPolygon([[415, 1080], [435, 1080], [433, 1085], [413, 1085]], 180, 185, 190, 255); // Dây giày

  return c.toPngBuffer();
}

// 11. Áo Giao Lĩnh Cổ Truyền (TOP - 800 x 1200 px) - Cổ vạt chéo sang phải, thắt đai lụa
function generateAoGiaoLinhUnisex() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Dáng áo cổ giao vạt chéo buông dài
  c.fillPolygon([
    [370, 290], [430, 290], [535, 335], [565, 615], [475, 665],
    [485, 885], [315, 885], [325, 665], [235, 615], [265, 335]
  ], 248, 246, 242, 255);

  // Cổ áo giao chéo (Vạt trái bắt chéo sang sườn phải)
  c.fillPolygon([[370, 290], [385, 290], [435, 470], [420, 470]], 210, 205, 198, 255);
  c.fillPolygon([[430, 290], [415, 290], [380, 410], [392, 410]], 220, 215, 208, 255);

  // Thắt lưng lụa buộc ngang eo
  c.fillPolygon([[342, 575], [458, 575], [458, 605], [342, 605]], 205, 198, 190, 255);
  // Dải đai lụa buông dài rủ xuống tà áo
  c.fillPolygon([[415, 605], [432, 605], [440, 770], [423, 770]], 195, 188, 180, 255);
  c.fillPolygon([[425, 605], [442, 605], [452, 740], [435, 740]], 200, 193, 185, 255);

  return c.toPngBuffer();
}

// 12. Áo Đối Khâm Cung Đình (TOP - 800 x 1200 px) - Hai vạt song song buông thẳng
function generateAoDoiKhamFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Vạt trái & tay trái
  c.fillPolygon([
    [360, 295], [394, 295], [394, 880], [320, 880], [325, 660],
    [230, 610], [270, 335]
  ], 248, 245, 240, 255);

  // Vạt phải & tay phải
  c.fillPolygon([
    [406, 295], [440, 295], [530, 335], [570, 610], [475, 660],
    [480, 880], [406, 880]
  ], 248, 245, 240, 255);

  // Lớp áo yếm/lót bên trong ở khe giữa
  c.fillPolygon([[394, 340], [406, 340], [406, 560], [394, 560]], 230, 225, 220, 255);

  // Đường viền nẹp cổ buông thẳng
  c.fillPolygon([[386, 295], [394, 295], [394, 880], [386, 880]], 210, 205, 198, 255);
  c.fillPolygon([[406, 295], [414, 295], [414, 880], [406, 880]], 210, 205, 198, 255);

  return c.toPngBuffer();
}

// 13. Váy Quây Xếp Ly Cổ Truyền (BOTTOM - 800 x 1200 px) - Hạ y buông dài
function generateVayQuayFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Dáng chân váy xòe mềm mại từ eo tới mắt cá chân
  c.fillPolygon([
    [340, 580], [460, 580], [485, 1085], [315, 1085]
  ], 246, 242, 236, 255);

  // Các nếp sọc xếp ly dọc tạo độ rủ tự nhiên
  const pleatXs = [350, 375, 400, 425, 450, 470];
  pleatXs.forEach(x => {
    c.fillPolygon([[x, 585], [x + 5, 585], [x + 8, 1080], [x + 3, 1080]], 218, 212, 202, 255);
  });

  return c.toPngBuffer();
}

// 14. Nón Ba Tầm (Nón Quai Thao) (HEADWEAR - 800 x 1200 px) - Vành tròn dẹt, quai thao buông rủ
function generateNonBaTamFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Quai thao bằng lụa rủ hai bên vai (vẽ trước vành nón để vành nón đè lên)
  c.fillPolygon([[330, 180], [338, 180], [342, 490], [334, 490]], 45, 38, 35, 255); // Quai thao trái
  c.fillPolygon([[462, 180], [470, 180], [466, 490], [458, 490]], 45, 38, 35, 255); // Quai thao phải
  // Quả tua lụa ngũ sắc ở đuôi quai thao
  c.fillEllipse(338, 500, 7, 14, 180, 45, 40, 255);
  c.fillEllipse(462, 500, 7, 14, 180, 45, 40, 255);

  // Vành nón tròn dẹt rộng bằng lá gồi khô
  c.fillEllipse(400, 172, 138, 28, 228, 205, 155, 255);
  c.fillEllipse(400, 172, 135, 25, 238, 215, 165, 255);
  // Đường vành tang nón
  c.fillEllipse(400, 172, 138, 7, 200, 175, 125, 255);
  // Chóp nón khum nhẹ
  c.fillEllipse(400, 164, 55, 12, 245, 225, 178, 255);

  return c.toPngBuffer();
}

// 15. Họa Tiết Thủy Ba & Sóng Mây Triều Nguyễn (PATTERN - 800 x 1200 px)
function generateHoaVanThuyBaUnisex() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Hoa văn sóng nước dập dềnh (thủy ba) tại gấu áo (y: 770 đến 855)
  // Các lớp dải sóng ngũ sắc
  c.fillPolygon([[325, 830], [475, 830], [475, 855], [325, 855]], 38, 70, 83, 255); // Xanh chàm thủy ba
  c.fillPolygon([[325, 810], [475, 810], [475, 830], [325, 830]], 42, 157, 143, 255); // Xanh cổ vịt
  c.fillPolygon([[325, 795], [475, 795], [475, 810], [325, 810]], 233, 196, 106, 255); // Vàng hoa mướp
  c.fillPolygon([[325, 780], [475, 780], [475, 795], [325, 795]], 158, 42, 43, 255); // Đỏ điều

  // Các ngọn sóng nhấp nhô hình tam giác & xoáy nước cách điệu
  for (let x = 335; x <= 465; x += 25) {
    c.fillPolygon([[x, 780], [x + 12, 765], [x + 24, 780]], 244, 241, 222, 255); // Sóng bọt trắng
  }

  // Cụm mây ngũ sắc cuộn xoắn hai bên gấu áo
  c.fillEllipse(345, 770, 15, 10, 233, 196, 106, 255);
  c.fillEllipse(455, 770, 15, 10, 233, 196, 106, 255);

  return c.toPngBuffer();
}

// 16. Ngọc Bội Thao Thiết Như Ý (ACCESSORY - 800 x 1200 px)
function generateNgocBoiUnisex() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Nút thắt cát tường bằng chỉ lụa đỏ bên hông phải (x: ~465, y: 555-580)
  c.fillEllipse(468, 565, 8, 8, 175, 30, 35, 255);
  c.fillPolygon([[465, 570], [471, 570], [470, 595], [466, 595]], 175, 30, 35, 255);

  // Miếng ngọc bội cẩm thạch xanh ngọc bích chạm khắc hoa văn Như Ý
  c.fillEllipse(468, 615, 18, 18, 50, 168, 120, 255);
  c.fillEllipse(468, 615, 12, 12, 35, 140, 95, 255);
  c.fillEllipse(468, 615, 5, 5, 235, 205, 120, 255); // Điểm xuyết hoa văn vàng

  // Chùm tua rua buông rủ dài
  c.fillPolygon([[463, 633], [473, 633], [476, 705], [460, 705]], 175, 30, 35, 255);
  c.fillPolygon([[466, 633], [470, 633], [472, 715], [464, 715]], 235, 205, 120, 255);

  return c.toPngBuffer();
}

// 17. Guốc Mộc Quai Vải Cổ Truyền (FOOTWEAR - 800 x 1200 px)
function generateGuocMocUnisex() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Chân trái: Đế guốc gỗ hai tầng
  c.fillPolygon([[355, 1085], [395, 1085], [398, 1115], [352, 1115]], 165, 115, 75, 255);
  c.fillPolygon([[360, 1100], [390, 1100], [388, 1115], [362, 1115]], 80, 50, 30, 255); // Rãnh lõm giữa 2 guốc
  c.fillEllipse(375, 1083, 18, 8, 175, 35, 40, 255); // Quai vải nhung đỏ

  // Chân phải: Đế guốc gỗ hai tầng
  c.fillPolygon([[405, 1085], [445, 1085], [448, 1115], [402, 1115]], 165, 115, 75, 255);
  c.fillPolygon([[410, 1100], [440, 1100], [438, 1115], [412, 1115]], 80, 50, 30, 255); // Rãnh lõm giữa 2 guốc
  c.fillEllipse(425, 1083, 18, 8, 175, 35, 40, 255); // Quai vải nhung đỏ

  return c.toPngBuffer();
}

// 18. Hài Thêu Mũi Cong Cung Đình (FOOTWEAR - 800 x 1200 px)
function generateHaiTheuFemale() {
  const c = new CanvasBuffer(WIDTH, HEIGHT);
  // Chân trái: Hài gấm đỏ mũi uốn cong vểnh lên
  c.fillPolygon([[352, 1080], [396, 1080], [398, 1115], [350, 1115]], 168, 35, 45, 255);
  c.fillPolygon([[346, 1073], [358, 1073], [355, 1095], [345, 1095]], 168, 35, 45, 255); // Mũi cong vểnh
  c.fillEllipse(353, 1080, 5, 5, 245, 210, 95, 255); // Hoa mai vàng thêu kim tuyến

  // Chân phải: Hài gấm đỏ mũi uốn cong vểnh lên đối xứng
  c.fillPolygon([[404, 1080], [448, 1080], [450, 1115], [402, 1115]], 168, 35, 45, 255);
  c.fillPolygon([[442, 1073], [454, 1073], [455, 1095], [445, 1095]], 168, 35, 45, 255); // Mũi cong vểnh
  c.fillEllipse(447, 1080, 5, 5, 245, 210, 95, 255); // Hoa mai vàng thêu kim tuyến

  return c.toPngBuffer();
}

// Main generation execution
const outDir = path.resolve(__dirname, '../public/assets/mock');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const assets = [
  { name: 'mannequin_female.png', fn: generateMannequinFemale },
  { name: 'mannequin_male.png', fn: generateMannequinMale },
  { name: 'female_ao_tac_top.png', fn: generateAoTacFemale },
  { name: 'male_ao_ngu_than_top.png', fn: generateAoNguThanMale },
  { name: 'female_ao_nhat_binh.png', fn: generateAoNhatBinhFemale },
  { name: 'unisex_quan_lua.png', fn: generateQuanLua },
  { name: 'male_khan_dong.png', fn: generateKhanDongMale },
  { name: 'female_man_nhung.png', fn: generateManNhungFemale },
  { name: 'unisex_quat_lua.png', fn: generateQuatLua },
  { name: 'unisex_sneaker.png', fn: generateSneakerUnisex },
  // 8 Món đồ mới chuẩn sử liệu
  { name: 'unisex_ao_giao_linh.png', fn: generateAoGiaoLinhUnisex },
  { name: 'female_ao_doi_kham.png', fn: generateAoDoiKhamFemale },
  { name: 'female_vay_quay.png', fn: generateVayQuayFemale },
  { name: 'female_non_ba_tam.png', fn: generateNonBaTamFemale },
  { name: 'unisex_hoa_van_thuy_ba.png', fn: generateHoaVanThuyBaUnisex },
  { name: 'unisex_ngoc_boi.png', fn: generateNgocBoiUnisex },
  { name: 'unisex_guoc_moc.png', fn: generateGuocMocUnisex },
  { name: 'female_hai_theu.png', fn: generateHaiTheuFemale },
];

console.log(`🎨 Đang sinh ${assets.length} file Mock Assets chuẩn 800 x 1200 px PNG...`);
for (const asset of assets) {
  const buf = asset.fn();
  const filePath = path.join(outDir, asset.name);
  fs.writeFileSync(filePath, buf);
  console.log(`  ✓ Đã tạo ${asset.name} (${buf.length} bytes, 800x1200 px)`);
}
console.log('✅ Hoàn tất sinh toàn bộ Mock Assets!');

