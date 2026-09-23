import { EvaluateRulesRequestDto, EvaluateRulesResponseDto, RuleViolation, SlotType, CulturalRuleEntity } from '../types';
import { SEED_CULTURAL_RULES } from '../data/cultural-rules.seed';
import { itemsService } from './items.service';
import { supabaseClient, isSupabaseConfigured } from '../config/supabase';

export class RulesService {
  /**
   * Lấy danh sách quy tắc văn hóa (Ưu tiên Supabase, Fallback Seed Data)
   */
  async getRules(): Promise<CulturalRuleEntity[]> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('cultural_rules').select('*');
        if (!error && data && data.length > 0) {
          return data as CulturalRuleEntity[];
        }
        if (error) {
          console.warn('[RulesService] Supabase cultural_rules error, falling back to seed:', error.message);
        }
      } catch (err) {
        console.warn('[RulesService] Supabase cultural_rules exception, falling back to seed:', err);
      }
    }
    return SEED_CULTURAL_RULES;
  }

  /**
   * Đánh giá outfit theo các quy tắc cấm kỵ văn hóa (Guardrails)
   * Tuân thủ sơ đồ Matching Pipeline tại docs/BUSINESS-LOGIC-SPECIFICATION.md mục 3
   */
  async evaluateRules(dto: EvaluateRulesRequestDto): Promise<EvaluateRulesResponseDto> {
    const violations: RuleViolation[] = [];
    const rules = await this.getRules();

    // 1. Thu thập tags của tất cả các món đồ đang mặc trên từng Slot
    const slotItemsMap: Partial<Record<SlotType, { id: string; tags: string[] }>> = {};

    const slotKeys = Object.keys(dto.slots) as SlotType[];
    for (const slot of slotKeys) {
      const itemId = dto.slots[slot];
      if (itemId) {
        const item = await itemsService.getItemById(itemId);
        if (item) {
          slotItemsMap[slot] = {
            id: item.id,
            tags: item.tags || [],
          };
        }
      }
    }

    // 2. So khớp từng quy tắc trong kho dữ liệu di sản
    for (const rule of rules) {
      const triggerSlot = rule.trigger_slot as SlotType;
      const triggerItem = slotItemsMap[triggerSlot];
      // Nếu slot kích hoạt không có đồ mặc -> bỏ qua
      if (!triggerItem) continue;

      // Kiểm tra món đồ có chứa trigger_tag tương ứng không
      const hasTriggerTag = triggerItem.tags.some(
        (t: string) => t.toLowerCase() === rule.trigger_tag.toLowerCase()
      );
      if (!hasTriggerTag) continue;

      // 3. Đánh giá theo Condition
      const { condition } = rule;

      // Điều kiện 1: Thiếu slot bắt buộc đi kèm (vd: Áo ngũ thân thiếu Quần)
      if (condition.type === 'MISSING_SLOT') {
        const requiredSlot = condition.required_slot as SlotType | undefined;
        if (requiredSlot && !dto.slots[requiredSlot]) {
          violations.push({
            rule_code: rule.rule_code,
            trigger_slot: triggerSlot,
            severity: rule.severity,
            message: rule.message,
            suggestion: rule.suggestion || {
              target_slot: requiredSlot,
              action: 'ADD_RECOMMENDED_ITEM',
            },
          });
        }
      }

      // Điều kiện 2: Chứa phụ kiện/món đồ xung khắc (Incompatible tags)
      else if (condition.type === 'INCOMPATIBLE_TAGS') {
        const forbiddenTags = condition.forbidden_tags || [];
        for (const otherSlot of slotKeys) {
          if (otherSlot === triggerSlot) continue;
          const otherItem = slotItemsMap[otherSlot];
          if (otherItem) {
            const hasForbidden = otherItem.tags.some((t: string) =>
              forbiddenTags.map((f: string) => f.toLowerCase()).includes(t.toLowerCase())
            );
            if (hasForbidden) {
              violations.push({
                rule_code: rule.rule_code,
                trigger_slot: triggerSlot,
                severity: rule.severity,
                message: rule.message,
                suggestion: rule.suggestion,
              });
              break;
            }
          }
        }
      }

      // Điều kiện 3: Yêu cầu tag tương thích ở slot đi kèm
      else if (condition.type === 'REQUIRED_TAGS') {
        const requiredSlot = condition.required_slot as SlotType | undefined;
        const requiredTags = condition.required_tags || [];
        if (requiredSlot && dto.slots[requiredSlot]) {
          const targetItem = slotItemsMap[requiredSlot];
          if (targetItem) {
            const hasRequired = targetItem.tags.some((t: string) =>
              requiredTags.map((r: string) => r.toLowerCase()).includes(t.toLowerCase())
            );
            if (!hasRequired) {
              violations.push({
                rule_code: rule.rule_code,
                trigger_slot: triggerSlot,
                severity: rule.severity,
                message: rule.message,
                suggestion: rule.suggestion,
              });
            }
          }
        }
      }
    }

    const isValid = violations.length === 0;

    return {
      is_valid: isValid,
      violations,
      encouragement: isValid
        ? 'Sự kết hợp tuyệt vời! Bạn đã dung hòa hoàn hảo nét trang nghiêm cổ phong với phong cách năng động của Gen Z.'
        : 'Bạn đang tạo nên một nét phá cách thú vị, hãy cân nhắc xem thêm gợi ý nhỏ để giữ trọn vẻ đẹp di sản nhé!',
    };
  }
}

export const rulesService = new RulesService();
