# Bảng 8 Màu Cổ Phong & Color Multiply Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tích hợp Bảng 8 màu Cổ phong Việt Nam chuẩn mực, bộ chọn màu tự do Hex Color Picker (Heritage Futurism), cơ chế khóa đổi màu văn hóa (Cultural Guardrail) và hoàn thiện thuật toán nhuộm màu vải Dual Offscreen Canvas Multiply theo tiêu chuẩn [S1.3] của Synapse V-Heritage Studio.

**Architecture:** Tách biệt thành các module rõ ràng: Bộ hằng số di sản (`constants/heritageColors.ts`), thuật toán xử lý pixel Offscreen Canvas (`canvas/tinting.ts`), kiểm soát trạng thái phối màu tập trung trong Zustand (`store/useOutfitStore.ts`), và component giao diện chuyên biệt `ColorBar.tsx` với giao diện kính mờ Glassmorphism, hỗ trợ chọn slot linh hoạt, khóa đổi màu khi gặp trang phục triều đình (`color_customizable = false`) và nhập tay mã Hex tùy ý.

**Tech Stack:** React 18, TypeScript Strict Mode, HTML5 Canvas 2D API (Offscreen Canvas Multiply), Zustand, Tailwind CSS, Lucide React, TSX / Node test runner.

**Spec:** [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md) (Sprint 1, S1.3), [docs/USER-STORY.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USER-STORY.md) (US-03, US-04), [docs/USE-CASE.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USE-CASE.md) (UC-03), [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md) (Mục 1), [GEMINI.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/GEMINI.md) (Mục 3.2).

---

## Global Constraints

- Tuân thủ nghiêm ngặt 8 mã màu Cổ phong: Đỏ điều (`#9E2A2B`), Vàng hoa mướp (`#E9C46A`), Xanh chàm (`#264653`), Xanh cổ vịt (`#2A9D8F`), Tía ngọc (`#5A189A`), Trắng ngà (`#F4F1DE`), Đen mun (`#1D1E2C`), Nâu sồng (`#6F4E37`).
- Bắt buộc kiểm tra cờ `color_customizable`: Nếu `false`, vô hiệu hóa thanh màu và hiển thị thông điệp văn hóa tôn trọng quy chế lịch sử (US-03 Scenario 3.2).
- Thuật toán nhuộm màu sử dụng Offscreen Canvas với `globalCompositeOperation = 'multiply'` và `'destination-in'` để bảo toàn 100% nếp gấp vải và bóng tự nhiên.
- TypeScript Strict Mode 100% (Không dùng kiểu `any`).
- Mọi lệnh thực thi terminal trên Windows bắt buộc chạy qua `cmd /c` và dùng `npm.cmd` / `npx.cmd`.
- Quy tắc Git: Không commit trực tiếp vào `main`. Nhánh phát triển: `feature/S1.3-color-palette-canvas-multiply`.

---

### Task 1: Cấu Hình Test Runner & Xây Dựng Hằng Số Bảng 8 Màu Cổ Phong

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/constants/heritageColors.ts`
- Create: `frontend/src/constants/heritageColors.test.ts`

**Interfaces:**
- Produces: `HeritageColor` interface:
  ```typescript
  export interface HeritageColor {
    id: string;
    name: string;
    hex: string;
    meaning: string;
    description: string;
  }
  ```
- Produces: `HERITAGE_PALETTE: readonly HeritageColor[]` chứa đúng 8 màu chuẩn từ `GEMINI.md`.
- Produces: `isValidHexColor(hex: string): boolean`.

- [ ] **Step 1: Viết bài test kiểm thử hằng số bảng màu và hàm validate hex**

Tạo tệp `frontend/src/constants/heritageColors.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { HERITAGE_PALETTE, isValidHexColor } from './heritageColors';

