import { ItemDto, CulturalFactDto, Gender, SlotType } from '../types';

export class ItemsService {
  /**
   * Danh mục trang phục mock chuẩn theo DATABASE-SCHEMA.sql
   */
  private mockItems: ItemDto[] = [
    {
      id: '11111111-0000-0000-0000-000000000001',
      name: 'Áo tấc tay thụng',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_tac_top.png',
      color_customizable: true,
      default_color: '#9E2A2B',
      tags: ['nguyen', 'formal', 'ao_tac', 'le_hoi'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000002',
      name: 'Áo ngũ thân tay chẽn',
      gender: 'MALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/male_ao_ngu_than_top.png',
      color_customizable: true,
      default_color: '#264653',
      tags: ['nguyen', 'daily', 'ao_ngu_than'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000004',
      name: 'Quần lụa ống rộng truyền thống',
      gender: 'UNISEX',
      slot: 'BOTTOM',
      layer_order: 20,
      image_url: '/assets/mock/unisex_quan_lua.png',
      color_customizable: true,
      default_color: '#F4F1DE',
      tags: ['nguyen', 'basic', 'quan_ong_rong', 'silk'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000005',
      name: 'Khăn đóng xếp nếp truyền thống',
      gender: 'MALE',
      slot: 'HEADWEAR',
      layer_order: 60,
      image_url: '/assets/mock/male_khan_dong.png',
      color_customizable: true,
      default_color: '#1D1E2C',
      tags: ['nguyen', 'formal', 'khan_dong'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000006',
      name: 'Mấn nhung đính ngọc',
      gender: 'FEMALE',
      slot: 'HEADWEAR',
      layer_order: 60,
      image_url: '/assets/mock/female_man_nhung.png',
      color_customizable: true,
      default_color: '#5A189A',
      tags: ['nguyen', 'royal', 'man_nhung'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000007',
      name: 'Quạt lụa vẽ tranh thủy mặc',
      gender: 'UNISEX',
      slot: 'ACCESSORY',
      layer_order: 50,
      image_url: '/assets/mock/unisex_quat_lua.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['phu_kien', 'quat_lua', 'nghe_thuat'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
  ];

  private mockFacts: Record<string, CulturalFactDto> = {
    '11111111-0000-0000-0000-000000000001': {
      id: 'fact-01',
      item_id: '11111111-0000-0000-0000-000000000001',
      era: 'Triều Nguyễn (Thế kỷ 19 - 20)',
      origin_story: 'Áo tấc (còn gọi là áo ngũ thân tay thụng) là lễ phục trang trọng thời Nguyễn, quy định cho cả nam lẫn nữ trong các dịp lễ tiết, hôn lễ, cúng bái tổ tiên.',
      symbolic_meaning: 'Tà áo rộng mang dáng dấp đĩnh đạc; cổ áo đứng cài 5 hạt khuy tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín; 5 thân áo tượng trưng cho tứ thân phụ mẫu che chở đứa con ở giữa.',
      modern_styling_tip: 'Gen Z có thể kết hợp áo tấc với quần lụa trắng ngà hoặc quần tây ống đứng, phối cùng túi xách mây tre đan hoặc giày mule thanh lịch.',
    },
    '11111111-0000-0000-0000-000000000002': {
      id: 'fact-02',
      item_id: '11111111-0000-0000-0000-000000000002',
      era: 'Triều Nguyễn (Thế kỷ 18 - 19)',
      origin_story: 'Được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1837 nhằm thống nhất y phục Đại Nam, thể hiện tinh thần tự chủ văn hóa.',
      symbolic_meaning: 'Tay chẽn gọn gàng tượng trưng cho sự nhanh nhẹn, quyết đoán của người quân tử. Cổ đứng cao giữ cho dáng người luôn thẳng thắn, trang nghiêm.',
      modern_styling_tip: 'Các bạn nam có thể phối áo ngũ thân tay chẽn màu xanh chàm với giày sneaker trắng hoặc kính râm đen phong cách Retro Cyberpunk.',
    },
    '11111111-0000-0000-0000-000000000004': {
      id: 'fact-04',
      item_id: '11111111-0000-0000-0000-000000000004',
      era: 'Dân gian & Cung đình',
      origin_story: 'Quần lụa ống rộng màu trắng ngà là trang phục kinh điển đồng hành cùng áo tấc và áo ngũ thân.',
      symbolic_meaning: 'Ống quần rộng tạo bước đi khoan thai, uyển chuyển, tượng trưng cho sự thuần khiết và thanh cao.',
      modern_styling_tip: 'Phối cùng thắt lưng vải lụa hoặc sneaker đế cao tối giản.',
    },
  };

  /**
   * Lấy danh sách trang phục theo bộ lọc
   */
  async getItems(filters?: { gender?: Gender; slot?: SlotType; era?: string }): Promise<ItemDto[]> {
    return this.mockItems.filter((item) => {
      if (filters?.gender && filters.gender !== 'UNISEX' && item.gender !== filters.gender && item.gender !== 'UNISEX') {
        return false;
      }
      if (filters?.slot && item.slot !== filters.slot) {
        return false;
      }
      return true;
    });
  }

  /**
   * Lấy chi tiết một món đồ theo ID
   */
  async getItemById(id: string): Promise<ItemDto | null> {
    return this.mockItems.find((item) => item.id === id) || null;
  }

  /**
   * Lấy thẻ tri thức văn hóa theo Item ID
   */
  async getCulturalFact(itemId: string): Promise<CulturalFactDto | null> {
    return this.mockFacts[itemId] || null;
  }
}

export const itemsService = new ItemsService();
