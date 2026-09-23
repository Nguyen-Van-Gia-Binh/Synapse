# [S2.3] V-Lookbook Card Component & 9:16 High-Res Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện tính năng xuất bản và triển lãm bộ phối thời trang V-Lookbook: bộ render Canvas chất lượng cao chuẩn tỷ lệ dọc 9:16 (1080x1920 px) cho Story/TikTok tải về dưới 2 giây, Backend REST API (`POST /api/lookbooks`) lưu trữ và tạo link chia sẻ trực tiếp, cùng Modal triển lãm lộng lẫy theo phong cách "Heritage Futurism" (US-08, UC-07).

**Architecture:**
- **Canvas Export Engine (`canvas/export.ts`):** Sử dụng Offscreen Canvas độ phân giải cao 1080x1920 px kết hợp các lớp đồ từ Canvas 800x1200 px, vẽ thêm Header (Logo Synapse V-Heritage Studio), Trung tâm (Mẫu phối đồ hoàn chỉnh), Footer (Dải màu Cổ phong thực tế đã dùng kèm tên văn hóa, Thẻ tri thức trích dẫn và Điểm hòa sắc đạt được).
- **Backend Lookbook Service (`lookbooks.service.ts`):** Lưu trữ bộ phối gồm `slots`, `palette_used`, `harmony_score` và sinh link chia sẻ công khai `https://synapse-studio.vercel.app/lookbook/:id`.
- **Frontend Showcase Modal (`LookbookModal.tsx` & `LookbookCard.tsx`):** Cho phép người dùng nhập tên tác phẩm tùy thích (ví dụ: "Dạo Phố Đông Kinh 2026"), xem trước thẻ 9:16, tải ảnh PNG về máy và sao chép link chia sẻ vào clipboard.

**Tech Stack:** HTML5 Canvas 2D API, Blob / FileSaver, React 18, TypeScript Strict Mode, Express, Zustand, Tailwind CSS, Lucide React, Node test runner (`node:test`).

**Spec:** [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md) (Sprint 2, S2.3 & Mục 3.5), [docs/USER-STORY.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USER-STORY.md) (US-08), [docs/USE-CASE.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USE-CASE.md) (UC-07), [docs/API-CONTRACTS.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/API-CONTRACTS.md) (Nhóm 4).

---

## Global Constraints

- **Quy chuẩn thẻ V-Lookbook (PLAN.md 3.5):** Tỷ lệ chuẩn dọc `9:16`. Bắt buộc đủ 7 thành phần: Logo Synapse Studio, Mẫu phối trung tâm, Tên tác phẩm do người dùng đặt, Dải chấm màu thực tế kèm tên cổ phong, Thẻ trích dẫn văn hóa, Điểm hòa sắc, Nút Tải PNG & Chia sẻ.
- **Tốc độ xuất file:** Render và xuất Blob tải về máy hoàn tất trong dưới **2 giây**.
- **Quy chuẩn Git & CONTRIBUTING.md:**
  - Nhánh phát triển: `feature/S2.3-vlookbook-card-export`.
  - Format commit: `<type>(<scope>): <mô tả tiếng Việt>` kèm `Refs: S2.3`. Scope: `lookbook` hoặc `api-lookbook`.
  - Không commit thẳng vào `main`.
- **Môi trường Windows:** Lệnh terminal bọc qua `cmd /c` và sử dụng `npm.cmd` / `npx.cmd`.

---

### Task 1: Hoàn Thiện Backend REST API Lưu Trữ & Truy Xuất Lookbook

**Files:**
- Modify: `backend/src/services/lookbooks.service.ts`
- Modify: `backend/src/controllers/lookbooks.controller.ts` (nếu chưa có thì tạo mới)
- Modify: `backend/src/routes/lookbooks.routes.ts`
- Create: `backend/src/tests/lookbooks-api.test.ts`

**Interfaces:**
- Produces:
  - `POST /api/lookbooks`: Nhận `CreateLookbookDto`, lưu trữ và trả về `LookbookResponseDto` (HTTP 201 Created).
  - `GET /api/lookbooks/:id`: Lấy chi tiết bộ phối đã lưu để hiển thị công khai (HTTP 200 OK hoặc 404 NOT_FOUND).

