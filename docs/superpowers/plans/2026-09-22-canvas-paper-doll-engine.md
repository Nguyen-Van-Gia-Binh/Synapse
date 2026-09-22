# Core Canvas Paper-Doll Engine & Mock Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng cỗ máy xếp lớp thời trang HTML5 Canvas 6 slot cố định (Paper-Doll Overlay 800x1200 px), thuật toán nhuộm màu vải Dual Offscreen Canvas Multiply 60 FPS, và bộ Mock Assets chuẩn mực để unblock toàn bộ luồng phối đồ tương tác của Synapse V-Heritage Studio.

**Architecture:** Áp dụng mô hình Paper-Doll Overlay với hệ tọa độ tuyệt đối `(0, 0, 800, 1200)` cho mọi lớp đồ; tách biệt giữa tầng Canvas Rendering Engine (`engine.ts`), bộ xử lý hòa sắc pixel (`tinting.ts`), và trạng thái phản ứng thời gian thực qua Zustand Store (`useOutfitStore.ts`). Hệ thống hỗ trợ bộ nhớ đệm cache ảnh (Image Preloader) chống nhấp nháy (flicker) và tự động co giãn sắc nét trên cả màn hình Desktop và Mobile (High-DPI scaling).

**Tech Stack:** React 18, TypeScript Strict Mode, HTML5 2D Canvas API, Dual Offscreen Canvas, Tailwind CSS, Zustand, Lucide React.

**Spec:** [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md) và [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md).

---

## Global Constraints

- Toàn bộ ảnh Mannequin và các chi tiết trang phục bắt buộc tuân theo khung chuẩn `800 x 1200 px` (tỉ lệ 2:3), định dạng `.png` trong suốt.
- Vẽ Canvas theo thứ tự Z-Index nghiêm ngặt: `MANNEQUIN` (0), `FOOTWEAR` (10), `BOTTOM` (20), `TOP` (30), `PATTERN` (40), `ACCESSORY` (50), `HEADWEAR` (60).
- Thuật toán nhuộm màu sử dụng Dual Offscreen Canvas `globalCompositeOperation = 'multiply'` và `'destination-in'` để bảo toàn nếp gấp vải và đổ bóng tự nhiên.
- TypeScript Strict Mode 100% (Zero `any`).
- Nhánh Git phát triển: `feature/S1.1-core-canvas-engine`.
- Lệnh chạy script trên Windows: bắt buộc dùng `npm.cmd` và `npx.cmd`.

---

### Task 1: Khởi Tạo Nhánh Git & Sinh Bộ Mock Assets Chuẩn 800x1200 px

**Files:**
- Create: `frontend/scripts/generate-mock-assets.mjs`
- Create: `frontend/public/assets/mock/mannequin_female.png`
- Create: `frontend/public/assets/mock/mannequin_male.png`
- Create: `frontend/public/assets/mock/female_ao_tac_top.png`
- Create: `frontend/public/assets/mock/male_ao_ngu_than_top.png`
- Create: `frontend/public/assets/mock/unisex_quan_lua.png`
- Create: `frontend/public/assets/mock/male_khan_dong.png`
- Create: `frontend/public/assets/mock/female_man_nhung.png`
- Create: `frontend/public/assets/mock/unisex_quat_lua.png`

**Interfaces:**
- Produces: 8 tệp ảnh PNG trong suốt độ phân giải chính xác `800 x 1200 px` phục vụ Canvas Engine.

- [ ] **Step 1: Tạo nhánh Git mới theo chuẩn CONTRIBUTING.md**
```bash
git checkout main
git pull origin main
git checkout -b feature/S1.1-core-canvas-engine
```

- [ ] **Step 2: Viết script Node tạo mock transparent PNG assets 800x1200**
Tạo tệp `frontend/scripts/generate-mock-assets.mjs` sử dụng Pure PNG generator / Canvas để vẽ hình bóng silhouette phom mẫu Nam/Nữ và trang phục mẫu theo đúng kích thước `800 x 1200 px`.

- [ ] **Step 3: Chạy script sinh mock assets**
```bash
node frontend/scripts/generate-mock-assets.mjs
```
Kỳ vọng: 8 tệp PNG được tạo trong `frontend/public/assets/mock/` với kích thước 800x1200 px.

