# Tái Cấu Trúc Hệ Thống Tài Liệu Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tái cấu trúc toàn bộ thư mục `docs/` thành mô hình Domain & Layer (`srs/`, `shared/`, `frontend/`, `backend/`, giữ `PLAN.md` ở gốc) và cập nhật 100% đường dẫn tham chiếu trong `GEMINI.md`, `README.md`, `CONTRIBUTING.md` và mã nguồn Frontend/Backend.

**Architecture:** Áp dụng mô hình phân tách tài liệu theo miền trách nhiệm (Domain-Driven Documentation): Yêu cầu nghiệp vụ chuyển vào `srs/`, kiến trúc giao tiếp chung FE-BE chuyển vào `shared/`, tài liệu thiết kế UI và Canvas Engine vào `frontend/`, kiến trúc dịch vụ và triển khai vào `backend/`. Dùng `git mv` để bảo toàn lịch sử commit Git.

**Tech Stack:** Git CLI, Markdown, TypeScript, React 18, Express, Vitest / Jest.

**Spec:** [docs/superpowers/specs/2026-09-27-docs-hierarchy-restructure-design.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/superpowers/specs/2026-09-27-docs-hierarchy-restructure-design.md)

## Global Constraints

- Nhánh làm việc: `docs/restructure-docs-hierarchy` (tuyệt đối không commit thẳng vào `main`).
- Mọi file di chuyển phải sử dụng `git mv` để bảo tồn lịch sử git blame.
- Giữ nguyên vị trí của `docs/PLAN.md`, `docs/devProcess/`, `docs/knowledge/`, `docs/superpowers/`.
- Không để sót bất kỳ liên kết 404 (broken link) nào trong tài liệu hoặc comment mã nguồn.
- Kiểm thử hồi quy: Toàn bộ unit tests Frontend (38 tests) và Backend (25 tests) phải tiếp tục PASS 100%.

---

### Task 1: Di chuyển các tệp tài liệu hiện có vào các thư mục phân nhóm bằng `git mv`

**Files:**
- Move: `docs/ProjectBrief.md` -> `docs/srs/ProjectBrief.md`
- Move: `docs/USER-STORY.md` -> `docs/srs/USER-STORY.md`
- Move: `docs/USE-CASE.md` -> `docs/srs/USE-CASE.md`
- Move: `docs/TESTING-CHECKLIST.md` -> `docs/srs/TESTING-CHECKLIST.md`
- Move: `docs/API-CONTRACTS.md` -> `docs/shared/API-CONTRACTS.md`
- Move: `docs/BUSINESS-LOGIC-SPECIFICATION.md` -> `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md`
- Move: `docs/DATABASE-SCHEMA.sql` -> `docs/shared/DATABASE-SCHEMA.sql`

**Interfaces:**
- Consumes: Các file tài liệu hiện hữu ở thư mục `docs/`.
- Produces: Cấu trúc thư mục mới `docs/srs/` và `docs/shared/`.

- [ ] **Step 1: Tạo các thư mục đích và thực hiện di chuyển bằng git mv**

```bash
mkdir docs/srs docs/shared docs/frontend docs/backend
git mv docs/ProjectBrief.md docs/srs/ProjectBrief.md
git mv docs/USER-STORY.md docs/srs/USER-STORY.md
git mv docs/USE-CASE.md docs/srs/USE-CASE.md
git mv docs/TESTING-CHECKLIST.md docs/srs/TESTING-CHECKLIST.md
git mv docs/API-CONTRACTS.md docs/shared/API-CONTRACTS.md
git mv docs/BUSINESS-LOGIC-SPECIFICATION.md docs/shared/BUSINESS-LOGIC-SPECIFICATION.md
git mv docs/DATABASE-SCHEMA.sql docs/shared/DATABASE-SCHEMA.sql
```

- [ ] **Step 2: Kiểm tra trạng thái Git để xác nhận rename**

Run: `git status`
Expected: 7 file đổi tên dạng `renamed: docs/X -> docs/srs/X` hoặc `docs/shared/X`.

- [ ] **Step 3: Commit thay đổi di chuyển**

```bash
git commit -m "docs(refactor): di chuyen cac tai lieu vao thu muc docs/srs va docs/shared"
```

---

### Task 2: Soạn thảo 4 tài liệu kỹ thuật chuyên biệt mới cho Frontend và Backend

**Files:**
- Create: `docs/frontend/DESIGN-SYSTEM.md`
- Create: `docs/frontend/CANVAS-ARCHITECTURE.md`
- Create: `docs/backend/ARCHITECTURE.md`
- Create: `docs/backend/DEPLOYMENT.md`

