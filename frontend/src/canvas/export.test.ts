import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  LOOKBOOK_CONFIG,
  calculatePaletteList,
  getLookbookLayout
} from './export';

describe('V-Lookbook 9:16 Export Engine Utilities', () => {
  test('LOOKBOOK_CONFIG phải tuân thủ chuẩn dọc 9:16 độ phân giải 1080x1920', () => {
    assert.equal(LOOKBOOK_CONFIG.WIDTH, 1080);
    assert.equal(LOOKBOOK_CONFIG.HEIGHT, 1920);
    assert.equal(LOOKBOOK_CONFIG.WIDTH / LOOKBOOK_CONFIG.HEIGHT, 9 / 16);
  });

  test('calculatePaletteList trích xuất danh sách màu không trùng lặp kèm tên Cổ phong', () => {
    const rawColors = ['#9E2A2B', '#E9C46A', '#9E2A2B']; // Đỏ điều, Vàng hoa mướp, Đỏ điều trùng
    const palette = calculatePaletteList(rawColors);

    assert.equal(palette.length, 2);
    assert.equal(palette[0].hex, '#9E2A2B');
    assert.equal(palette[0].name, 'Đỏ điều');
    assert.equal(palette[1].hex, '#E9C46A');
    assert.equal(palette[1].name, 'Vàng hoa mướp');
  });

  test('calculatePaletteList hỗ trợ nhận diện màu hiện đại ngoài bảng 8 màu', () => {
    const palette = calculatePaletteList(['#00F5D4']);
    assert.equal(palette.length, 1);
    assert.equal(palette[0].hex, '#00F5D4');
    assert.equal(palette[0].name, 'Sáng tạo');
  });

  test('getLookbookLayout phân bổ các vùng hiển thị hài hòa trong khung 1080x1920', () => {
    const layout = getLookbookLayout();
    // Header phải ở phần trên
    assert.ok(layout.header.y >= 0 && layout.header.y < 200);
    // Mannequin ở trung tâm
    assert.ok(layout.viewport.y >= 150 && layout.viewport.height >= 1000);
    // Footer và Thẻ tri thức ở phần dưới
    assert.ok(layout.footer.y > 1500 && layout.footer.y < 1920);
  });
});