- [ ] **Step 4: Commit mock assets**
```bash
git add frontend/scripts/ frontend/public/assets/mock/
git commit -m "asset(assets): bổ sung bộ ảnh mock mannequin và cổ phục chuẩn 800x1200 px" -m "Refs: S0.4, S1.1"
```

---

### Task 2: Xây Dựng Thuật Toán Nhuộm Màu Vải (Dual Offscreen Canvas Tinting)

**Files:**
- Create: `frontend/src/canvas/tinting.ts`
- Create: `frontend/src/canvas/tinting.test.ts`

**Interfaces:**
- Produces: `renderTintedLayer(mainCtx: CanvasRenderingContext2D, image: HTMLImageElement, hexColor: string, customizable: boolean): void`
- Produces: `hexToRgb(hex: string): { r: number; g: number; b: number } | null`

- [ ] **Step 1: Viết test harness cho thuật toán nhuộm màu**
Viết kiểm thử cho hàm chuyển đổi màu hex sang RGB và logic tạo layer Offscreen Canvas.

- [ ] **Step 2: Triển khai mã nguồn tinting.ts**
Hiện thực hàm `renderTintedLayer` tuân thủ 100% thuật toán `globalCompositeOperation = 'multiply'` và `'destination-in'` từ [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md) lines 46-80.

- [ ] **Step 3: Kiểm tra build TypeScript**
```bash
cd frontend
npm.cmd run build
```
Kỳ vọng: Không có lỗi type.

- [ ] **Step 4: Commit module tinting**
```bash
git add frontend/src/canvas/tinting.ts
git commit -m "feat(canvas): triển khai thuật toán nhuộm màu vải Dual Offscreen Canvas" -m "Refs: S1.1, S1.3"
```

---

### Task 3: Xây Dựng Core Canvas Paper-Doll Engine (Xếp Lớp 6 Slot Z-Index)

**Files:**
- Modify: `frontend/src/canvas/index.ts`
- Create: `frontend/src/canvas/engine.ts`

**Interfaces:**
- Produces:
  ```typescript
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
    slot: SlotType | 'MANNEQUIN';
    imageUrl: string;
    color?: string;
    customizable?: boolean;
  }

  export class PaperDollCanvasEngine {
    constructor(canvas: HTMLCanvasElement);
    preloadImages(urls: string[]): Promise<void>;
    renderLayers(layers: RenderLayerOptions[]): Promise<void>;
    exportImageBlob(type?: string, quality?: number): Promise<Blob | null>;
    destroy(): void;
  }
  ```

- [ ] **Step 1: Định nghĩa types & interfaces trong canvas/index.ts**
Định nghĩa cấu hình kích thước chuẩn `CANVAS_CONFIG = { WIDTH: 800, HEIGHT: 1200, ASPECT_RATIO: 2 / 3 }` và `LAYER_Z_INDEX`.

- [ ] **Step 2: Hiện thực PaperDollCanvasEngine trong canvas/engine.ts**
- Cơ chế quản lý bộ nhớ cache ảnh (`Map<string, HTMLImageElement>`).
- Sắp xếp các lớp tự động theo `LAYER_Z_INDEX`.
- Vẽ tuần tự lên context 2D tại tọa độ `(0, 0, 800, 1200)`.
- Tích hợp gọi `renderTintedLayer` đối với các item có cờ `color_customizable: true`.

- [ ] **Step 3: Kiểm tra build TypeScript**
```bash
cd frontend
npm.cmd run build
```
Kỳ vọng: Build pass.

- [ ] **Step 4: Commit Canvas Engine**
```bash
git add frontend/src/canvas/
git commit -m "feat(canvas): hoàn thiện Paper-Doll Engine xếp lớp 6 slot Z-Index" -m "Refs: S1.1"
```

---

### Task 4: Tích Hợp Canvas Engine Vào Viewport Studio & Zustand Store

**Files:**
- Modify: `frontend/src/components/studio/CanvasViewport.tsx`
- Modify: `frontend/src/store/useOutfitStore.ts`

**Interfaces:**
- Consumes: `useOutfitStore` (slots, gender, setItemColor, selectItem).
- Consumes: `PaperDollCanvasEngine` từ `frontend/src/canvas/engine.ts`.