- [ ] **Step 1: Viết integration test cho API Lookbook**

Tạo `backend/src/tests/lookbooks-api.test.ts` kiểm thử:
- Tạo mới một Lookbook thành công trả về ID và `share_url`.
- Truy xuất Lookbook vừa tạo bằng ID.
- Truy xuất ID không tồn tại trả về lỗi `LOOKBOOK_NOT_FOUND`.

- [ ] **Step 2: Chạy test xác nhận kiểm thử thất bại**

```bash
cmd /c "cd backend && npm.cmd test"
```

- [ ] **Step 3: Triển khai hoàn chỉnh LookbooksController và LookbooksService**

- [ ] **Step 4: Chạy test xác nhận pass và kiểm tra build**

```bash
cmd /c "cd backend && npm.cmd test && npm.cmd run build"
```

- [ ] **Step 5: Commit Backend Lookbook API**

```bash
git add backend/src/services/lookbooks.service.ts backend/src/controllers/ backend/src/routes/ backend/src/tests/
git commit -m "feat(api-lookbook): hoàn thiện REST API lưu trữ và chia sẻ Lookbook" -m "Refs: S2.3, US-08"
```

---

### Task 2: Xây Dựng Bộ Render Canvas Xuất Bản Chuẩn 9:16 (High-Res Exporter)

**Files:**
- Create: `frontend/src/canvas/export.ts`
- Create: `frontend/src/canvas/export.test.ts`
- Modify: `frontend/src/canvas/index.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface LookbookRenderOptions {
    title: string;
    gender: 'MALE' | 'FEMALE';
    mannequinCanvas: HTMLCanvasElement;
    paletteUsed: { name: string; hex: string }[];
    factQuote: { title: string; era: string; quote: string };
    harmonyScore: number;
  }

  export function renderLookbookCard916(options: LookbookRenderOptions): Promise<Blob | null>;
  ```

- [ ] **Step 1: Viết test harness kiểm thử các hàm tính toán bố cục Canvas 9:16**

- [ ] **Step 2: Triển khai renderLookbookCard916 trong canvas/export.ts**
  - Khởi tạo Canvas chuẩn `1080 x 1920 px`.
  - Phủ gradient nền tối sang trọng: `#0F1016` $\rightarrow$ `#1E1F2E`.
  - Vẽ Header: Logo *SYNAPSE V-HERITAGE STUDIO* chữ chân thanh thoát *Cinzel/Playfair*.
  - Vẽ Canvas người mẫu ở trung tâm `(width: 800, height: 1200)` co giãn sắc nét.
  - Vẽ Tên tác phẩm do người dùng nhập.
  - Vẽ dải chấm màu kèm mã Hex & tên Cổ phong.
  - Vẽ trích dẫn Fact văn hóa và Badge Điểm hòa sắc.

- [ ] **Step 3: Kiểm tra build TypeScript Frontend**

```bash
cmd /c "cd frontend && npm.cmd run build"
```

- [ ] **Step 4: Commit module Canvas Export**

```bash
git add frontend/src/canvas/
git commit -m "feat(canvas): xây dựng cỗ máy render thẻ V-Lookbook chuẩn 9:16 1080x1920" -m "Refs: S2.3, US-08"
```

---

### Task 3: Xây Dựng Thẻ Giao Diện `LookbookCard.tsx` (9:16 Visual Preview)

**Files:**
- Create: `frontend/src/components/lookbook/LookbookCard.tsx`
- Modify: `frontend/src/components/lookbook/index.ts`

**Interfaces:**
- Produces: Component `LookbookCard` hiển thị phiên bản preview tỉ lệ 9:16 mượt mà ngay trong Modal trước khi tải ảnh:
  - Khung viền mạ vàng hổ phách, hiệu ứng kính mờ Glassmorphism.
  - Hiển thị trực tiếp hình ảnh outfit, các chấm màu thực tế và trích dẫn di sản.

- [ ] **Step 1: Thiết kế giao diện LookbookCard với Tailwind CSS chuẩn mực**

- [ ] **Step 2: Kiểm tra build Frontend**