**Interfaces:**
- Consumes: Quy chuẩn thẩm mỹ từ `GEMINI.md`, `BUSINESS-LOGIC-SPECIFICATION.md`, `render.yaml`, `backend/src/`.
- Produces: 4 tài liệu đặc tả chuẩn cho Frontend và Backend.

- [ ] **Step 1: Soạn thảo `docs/frontend/DESIGN-SYSTEM.md`**

Nội dung bao gồm:
- Tôn chỉ "Heritage Futurism": Dark mode sang trọng, kính mờ Glassmorphism, chiều sâu thị giác.
- Bảng 8 màu cổ phong Việt Nam (Hex, tên cổ, ý nghĩa ngũ hành).
- Hệ thống Typography: Playfair Display / Cinzel (Tiêu đề) và Be Vietnam Pro / Inter (Giao diện).
- Hệ thống biến CSS tokens từ `frontend/src/index.css`.
- Micro-interactions (Transitions 150-200ms cubic-bezier).

- [ ] **Step 2: Soạn thảo `docs/frontend/CANVAS-ARCHITECTURE.md`**

Nội dung bao gồm:
- Khung canvas cố định `800 x 1200 px` (tỉ lệ 2:3), render tọa độ gốc `(0, 0)`.
- Hệ thống 6 Slot và thứ tự Z-Index (Headwear, Top, Bottom, Pattern, Accessory, Footwear).
- Kỹ thuật nhuộm màu Dual Offscreen Canvas Multiply (`globalCompositeOperation = 'multiply'` kết hợp `'destination-in'`).
- Cơ chế xuất bản Lookbook `9:16` (`1080 x 1920 px`) kèm watermark, palette và fact card trích dẫn.

- [ ] **Step 3: Soạn thảo `docs/backend/ARCHITECTURE.md`**

Nội dung bao gồm:
- Kiến trúc phân tầng Express + TypeScript: `routes/` -> `controllers/` -> `services/` -> Supabase Client.
- Quản lý mã lỗi chuẩn RFC theo `shared/API-CONTRACTS.md`.
- Cơ chế In-Memory Mock Fallback cho `items`, `cultural_facts`, `cultural_rules`, `lookbooks` khi Supabase offline hoặc khi chạy Unit Test.

- [ ] **Step 4: Soạn thảo `docs/backend/DEPLOYMENT.md`**

Nội dung bao gồm:
- Mô hình triển khai Render.com Web Service (`render.yaml`).
- Tích hợp Supabase PostgreSQL và Storage bucket.
- Danh sách biến môi trường bắt buộc: `PORT`, `NODE_ENV`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Giám sát sức khỏe dịch vụ qua endpoint `GET /health`.

- [ ] **Step 5: Commit 4 tài liệu mới**

```bash
git add docs/frontend/ docs/backend/
git commit -m "docs(fe-be): bo sung tai lieu Design System, Canvas Engine va Backend Architecture"
```

---

### Task 3: Cập nhật tài liệu điều phối trung tâm & chỉ dẫn dự án

**Files:**
- Modify: `docs/PLAN.md`
- Modify: `GEMINI.md`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: Cấu trúc thư mục mới từ Task 1 và Task 2.
- Produces: Bản đồ điều hướng và chỉ dẫn dự án được cập nhật 100% link chính xác.

- [ ] **Step 1: Cập nhật `docs/PLAN.md`**
- Cập nhật mục 3.6 (Project Architecture Blueprint) hiển thị cây thư mục mới của `docs/` (`srs/`, `shared/`, `frontend/`, `backend/`).
- Cập nhật các đường dẫn tham chiếu nội bộ trong `docs/PLAN.md`:
  - `docs/USER-STORY.md` -> `docs/srs/USER-STORY.md`
  - `docs/USE-CASE.md` -> `docs/srs/USE-CASE.md`
  - `docs/API-CONTRACTS.md` -> `docs/shared/API-CONTRACTS.md`
  - `docs/BUSINESS-LOGIC-SPECIFICATION.md` -> `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md`
  - `docs/DATABASE-SCHEMA.sql` -> `docs/shared/DATABASE-SCHEMA.sql`
  - `docs/ProjectBrief.md` -> `docs/srs/ProjectBrief.md`

- [ ] **Step 2: Cập nhật `GEMINI.md`**
- Mục 2.1: Cập nhật `[docs/ProjectBrief.md](docs/ProjectBrief.md)` thành `[docs/srs/ProjectBrief.md](docs/srs/ProjectBrief.md)`.
- Mục 3.1 & 3.2: Đảm bảo các tham chiếu tài liệu đều chuẩn xác.

- [ ] **Step 3: Cập nhật `README.md`**
- Cập nhật liên kết thanh tiêu đề: `[📌 Đề Bài & Thử Thách](docs/ProjectBrief.md)` -> `[📌 Đề Bài & Thử Thách](docs/srs/ProjectBrief.md)`.
- Cập nhật cây thư mục `docs/` ở mục cấu trúc dự án để phản ánh đúng cấu trúc phân nhóm mới.

