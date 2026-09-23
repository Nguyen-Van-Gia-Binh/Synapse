import { ItemDto, CulturalFactDto, Gender, SlotType } from '../types';
import { supabaseClient, isSupabaseConfigured } from '../config/supabase';

export class ItemsService {
  /**
   * Danh mục trang phục mock chuẩn 100% theo DATABASE-SCHEMA.sql
   */
  private mockItems: ItemDto[] = [
    {
      id: '11111111-0000-0000-0000-000000000001',
      name: 'Áo tấc tay thụng thời Nguyễn',
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
      name: 'Áo ngũ thân tay chẽn Nam',
      gender: 'MALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/male_ao_ngu_than_top.png',
      color_customizable: true,
      default_color: '#264653',
      tags: ['nguyen', 'daily', 'ao_ngu_than', 'nam'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000003',
      name: 'Áo Nhật bình thêu ngũ sắc',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_nhat_binh.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['nguyen', 'royal', 'ao_nhat_binh', 'hoang_cung'],
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
    {
      id: '11111111-0000-0000-0000-000000000008',
      name: 'Giày Sneaker tối giản Gen Z',
      gender: 'UNISEX',
      slot: 'FOOTWEAR',
      layer_order: 10,
      image_url: '/assets/mock/unisex_sneaker.png',
      color_customizable: false,
      default_color: '#FFFFFF',
      tags: ['modern', 'streetwear', 'sneaker'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
  ];

  /**
   * Thẻ tri thức văn hóa lịch sử mock chuẩn 100% theo DATABASE-SCHEMA.sql
   */
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
    '11111111-0000-0000-0000-000000000003': {
      id: 'fact-03',
      item_id: '11111111-0000-0000-0000-000000000003',
      era: 'Triều Nguyễn (Cung đình Huế)',
      origin_story: 'Nguyên bản là thường phục của Hoàng hậu, Công chúa và mệnh phụ quý tộc triều Nguyễn. Tên gọi Nhật bình bắt nguồn từ dải cổ áo to bản ghép lại tạo thành hình chữ nhật trước ngực.',
      symbolic_meaning: 'Dải ngũ sắc nơi tay áo tượng trưng cho Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ). Hoa văn thêu loan phụng và mây sóng thủy ba biểu trưng cho sự tôn quý và an định đất nước.',
      modern_styling_tip: 'Nên giữ nguyên áo khoác ngoài Nhật bình kết hợp bên trong là áo lót trắng hoặc chân váy xòe xếp ly hiện đại khi tham dự triển lãm nghệ thuật.',
    },
    '11111111-0000-0000-0000-000000000004': {
      id: 'fact-04',
      item_id: '11111111-0000-0000-0000-000000000004',
      era: 'Dân gian & Cung đình',
      origin_story: 'Quần lụa ống rộng màu trắng ngà là trang phục kinh điển đồng hành cùng áo tấc và áo ngũ thân.',
      symbolic_meaning: 'Ống quần rộng tạo bước đi khoan thai, uyển chuyển, tượng trưng cho sự thuần khiết và thanh cao.',
      modern_styling_tip: 'Phối cùng thắt lưng vải lụa hoặc sneaker đế cao tối giản.',
    },
    '11111111-0000-0000-0000-000000000005': {
      id: 'fact-05',
      item_id: '11111111-0000-0000-0000-000000000005',
      era: 'Triều Nguyễn (Nam giới)',
      origin_story: 'Khăn đóng (khăn xếp) là nét đặc trưng không thể thiếu của nam giới người Việt khi mặc áo ngũ thân hoặc áo tấc trong các dịp trang trọng.',
      symbolic_meaning: 'Các nếp gấp hình chữ Nhất (-) hoặc chữ Nhân (人) phía trước trán tượng trưng cho đạo làm người ngay thẳng, khiêm nhường.',
      modern_styling_tip: 'Kết hợp cùng áo ngũ thân cách tân tối giản và kính mắt gọng kim loại thanh mảnh.',
    },
    '11111111-0000-0000-0000-000000000006': {
      id: 'fact-06',
      item_id: '11111111-0000-0000-0000-000000000006',
      era: 'Triều Nguyễn (Nữ giới Quý tộc)',
      origin_story: 'Mấn nhung hoặc mấn vấn khăn bằng vải quý là phụ kiện đội đầu trang nhã của phụ nữ quý tộc thời Nguyễn khi mặc lễ phục.',
      symbolic_meaning: 'Tôn vinh khuôn mặt đoan trang, thể hiện nét đài các, dịu dàng của người phụ nữ truyền thống Việt Nam.',
      modern_styling_tip: 'Mấn nhung tím hoặc đen kết hợp cùng khuyên tai ngọc trai và áo dài ngũ thân màu nhạt.',
    },
    '11111111-0000-0000-0000-000000000007': {
      id: 'fact-07',
      item_id: '11111111-0000-0000-0000-000000000007',
      era: 'Cổ truyền Việt Nam',
      origin_story: 'Quạt lụa cầm tay vẽ tranh thủy mặc hoặc phong cảnh non nước là phụ kiện tao nhã của tầng lớp văn nhân thi sĩ.',
      symbolic_meaning: 'Biểu trưng cho phong thái tự tại, thanh tao và tình yêu đối với vẻ đẹp thiên nhiên đất nước.',
      modern_styling_tip: 'Cầm tay tạo dáng chụp ảnh Lookbook hoặc dắt nhẹ vào dải thắt lưng áo.',
    },
    '11111111-0000-0000-0000-000000000008': {
      id: 'fact-08',
      item_id: '11111111-0000-0000-0000-000000000008',
      era: 'Đương đại (Gen Z Streetwear)',
      origin_story: 'Giày sneaker trắng tối giản là biểu tượng thời trang đường phố toàn cầu thế kỷ 21, được giới trẻ Việt ưa chuộng.',
      symbolic_meaning: 'Sự năng động, phóng khoáng và tinh thần phá cách, mang cổ phục bước vào đời sống thường nhật.',
      modern_styling_tip: 'Phối cùng tà áo dài ngũ thân hoặc áo tấc để tạo nét giao thoa Heritage Futurism đầy cuốn hút.',
    },
  };

  /**
   * Lấy danh sách trang phục theo bộ lọc (Ưu tiên Supabase, Fallback In-Memory)
   */
  async getItems(filters?: { gender?: Gender; slot?: SlotType; era?: string }): Promise<ItemDto[]> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        let query = supabaseClient.from('items').select('*').order('layer_order', { ascending: true });

        if (filters?.gender && filters.gender !== 'UNISEX') {
          query = query.in('gender', [filters.gender, 'UNISEX']);
        }
        if (filters?.slot) {
          query = query.eq('slot', filters.slot);
        }
        if (filters?.era) {
          query = query.contains('tags', JSON.stringify([filters.era.toLowerCase()]));
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as ItemDto[];
        }
        if (error) {
          console.warn('[ItemsService] Supabase query error, falling back to In-Memory mock:', error.message);
        }
      } catch (err) {
        console.warn('[ItemsService] Supabase query exception, falling back to In-Memory mock:', err);
      }
    }

    // Fallback In-Memory Filter
    return this.mockItems.filter((item) => {
      if (filters?.gender && filters.gender !== 'UNISEX' && item.gender !== filters.gender && item.gender !== 'UNISEX') {
        return false;
      }
      if (filters?.slot && item.slot !== filters.slot) {
        return false;
      }
      if (filters?.era) {
        const eraQuery = filters.era.toLowerCase();
        const hasEra = item.tags.some((tag) => tag.toLowerCase() === eraQuery);
        if (!hasEra) return false;
      }
      return true;
    });
  }

