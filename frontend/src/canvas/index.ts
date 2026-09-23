/**
 * Core Canvas Paper-Doll Engine Constants & Types
 * Khung vẽ cố định 800 x 1200 px (tỉ lệ 2:3)
 */

import { SlotType } from '../types';

export const CANVAS_CONFIG = {
  WIDTH: 800,
  HEIGHT: 1200,
  ASPECT_RATIO: 2 / 3,
};

export const LAYER_Z_INDEX: Record<SlotType | 'MANNEQUIN', number> = {
  MANNEQUIN: 0,
  FOOTWEAR: 10,
  BOTTOM: 20,
  TOP: 30,
  PATTERN: 40,
  ACCESSORY: 50,
  HEADWEAR: 60,
};

export interface RenderLayerOptions {
  id: string;
  slot: SlotType | 'MANNEQUIN';
  imageUrl: string;
  color?: string;
  customizable?: boolean;
}

export * from './tinting';
export * from './engine';
export * from './export';
