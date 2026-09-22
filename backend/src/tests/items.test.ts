import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { itemsService } from '../services/items.service';

describe('ItemsService - Catalog & Cultural Fact Logic', () => {
  test('Lấy toàn bộ danh mục phải đủ 8 trang phục theo DATABASE-SCHEMA.sql', async () => {
    const items = await itemsService.getItems();
    assert.equal(items.length, 8);
  });

  test('Lọc theo era = "nguyen" phải trả về các trang phục thời Nguyễn', async () => {
    const items = await itemsService.getItems({ era: 'nguyen' });
    assert.ok(items.length >= 6);
    items.forEach((item) => {
      assert.ok(item.tags.includes('nguyen'));
    });
  });

  test('Lọc theo gender = "FEMALE" chỉ trả về FEMALE và UNISEX', async () => {
    const items = await itemsService.getItems({ gender: 'FEMALE' });
    items.forEach((item) => {
      assert.ok(item.gender === 'FEMALE' || item.gender === 'UNISEX');
      assert.notEqual(item.gender, 'MALE');
    });
  });

  test('Lọc theo slot = "HEADWEAR" chỉ trả về HEADWEAR', async () => {
    const items = await itemsService.getItems({ slot: 'HEADWEAR' });
    assert.ok(items.length >= 2);
    items.forEach((item) => {
      assert.equal(item.slot, 'HEADWEAR');
    });
  });

  test('Lấy chi tiết trang phục theo ID tồn tại và không tồn tại', async () => {
    const item = await itemsService.getItemById('11111111-0000-0000-0000-000000000001');
    assert.ok(item !== null);
    assert.equal(item.name, 'Áo tấc tay thụng thời Nguyễn');

    const notFound = await itemsService.getItemById('non-existent-id');
    assert.equal(notFound, null);
  });

  test('Lấy thông tin Fact văn hóa của Áo Nhật Bình phải có đầy đủ ý nghĩa', async () => {
    const nhatBinhFact = await itemsService.getCulturalFact('11111111-0000-0000-0000-000000000003');
    assert.ok(nhatBinhFact !== null);
    assert.equal(nhatBinhFact.era, 'Triều Nguyễn (Cung đình Huế)');
    assert.ok(nhatBinhFact.symbolic_meaning.includes('Ngũ hành'));
    assert.ok(nhatBinhFact.origin_story.includes('Nhật bình'));
  });

  test('Fact văn hóa cho ID không tồn tại trả về null', async () => {
    const nullFact = await itemsService.getCulturalFact('non-existent-id');
    assert.equal(nullFact, null);
  });
});