  /**
   * Lấy chi tiết một món đồ theo ID (Ưu tiên Supabase, Fallback In-Memory)
   */
  async getItemById(id: string): Promise<ItemDto | null> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('items').select('*').eq('id', id).maybeSingle();
        if (!error && data) {
          return data as ItemDto;
        }
        if (error) {
          console.warn('[ItemsService] Supabase getItemById error, falling back to In-Memory mock:', error.message);
        }
      } catch (err) {
        console.warn('[ItemsService] Supabase getItemById exception, falling back to In-Memory mock:', err);
      }
    }
    return this.mockItems.find((item) => item.id === id) || null;
  }

  /**
   * Lấy thẻ tri thức văn hóa theo Item ID (Ưu tiên Supabase, Fallback In-Memory)
   */
  async getCulturalFact(itemId: string): Promise<CulturalFactDto | null> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('cultural_facts').select('*').eq('item_id', itemId).maybeSingle();
        if (!error && data) {
          return data as CulturalFactDto;
        }
        if (error) {
          console.warn('[ItemsService] Supabase getCulturalFact error, falling back to In-Memory mock:', error.message);
        }
      } catch (err) {
        console.warn('[ItemsService] Supabase getCulturalFact exception, falling back to In-Memory mock:', err);
      }
    }
    return this.mockFacts[itemId] || null;
  }
}

export const itemsService = new ItemsService();