```bash
cmd /c "cd frontend && npm.cmd run build"
```

- [ ] **Step 3: Commit component LookbookCard**

```bash
git add frontend/src/components/lookbook/LookbookCard.tsx
git commit -m "feat(lookbook): xây dựng component thẻ LookbookCard tỉ lệ dọc 9:16" -m "Refs: S2.3, US-08"
```

---

### Task 4: Nâng Cấp `LookbookModal.tsx` Với Đầy Đủ Tương Tác Xuất Bản

**Files:**
- Modify: `frontend/src/components/lookbook/LookbookModal.tsx`
- Modify: `frontend/src/services/api.ts`

**Interfaces:**
- In `apiClient`: Thêm `createLookbook(dto: CreateLookbookDto): Promise<LookbookResponseDto>`.
- In `LookbookModal`:
  - Ô nhập Tên tác phẩm (`title`) có giá trị mặc định hấp dẫn (ví dụ: "Dạo Phố Đông Kinh 2026").
  - Nút `[💾 Tải ảnh PNG]`: Gọi `renderLookbookCard916`, sinh Blob và kích hoạt tải về máy trong `< 2s`.
  - Nút `[🔗 Sao chép Link]`: Gọi API Backend lưu lookbook, copy link vào clipboard và hiển thị Toast thông báo.

- [ ] **Step 1: Viết test cho hàm gọi API lưu lookbook**

- [ ] **Step 2: Nâng cấp LookbookModal thay thế mã placeholder cũ**

- [ ] **Step 3: Kiểm tra build Frontend**

```bash
cmd /c "cd frontend && npm.cmd run build"
```

- [ ] **Step 4: Commit Modal hoàn thiện**

```bash
git add frontend/src/components/lookbook/LookbookModal.tsx frontend/src/services/api.ts
git commit -m "feat(lookbook): hoàn thiện LookbookModal với tính năng tải ảnh PNG và link chia sẻ" -m "Refs: S2.3, US-08, UC-07"
```

---

### Task 5: Tích Hợp Toàn Diện Topbar Studio & Kiểm Thử Toàn Dự Án

**Files:**
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Kết nối nút `[✨ Xuất V-Lookbook]` trên Topbar mở `LookbookModal` và truyền dữ liệu Canvas thật từ Viewport.

- [ ] **Step 1: Cập nhật App.tsx truyền canvasRef hoặc render callback vào LookbookModal**

- [ ] **Step 2: Chạy toàn bộ kiểm thử tự động Frontend và Backend**

```bash
cmd /c "cd frontend && npm.cmd test && npm.cmd run build && cd ../backend && npm.cmd test && npm.cmd run build"
```
Kỳ vọng: Toàn bộ test pass 100%.

- [ ] **Step 3: Commit hoàn tất task S2.3**

```bash
git add frontend/src/App.tsx
git commit -m "feat(studio): tích hợp toàn diện luồng xuất bản V-Lookbook vào Studio Topbar" -m "Refs: S2.3, US-08, UC-07"
```

---

## Verification Plan

### Automated Tests
```bash
cmd /c "cd backend && npm.cmd test && npm.cmd run build"
cmd /c "cd frontend && npm.cmd test && npm.cmd run build"
```

### Manual Verification
1. Mở `http://localhost:5173`.
2. Phối một bộ outfit hoàn chỉnh gồm Áo ngũ thân Đỏ điều, Quần lụa Trắng ngà, Khăn đóng Đen mun.
3. Bấm nút tím gradient **[✨ Xuất V-Lookbook]** trên Topbar.
4. Nhập tên tác phẩm: "Hồn Xưa Phố Mới".
5. Bấm `[💾 Tải ảnh PNG]` $\rightarrow$ Trình duyệt tải file ảnh PNG độ nét cao 1080x1920 px trong dưới 2 giây.
6. Mở file ảnh vừa tải kiểm tra: Đầy đủ logo, ảnh mẫu sắc nét, 3 chấm màu đã dùng kèm tên cổ phong, trích dẫn văn hóa và điểm hòa sắc.
7. Bấm `[🔗 Sao chép Link]` $\rightarrow$ Thông báo link chia sẻ đã được sao chép thành công.
