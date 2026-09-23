import { CulturalRuleEntity } from '../types';

export const SEED_CULTURAL_RULES: CulturalRuleEntity[] = [
  {
    id: 'rule-001',
    rule_code: 'RULE_AODAI_MISSING_BOTTOM',
    trigger_slot: 'TOP',
    trigger_tag: 'ao_tac',
    condition: {
      type: 'MISSING_SLOT',
      required_slot: 'BOTTOM',
    },
    severity: 'WARNING',
    message: 'Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?',
    suggestion: {
      target_slot: 'BOTTOM',
      action: 'ADD_RECOMMENDED_ITEM',
      recommended_tags: ['silk', 'quan_lua', 'quan_ong_rong'],
    },
  },
  {
    id: 'rule-002',
    rule_code: 'RULE_AODAI_NGUTHAN_BOTTOM',
    trigger_slot: 'TOP',
    trigger_tag: 'ao_ngu_than',
    condition: {
      type: 'MISSING_SLOT',
      required_slot: 'BOTTOM',
    },
    severity: 'WARNING',
    message: 'Áo dài ngũ thân tay chẽn đi cùng quần lụa sẽ tôn lên nét nho nhã, mực thước đúng phong thái cổ nhân.',
    suggestion: {
      target_slot: 'BOTTOM',
      action: 'ADD_RECOMMENDED_ITEM',
      recommended_tags: ['quan_lua', 'silk'],
    },
  },
  {
    id: 'rule-003',
    rule_code: 'RULE_NHATBINH_SUGGEST_HEADWEAR',
    trigger_slot: 'TOP',
    trigger_tag: 'nhat_binh',
    condition: {
      type: 'MISSING_SLOT',
      required_slot: 'HEADWEAR',
    },
    severity: 'INFO',
    message: 'Áo Nhật bình lộng lẫy thời Nguyễn khi phối cùng Mấn nhung sẽ tôn vinh trọn vẹn nét quý phái cung đình xưa.',
    suggestion: {
      target_slot: 'HEADWEAR',
      action: 'ADD_RECOMMENDED_ITEM',
      recommended_tags: ['man_nhung', 'khan_vanh'],
    },
  },
  {
    id: 'rule-004',
    rule_code: 'RULE_KHAN_DONG_MEN',
    trigger_slot: 'TOP',
    trigger_tag: 'nam',
    condition: {
      type: 'MISSING_SLOT',
      required_slot: 'HEADWEAR',
    },
    severity: 'INFO',
    message: 'Một chiếc khăn đóng chữ Nhất truyền thống sẽ giúp diện mạo ngũ thân tay chẽn của bạn thêm phần đĩnh đạc và phong độ.',
    suggestion: {
      target_slot: 'HEADWEAR',
      action: 'ADD_RECOMMENDED_ITEM',
      recommended_tags: ['khan_dong'],
    },
  },
];
