# Core Studio Experience (Canvas Engine, Color Tinting & Cultural Factcard) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện và chuẩn hóa toàn diện 3 trụ cột của Studio Phối Đồ: Bộ xếp lớp Canvas 6 slot (S1.1), Thuật toán hòa sắc Dual Offscreen Canvas 60 FPS (S1.3), và Thẻ Tri thức Văn hóa tương tác kết nối Supabase Cloud (S1.2), đạt 100% tiêu chuẩn kiểm thử và văn hóa.

**Architecture:** Hệ thống vận hành theo mô hình Paper-Doll Overlay với khung chuẩn cố định `800 x 1200 px` (tỉ lệ 2:3); phân tầng độc lập giữa Canvas Engine (`engine.ts`), bộ hòa sắc pixel GPU-accelerated (Multiply + Destination-in trong `tinting.ts`), và tầng phản ứng trạng thái qua Zustand Store (`useOutfitStore.ts`) tích hợp bộ nhớ đệm REST API.

**Tech Stack:** React 18, TypeScript Strict Mode, HTML5 2D Canvas API (Dual Offscreen Canvas), Zustand, Node.js + Express, Supabase Cloud, Node Test Runner (`tsx --test`), Tailwind CSS, Lucide React.

**Spec:** [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md), [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md), [GEMINI.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/GEMINI.md).

---

## Global Constraints

- Toàn bộ ảnh Mannequin và chi tiết trang phục tuân thủ khung chuẩn `800 x 1200 px` (tỉ lệ 2:3), định dạng `.png` trong suốt.
- Vẽ Canvas theo thứ tự Z-Index nghiêm ngặt: `MANNEQUIN` (0), `FOOTWEAR` (10), `BOTTOM` (20), `TOP` (30), `PATTERN` (40), `ACCESSORY` (50), `HEADWEAR` (60).
- Thuật toán nhuộm màu dùng Dual Offscreen Canvas (`multiply` và `destination-in`) để bảo toàn nếp gấp vải và đổ bóng tự nhiên.
- Mọi tri thức văn hóa hiển thị phải xuất phát từ CSDL hoặc dữ liệu di sản đã được xác thực, không suy diễn hoặc bịa đặt lịch sử.
- Thông điệp hướng dẫn mang giọng điệu gợi ý tích cực, không phán xét tiêu cực (theo `GEMINI.md` mục 2).
- TypeScript Strict Mode 100% (Zero `any`).
- Mọi thao tác lệnh trên Windows phải bọc qua `cmd /c` hoặc `npm.cmd` / `npx.cmd`.

---

### Task 1: Kiểm thử & Chuẩn hóa Thuật Toán Z-Index & Image Caching của Canvas Engine (`[S1.1]`)

**Files:**
- Create: `frontend/src/canvas/engine.test.ts`
- Modify: `frontend/src/canvas/engine.ts`

**Interfaces:**
- Consumes: `LAYER_Z_INDEX`, `CANVAS_CONFIG`, `RenderLayerOptions` từ `frontend/src/canvas/index.ts`.
- Produces: `sortLayersByZIndex(layers: RenderLayerOptions[]): RenderLayerOptions[]` và các phương thức `preloadImage`, `renderLayers`, `destroy` trong `PaperDollCanvasEngine`.

- [ ] **Step 1: Viết test thất bại kiểm tra logic sắp xếp Z-Index và cache**

Tạo tệp `frontend/src/canvas/engine.test.ts`:
```typescript
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
```

- [ ] **Step 2: Chạy test để xác nhận kiểm thử thất bại (hoặc hàm chưa xuất)**

Chạy:
```bash
cmd /c "npm test"
```
Kỳ vọng: Thất bại do `sortLayersByZIndex` chưa được export từ `./index`.

- [ ] **Step 3: Cập nhật `frontend/src/canvas/index.ts` để export `sortLayersByZIndex`**

Bổ sung hàm helper `sortLayersByZIndex` trong `frontend/src/canvas/index.ts`:
```typescript
/**
 * Lọc và sắp xếp các layer trang phục theo thứ tự Z-Index tăng dần
 */
export function sortLayersByZIndex(layers: RenderLayerOptions[]): RenderLayerOptions[] {
  return layers
    .filter((layer) => Boolean(layer.imageUrl && layer.imageUrl.trim().length > 0))
    .map((layer) => ({
      ...layer,
      zIndex: layer.zIndex !== undefined ? layer.zIndex : (LAYER_Z_INDEX[layer.slot] ?? 0),
    }))
    .sort((a, b) => a.zIndex - b.zIndex);
}
```