describe('Heritage Colors & Hex Validation', () => {
  test('HERITAGE_PALETTE phải chứa đúng 8 mã màu chuẩn cổ phong Việt Nam', () => {
    assert.equal(HERITAGE_PALETTE.length, 8);
    
    const expectedHexes = [
      '#9E2A2B', // Đỏ điều
      '#E9C46A', // Vàng hoa mướp
      '#264653', // Xanh chàm
      '#2A9D8F', // Xanh cổ vịt
      '#5A189A', // Tía ngọc
      '#F4F1DE', // Trắng ngà
      '#1D1E2C', // Đen mun
      '#6F4E37', // Nâu sồng
    ];

    const actualHexes = HERITAGE_PALETTE.map((c) => c.hex.toUpperCase());
    for (const hex of expectedHexes) {
      assert.ok(actualHexes.includes(hex.toUpperCase()), `Thiếu mã màu ${hex}`);
    }
  });

  test('isValidHexColor nhận diện chính xác mã hex 3 ký tự và 6 ký tự hợp lệ', () => {
    assert.equal(isValidHexColor('#9E2A2B'), true);
    assert.equal(isValidHexColor('#fff'), true);
    assert.equal(isValidHexColor('#00F5D4'), true);
    assert.equal(isValidHexColor('9E2A2B'), true); // tự bù thăng
    assert.equal(isValidHexColor('#ZZZZZZ'), false);
    assert.equal(isValidHexColor('invalid'), false);
    assert.equal(isValidHexColor(''), false);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Cập nhật `frontend/package.json` thêm `"tsx": "^4.19.3"` trong `devDependencies` và script `"test": "tsx --test \"src/**/*.test.ts\""`.
Chạy lệnh:
```bash
cmd /c "cd frontend && npm.cmd run test"
```
Kỳ vọng: Thất bại do chưa tồn tại module `heritageColors.ts`.

- [ ] **Step 3: Triển khai mã nguồn heritageColors.ts**

Tạo tệp `frontend/src/constants/heritageColors.ts`:
```typescript
export interface HeritageColor {
  id: string;
  name: string;
  hex: string;
  meaning: string;
  description: string;
}

export const HERITAGE_PALETTE: readonly HeritageColor[] = [
  {
    id: 'do-dieu',
    name: 'Đỏ điều',
    hex: '#9E2A2B',
    meaning: 'Tôn nghiêm, May mắn, Phẩm phục',
    description: 'Sắc đỏ thắm truyền thống tượng trưng cho sự tôn nghiêm triều chính và may mắn trong dân gian.',
  },
  {
    id: 'vang-muop',
    name: 'Vàng hoa mướp',
    hex: '#E9C46A',
    meaning: 'Đất mẹ (Hành Thổ), Phú quý, Hưng thịnh',
    description: 'Sắc vàng ấm áp như hoa mướp nở, biểu trưng cho sự trù phú và hưng thịnh của vùng châu thổ.',
  },
  {
    id: 'xanh-cham',
    name: 'Xanh chàm',
    hex: '#264653',
    meaning: 'Thủy ba, Sông nước, Điềm đạm',
    description: 'Màu chàm nhuộm từ thảo mộc sông nước, trầm mặc, uy nghi như sóng thủy ba triều Nguyễn.',
  },
  {
    id: 'xanh-co-vit',
    name: 'Xanh cổ vịt',
    hex: '#2A9D8F',
    meaning: 'Thanh nhã, Quý phái, Cổ kính',
    description: 'Sắc xanh pha lục biếc tự nhiên, biểu trưng cho sự thanh tao và nét quý phái kín đáo.',
  },
  {
    id: 'tia-ngoc',
    name: 'Tía ngọc',
    hex: '#5A189A',
    meaning: 'Hoàng tộc, Huyền bí, Quyền quý',
    description: 'Sắc tím ngọc hoàng gia sâu lắng, gắn liền với phẩm phục cao quý và nét bí ẩn tao nhã.',
  },
  {
    id: 'trang-nga',
    name: 'Trắng ngà',
    hex: '#F4F1DE',
    meaning: 'Lụa tơ tằm, Thuần khiết, Nền nã',
    description: 'Màu sợi tơ tằm thô nguyên bản không tẩy, mang lại cảm giác dịu nhẹ, thanh bạch và thoát tục.',
  },
  {
    id: 'den-mun',
    name: 'Đen mun',
    hex: '#1D1E2C',
    meaning: 'Gỗ mun, Mực thước, Trang trọng',
    description: 'Sắc đen tuyền như gỗ mun quý, mực thước và tôn nghiêm trong các nghi lễ trang trọng.',
  },
  {
    id: 'nau-song',
    name: 'Nâu sồng',
    hex: '#6F4E37',
    meaning: 'Cần lao, Mộc mạc, Dân gian',
    description: 'Màu áo bà ba, áo nâu nhuộm củ nâu dân gian, đại diện cho đức tính cần cù, kiên cường của người Việt.',
  },
] as const;

export function isValidHexColor(hex: string): boolean {
  if (!hex) return false;
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleanHex);
}

export function normalizeHex(hex: string): string {
  const cleanHex = hex.trim();
  return cleanHex.startsWith('#') ? cleanHex.toUpperCase() : `#${cleanHex}`.toUpperCase();
}
```

- [ ] **Step 4: Chạy lại test để xác nhận kiểm thử thành công**

```bash
cmd /c "cd frontend && npm.cmd run test"
```
Kỳ vọng: Test PASS 100%.

- [ ] **Step 5: Commit hằng số bảng màu di sản**

```bash
git add frontend/package.json frontend/src/constants/
git commit -m "feat(palette): định nghĩa bảng 8 màu cổ phong và bộ thẩm định mã hex" -m "Refs: S1.3, US-03"
```

---

### Task 2: Củng Cố & Unit Test Thuật Toán Canvas Nhuộm Màu (Dual Offscreen Tinting)

**Files:**
- Modify: `frontend/src/canvas/tinting.ts`
- Create: `frontend/src/canvas/tinting.test.ts`

**Interfaces:**
- Consumes: `isValidHexColor`, `normalizeHex` từ `frontend/src/constants/heritageColors.ts`.
- Produces: `renderTintedLayer(mainCtx, image, hexColor, customizable): void` bảo toàn nếp vải, fallback an toàn khi mã màu rỗng hoặc `customizable = false`.
- Produces: `hexToRgb(hex: string): { r: number; g: number; b: number } | null`.

- [ ] **Step 1: Viết test harness kiểm thử thuật toán tinting và chuyển đổi màu RGB**

Tạo tệp `frontend/src/canvas/tinting.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb } from './tinting';

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
});
```

- [ ] **Step 2: Chạy test xác nhận test chạy được**

```bash
cmd /c "cd frontend && npm.cmd run test"
```
Kỳ vọng: Test PASS.

- [ ] **Step 3: Cập nhật tinting.ts hoàn thiện xử lý an toàn**

Cập nhật `frontend/src/canvas/tinting.ts`:
- Import `isValidHexColor` và `normalizeHex` từ `../constants/heritageColors`.
- Chuẩn hóa mã hex đầu vào trước khi render.
- Thêm kiểm tra kích thước `image.width > 0 && image.height > 0`.
- Đảm bảo khi `!customizable || !isValidHexColor(hexColor)` thì lập tức vẽ ảnh gốc qua `mainCtx.drawImage(image, 0, 0, WIDTH, HEIGHT)` mà không lãng phí bộ nhớ Offscreen Canvas.

- [ ] **Step 4: Kiểm tra build TypeScript**

```bash
cmd /c "cd frontend && npm.cmd run build"
```
Kỳ vọng: `tsc && vite build` hoàn thành không có lỗi biên dịch.

- [ ] **Step 5: Commit cải tiến thuật toán tinting**

```bash
git add frontend/src/canvas/tinting.ts frontend/src/canvas/tinting.test.ts
git commit -m "feat(canvas): tối ưu hóa thuật toán tinting và bổ sung unit test màu sắc" -m "Refs: S1.3"
```

---

### Task 3: Nâng Cấp Zustand Store Hỗ Trợ Đổi Màu Đa Slot & Khóa Đổi Màu Văn Hóa

**Files:**
- Modify: `frontend/src/store/useOutfitStore.ts`
- Create: `frontend/src/store/useOutfitStore.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  // Thuộc tính mới trong OutfitStoreState:
  selectedSlotForColor: SlotType;
  setSelectedSlotForColor: (slot: SlotType) => void;
  setItemColor: (slot: SlotType, color: string) => void;
  ```
- Ràng buộc nghiệp vụ: `setItemColor` chỉ cho phép đổi màu nếu món đồ tại slot đó có `item.color_customizable === true`. Nếu `false`, không ghi đè màu sắc để bảo vệ tính chính xác văn hóa.

- [ ] **Step 1: Viết test kiểm tra logic đổi màu và khóa bảo vệ văn hóa trong Store**

Tạo tệp `frontend/src/store/useOutfitStore.test.ts`:
```typescript
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
});
```

- [ ] **Step 2: Chạy test xác nhận thất bại do thiếu selectedSlotForColor**

```bash
cmd /c "cd frontend && npm.cmd run test"
```
Kỳ vọng: Thất bại do thuộc tính `selectedSlotForColor` chưa được định nghĩa trong `OutfitStoreState`.

- [ ] **Step 3: Triển khai cập nhật trong useOutfitStore.ts**

Sửa `frontend/src/store/useOutfitStore.ts`:
1. Thêm `selectedSlotForColor: SlotType;` vào `OutfitStoreState`.
2. Thêm `setSelectedSlotForColor: (slot: SlotType) => void;` vào `OutfitStoreState`.
3. Giá trị khởi tạo: `selectedSlotForColor: 'TOP'`.
4. Trong `setItemColor(slot, color)`:
   - Thêm kiểm tra:
     ```typescript
     if (current.item && current.item.color_customizable === false) {
       return state; // Giữ nguyên màu gốc triều đình
     }
     ```
5. Trong `selectItem(slot, item, initialColor)`:
   - Nếu `item.color_customizable === true`, tự động gọi cập nhật `selectedSlotForColor: slot` để người dùng tiện tay đổi màu ngay món vừa chọn.

- [ ] **Step 4: Chạy test để xác nhận hoàn tất**

```bash
cmd /c "cd frontend && npm.cmd run test"
```
Kỳ vọng: Toàn bộ test trong `useOutfitStore.test.ts` PASS 100%.

- [ ] **Step 5: Commit cập nhật Store**

```bash
git add frontend/src/store/useOutfitStore.ts frontend/src/store/useOutfitStore.test.ts
git commit -m "feat(store): bổ sung quản trị slot nhuộm màu và khóa đổi màu văn hóa" -m "Refs: S1.3, US-03"
```

---

### Task 4: Xây Dựng Component ColorBar.tsx Chuẩn Heritage Futurism

**Files:**
- Create: `frontend/src/components/studio/ColorBar.tsx`
- Modify: `frontend/src/components/studio/index.ts` (nếu có export)

**Interfaces:**
- Consumes: `HERITAGE_PALETTE`, `isValidHexColor`, `normalizeHex` từ `../../constants/heritageColors`.
- Consumes: `useOutfitStore` (slots, selectedSlotForColor, setSelectedSlotForColor, setItemColor).
- Produces: Component `ColorBar` hoàn chỉnh đáp ứng:
  1. Hàng nút chọn Slot đang mặc (`TOP`, `BOTTOM`, `HEADWEAR`...) có badge hiển thị tên món đồ.
  2. Bảng 8 chấm màu Cổ phong với tooltip tên văn hóa (`Đỏ điều`, `Vàng hoa mướp`...).
  3. Trạng thái Disable + Banner Tooltip văn hóa khi món đồ có `color_customizable = false`: *"Trang phục giữ nguyên màu gốc theo quy chế triều đình"* (US-03 Scenario 3.2).
  4. Bộ chọn màu Hex tự do (Custom Hex Color Picker) gồm ô nhập mã trực tiếp `#...` kèm xem trước màu sắc (US-04 Scenario 4.1).

