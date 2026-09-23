import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb } from './tinting';

describe('Canvas Tinting & Color Utilities', () => {
  test('hexToRgb chuyển đổi chính xác mã hex 6 ký tự', () => {
    const rgb = hexToRgb('#9E2A2B');
    assert.deepEqual(rgb, { r: 158, g: 42, b: 43 });
  });

  test('hexToRgb chuyển đổi chính xác mã hex 3 ký tự viết tắt', () => {
    const rgb = hexToRgb('#fff');
    assert.deepEqual(rgb, { r: 255, g: 255, b: 255 });
  });

  test('hexToRgb trả về null khi mã màu không hợp lệ', () => {
    assert.equal(hexToRgb('invalid-hex'), null);
    assert.equal(hexToRgb(''), null);
    assert.equal(hexToRgb('#12'), null);
  });
});