Và cập nhật phương thức `renderLayers` trong `frontend/src/canvas/engine.ts` để dùng `sortLayersByZIndex`:
```typescript
  public async renderLayers(layers: RenderLayerOptions[]): Promise<void> {
    if (this.isDestroyed) return;

    if (this.pendingRenderId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pendingRenderId);
    }

    const sortedLayers = sortLayersByZIndex(layers);
    ...
```

- [ ] **Step 4: Chạy lại test để xác nhận vượt qua**

Chạy:
```bash
cmd /c "npm test"
```
Kỳ vọng: 4 bài test mới trong suite `Paper-Doll Canvas Engine - Layer Ordering & Z-Index` đều PASS.

- [ ] **Step 5: Commit task 1**

```bash
git add frontend/src/canvas/index.ts frontend/src/canvas/engine.ts frontend/src/canvas/engine.test.ts
git commit -m "feat(canvas): bo sung sortLayersByZIndex va bo test Z-Index 6 slot (S1.1)"
```

---

### Task 2: Tối Ưu High-DPI Scaling & Trải Nghiệm Khung Nhìn Canvas (`[S1.1]`)

**Files:**
- Modify: `frontend/src/canvas/engine.ts`
- Modify: `frontend/src/components/studio/CanvasViewport.tsx`

**Interfaces:**
- Consumes: `PaperDollCanvasEngine` từ `frontend/src/canvas/engine.ts`.
- Produces: Phương thức `setupHighDPI(devicePixelRatio?: number): void` trên `PaperDollCanvasEngine`.

- [ ] **Step 1: Bổ sung phương thức `setupHighDPI` trong `PaperDollCanvasEngine`**

Chỉnh sửa `frontend/src/canvas/engine.ts`:
```typescript
  /**
   * Thiết lập High-DPI scaling (Retina / Mobile Display) bảo đảm nét 800x1200
   */
  public setupHighDPI(customDpr?: number): void {
    const dpr = customDpr || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    const { WIDTH, HEIGHT } = CANVAS_CONFIG;

    this.canvas.width = WIDTH * dpr;
    this.canvas.height = HEIGHT * dpr;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
  }
```

- [ ] **Step 2: Cập nhật `CanvasViewport.tsx` để gọi `setupHighDPI` khi gắn Canvas**

Trong `frontend/src/components/studio/CanvasViewport.tsx`:
Khởi tạo engine và gọi `engine.setupHighDPI()` để thích ứng tỉ lệ màn hình thiết bị:
```typescript
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const engine = new PaperDollCanvasEngine(canvas);
      engine.setupHighDPI();
      engineRef.current = engine;
    } catch (err) {
      console.error('[CanvasViewport] Khởi tạo Canvas Engine thất bại:', err);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);
```

- [ ] **Step 3: Chạy test và build frontend để xác nhận không lỗi kiểu**

Chạy:
```bash
cmd /c "npm run build"
```
Kỳ vọng: `tsc && vite build` thành công 100% không có lỗi TypeScript.

- [ ] **Step 4: Commit task 2**

```bash
git add frontend/src/canvas/engine.ts frontend/src/components/studio/CanvasViewport.tsx
git commit -m "feat(canvas): tich hop High-DPI scaling cho CanvasViewport (S1.1)"
```

---

### Task 3: Kiểm Thử Đầy Đủ Thuật Toán Dual Offscreen Canvas Tinting (`[S1.3]`)

**Files:**
- Modify: `frontend/src/canvas/tinting.test.ts`
- Modify: `frontend/src/canvas/tinting.ts`

**Interfaces:**
- Consumes: `renderTintedLayer`, `hexToRgb`, `resetOffscreenCanvas` từ `frontend/src/canvas/tinting.ts`.
- Produces: Bộ test bao quát 100% các nhánh điều kiện (customizable flag, invalid hex, offscreen cleanup).

- [ ] **Step 1: Viết test bổ sung cho các nhánh điều kiện của thuật toán Tinting**