- [ ] **Step 1: Viết ColorBar.tsx với đầy đủ tương tác & thẩm mỹ cao**

Tạo `frontend/src/components/studio/ColorBar.tsx`:
- Render danh sách các slot đang có trang phục trên người để người dùng click chuyển slot nhuộm màu nhanh.
- Render 8 chấm màu hình tròn với hiệu ứng scale 125%, active ring vàng hổ phách `ring-2 ring-heritage-yellow`.
- Xử lý trạng thái khóa: Khi món đồ hiện tại có `color_customizable === false`, hiển thị banner mờ kính thủy tinh với icon `Lock` và giải thích: *"Trang phục giữ nguyên màu gốc theo quy chế triều đình"*.
- Thêm ô nhập mã màu tự do có tiền tố `#`, nút mở `<input type="color">` ẩn và nút áp dụng màu Hex.

- [ ] **Step 2: Kiểm tra build TypeScript**

```bash
cmd /c "cd frontend && npm.cmd run build"
```
Kỳ vọng: Không có lỗi type.

- [ ] **Step 3: Commit component ColorBar**

```bash
git add frontend/src/components/studio/ColorBar.tsx
git commit -m "feat(studio): xây dựng component ColorBar chuẩn Heritage Futurism" -m "Refs: S1.3, US-03, US-04"
```

