import { EvaluateRulesRequestDto, EvaluateRulesResponseDto } from '../types';

export class RulesService {
  /**
   * Đánh giá outfit theo các quy tắc cấm kỵ văn hóa (Guardrails)
   */
  async evaluateRules(dto: EvaluateRulesRequestDto): Promise<EvaluateRulesResponseDto> {
    const violations = [];

    // Ví dụ rule kiểm tra cơ bản: có Áo nhưng chưa có Quần
    if (dto.slots.TOP && !dto.slots.BOTTOM) {
      violations.push({
        rule_code: 'RULE_AODAI_01',
        trigger_slot: 'TOP' as const,
        severity: 'INFO' as const,
        message: 'Áo dài ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?',
        suggestion: {
          target_slot: 'BOTTOM' as const,
          action: 'ADD',
          recommended_tags: ['quan_lua', 'quan_tay'],
        },
      });
    }

    return {
      is_valid: violations.length === 0,
      violations,
      encouragement: violations.length === 0 
        ? 'Bộ trang phục kết hợp hài hòa, tôn vinh nét đẹp cổ phong truyền thống!'
        : 'Sáng tạo rất độc đáo! Xem thêm gợi ý nhỏ bên dưới để bộ phối thêm trọn vẹn nhé.',
    };
  }
}

export const rulesService = new RulesService();
