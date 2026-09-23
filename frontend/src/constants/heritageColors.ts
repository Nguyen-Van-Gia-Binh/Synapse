export interface HeritageColor {
  id: string;
  name: string;
  hex: string;
  meaning: string;
  description: string;
}

export const HERITAGE_PALETTE: readonly HeritageColor[] = [
  {
    id: 'do-dieu',
    name: 'Đỏ điều',
    hex: '#9E2A2B',
    meaning: 'Tôn nghiêm, May mắn, Phẩm phục',
    description: 'Sắc đỏ thắm truyền thống tượng trưng cho sự tôn nghiêm triều chính và may mắn trong dân gian.',
  },
  {
    id: 'vang-muop',
    name: 'Vàng hoa mướp',
    hex: '#E9C46A',
    meaning: 'Đất mẹ (Hành Thổ), Phú quý, Hưng thịnh',
    description: 'Sắc vàng ấm áp như hoa mướp nở, biểu trưng cho sự trù phú và hưng thịnh của vùng châu thổ.',
  },
  {
    id: 'xanh-cham',
    name: 'Xanh chàm',
    hex: '#264653',
    meaning: 'Thủy ba, Sông nước, Điềm đạm',
    description: 'Màu chàm nhuộm từ thảo mộc sông nước, trầm mặc, uy nghi như sóng thủy ba triều Nguyễn.',
  },
  {
    id: 'xanh-co-vit',
    name: 'Xanh cổ vịt',
    hex: '#2A9D8F',
    meaning: 'Thanh nhã, Quý phái, Cổ kính',
    description: 'Sắc xanh pha lục biếc tự nhiên, biểu trưng cho sự thanh tao và nét quý phái kín đáo.',
  },
  {
    id: 'tia-ngoc',
    name: 'Tía ngọc',
    hex: '#5A189A',
    meaning: 'Hoàng tộc, Huyền bí, Quyền quý',
    description: 'Sắc tím ngọc hoàng gia sâu lắng, gắn liền với phẩm phục cao quý và nét bí ẩn tao nhã.',
  },
  {
    id: 'trang-nga',
    name: 'Trắng ngà',
    hex: '#F4F1DE',
    meaning: 'Lụa tơ tằm, Thuần khiết, Nền nã',
    description: 'Màu sợi tơ tằm thô nguyên bản không tẩy, mang lại cảm giác dịu nhẹ, thanh bạch và thoát tục.',
  },
  {
    id: 'den-mun',
    name: 'Đen mun',
    hex: '#1D1E2C',
    meaning: 'Gỗ mun, Mực thước, Trang trọng',
    description: 'Sắc đen tuyền như gỗ mun quý, mực thước và tôn nghiêm trong các nghi lễ trang trọng.',
  },
  {
    id: 'nau-song',
    name: 'Nâu sồng',
    hex: '#6F4E37',
    meaning: 'Cần lao, Mộc mạc, Dân gian',
    description: 'Màu áo bà ba, áo nâu nhuộm củ nâu dân gian, đại diện cho đức tính cần cù, kiên cường của người Việt.',
  },
] as const;

export function isValidHexColor(hex: string): boolean {
  if (!hex) return false;
  const cleanHex = hex.trim().startsWith('#') ? hex.trim() : `#${hex.trim()}`;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleanHex);
}

export function normalizeHex(hex: string): string {
  const cleanHex = hex.trim();
  return cleanHex.startsWith('#') ? cleanHex.toUpperCase() : `#${cleanHex}`.toUpperCase();
}