---

### Task 5: Tích Hợp ColorBar Vào Workspace Studio & Tinh Chỉnh Giao Diện Toàn Cục

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/studio/ItemDrawer.tsx`

**Interfaces:**
- Consumes: `ColorBar` từ `./components/studio/ColorBar`.
- Kết nối đồng bộ: Khi người dùng nhấp chọn trang phục trong `ItemDrawer`, tự động đồng bộ sang `ColorBar` để đổi màu ngay tức thì.

- [ ] **Step 1: Cập nhật App.tsx thay thế mã nguồn ColorBar inline cũ**

- Gỡ bỏ khối mã inline `heritagePalette` và các thẻ button màu cũ trong `App.tsx` (dòng 42-51, 66-75, 228-267).
- Nhúng component `<ColorBar />` chuyên biệt vào chính giữa phía dưới màn hình Canvas.
- Dọn sạch các state thừa không còn dùng (`selectedSlotForColor` cục bộ trong `App.tsx`).

- [ ] **Step 2: Cập nhật ItemDrawer.tsx đồng bộ chọn slot nhuộm màu**

- Chuyển `selectedSlotForColor` và `onSelectSlotForColor` sang đọc/ghi trực tiếp từ `useOutfitStore` để loại bỏ prop drilling không cần thiết.

- [ ] **Step 3: Kiểm tra build toàn diện Frontend & Backend**

```bash
cmd /c "cd frontend && npm.cmd run build && cd ../backend && npm.cmd run build"
```
Kỳ vọng: Cả 2 project biên dịch 100% không lỗi.

- [ ] **Step 4: Chạy bộ kiểm thử tự động toàn dự án**

```bash
cmd /c "cd frontend && npm.cmd run test && cd ../backend && npm.cmd run test"
```
Kỳ vọng: Tất cả các bài test frontend và backend đều PASS.

- [ ] **Step 5: Commit hoàn tất task S1.3**

```bash
git add frontend/src/App.tsx frontend/src/components/studio/ItemDrawer.tsx
git commit -m "feat(studio): tích hợp ColorBar chuyên biệt vào Studio Workspace" -m "Refs: S1.3, US-03, US-04, UC-03"
```

---

## Verification Plan

### Automated Build & Unit Tests
```bash
# 1. Chạy toàn bộ unit test frontend
cd frontend
npm.cmd run test

