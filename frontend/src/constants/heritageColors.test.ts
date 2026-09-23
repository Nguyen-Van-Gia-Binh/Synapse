import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { HERITAGE_PALETTE, isValidHexColor, normalizeHex } from './heritageColors';

describe('Heritage Colors & Hex Validation', () => {
  test('HERITAGE_PALETTE phải chứa đúng 8 mã màu chuẩn cổ phong Việt Nam', () => {
    assert.equal(HERITAGE_PALETTE.length, 8);
    
    const expectedHexes = [
      '#9E2A2B', // Đỏ điều
      '#E9C46A', // Vàng hoa mướp
      '#264653', // Xanh chàm
      '#2A9D8F', // Xanh cổ vịt
      '#5A189A', // Tía ngọc
      '#F4F1DE', // Trắng ngà
      '#1D1E2C', // Đen mun
      '#6F4E37', // Nâu sồng
    ];

    const actualHexes = HERITAGE_PALETTE.map((c) => c.hex.toUpperCase());
    for (const hex of expectedHexes) {
      assert.ok(actualHexes.includes(hex.toUpperCase()), `Thiếu mã màu ${hex}`);
    }
  });

  test('isValidHexColor nhận diện chính xác mã hex 3 ký tự và 6 ký tự hợp lệ', () => {
    assert.equal(isValidHexColor('#9E2A2B'), true);
    assert.equal(isValidHexColor('#fff'), true);
    assert.equal(isValidHexColor('#00F5D4'), true);
    assert.equal(isValidHexColor('9E2A2B'), true);
    assert.equal(isValidHexColor('#ZZZZZZ'), false);
    assert.equal(isValidHexColor('invalid'), false);
    assert.equal(isValidHexColor(''), false);
  });

  test('normalizeHex chuẩn hóa mã màu viết hoa và bổ sung dấu thăng', () => {
    assert.equal(normalizeHex('9e2a2b'), '#9E2A2B');
    assert.equal(normalizeHex('#e9c46a'), '#E9C46A');
  });
});