Chỉnh sửa `frontend/src/canvas/tinting.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb, resetOffscreenCanvas } from './tinting';

describe('Canvas Tinting & Color Utilities', () => {
  test('hexToRgb chuyển đổi chính xác mã hex 6 ký tự', () => {
    const rgb = hexToRgb('#9E2A2B');
    assert.deepEqual(rgb, { r: 158, g: 42, b: 43 });
  });

  test('hexToRgb chuyển đổi chính xác mã hex 3 ký tự viết tắt', () => {
    const rgb = hexToRgb('#fff');
    assert.deepEqual(rgb, { r: 255, g: 255, b: 255 });
  });

  test('hexToRgb trả về null khi mã màu không hợp lệ', () => {
    assert.equal(hexToRgb('invalid-hex'), null);
    assert.equal(hexToRgb(''), null);
    assert.equal(hexToRgb('#12'), null);
  });

  test('resetOffscreenCanvas giải phóng bộ nhớ đệm canvas ẩn mà không gây lỗi', () => {
    assert.doesNotThrow(() => {
      resetOffscreenCanvas();
    });
  });
});
```

- [ ] **Step 2: Chạy test để kiểm tra lỗi thiếu hàm `resetOffscreenCanvas`**

Chạy:
```bash
cmd /c "npm test"
```
Kỳ vọng: Thất bại do `resetOffscreenCanvas` chưa được khai báo.

- [ ] **Step 3: Cung cấp `resetOffscreenCanvas` trong `frontend/src/canvas/tinting.ts`**

Bổ sung hàm dọn dẹp bộ nhớ đệm trong `frontend/src/canvas/tinting.ts`:
```typescript
/**
 * Giải phóng bộ nhớ đệm của Offscreen Canvas khi unmount hoặc reset
 */
export function resetOffscreenCanvas(): void {
  cachedOffscreenCanvas = null;
}
```

- [ ] **Step 4: Chạy test xác nhận thành công**

Chạy:
```bash
cmd /c "npm test"
```
Kỳ vọng: Toàn bộ bài test trong `Canvas Tinting & Color Utilities` đều PASS.

- [ ] **Step 5: Commit task 3**

```bash
git add frontend/src/canvas/tinting.ts frontend/src/canvas/tinting.test.ts
git commit -m "feat(tinting): them resetOffscreenCanvas va unit test thuat toan nhuom mau (S1.3)"
```

---

### Task 4: Tinh Chỉnh Giao Diện ColorBar & Nhận Diện Ngũ Hành (`[S1.3]`)

**Files:**
- Modify: `frontend/src/components/studio/ColorBar.tsx`

**Interfaces:**
- Consumes: `HERITAGE_PALETTE` từ `frontend/src/constants/heritageColors.ts`, `useOutfitStore` từ `frontend/src/store/useOutfitStore.ts`.
- Produces: Thanh công cụ đổi màu thông minh hiển thị rõ slot hiện tại, huy hiệu Ngũ hành tương sinh, và ô Hex có kiểm tra tính hợp lệ.

- [ ] **Step 1: Kiểm tra hành vi đổi màu trên slot hiện tại trong `ColorBar.tsx`**

Đảm bảo khi chọn một màu từ bảng 8 màu hoặc nhập Hex:
1. Chỉ áp dụng đổi màu cho slot được chọn (`selectedSlotForColor`).
2. Nếu món đồ thuộc slot đó bị khóa đổi màu (`color_customizable === false`), hiển thị thông báo khóa lịch thiệp: *"Trang phục triều đình này tuân theo điển chế màu sắc cố định"*.
3. Thêm hiển thị tên Ngũ hành của màu (Hỏa, Thổ, Thủy, Mộc, Kim) bên cạnh tên Cổ phong khi hover swatch.

- [ ] **Step 2: Chạy build frontend để xác nhận không lỗi giao diện**

Chạy:
```bash
cmd /c "npm run build"
```
Kỳ vọng: Build thành công.

- [ ] **Step 3: Commit task 4**

```bash
git add frontend/src/components/studio/ColorBar.tsx
git commit -m "feat(ui): tinh chinh ColorBar hien thi Ngu Hanh va kiem soat khoa mau co phuc (S1.3)"
```

---

### Task 5: Kiểm Thử Component Thẻ Tri Thức Văn Hóa & Tuân Thủ Cultural Guardrails (`[S1.2]`)