# 2. Kiểm tra type check & bundle build frontend
npm.cmd run build

# 3. Kiểm tra hồi quy backend
cd ../backend
npm.cmd run test
npm.cmd run build
```

### Manual Verification Flow (Studio Workspace)
1. Khởi động hệ thống:
   - Backend: `cd backend && npm.cmd run dev` (Port 5000)
   - Frontend: `cd frontend && npm.cmd run dev` (Port 5173)
2. Mở trình duyệt tại `http://localhost:5173`.
3. Kiểm tra 8 màu cổ phong (US-03):
   - Mặc "Áo tấc tay thụng thời Nguyễn" (Slot `TOP`).
   - Nhấp vào từng chấm màu trong 8 màu cổ phong (`Đỏ điều`, `Vàng hoa mướp`, `Xanh chàm`...).
   - Quan sát Canvas: Tà áo đổi màu mượt mà trong `< 5ms`, các nếp gấp vải và bóng tối 3D vẫn hiển thị rõ ràng, không bị bệt màu.
4. Kiểm tra khóa đổi màu theo quy chế văn hóa (US-03 Scenario 3.2):
   - Trong drawer, chọn trang phục đặc thù có `color_customizable = false` (ví dụ Áo Nhật bình ngũ sắc).
   - Quan sát `ColorBar`: Bảng màu chuyển sang trạng thái làm mờ (disabled), hiển thị biểu tượng ổ khóa và thông điệp: *"Trang phục giữ nguyên màu gốc theo quy chế triều đình"*.
   - Nhấp vào các chấm màu: Màu áo không bị thay đổi.
5. Kiểm tra Custom Hex Color Picker (US-04):
   - Chọn "Quần lụa trắng" (Slot `BOTTOM`).
   - Nhập mã Hex `#00F5D4` (Neon Teal) vào ô input.
   - Quan sát Canvas: Quần chuyển sang tone màu Neon Teal chuẩn xác.
6. Kiểm tra Chuyển Slot Nhuộm Màu:
   - Bấm chuyển đổi giữa các slot `TOP`, `BOTTOM`, `HEADWEAR` trên thanh ColorBar.
   - Nhuộm màu riêng biệt cho từng món đồ trên người mà không làm ảnh hưởng đến các lớp khác.
7. Kiểm tra Undo / Redo:
   - Nhấn Undo -> Màu trang phục quay lại màu trước đó.
   - Nhấn Redo -> Màu trang phục tiến tới màu vừa chọn.