- [ ] **Step 1: Cập nhật CanvasViewport với HTML5 Canvas thật và bộ điều khiển Zoom/Reset**
- Thêm canvas element gắn `ref`.
- Khởi tạo instance `PaperDollCanvasEngine`.
- Lắng nghe sự thay đổi của `slots` và `gender` từ `useOutfitStore` để re-render canvas mượt mà.
- Hỗ trợ zoom in/out (0.5x, 0.75x, 1x, 1.25x) và nút Đặt lại góc nhìn.

- [ ] **Step 2: Cập nhật seed items trong Store & Backend mock**
Cập nhật danh mục trang phục trỏ đúng tới các đường dẫn ảnh mock `800x1200` vừa tạo ở Task 1.

- [ ] **Step 3: Kiểm tra build & runtime**
```bash
cd frontend
npm.cmd run build
```
Kỳ vọng: Build pass 100%.

- [ ] **Step 4: Commit component Viewport**
```bash
git add frontend/src/components/studio/CanvasViewport.tsx frontend/src/store/
git commit -m "feat(canvas): tích hợp Canvas Viewport tương tác 60 FPS với Zustand store" -m "Refs: S1.1"
```

---

### Task 5: Xây Dựng Item Drawer Phân Loại 6 Slot & Color Bar Tương Tác

**Files:**
- Create: `frontend/src/components/studio/ItemDrawer.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: `ItemDrawer` component cho phép duyệt trang phục theo tab slot và click mặc đồ lên người mẫu.

- [ ] **Step 1: Viết ItemDrawer component**
- Tabs: `Tất cả`, `Áo (TOP)`, `Quần (BOTTOM)`, `Mũ & Mấn (HEADWEAR)`, `Phụ kiện (ACCESSORY)`.
- Grid danh sách món đồ kèm ảnh thumbnail và thẻ tag.
- Nút bấm trực quan chọn mặc/tháo đồ.

- [ ] **Step 2: Tích hợp Bảng 8 Màu Cổ Phong tương tác thời gian thực**
- Khi click chọn 1 trong 8 màu cổ phong (`Đỏ điều`, `Vàng hoa mướp`, `Xanh chàm`...), gọi `setItemColor(selectedSlot, hexColor)`.
- Canvas tức thời đổi màu tà áo trong `< 5ms`.

- [ ] **Step 3: Cập nhật App.tsx kết nối toàn bộ luồng Studio**
Gắn `ItemDrawer` vào không gian làm việc chính của Studio, kiểm tra responsive.

- [ ] **Step 4: Kiểm tra build toàn diện**
```bash
cd frontend
npm.cmd run build
cd ../backend
npm.cmd run build
```
Kỳ vọng: Cả frontend và backend đều build thành công.

- [ ] **Step 5: Commit hoàn tất feature**
```bash
git add frontend/
git commit -m "feat(studio): hoàn thiện Drawer phân loại 6 slot và thanh đổi 8 màu cổ phong" -m "Refs: S1.1, S1.3"
```

---

## Verification Plan

### Automated Build & Type Checks
```bash
# Kiểm tra Frontend
cd frontend
npm.cmd run build

# Kiểm tra Backend
cd ../backend
npm.cmd run build
```

### Manual Verification
1. Chạy Backend (`cd backend; npm.cmd run dev`) và Frontend (`cd frontend; npm.cmd run dev`).
2. Mở trình duyệt tại `http://localhost:5173`.
3. Kiểm tra các tương tác:
   - Chuyển đổi giữa Nam Mẫu và Nữ Mẫu -> Canvas cập nhật hình bóng mannequin 800x1200 tương ứng.
   - Mở Drawer chọn Áo ngũ thân -> Áo xuất hiện chính xác trên người mẫu tại vị trí Z-Index 30.
   - Chọn Quần lụa -> Quần xếp lớp bên dưới áo (Z-Index 20).
   - Chọn Khăn đóng -> Khăn đội trên đầu (Z-Index 60).
   - Click chọn màu Đỏ điều hoặc Xanh chàm trên thanh Bảng màu -> Áo ngũ thân đổi màu mượt mà, giữ nguyên chi tiết viền nếp gấp.
   - Bấm nút Undo / Redo -> Các lớp đồ và màu sắc hoàn tác/làm lại trơn tru.