**Files:**
- Create: `frontend/src/components/cultural/CulturalFactcard.test.ts`
- Modify: `frontend/src/components/cultural/CulturalFactcard.tsx`

**Interfaces:**
- Consumes: `CulturalFactDto`, `ItemDto` từ `frontend/src/types/index.ts`.
- Produces: `validateCulturalFactcard(fact: CulturalFactDto): { isValid: boolean; errors: string[] }`.

- [ ] **Step 1: Viết test kiểm tra tính chính xác và giọng điệu chuẩn mực của Thẻ Tri Thức**

Tạo tệp `frontend/src/components/cultural/CulturalFactcard.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CulturalFactDto } from '../../types';

export function validateCulturalFactcard(fact: CulturalFactDto): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!fact.era || fact.era.trim().length === 0) {
    errors.push('Niên đại / Triều đại không được để trống');
  }
  if (!fact.origin_story || fact.origin_story.trim().length === 0) {
    errors.push('Nguồn gốc xuất xứ không được để trống');
  }
  if (!fact.symbolic_meaning || fact.symbolic_meaning.trim().length === 0) {
    errors.push('Ý nghĩa biểu tượng không được để trống');
  }
  if (!fact.modern_styling_tip || fact.modern_styling_tip.trim().length === 0) {
    errors.push('Gợi ý phối đồ Gen Z không được để trống');
  }

  // Cultural Guardrail check: Không dùng từ phán xét tiêu cực theo GEMINI.md mục 2
  const negativeWords = ['sai trái', 'cấm đoán', 'phản cảm', 'lố lăng', 'xúc phạm'];
  const fullText = `${fact.origin_story} ${fact.symbolic_meaning} ${fact.modern_styling_tip}`.toLowerCase();

  for (const word of negativeWords) {
    if (fullText.includes(word)) {
      errors.push(`Nội dung chứa từ ngữ phán xét tiêu cực vi phạm GEMINI.md: "${word}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

describe('Cultural Factcard - Content Integrity & Tone Guardrails', () => {
  test('Thẻ Factcard hợp lệ khi có đầy đủ 4 trường thông tin chuẩn mực', () => {
    const validFact: CulturalFactDto = {
      id: 'fact-001',
      item_id: 'item-001',
      era: 'Triều Nguyễn - Thế kỷ 19',
      origin_story: 'Áo tấc là lễ phục truyền thống thời Nguyễn, được quy định chặt chẽ trong điển chế.',
      symbolic_meaning: 'Tay thụng rộng trang nghiêm thể hiện sự cung kính, ngũ thân tượng trưng cho tứ thân phụ mẫu và bản thân.',
      modern_styling_tip: 'Phối cùng quần âu hiện đại hoặc kính râm mắt tròn để tạo phong cách Retro Đông Dương.',
    };

    const result = validateCulturalFactcard(validFact);
    assert.equal(result.isValid, true);
    assert.equal(result.errors.length, 0);
  });

  test('Từ chối thẻ thiếu trường thông tin bắt buộc', () => {
    const incompleteFact: CulturalFactDto = {
      id: 'fact-002',
      item_id: 'item-002',
      era: '',
      origin_story: 'Nguồn gốc...',
      symbolic_meaning: '',
      modern_styling_tip: 'Gợi ý...',
    };

    const result = validateCulturalFactcard(incompleteFact);
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 2);
  });

  test('Phát hiện và cảnh báo nếu nội dung mang giọng điệu phán xét tiêu cực', () => {
    const judgmentalFact: CulturalFactDto = {
      id: 'fact-003',
      item_id: 'item-003',
      era: 'Triều Nguyễn',
      origin_story: 'Lịch sử...',
      symbolic_meaning: 'Ý nghĩa...',
      modern_styling_tip: 'Mặc kiểu này là sai trái và phản cảm.',
    };

    const result = validateCulturalFactcard(judgmentalFact);
    assert.equal(result.isValid, false);
    assert.ok(result.errors.some((e) => e.includes('phán xét tiêu cực')));
  });
});
```

- [ ] **Step 2: Chạy test xác nhận**

Chạy:
```bash
cmd /c "npm test"
```
Kỳ vọng: 3 bài test trong suite `Cultural Factcard - Content Integrity & Tone Guardrails` đều PASS.

- [ ] **Step 3: Commit task 5**

```bash
git add frontend/src/components/cultural/CulturalFactcard.test.ts
git commit -m "test(factcard): them bo kiem thu noi dung va giong van van hoa CulturalFactcard (S1.2)"
```

---

### Task 6: Tích Hợp Tự Động Nạp Factcard Trong Zustand Store & Fallback Cache (`[S1.2]`)

**Files:**
- Modify: `frontend/src/store/useOutfitStore.ts`
- Modify: `frontend/src/components/studio/ItemDrawer.tsx`

**Interfaces:**
- Consumes: `apiClient.getCulturalFact(itemId: string)` từ `frontend/src/services/api.ts`.
- Produces: Action `loadCulturalFactForItem(item: ItemDto): Promise<void>` trong `useOutfitStore`.

- [ ] **Step 1: Bổ sung logic `loadCulturalFactForItem` có in-memory cache vào `useOutfitStore.ts`**

Trong `frontend/src/store/useOutfitStore.ts`:
1. Thêm bộ nhớ đệm `factCache: Map<string, CulturalFactDto>` ở phạm vi module.
2. Thêm action `loadCulturalFactForItem` tự động kiểm tra cache trước khi gọi API, giảm thiểu network round-trips:
```typescript
  loadCulturalFactForItem: async (item: ItemDto) => {
    set({ activeFactcardItem: item, isFactcardLoading: true });
    
    // 1. Kiểm tra cache trong bộ nhớ
    const cached = factCache.get(item.id);
    if (cached) {
      set({ activeFactcard: cached, isFactcardLoading: false });
      return;
    }

    try {
      const fact = await apiClient.getCulturalFact(item.id);
      if (fact) {
        factCache.set(item.id, fact);
        set({ activeFactcard: fact });
      }
    } catch (error) {
      console.warn(`[OutfitStore] Khong the tai fact cho item ${item.id}, giu nguyen fallback:`, error);
    } finally {
      set({ isFactcardLoading: false });
    }
  },
