import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { rulesService } from '../services/rules.service';
import { EvaluateRulesRequestDto } from '../types';

describe('RulesService - Guardrails Evaluation Engine', () => {
  test('Áo tấc (TOP) nhưng thiếu Quần (BOTTOM) phải phát hiện vi phạm RULE_AODAI_MISSING_BOTTOM', async () => {
    const request: EvaluateRulesRequestDto = {
      gender: 'FEMALE',
      slots: {
        HEADWEAR: null,
        TOP: '11111111-0000-0000-0000-000000000001', // Áo tấc tay thụng (tags: ao_tac, formal)
        BOTTOM: null,
        PATTERN: null,
        ACCESSORY: null,
        FOOTWEAR: null,
      },
    };

    const result = await rulesService.evaluateRules(request);
    assert.equal(result.is_valid, false);
    assert.ok(result.violations.length >= 1);
    
    const violation = result.violations.find((v) => v.rule_code === 'RULE_AODAI_MISSING_BOTTOM');
    assert.ok(violation);
    assert.equal(violation.trigger_slot, 'TOP');
    assert.equal(violation.severity, 'WARNING');
    assert.ok(violation.message.includes('quần'));
    assert.equal(violation.suggestion?.target_slot, 'BOTTOM');
  });

  test('Bộ phối hợp chuẩn (Áo tấc + Quần lụa) phải trả về is_valid = true và không có vi phạm', async () => {
    const request: EvaluateRulesRequestDto = {
      gender: 'FEMALE',
      slots: {
        HEADWEAR: '33333333-0000-0000-0000-000000000001', // Mấn nhung
        TOP: '11111111-0000-0000-0000-000000000001', // Áo tấc
        BOTTOM: '22222222-0000-0000-0000-000000000001', // Quần lụa trắng
        PATTERN: null,
        ACCESSORY: null,
        FOOTWEAR: null,
      },
    };

    const result = await rulesService.evaluateRules(request);
    assert.equal(result.is_valid, true);
    assert.equal(result.violations.length, 0);
    assert.ok(result.encouragement.length > 10);
  });

  test('Outfit rỗng không kích hoạt cảnh báo sai lệch', async () => {
    const request: EvaluateRulesRequestDto = {
      gender: 'FEMALE',
      slots: {
        HEADWEAR: null,
        TOP: null,
        BOTTOM: null,
        PATTERN: null,
        ACCESSORY: null,
        FOOTWEAR: null,
      },
    };

    const result = await rulesService.evaluateRules(request);
    assert.equal(result.is_valid, true);
    assert.equal(result.violations.length, 0);
  });
});
