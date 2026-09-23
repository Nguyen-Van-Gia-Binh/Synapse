import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { useOutfitStore } from './useOutfitStore';
import { ItemDto } from '../types';

const mockCustomizableItem: ItemDto = {
  id: 'item-1',
  name: 'Áo tấc truyền thống',
  gender: 'FEMALE',
  slot: 'TOP',
  layer_order: 30,
  image_url: '/assets/mock/female_ao_tac_top.png',
  color_customizable: true,
  default_color: '#9E2A2B',
  tags: ['ao_tac'],
};

const mockLockedItem: ItemDto = {
  id: 'item-2',
  name: 'Áo Nhật bình ngũ sắc hoàng cung',
  gender: 'FEMALE',
  slot: 'TOP',
  layer_order: 30,
  image_url: '/assets/mock/female_nhat_binh.png',
  color_customizable: false,
  default_color: '#E9C46A',
  tags: ['nhat_binh'],
};

describe('Outfit Store - Color Management & Cultural Guardrails', () => {
  test('Đổi màu thành công đối với trang phục cho phép tùy biến (color_customizable = true)', () => {
    const store = useOutfitStore.getState();
    store.resetOutfit();
    store.selectItem('TOP', mockCustomizableItem);

    store.setItemColor('TOP', '#264653');
    const updated = useOutfitStore.getState().slots.TOP;
    assert.equal(updated?.color, '#264653');
  });

  test('Từ chối đổi màu khi trang phục bị khóa theo quy chế văn hóa (color_customizable = false)', () => {
    const store = useOutfitStore.getState();
    store.resetOutfit();
    store.selectItem('TOP', mockLockedItem);

    store.setItemColor('TOP', '#9E2A2B'); // Cố tình đổi màu khác
    const updated = useOutfitStore.getState().slots.TOP;
    assert.equal(updated?.color, '#E9C46A'); // Vẫn giữ nguyên default_color hoàng cung
  });

  test('Chuyển đổi selectedSlotForColor cập nhật chính xác slot cần nhuộm', () => {
    const store = useOutfitStore.getState();
    store.setSelectedSlotForColor('BOTTOM');
    assert.equal(useOutfitStore.getState().selectedSlotForColor, 'BOTTOM');
  });

  test('evaluateGuardrails phát hiện vi phạm khi chỉ mặc áo mà không mặc quần', async () => {
    const store = useOutfitStore.getState();
    store.resetOutfit();
    store.selectItem('TOP', mockCustomizableItem);
    await store.evaluateGuardrails();

    const violations = useOutfitStore.getState().violations;
    assert.ok(violations.length >= 1);
    assert.equal(violations[0].trigger_slot, 'TOP');
    assert.equal(violations[0].rule_code, 'RULE_AODAI_MISSING_BOTTOM');
  });
});
