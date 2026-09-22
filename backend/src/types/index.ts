/**
 * TypeScript Interfaces & DTOs cho Synapse Backend
 * Khớp 100% với đặc tả API-CONTRACTS.md
 */

export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';
export type SlotType = 'HEADWEAR' | 'TOP' | 'BOTTOM' | 'PATTERN' | 'ACCESSORY' | 'FOOTWEAR';
export type RuleSeverity = 'INFO' | 'WARNING';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface ItemDto {
  id: string;
  name: string;
  gender: Gender;
  slot: SlotType;
  layer_order: number;
  image_url: string;
  color_customizable: boolean;
  default_color: string;
  tags: string[];
  created_at?: string;
}

export interface CulturalFactDto {
  id: string;
  item_id: string;
  era: string;
  origin_story: string;
  symbolic_meaning: string;
  modern_styling_tip: string;
}

export interface SlotMap {
  HEADWEAR: string | null;
  TOP: string | null;
  BOTTOM: string | null;
  PATTERN: string | null;
  ACCESSORY: string | null;
  FOOTWEAR: string | null;
}

export interface EvaluateRulesRequestDto {
  gender: Gender;
  slots: SlotMap;
}

export interface RuleViolation {
  rule_code: string;
  trigger_slot: SlotType;
  severity: RuleSeverity;
  message: string;
  suggestion?: {
    target_slot: SlotType;
    action: string;
    recommended_tags?: string[];
  };
}

export interface EvaluateRulesResponseDto {
  is_valid: boolean;
  violations: RuleViolation[];
  encouragement: string;
}

export interface LookbookOutfitData {
  slots: Record<SlotType, { item_id: string; color: string } | null>;
  palette_used: string[];
}

export interface CreateLookbookDto {
  title: string;
  gender: Gender;
  harmony_score: number;
  outfit_data: LookbookOutfitData;
}

export interface LookbookResponseDto extends CreateLookbookDto {
  id: string;
  share_url: string;
  created_at: string;
}