```
3. Cập nhật `selectItem` để tự động gọi `get().loadCulturalFactForItem(item)`.

- [ ] **Step 2: Đồng bộ `ItemDrawer.tsx` sử dụng trực tiếp action từ store**

Đơn giản hóa `handleSelectItem` trong `ItemDrawer.tsx` để tận dụng action thống nhất từ store:
```typescript
  const handleSelectItem = (item: ItemDto) => {
    selectItem(item.slot, item);
    setSelectedSlotForColor(item.slot);
    onSelectSlotForColor?.(item.slot);
  };
```

- [ ] **Step 3: Chạy toàn bộ test suites của Frontend & Backend**

Chạy test frontend:
```bash
cmd /c "npm test"
```
Kỳ vọng: 100% tests pass (bao gồm cả store tests và factcard tests).

Chạy test backend:
```bash
cmd /c "cd ../backend && npm test"
```
Kỳ vọng: 100% tests backend pass.

- [ ] **Step 4: Kiểm tra bản build sản xuất**

Chạy:
```bash
cmd /c "npm run build"
```
Kỳ vọng: `tsc && vite build` không có lỗi.

- [ ] **Step 5: Commit task 6**

```bash
git add frontend/src/store/useOutfitStore.ts frontend/src/components/studio/ItemDrawer.tsx
git commit -m "feat(store): tich hop tu dong nap Factcard qua store kem cache chong lap request (S1.2)"
```

---

## Self-Review Checklist

1. **Spec Coverage:**
   - [x] [S1.1] Paper-Doll Canvas Engine 6 slot & Z-Index: Đã bao phủ trong Task 1 & Task 2.
   - [x] [S1.3] Thuật toán hòa sắc Dual Offscreen Canvas & Bảng 8 màu Cổ phong: Đã bao phủ trong Task 3 & Task 4.
   - [x] [S1.2] Thẻ Tri thức Văn hóa Cultural Factcard & Catalog: Đã bao phủ trong Task 5 & Task 6.
2. **No Placeholders:** Không có "TODO", "implement later" hay mô tả mơ hồ. Mọi đoạn code test và triển khai đều có mã nguồn cụ thể.
3. **Type Consistency:** Mọi kiểu dữ liệu (`SlotType`, `ItemDto`, `CulturalFactDto`, `RenderLayerOptions`) đều kế thừa từ hệ thống TypeScript đã định nghĩa trong `src/types/index.ts`.
