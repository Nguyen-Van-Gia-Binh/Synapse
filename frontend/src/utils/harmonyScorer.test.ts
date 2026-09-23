import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateColorHarmony } from './harmonyScorer';

describe('Color Harmony Scorer Algorithm', () => {
  test('Đỏ điều + Vàng mướp (Hỏa sinh Thổ) đạt điểm cao và nhận diện Ngũ hành tương sinh', () => {
    // Đỏ điều (#9E2A2B) + Vàng hoa mướp (#E9C46A)
    const result = calculateColorHarmony('#9E2A2B', '#E9C46A');
    assert.ok(result.totalScore >= 85, `Score ${result.totalScore} should be >= 85`);
    assert.equal(result.isGeneratingWuXing, true);
    assert.equal(result.heritageScore, 100);
    assert.ok(result.title.includes('Tương Sinh') || result.title.includes('tương sinh'));
  });

  test('Cặp màu bổ túc (Complementary) có độ tương phản cao nhận diện chính xác', () => {
    // Đỏ (#FF0000) và Cyan (#00FFFF) -> deltaTheta ~ 180
    const result = calculateColorHarmony('#FF0000', '#00FFFF');
    assert.equal(result.hueType, 'COMPLEMENTARY');
    assert.ok(result.contrastScore >= 80);
    assert.ok(result.comment.includes('Tương phản') || result.comment.includes('tương phản'));
  });

  test('Cặp màu tương đồng (Analogous) nhận diện đúng thế màu', () => {
    // Đỏ (#FF0000) và Cam đỏ (#FF4500) -> chênh < 30 độ
    const result = calculateColorHarmony('#FF0000', '#FF4500');
    assert.equal(result.hueType, 'ANALOGOUS');
    assert.equal(result.hueScore, 95);
  });

  test('Trắng ngà + Đen mun (Tương phản sáng tối cực đại) cho điểm tương phản tối đa', () => {
    // #F4F1DE và #1D1E2C
    const result = calculateColorHarmony('#F4F1DE', '#1D1E2C');
    assert.equal(result.contrastScore, 95);
    assert.ok(result.totalScore >= 80);
  });
});
