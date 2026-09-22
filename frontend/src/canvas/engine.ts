/**
 * PaperDollCanvasEngine - Quản lý xếp lớp Canvas theo Z-Index và render 60 FPS
 */

import { CANVAS_CONFIG, LAYER_Z_INDEX, RenderLayerOptions } from './index';
import { renderTintedLayer } from './tinting';

export class PaperDollCanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private pendingRenderId: number | null = null;
  private isDestroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      throw new Error('Không thể khởi tạo CanvasRenderingContext2D');
    }
    this.ctx = context;

    // Thiết lập kích thước pixel thật 800 x 1200
    this.canvas.width = CANVAS_CONFIG.WIDTH;
    this.canvas.height = CANVAS_CONFIG.HEIGHT;
  }

  /**
   * Tải trước một ảnh và lưu vào bộ nhớ cache
   */
  public async preloadImage(url: string): Promise<HTMLImageElement> {
    const existing = this.imageCache.get(url);
    if (existing && existing.complete) {
      return existing;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = (err) => {
        console.warn(`[CanvasEngine] Không thể tải ảnh: ${url}`, err);
        reject(err);
      };
      img.src = url;
    });
  }

  /**
   * Tải trước một danh sách URL ảnh
   */
  public async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map((url) => this.preloadImage(url).catch(() => null));
    await Promise.all(promises);
  }

  /**
   * Vẽ toàn bộ các lớp trang phục lên canvas theo đúng thứ tự Z-Index
   */
  public async renderLayers(layers: RenderLayerOptions[]): Promise<void> {
    if (this.isDestroyed) return;

    // Hủy frame render trước đó nếu đang chờ để tránh race condition
    if (this.pendingRenderId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pendingRenderId);
    }

    // Sắp xếp các lớp từ dưới lên trên theo Z-Index
    const sortedLayers = [...layers].sort((a, b) => {
      const zA = LAYER_Z_INDEX[a.slot] ?? 0;
      const zB = LAYER_Z_INDEX[b.slot] ?? 0;
      return zA - zB;
    });

    // Tải trước toàn bộ ảnh của các lớp đang cần vẽ
    const imageUrls = sortedLayers.map((l) => l.imageUrl).filter(Boolean);
    await this.preloadImages(imageUrls);

    if (this.isDestroyed) return;

    // Thực hiện vẽ trong AnimationFrame để tối ưu 60 FPS
    const executeDraw = () => {
      const { WIDTH, HEIGHT } = CANVAS_CONFIG;

      // 1. Dọn sạch khung vẽ
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // 2. Vẽ tuần tự từng lớp từ dưới lên trên
      for (const layer of sortedLayers) {
        if (!layer.imageUrl) continue;
        const img = this.imageCache.get(layer.imageUrl);
        if (!img || !img.complete || img.naturalWidth === 0) continue;

        if (layer.customizable && layer.color) {
          // Nhuộm màu vải bằng Dual Offscreen Canvas Multiply
          renderTintedLayer(this.ctx, img, layer.color, true);
        } else {
          // Vẽ trực tiếp tại tọa độ gốc (0, 0, 800, 1200)
          this.ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
        }
      }
      this.pendingRenderId = null;
    };

    if (typeof requestAnimationFrame !== 'undefined') {
      this.pendingRenderId = requestAnimationFrame(executeDraw);
    } else {
      executeDraw();
    }
  }

  /**
   * Xuất hình ảnh hiện tại ra Blob PNG độ phân giải 800x1200 px
   */
  public async exportImageBlob(type = 'image/png', quality = 1.0): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  }

  /**
   * Dọn dẹp tài nguyên
   */
  public destroy(): void {
    this.isDestroyed = true;
    if (this.pendingRenderId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pendingRenderId);
    }
    this.imageCache.clear();
  }
}
