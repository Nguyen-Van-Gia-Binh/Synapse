# API Catalog & Cultural Factcard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện toàn bộ API Catalog trang phục (`GET /api/items`, `GET /api/items/:id`) và API Tri thức văn hóa (`GET /api/items/:id/facts`), cùng giao diện Thẻ Cultural Factcard chuyên sâu tại Right Sidebar và Micro-Tooltip trong Drawer theo tiêu chuẩn "Heritage Futurism".

**Architecture:** Tách biệt rõ ràng 3 tầng: Backend Service & Controller bọc chuẩn Envelope JSON; Frontend Zustand State Management quản lý đồng bộ trạng thái Factcard và trang phục đang chọn; UI Factcard được thiết kế trang nhã với typography có chân (*Playfair/Cinzel*), tích hợp Skeleton loading mượt mà và tương tác hai chiều (Drawer $\leftrightarrow$ Canvas $\leftrightarrow$ Inspector).

**Tech Stack:** Node.js, Express, TypeScript Strict Mode, React 18, Tailwind CSS, Zustand, Lucide React, Node.js Native Test Runner (`node:test` + `tsx`).

**Spec:** [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md#L306-L308), [docs/USER-STORY.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USER-STORY.md#L132-L144), [docs/USE-CASE.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USE-CASE.md#L153-L170), [docs/API-CONTRACTS.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/API-CONTRACTS.md#L54-L155), [docs/DATABASE-SCHEMA.sql](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/DATABASE-SCHEMA.sql#L21-L50).

---

## Global Constraints

- Backend phản hồi 100% cấu trúc Envelope chuẩn: `{ success: true, data: T, timestamp: string }` và mã lỗi `{ success: false, error: { code, message, details } }`.
- Dữ liệu lịch sử chuẩn xác 100%, tuyệt đối không bịa đặt nguồn gốc hay niên đại (tuân thủ nghiêm ngặt Vùng cấm văn hóa trong [GEMINI.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/GEMINI.md)).
- TypeScript Strict Mode 100% (Zero `any`).
- Factcard hiển thị cố định tại Right Inspector Sidebar để đảm bảo trải nghiệm đọc sâu (Deep Reading); thẻ trong Drawer có Micro-Tooltip tóm tắt 1 dòng.
- Nhánh Git phát triển: `feature/S1.2-catalog-api-cultural-factcard`.
- Lệnh chạy script trên Windows: sử dụng `npm.cmd` và `cmd /c "..."`.

---

### Task 1: Khởi Tạo Nhánh Git & Cấu Hình Bộ Kiểm Thử Tự Động Backend

**Files:**
- Modify: `backend/package.json`
- Create: `backend/src/tests/smoke.test.ts`

**Interfaces:**
- Produces: Lệnh `npm test` chạy kiểm thử tự động TypeScript qua `node:test` và `tsx`.

- [ ] **Step 1: Tạo nhánh Git mới từ main/feature**
```bash
git checkout -b feature/S1.2-catalog-api-cultural-factcard
```

- [ ] **Step 2: Thêm script test vào backend/package.json**
Cập nhật `backend/package.json` bổ sung script:
```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "tsx --test \"src/tests/**/*.test.ts\""
}
```

- [ ] **Step 3: Viết smoke test kiểm tra runner hoạt động**
Tạo file `backend/src/tests/smoke.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Backend Test Harness Smoke Test', () => {
  test('Kiểm thử môi trường node:test hoạt động chuẩn xác', () => {
    assert.equal(1 + 1, 2);
  });
});
```

- [ ] **Step 4: Chạy kiểm thử xác nhận runner pass**
```bash
cmd /c "npm test"
```
Kỳ vọng: 1 test pass trong nhóm `Backend Test Harness Smoke Test`.

- [ ] **Step 5: Commit cấu hình test**
```bash
git add backend/package.json backend/src/tests/smoke.test.ts
git commit -m "chore(test): cấu hình bộ chạy kiểm thử tự động node:test và tsx cho backend" -m "Refs: S1.2"
```

---

### Task 2: Chuẩn Hóa Mock Data CSDL & Triển Khai Logic Bộ Lọc Catalog

**Files:**
- Modify: `backend/src/services/items.service.ts`

**Interfaces:**
- Consumes: `ItemDto`, `CulturalFactDto`, `Gender`, `SlotType` từ `backend/src/types`
- Produces: `itemsService.getItems(filters?: { gender?: Gender; slot?: SlotType; era?: string }): Promise<ItemDto[]>`
- Produces: `itemsService.getItemById(id: string): Promise<ItemDto | null>`
- Produces: `itemsService.getCulturalFact(itemId: string): Promise<CulturalFactDto | null>`

- [ ] **Step 1: Viết test thất bại (Red) cho bộ lọc era và danh mục đủ 8 món**
Tạo file `backend/src/tests/items.test.ts`:
```typescript
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

  test('Lấy thông tin Fact văn hóa của Áo Nhật Bình phải có đầy đủ ý nghĩa', async () => {
    const nhatBinhFact = await itemsService.getCulturalFact('11111111-0000-0000-0000-000000000003');
    assert.ok(nhatBinhFact !== null);
    assert.equal(nhatBinhFact.era, 'Triều Nguyễn (Cung đình Huế)');
    assert.ok(nhatBinhFact.symbolic_meaning.includes('Ngũ hành'));
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận kiểm thử thất bại (Fail)**
```bash
cmd /c "npm test"
```
Kỳ vọng: FAIL (do hiện tại chỉ có 6 món và chưa hỗ trợ lọc `era`, thiếu fact Áo Nhật Bình).

- [ ] **Step 3: Cập nhật mockItems và mockFacts chuẩn 100% DATABASE-SCHEMA.sql**
Chỉnh sửa `backend/src/services/items.service.ts` để đồng bộ toàn bộ 8 items và 8 cultural facts:
1. Áo tấc tay thụng (`...0001`)
2. Áo ngũ thân tay chẽn (`...0002`)
3. Áo Nhật bình thêu ngũ sắc (`...0003`)
4. Quần lụa ống rộng truyền thống (`...0004`)
5. Khăn đóng xếp nếp truyền thống (`...0005`)
6. Mấn nhung đính ngọc (`...0006`)
7. Quạt lụa vẽ tranh thủy mặc (`...0007`)
8. Giày Sneaker tối giản Gen Z (`...0008`)

Bổ sung logic lọc `era`:
```typescript
if (filters?.era) {
  const eraQuery = filters.era.toLowerCase();
  const hasEra = item.tags.some((tag) => tag.toLowerCase() === eraQuery);
  if (!hasEra) return false;
}
```

- [ ] **Step 4: Chạy test để xác nhận kiểm thử chuyển sang màu xanh (Pass)**
```bash
cmd /c "npm test"
```
Kỳ vọng: Tất cả các test case trong `items.test.ts` đều PASS.

- [ ] **Step 5: Kiểm tra TypeScript build**
```bash
cmd /c "npm run build"
```
Kỳ vọng: Build thành công không có lỗi type.

- [ ] **Step 6: Commit backend service**
```bash
git add backend/src/services/items.service.ts backend/src/tests/items.test.ts
git commit -m "feat(api): chuẩn hóa 8 items và cultural facts chuẩn schema kèm bộ lọc era" -m "Refs: S1.2"
```

---

### Task 3: Bổ Sung Test Suite Cho Controller & API Endpoint Responses

**Files:**
- Modify: `backend/src/controllers/items.controller.ts`
- Create: `backend/src/tests/api.test.ts`

**Interfaces:**
- Consumes: `itemsController`, `ApiResponse`
- Produces: API response chuẩn RFC & API-CONTRACTS.md (mã lỗi `ITEM_NOT_FOUND` khi fact không tồn tại)

- [ ] **Step 1: Viết test cho Controller response envelope và status code**
Tạo file `backend/src/tests/api.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { itemsController } from '../controllers/items.controller';
import { Request, Response } from 'express';

describe('ItemsController - Envelope & Status Codes', () => {
  test('getCulturalFact trả về mã lỗi chuẩn ITEM_NOT_FOUND khi ID không tồn tại', async () => {
    let statusCode = 0;
    let responseBody: any = null;

    const mockReq = {
      params: { id: 'non-existent-uuid' },
    } as unknown as Request;

    const mockRes = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: any) {
        responseBody = body;
        return this;
      },
    } as unknown as Response;

    await itemsController.getCulturalFact(mockReq, mockRes);

    assert.equal(statusCode, 404);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.error.code, 'ITEM_NOT_FOUND');
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**
```bash
cmd /c "npm test"
```
Kỳ vọng: FAIL (vì controller hiện tại trả về mã `FACT_NOT_FOUND` thay vì `ITEM_NOT_FOUND` theo mục 1.3 của [API-CONTRACTS.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/API-CONTRACTS.md)).

- [ ] **Step 3: Cập nhật mã lỗi chuẩn trong items.controller.ts**
Đổi mã lỗi trong hàm `getCulturalFact` thành `ITEM_NOT_FOUND`:
```typescript
if (!fact) {
  res.status(404).json({
    success: false,
    error: {
      code: 'ITEM_NOT_FOUND',
      message: 'Không tìm thấy thông tin văn hóa cho trang phục này.',
    },
    timestamp: new Date().toISOString(),
  });
  return;
}
```

- [ ] **Step 4: Chạy lại toàn bộ test suite**
```bash
cmd /c "npm test"
```
Kỳ vọng: PASS 100%.

- [ ] **Step 5: Commit controller test & fix**
```bash
git add backend/src/controllers/items.controller.ts backend/src/tests/api.test.ts
git commit -m "test(api): hoàn thiện test suite và chuẩn hóa mã lỗi ITEM_NOT_FOUND cho facts" -m "Refs: S1.2"
```

---

### Task 4: Nâng Cấp Quản Lý Trạng Thái & Giao Diện Cultural Factcard (Right Sidebar)

**Files:**
- Modify: `frontend/src/store/useOutfitStore.ts`
- Modify: `frontend/src/components/cultural/CulturalFactcard.tsx`

**Interfaces:**
- Consumes: `activeFactcard`, `activeItem` từ `useOutfitStore`
- Produces: Giao diện Factcard phong cách "Heritage Futurism": font chữ có chân Cinzel/Playfair Display, Skeleton Loader, badges thời kỳ, mẹo phối Gen Z.

- [ ] **Step 1: Cập nhật useOutfitStore hỗ trợ activeFactcardItem và loading state**
Thêm thuộc tính vào `OutfitStoreState` trong `frontend/src/store/useOutfitStore.ts`:
```typescript
activeFactcardItem: ItemDto | null;
isFactcardLoading: boolean;
setActiveFactcardItem: (item: ItemDto | null) => void;
setIsFactcardLoading: (isLoading: boolean) => void;
```
Cập nhật giá trị khởi tạo và action tương ứng trong `create(...)`.

- [ ] **Step 2: Viết lại CulturalFactcard.tsx với thiết kế cao cấp chuẩn GEMINI.md**
Cập nhật `frontend/src/components/cultural/CulturalFactcard.tsx`:
1. Khi `isFactcardLoading = true`: Render Skeleton Card mềm mại (shimmer effect) với 3 thanh placeholder.
2. Khi `!activeFactcard`: Render trạng thái mời gọi tương tác với icon BookOpen trang nhã.
3. Khi có dữ liệu:
   - Tiêu đề món đồ: Tên trang phục hiển thị bằng font có chân `font-serif-heritage text-base text-heritage-yellow font-bold tracking-wide`.
   - Badge Slot & Badge Triều đại: Thiết kế bóng bẩy với icon Sparkles và Library.
   - Nguồn gốc & Xuất xứ: Đoạn trích ngắn gọn, cỡ chữ 12px dễ đọc.
   - Ý nghĩa biểu tượng: Điểm nhấn về triết lý ngũ thường / hoa văn cổ.
   - Hộp Mẹo phối Gen Z: Khung màu chàm nhung `bg-heritage-indigo/30` có viền highlight hổ phách, icon bóng đèn 💡 và font chữ hiện đại.

- [ ] **Step 3: Kiểm tra frontend build**
```bash
cmd /c "npm run build"
```
Kỳ vọng: Build TypeScript không lỗi.

- [ ] **Step 4: Commit UI Factcard**
```bash
git add frontend/src/store/useOutfitStore.ts frontend/src/components/cultural/CulturalFactcard.tsx
git commit -m "feat(ui): nâng cấp thẻ Cultural Factcard với font cổ phong và skeleton loader" -m "Refs: S1.2, US-05, UC-04"
```

---

### Task 5: Triển Khai Micro-Tooltip & Tương Tác Hai Chiều Trong ItemDrawer

**Files:**
- Modify: `frontend/src/components/studio/ItemDrawer.tsx`

**Interfaces:**
- Consumes: `apiClient.getCulturalFact`, `useOutfitStore` actions
- Produces: Thẻ item có Micro-Tooltip triều đại khi hover, tự động gọi API và tải Factcard khi click (cả trong Drawer lẫn thanh "Đang mặc").

- [ ] **Step 1: Cập nhật hàm handleSelectItem trong ItemDrawer.tsx**
Gọi đồng thời việc kích hoạt animation loading và fetch fact:
```typescript
const handleSelectItem = async (item: ItemDto) => {
  selectItem(item.slot, item);
  onSelectSlotForColor(item.slot);
  setActiveFactcardItem(item);

  setIsFactcardLoading(true);
  try {
    const fact = await apiClient.getCulturalFact(item.id);
    setActiveFactcard(fact);
  } catch (error) {
    console.error('Không thể tải fact văn hóa:', error);
  } finally {
    setIsFactcardLoading(false);
  }
};
```

- [ ] **Step 2: Bổ sung Micro-Tooltip khi hover vào thẻ món đồ**
Trong danh sách `filteredItems.map(item => ...)`:
- Thêm tooltip hiển thị triều đại / đặc trưng tóm tắt 1 dòng: `🏛️ Triều Nguyễn • Lễ phục` hoặc `✨ Cổ phục Việt`.
- Thêm icon nút thông tin `(i)` nhỏ xinh ở góc thẻ để người dùng có thể click xem Factcard mà không bắt buộc phải mặc thay đổi outfit hiện tại.

- [ ] **Step 3: Cho phép click vào item trong thanh "Đang mặc" (Active Slots) để xem Factcard**
Trong danh sách `activeSlotsList.map(...)`, khi người dùng click vào một slot đang mặc, ngoài việc chọn màu (`onSelectSlotForColor`), hệ thống gọi hàm tra cứu fact tương ứng của món đó.

- [ ] **Step 4: Kiểm tra frontend build**
```bash
cmd /c "npm run build"
```
Kỳ vọng: Build thành công mượt mà.

- [ ] **Step 5: Commit tương tác ItemDrawer**
```bash
git add frontend/src/components/studio/ItemDrawer.tsx
git commit -m "feat(studio): tích hợp Micro-Tooltip và kích hoạt Factcard hai chiều từ tủ đồ" -m "Refs: S1.2, UC-04"
```

---

### Task 6: Kiểm Thử Tích Hợp Toàn Diện & Đóng Gói Hoàn Thiện

**Files:**
- Test verification across Backend & Frontend

**Interfaces:**
- Produces: Toàn bộ kiểm thử unit/API tự động pass; toàn bộ build production pass.

- [ ] **Step 1: Chạy toàn bộ backend test**
```bash
cd backend
cmd /c "npm test"
```
Kỳ vọng: 100% test cases pass.

- [ ] **Step 2: Build production cả hai dự án**
```bash
cd backend && cmd /c "npm run build"
cd ../frontend && cmd /c "npm run build"
```
Kỳ vọng: Exit code 0, không có bất kỳ cảnh báo lỗi type nào.

- [ ] **Step 3: Kiểm thử luồng tương tác thực tế (Manual Smoke Test)**
1. Mở Drawer $\rightarrow$ kiểm tra danh mục hiển thị đủ 8 món.
2. Hover vào "Áo Nhật bình thêu ngũ sắc" $\rightarrow$ thấy Micro-Tooltip hiển thị tóm tắt.
3. Click vào "Áo Nhật bình" $\rightarrow$ Right Sidebar hiển thị Factcard Áo Nhật bình triều Nguyễn, ý nghĩa Ngũ hành và tip phối Gen Z.
4. Click vào "Giày Sneaker" $\rightarrow$ Right Sidebar cập nhật Factcard phong cách hiện đại.
5. Click vào tab "Đang mặc" $\rightarrow$ chọn món áo đang mặc $\rightarrow$ Factcard cập nhật tức thì.

- [ ] **Step 4: Commit hoàn tất task S1.2**
```bash
git commit --allow-empty -m "chore(release): hoàn thiện và nghiệm thu task [S1.2] API Catalog & Thẻ Cultural Factcard" -m "Refs: S1.2, US-05, UC-04"
```
