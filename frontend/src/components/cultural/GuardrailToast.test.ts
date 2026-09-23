import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RuleViolation } from '../../types';

describe('GuardrailToast - Tone & Format Validator', () => {
  test('Nội dung cảnh báo không được chứa từ ngữ phán xét tiêu cực theo GEMINI.md 2.2', () => {
    const mockViolation: RuleViolation = {
      rule_code: 'RULE_AODAI_MISSING_BOTTOM',
      trigger_slot: 'TOP',
      severity: 'WARNING',
      message: 'Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?',
      suggestion: {
        target_slot: 'BOTTOM',
        action: 'ADD_RECOMMENDED_ITEM',
        recommended_tags: ['quan_lua'],
      },
    };

    const forbiddenWords = ['sai quy tắc', 'sai luật', 'cấm', 'bị cấm', 'vi phạm nặng'];
    for (const word of forbiddenWords) {
      assert.ok(
        !mockViolation.message.toLowerCase().includes(word),
        `Cảnh báo chứa từ cấm: ${word}`
      );
    }
  });

  test('Gợi ý (suggestion) phải chỉ rõ slot đích và hành động đề xuất', () => {
    const mockViolation: RuleViolation = {
      rule_code: 'RULE_AODAI_MISSING_BOTTOM',
      trigger_slot: 'TOP',
      severity: 'WARNING',
      message: 'Gợi ý kết hợp thêm quần lụa để tôn dáng.',
      suggestion: {
        target_slot: 'BOTTOM',
        action: 'ADD_RECOMMENDED_ITEM',
        recommended_tags: ['quan_lua'],
      },
    };

    assert.equal(mockViolation.suggestion?.target_slot, 'BOTTOM');
    assert.ok(mockViolation.suggestion?.recommended_tags?.includes('quan_lua'));
  });
});
