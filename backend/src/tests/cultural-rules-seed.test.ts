import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SEED_CULTURAL_RULES } from '../data/cultural-rules.seed';

describe('Cultural Rules Seed Data Integrity', () => {
  test('SEED_CULTURAL_RULES phải chứa tối thiểu 3 quy tắc văn hóa chuẩn triều Nguyễn', () => {
    assert.ok(SEED_CULTURAL_RULES.length >= 3);
  });

  test('Mỗi quy tắc phải có rule_code, trigger_slot, message thân thiện và suggestion', () => {
    for (const rule of SEED_CULTURAL_RULES) {
      assert.ok(rule.rule_code.startsWith('RULE_'));
      assert.ok(rule.trigger_slot);
      assert.ok(rule.message.length > 20);
      assert.ok(rule.suggestion?.target_slot);
      // Đảm bảo tuân thủ GEMINI.md 2.2: Giọng văn thân thiện, không phán xét
      assert.ok(!rule.message.toLowerCase().includes('sai quy tắc'));
      assert.ok(!rule.message.toLowerCase().includes('cấm'));
    }
  });

  test('Chứa quy tắc kiểm tra áo ngũ thân / áo tấc đi cùng quần', () => {
    const aoNguThanRule = SEED_CULTURAL_RULES.find((r) => r.rule_code === 'RULE_AODAI_MISSING_BOTTOM');
    assert.ok(aoNguThanRule);
    assert.equal(aoNguThanRule.trigger_slot, 'TOP');
    assert.equal(aoNguThanRule.condition.type, 'MISSING_SLOT');
    assert.equal(aoNguThanRule.condition.required_slot, 'BOTTOM');
  });
});
