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
  { name: 'unisex_quan_lua.png', fn: generateQuanLua },
  { name: 'male_khan_dong.png', fn: generateKhanDongMale },
  { name: 'female_man_nhung.png', fn: generateManNhungFemale },
  { name: 'unisex_quat_lua.png', fn: generateQuatLua },
];

console.log('🎨 Đang sinh 8 file Mock Assets chuẩn 800 x 1200 px PNG...');
for (const asset of assets) {
  const buf = asset.fn();
  const filePath = path.join(outDir, asset.name);
  fs.writeFileSync(filePath, buf);
  console.log(`  ✓ Đã tạo ${asset.name} (${buf.length} bytes, 800x1200 px)`);
}
console.log('✅ Hoàn tất sinh Mock Assets!');
