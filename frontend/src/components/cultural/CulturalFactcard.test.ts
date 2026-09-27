import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CulturalFactDto } from '../../types';

export function validateCulturalFactcard(fact: CulturalFactDto): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!fact.era || fact.era.trim().length === 0) {
    errors.push('Niên đại / Triều đại không được để trống');
  }
  if (!fact.origin_story || fact.origin_story.trim().length === 0) {
    errors.push('Nguồn gốc xuất xứ không được để trống');
  }
  if (!fact.symbolic_meaning || fact.symbolic_meaning.trim().length === 0) {
    errors.push('Ý nghĩa biểu tượng không được để trống');
  }
  if (!fact.modern_styling_tip || fact.modern_styling_tip.trim().length === 0) {
    errors.push('Gợi ý phối đồ Gen Z không được để trống');
  }

  // Cultural Guardrail check: Không dùng từ phán xét tiêu cực theo GEMINI.md mục 2
  const negativeWords = ['sai trái', 'cấm đoán', 'phản cảm', 'lố lăng', 'xúc phạm'];
  const fullText = `${fact.origin_story} ${fact.symbolic_meaning} ${fact.modern_styling_tip}`.toLowerCase();

  for (const word of negativeWords) {
    if (fullText.includes(word)) {
      errors.push(`Nội dung chứa từ ngữ phán xét tiêu cực vi phạm GEMINI.md: "${word}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

describe('Cultural Factcard - Content Integrity & Tone Guardrails', () => {
  test('Thẻ Factcard hợp lệ khi có đầy đủ 4 trường thông tin chuẩn mực', () => {
    const validFact: CulturalFactDto = {
      id: 'fact-001',
      item_id: 'item-001',
      era: 'Triều Nguyễn - Thế kỷ 19',
      origin_story: 'Áo tấc là lễ phục truyền thống thời Nguyễn, được quy định chặt chẽ trong điển chế.',
      symbolic_meaning: 'Tay thụng rộng trang nghiêm thể hiện sự cung kính, ngũ thân tượng trưng cho tứ thân phụ mẫu và bản thân.',
      modern_styling_tip: 'Phối cùng quần âu hiện đại hoặc kính râm mắt tròn để tạo phong cách Retro Đông Dương.',
    };

    const result = validateCulturalFactcard(validFact);
    assert.equal(result.isValid, true);
    assert.equal(result.errors.length, 0);
  });

  test('Từ chối thẻ thiếu trường thông tin bắt buộc', () => {
    const incompleteFact: CulturalFactDto = {
      id: 'fact-002',
      item_id: 'item-002',
      era: '',
      origin_story: 'Nguồn gốc...',
      symbolic_meaning: '',
      modern_styling_tip: 'Gợi ý...',
    };

    const result = validateCulturalFactcard(incompleteFact);
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 2);
  });

  test('Phát hiện và cảnh báo nếu nội dung mang giọng điệu phán xét tiêu cực', () => {
    const judgmentalFact: CulturalFactDto = {
      id: 'fact-003',
      item_id: 'item-003',
      era: 'Triều Nguyễn',
      origin_story: 'Lịch sử...',
      symbolic_meaning: 'Ý nghĩa...',
      modern_styling_tip: 'Mặc kiểu này là sai trái và phản cảm.',
    };

    const result = validateCulturalFactcard(judgmentalFact);
    assert.equal(result.isValid, false);
    assert.ok(result.errors.some((e) => e.includes('phán xét tiêu cực')));
  });
});
