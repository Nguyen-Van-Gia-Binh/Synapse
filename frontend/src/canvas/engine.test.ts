import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { sortLayersByZIndex, LAYER_Z_INDEX, RenderLayerOptions } from './index';

describe('Paper-Doll Canvas Engine - Layer Ordering & Z-Index', () => {
  test('LAYER_Z_INDEX phải định nghĩa đúng 6 slot theo thứ tự phân tầng chuẩn', () => {
    assert.equal(LAYER_Z_INDEX.MANNEQUIN, 0);
    assert.equal(LAYER_Z_INDEX.FOOTWEAR, 10);
    assert.equal(LAYER_Z_INDEX.BOTTOM, 20);
    assert.equal(LAYER_Z_INDEX.TOP, 30);
    assert.equal(LAYER_Z_INDEX.PATTERN, 40);
    assert.equal(LAYER_Z_INDEX.ACCESSORY, 50);
    assert.equal(LAYER_Z_INDEX.HEADWEAR, 60);
  });

  test('sortLayersByZIndex sắp xếp các layer theo thứ tự Z-Index tăng dần', () => {
    const rawLayers: RenderLayerOptions[] = [
      { slot: 'HEADWEAR', imageUrl: '/head.png', zIndex: 60 },
      { slot: 'BOTTOM', imageUrl: '/bottom.png', zIndex: 20 },
      { slot: 'MANNEQUIN', imageUrl: '/mannequin.png', zIndex: 0 },
      { slot: 'TOP', imageUrl: '/top.png', zIndex: 30 },
      { slot: 'ACCESSORY', imageUrl: '/acc.png', zIndex: 50 },
    ];

    const sorted = sortLayersByZIndex(rawLayers);
    const sortedSlots = sorted.map((l) => l.slot);
    assert.deepEqual(sortedSlots, ['MANNEQUIN', 'BOTTOM', 'TOP', 'ACCESSORY', 'HEADWEAR']);
  });

  test('sortLayersByZIndex tự động gán zIndex mặc định nếu layer không chỉ định zIndex', () => {
    const rawLayers: RenderLayerOptions[] = [
      { slot: 'TOP', imageUrl: '/top.png' },
      { slot: 'BOTTOM', imageUrl: '/bottom.png' },
    ];

    const sorted = sortLayersByZIndex(rawLayers);
    assert.equal(sorted[0].slot, 'BOTTOM');
    assert.equal(sorted[1].slot, 'TOP');
  });

  test('sortLayersByZIndex loại bỏ các layer rỗng hoặc không có imageUrl hợp lệ', () => {
    const rawLayers: RenderLayerOptions[] = [
      { slot: 'TOP', imageUrl: '/top.png' },
      { slot: 'BOTTOM', imageUrl: '' },
      { slot: 'HEADWEAR', imageUrl: '   ' },
    ];

    const sorted = sortLayersByZIndex(rawLayers);
    assert.equal(sorted.length, 1);
    assert.equal(sorted[0].slot, 'TOP');
  });
});