- [ ] **Step 4: Cập nhật `CONTRIBUTING.md`**
- Cập nhật dòng trỏ tới `docs/ProjectBrief.md` thành `docs/srs/ProjectBrief.md`.

- [ ] **Step 5: Commit cập nhật tài liệu trung tâm**

```bash
git add docs/PLAN.md GEMINI.md README.md CONTRIBUTING.md
git commit -m "docs(nav): dong bo ban do lien ket trong PLAN, GEMINI, README va CONTRIBUTING"
```

---

### Task 4: Cập nhật đường dẫn tham chiếu trong mã nguồn Frontend & Backend

**Files:**
- Modify: `frontend/src/utils/heritageWuXing.ts`
- Modify: `frontend/src/utils/harmonyScorer.ts`
- Modify: `frontend/src/utils/colorMetrics.ts`
- Modify: `frontend/src/canvas/tinting.ts`
- Modify: `frontend/src/components/studio/ItemDrawer.tsx`
- Modify: `backend/src/services/rules.service.ts`
- Modify: `backend/src/services/items.service.ts`
- Modify: `backend/src/tests/items.test.ts`

**Interfaces:**
- Consumes: Đường dẫn tài liệu mới `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` và `docs/shared/DATABASE-SCHEMA.sql`.
- Produces: Chú thích và docstrings trong code trỏ đúng vị trí mới.

- [ ] **Step 1: Cập nhật các file mã nguồn Frontend**
- Thay `docs/BUSINESS-LOGIC-SPECIFICATION.md` bằng `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` trong:
  - `frontend/src/utils/heritageWuXing.ts`
  - `frontend/src/utils/harmonyScorer.ts`
  - `frontend/src/utils/colorMetrics.ts`
  - `frontend/src/canvas/tinting.ts`
- Thay `DATABASE-SCHEMA.sql` bằng `docs/shared/DATABASE-SCHEMA.sql` trong `frontend/src/components/studio/ItemDrawer.tsx`.

- [ ] **Step 2: Cập nhật các file mã nguồn Backend**
- Thay `docs/BUSINESS-LOGIC-SPECIFICATION.md` bằng `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` trong `backend/src/services/rules.service.ts`.
- Thay `DATABASE-SCHEMA.sql` bằng `docs/shared/DATABASE-SCHEMA.sql` trong `backend/src/services/items.service.ts` và `backend/src/tests/items.test.ts`.

- [ ] **Step 3: Commit cập nhật mã nguồn**

```bash
git add frontend/src/ backend/src/
git commit -m "refactor(code): cap nhat duong dan tai lieu shared trong chu thich ma nguon"
```

---

### Task 5: Kiểm thử toàn diện, ghi nhận DevProcess và hoàn thiện Pull Request

**Files:**
- Create: `docs/devProcess/2026-09-27-04-tai-cau-truc-thu-muc-tai-lieu-docs.md`

**Interfaces:**
- Consumes: Toàn bộ thay đổi của Tasks 1-4.
- Produces: Kết quả test pass 100%, bản ghi nhật ký phát triển, PR GitHub sẵn sàng merge.

- [ ] **Step 1: Chạy toàn bộ Unit Tests Frontend & Backend**

Run: `npm test --prefix frontend`
Expected: 38/38 tests PASS.

Run: `npm test --prefix backend`
Expected: 25/25 tests PASS.

- [ ] **Step 2: Kiểm tra Build Frontend & Backend**

Run: `npm run build --prefix frontend`
Run: `npm run build --prefix backend`
Expected: Cả hai build thành công không có lỗi TypeScript.

- [ ] **Step 3: Soạn thảo nhật ký phát triển `docs/devProcess/2026-09-27-04-tai-cau-truc-thu-muc-tai-lieu-docs.md`**

Ghi nhận đầy đủ: Mục tiêu phiên, những việc đã làm, quyết định kỹ thuật, kết quả kiểm thử và việc cần làm tiếp theo.

- [ ] **Step 4: Commit nhật ký phát triển, Push nhánh lên Remote và mở Pull Request**

```bash
git add docs/devProcess/2026-09-27-04-tai-cau-truc-thu-muc-tai-lieu-docs.md docs/superpowers/plans/2026-09-27-docs-hierarchy-restructure.md
git commit -m "docs(devprocess): ghi nhan nhat ky tai cau truc thu muc tai lieu docs"
git push -u origin docs/restructure-docs-hierarchy
gh pr create --title "docs(hierarchy): tái cấu trúc thư mục tài liệu docs theo mô hình Domain & Layer" --body "..." --base main
```
