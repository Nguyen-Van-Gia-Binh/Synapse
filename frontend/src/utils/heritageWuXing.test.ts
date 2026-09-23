import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getColorWuXing,
  checkGeneratingRelationship,
  calculateHeritageBonus
} from './heritageWuXing';

describe('Heritage WuXing & Cultural Bonus Utilities', () => {
  test('getColorWuXing ánh xạ chính xác 8 màu Cổ phong sang Ngũ hành', () => {
    assert.equal(getColorWuXing('#F4F1DE'), 'KIM'); // Trắng ngà
    assert.equal(getColorWuXing('#2A9D8F'), 'MOC'); // Xanh cổ vịt
    assert.equal(getColorWuXing('#264653'), 'THUY'); // Xanh chàm
    assert.equal(getColorWuXing('#1D1E2C'), 'THUY'); // Đen mun
    assert.equal(getColorWuXing('#9E2A2B'), 'HOA'); // Đỏ điều
    assert.equal(getColorWuXing('#5A189A'), 'HOA'); // Tía ngọc
    assert.equal(getColorWuXing('#E9C46A'), 'THO'); // Vàng hoa mướp
    assert.equal(getColorWuXing('#6F4E37'), 'THO'); // Nâu sồng
    assert.equal(getColorWuXing('#123456'), null); // Màu hiện đại ngoài bảng
  });

  test('checkGeneratingRelationship kiểm tra chính xác 5 cặp tương sinh', () => {
    // Kim sinh Thủy
    assert.equal(checkGeneratingRelationship('KIM', 'THUY'), true);
    assert.equal(checkGeneratingRelationship('THUY', 'KIM'), true);

    // Thủy sinh Mộc
    assert.equal(checkGeneratingRelationship('THUY', 'MOC'), true);

    // Mộc sinh Hỏa
    assert.equal(checkGeneratingRelationship('MOC', 'HOA'), true);

    // Hỏa sinh Thổ
    assert.equal(checkGeneratingRelationship('HOA', 'THO'), true);

    // Thổ sinh Kim
    assert.equal(checkGeneratingRelationship('THO', 'KIM'), true);

    // Khắc hoặc không tương sinh
    assert.equal(checkGeneratingRelationship('HOA', 'THUY'), false); // Thủy khắc Hỏa
    assert.equal(checkGeneratingRelationship('KIM', 'MOC'), false); // Kim khắc Mộc
  });

  test('calculateHeritageBonus thưởng 100 điểm cho cặp màu Tương Sinh di sản', () => {
    // Đỏ điều (Hỏa) + Vàng hoa mướp (Thổ) -> Hỏa sinh Thổ
    const hoaTho = calculateHeritageBonus('#9E2A2B', '#E9C46A');
    assert.equal(hoaTho.bonusScore, 100);
    assert.equal(hoaTho.isGenerating, true);
    assert.ok(hoaTho.note.includes('Tương sinh') || hoaTho.note.includes('tương sinh'));

    // Trắng ngà (Kim) + Xanh chàm (Thủy) -> Kim sinh Thủy
    const kimThuy = calculateHeritageBonus('#F4F1DE', '#264653');
    assert.equal(kimThuy.bonusScore, 100);
    assert.equal(kimThuy.isGenerating, true);
  });

  test('calculateHeritageBonus chấm điểm phù hợp khi dùng màu hiện đại ngoài bảng', () => {
    // 1 màu cổ phong + 1 màu hiện đại
    const mixed = calculateHeritageBonus('#9E2A2B', '#00F5D4');
    assert.equal(mixed.bonusScore, 50);
    assert.equal(mixed.isGenerating, false);

    // Cả 2 màu đều hiện đại
    const modern = calculateHeritageBonus('#FF00FF', '#00FFFF');
    assert.equal(modern.bonusScore, 30);
    assert.equal(modern.isGenerating, false);
  });
});
