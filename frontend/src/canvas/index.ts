/**
 * Core Canvas Paper-Doll Engine (Placeholder cho Sprint 1)
 * Khung vẽ cố định 800 x 1200 px (tỉ lệ 2:3)
 */

export const CANVAS_CONFIG = {
  WIDTH: 800,
  HEIGHT: 1200,
  ASPECT_RATIO: 2 / 3,
};

export interface CanvasLayer {
  id: string;
  slot: string;
  layerOrder: number;
  imageUrl: string;
  color?: string;
}
