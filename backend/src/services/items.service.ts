import { ItemDto, CulturalFactDto, Gender, SlotType } from '../types';

export class ItemsService {
  /**
   * Lấy danh sách trang phục theo bộ lọc
   */
  async getItems(filters?: { gender?: Gender; slot?: SlotType; era?: string }): Promise<ItemDto[]> {
    // Stub dữ liệu ban đầu cho Sprint 0, sẽ kết nối Supabase trong Sprint 1
    const mockItems: ItemDto[] = [
      {
        id: 'e4b2d5a1-7c8e-4a9b-8f12-3d4e5f6a7b8c',
        name: 'Áo tấc tay thụng',
        gender: 'FEMALE',
        slot: 'TOP',
        layer_order: 30,
        image_url: '/assets/fallback/female_ao_tac_top.png',
        color_customizable: true,
        default_color: '#9E2A2B',
        tags: ['nguyen', 'formal', 'ao_tac', 'le_hoi'],
        created_at: new Date().toISOString(),
      },
      {
        id: 'f8a1c3d2-5b7e-4e9a-9c23-4e5f6a7b8c9d',
        name: 'Áo ngũ thân tay chẽn',
        gender: 'MALE',
        slot: 'TOP',
        layer_order: 30,
        image_url: '/assets/fallback/male_ao_ngu_than_top.png',
        color_customizable: true,
        default_color: '#264653',
        tags: ['nguyen', 'daily', 'ao_ngu_than'],
        created_at: new Date().toISOString(),
      },
    ];

    return mockItems.filter(item => {
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
    const items = await this.getItems();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Lấy thẻ tri thức văn hóa theo Item ID
   */
  async getCulturalFact(itemId: string): Promise<CulturalFactDto | null> {
    return {
      id: 'fact-01',
      item_id: itemId,
      era: 'Triều Nguyễn (Thế kỷ 19)',
      origin_story: 'Áo ngũ thân tượng trưng cho tứ thân phụ mẫu ôm ấp lấy thân con (tà con bên trong).',
      symbolic_meaning: 'Năm cúc áo đại diện cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) của người quân tử.',
      modern_styling_tip: 'Phối cùng kính râm mắt tròn và sneaker trắng để tạo nét cá tính Heritage Futurism đương đại.',
    };
  }
}

export const itemsService = new ItemsService();
