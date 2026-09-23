import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb,
  hexToHsl,
  calculateDeltaTheta,
  calculateRelativeLuminance,
  calculateContrastRatio
} from './colorMetrics';

describe('Color Metrics & WCAG Utilities', () => {
  test('hexToRgb chuyển đổi chính xác mã hex sang RGB', () => {
    const rgb = hexToRgb('#9E2A2B');
    assert.deepEqual(rgb, { r: 158, g: 42, b: 43 });

    const white = hexToRgb('#FFF');
    assert.deepEqual(white, { r: 255, g: 255, b: 255 });

    assert.equal(hexToRgb('invalid'), null);
  });

  test('hexToHsl tính toán chính xác góc Hue, Saturation, Lightness', () => {
    // Đỏ điều #9E2A2B -> rgb(158, 42, 43)
    const hsl = hexToHsl('#9E2A2B');
    assert.ok(hsl !== null);
    // Hue gần 359 độ (đỏ đậm), s ~ 58%, l ~ 39%
    assert.ok(hsl.h >= 358 && hsl.h <= 360, `Hue ${hsl.h} should be ~359`);
    assert.ok(hsl.s >= 55 && hsl.s <= 62, `Sat ${hsl.s} should be ~58`);
    assert.ok(hsl.l >= 37 && hsl.l <= 42, `Light ${hsl.l} should be ~39`);

    // Trắng tinh #FFFFFF -> l = 100, s = 0, h = 0
    const whiteHsl = hexToHsl('#FFFFFF');
    assert.ok(whiteHsl !== null);
    assert.equal(whiteHsl.l, 100);
    assert.equal(whiteHsl.s, 0);
  });

  test('calculateDeltaTheta tính góc lệch nhỏ nhất giữa 2 góc Hue (0 - 180)', () => {
    // Góc 10 và góc 350 -> chênh 20 độ (qua mốc 0/360)
    assert.equal(calculateDeltaTheta(10, 350), 20);
    assert.equal(calculateDeltaTheta(350, 10), 20);
    // Góc 30 và góc 90 -> chênh 60 độ
    assert.equal(calculateDeltaTheta(30, 90), 60);
    // Góc 0 và góc 180 -> chênh 180 độ
    assert.equal(calculateDeltaTheta(0, 180), 180);
  });

  test('calculateRelativeLuminance tính độ chói WCAG chuẩn xác', () => {
    const blackL = calculateRelativeLuminance({ r: 0, g: 0, b: 0 });
    assert.equal(blackL, 0);

    const whiteL = calculateRelativeLuminance({ r: 255, g: 255, b: 255 });
    assert.ok(Math.abs(whiteL - 1) < 0.001);
  });

  test('calculateContrastRatio tính tỷ lệ tương phản chuẩn WCAG 2.1', () => {
    // Trắng ngà (#F4F1DE) và Đen mun (#1D1E2C) có tương phản rất cao (>= 7:1)
    const whiteRgb = hexToRgb('#F4F1DE')!;
    const blackRgb = hexToRgb('#1D1E2C')!;
    const ratio = calculateContrastRatio(whiteRgb, blackRgb);
    assert.ok(ratio >= 7, `Contrast ratio ${ratio} must be >= 7`);

    // Hai màu giống hệt nhau tỷ lệ = 1:1
    const sameRatio = calculateContrastRatio(whiteRgb, whiteRgb);
    assert.equal(sameRatio, 1);
  });
});
