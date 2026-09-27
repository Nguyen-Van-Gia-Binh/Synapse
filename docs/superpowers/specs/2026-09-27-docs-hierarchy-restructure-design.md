# Đặc Tả Thiết Kế: Tái Cấu Trúc Hệ Thống Tài Liệu Dự Án Synapse (Documentation Hierarchy Restructure)

- **Dự án:** Synapse – V-Heritage Studio
- **Tác giả:** Antigravity AI Pair Programmer & Lead Dev
- **Ngày lập:** 27/09/2026
- **Trạng thái:** Đã thống nhất thiết kế (Validated Design - Phương án 1)
- **Tài liệu tham chiếu:** [docs/PLAN.md](../../PLAN.md), [GEMINI.md](../../../GEMINI.md), [README.md](../../../README.md)

---

## 1. Mục Tiêu & Bối Cảnh

Thư mục `docs/` hiện tại đang chứa 8 tệp tài liệu lớn ở cấp 1 (root level) cùng 3 thư mục con (`devProcess/`, `knowledge/`, `superpowers/`). Dù các tài liệu này có chất lượng rất cao (chuẩn Agile, BDD, UML, RFC REST API, thuật toán Canvas), việc đặt chung tất cả tài liệu phân tích nghiệp vụ, hợp đồng API, schema cơ sở dữ liệu và đặc tả thuật toán vào cùng một thư mục phẳng làm tăng tải nhận thức, khó khăn cho việc tra cứu chuyên biệt theo vai trò (Frontend Developer, Backend Developer, QA/Content Researcher).

### Mục tiêu chính:
1. Phân nhóm tài liệu theo nguyên tắc **Domain & Layer Driven**:
   - `docs/srs/`: Chuyên trách tài liệu đặc tả yêu cầu người dùng, phân tích nghiệp vụ và tiêu chí nghiệm thu (SRS / BDD / UML).
   - `docs/shared/`: Chuyên trách kiến trúc và hợp đồng giao tiếp dùng chung giữa Frontend & Backend (API Contracts, Database Schema, Business Logic Algorithms).
   - `docs/frontend/`: Chuyên trách quy chuẩn thiết kế giao diện (Design System "Heritage Futurism") và kiến trúc Canvas Engine Paper-Doll.
   - `docs/backend/`: Chuyên trách cấu trúc dịch vụ API, luồng xử lý Controller-Service, cơ chế fallback offline và hướng dẫn triển khai (Deployment).
2. Giữ nguyên [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md) tại gốc `docs/` làm **Single Source of Truth** & bản đồ điều phối điều hướng (Navigation Map) toàn dự án.
3. Giữ nguyên [docs/devProcess/](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/devProcess), [docs/knowledge/](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/knowledge), [docs/superpowers/](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/superpowers).
4. Đồng bộ hóa 100% tất cả các liên kết tham chiếu (Links & Markdown paths) trong `GEMINI.md`, `README.md`, `CONTRIBUTING.md`, mã nguồn Frontend TypeScript, mã nguồn Backend TypeScript và nhật ký phát triển.

---

## 2. Cây Thư Mục Mục Tiêu (Target Documentation Blueprint)

```text
Synapse/
├── docs/                                          # Kho tài liệu đặc tả chuẩn mực
│   ├── PLAN.md                                    # [Root Entry Point] Kế hoạch 16 ngày & Bản đồ điều hướng
│   ├── srs/                                       # [Tài liệu Đặc tả Yêu cầu Phần mềm]
│   │   ├── ProjectBrief.md                        # Đề bài & Định vị giải pháp V-Heritage Studio
│   │   ├── USER-STORY.md                          # 4 Epics, 9 User Stories chuẩn BDD
│   │   ├── USE-CASE.md                            # 8 Use Cases đặc tả luồng chính/phụ & Actor
│   │   └── TESTING-CHECKLIST.md                   # Tiêu chí nghiệm thu DoD & Kịch bản kiểm thử
│   ├── shared/                                    # [Kiến trúc & Hợp đồng Dùng chung FE & BE]
│   │   ├── API-CONTRACTS.md                       # Đặc tả 4 nhóm REST API, DTOs & Mã lỗi
│   │   ├── BUSINESS-LOGIC-SPECIFICATION.md        # Thuật toán Canvas 60 FPS, Hòa sắc, Guardrails
│   │   └── DATABASE-SCHEMA.sql                    # Thiết kế DDL PostgreSQL Supabase & RLS
│   ├── frontend/                                  # [Quy chuẩn Kỹ thuật Giao diện]
│   │   ├── DESIGN-SYSTEM.md                       # Heritage Futurism: Bảng màu, Font, Glassmorphism, Tokens
│   │   └── CANVAS-ARCHITECTURE.md                 # 6 Slot, Offscreen Canvas Multiply, Export 9:16
│   ├── backend/                                   # [Quy chuẩn Kỹ thuật Dịch vụ API]
│   │   ├── ARCHITECTURE.md                        # Cấu trúc Controller-Service, Error Handling, Mock Fallback
│   │   └── DEPLOYMENT.md                          # Hướng dẫn Render.com, Supabase Sync, Health Check
│   ├── devProcess/                                # (Giữ nguyên) Nhật ký phát triển / PR hằng ngày
│   │   ├── README.md                              # Quy chuẩn đặt tên & Template
│   │   └── YYYY-MM-DD-NN-*.md                     # Các bản ghi Sprint/PR
│   ├── knowledge/                                 # (Giữ nguyên) Tri thức văn hóa, tài liệu gốc
│   │   └── Arena AI.md                            # Tư liệu văn hóa & prompt tham chiếu
│   └── superpowers/                               # (Giữ nguyên) AI Specs & Plans
│       ├── specs/
│       └── plans/
```

---

## 3. Nội Dung Chi Tiết Các Tệp Tạo Mới

### 3.1. `docs/frontend/DESIGN-SYSTEM.md`
- **Mục tiêu:** Hệ thống hóa toàn bộ quy chuẩn thẩm mỹ "Heritage Futurism" đã được áp dụng trong `frontend/src/index.css`.
- **Nội dung chính:**
  - Triết lý thiết kế: Tôn vinh cổ phục Việt Nam trên nền tảng hiện đại, sang trọng, chiều sâu thị giác.
  - Bảng 8 màu cổ phong Việt Nam (Hex, tên cổ, ý nghĩa văn hóa, hành ngũ hành tương ứng).
  - Hệ thống Typography: Serif cho tiêu đề (`Playfair Display` / `Cinzel`), Sans-serif cho tương tác (`Be Vietnam Pro` / `Inter`).
  - Hiệu ứng Kính mờ (Glassmorphism) và đổ bóng hoàng gia (Heritage Shadows).
  - Micro-interactions & Thời gian chuyển động (Transitions 150-200ms cubic-bezier).

### 3.2. `docs/frontend/CANVAS-ARCHITECTURE.md`
- **Mục tiêu:** Đặc tả cơ chế hoạt động của Core Canvas Paper-Doll Engine (`frontend/src/canvas/`).
- **Nội dung chính:**
  - Khung chuẩn `800 x 1200 px` (tỉ lệ 2:3), render tọa độ gốc `(0, 0)`.
  - Hệ thống 6 Slot và thứ tự Z-Index: Headwear, Top, Bottom, Pattern, Accessory, Footwear.
  - Kỹ thuật nhuộm màu vải bằng Dual Offscreen Canvas (`globalCompositeOperation = 'multiply'` kết hợp `'destination-in'`).
  - Quy trình xuất bản Lookbook tỉ lệ `9:16` (`1080 x 1920 px`) tích hợp thẻ bài di sản, harmony score và watermark.

### 3.3. `docs/backend/ARCHITECTURE.md`
- **Mục tiêu:** Phản ánh chân thực kiến trúc hiện tại của backend Node.js + Express + TypeScript.
- **Nội dung chính:**
  - Luồng dữ liệu phân tầng: Routes -> Controllers -> Services -> Supabase Client.
  - Xử lý mã lỗi tập trung theo chuẩn RFC & `API-CONTRACTS.md`.
  - Cơ chế Dual-Mode Persistence: Kết nối Supabase PostgreSQL khi có kết nối, tự động kích hoạt In-Memory Mock Fallback khi offline hoặc chạy Unit Test.

### 3.4. `docs/backend/DEPLOYMENT.md`
- **Mục tiêu:** Hướng dẫn cấu hình và duy trì hạ tầng vận hành.
- **Nội dung chính:**
  - Cấu hình triển khai Render.com Web Service (`render.yaml`).
  - Kết nối Supabase Database (Biến môi trường `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
  - Endpoint giám sát sức khỏe hệ thống: `GET /health`.
  - Hướng dẫn đồng bộ dữ liệu và migration Supabase DDL.

---

## 4. Kế Hoạch Cập Nhật Liên Kết (Reference Migration Matrix)

| Tệp nguồn | Đường dẫn cũ | Đường dẫn mới |
| :--- | :--- | :--- |
| `GEMINI.md` | `docs/ProjectBrief.md` | `docs/srs/ProjectBrief.md` |
| `README.md` | `docs/ProjectBrief.md` | `docs/srs/ProjectBrief.md` |
| `README.md` | Cây thư mục `docs/` cũ | Cây thư mục `docs/` mới phân tầng |
| `CONTRIBUTING.md` | `docs/ProjectBrief.md` | `docs/srs/ProjectBrief.md` |
| `docs/PLAN.md` | Cây thư mục mục 3.6 | Cây thư mục `docs/` mới phân tầng |
| `docs/PLAN.md` | `USER-STORY.md`, `USE-CASE.md`, `API-CONTRACTS.md`... | `srs/USER-STORY.md`, `srs/USE-CASE.md`, `shared/API-CONTRACTS.md`... |
| `frontend/src/utils/heritageWuXing.ts` | `docs/BUSINESS-LOGIC-SPECIFICATION.md` | `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` |
| `frontend/src/utils/harmonyScorer.ts` | `docs/BUSINESS-LOGIC-SPECIFICATION.md` | `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` |
| `frontend/src/utils/colorMetrics.ts` | `docs/BUSINESS-LOGIC-SPECIFICATION.md` | `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` |
| `frontend/src/canvas/tinting.ts` | `docs/BUSINESS-LOGIC-SPECIFICATION.md` | `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` |
| `frontend/src/components/studio/ItemDrawer.tsx` | `DATABASE-SCHEMA.sql` | `docs/shared/DATABASE-SCHEMA.sql` |
| `backend/src/services/rules.service.ts` | `docs/BUSINESS-LOGIC-SPECIFICATION.md` | `docs/shared/BUSINESS-LOGIC-SPECIFICATION.md` |
| `backend/src/services/items.service.ts` | `DATABASE-SCHEMA.sql` | `docs/shared/DATABASE-SCHEMA.sql` |
| `backend/src/tests/items.test.ts` | `DATABASE-SCHEMA.sql` | `docs/shared/DATABASE-SCHEMA.sql` |

---

## 5. Tiêu Chí Nghiệm Thu (Definition of Done)

1. [ ] Các thư mục `docs/srs/`, `docs/shared/`, `docs/frontend/`, `docs/backend/` đã được tạo và chứa đầy đủ tài liệu tương ứng.
2. [ ] Thư mục gốc `docs/` chỉ còn: `PLAN.md`, 4 thư mục phân nhóm mới, cùng 3 thư mục hệ thống sẵn có (`devProcess/`, `knowledge/`, `superpowers/`).
3. [ ] 4 tài liệu kỹ thuật mới (`docs/frontend/DESIGN-SYSTEM.md`, `docs/frontend/CANVAS-ARCHITECTURE.md`, `docs/backend/ARCHITECTURE.md`, `docs/backend/DEPLOYMENT.md`) được biên soạn đầy đủ, chuẩn xác, không có placeholder TBD.
4. [ ] 100% đường dẫn tham chiếu trong `GEMINI.md`, `README.md`, `CONTRIBUTING.md`, `docs/PLAN.md` và mã nguồn Frontend/Backend đã được cập nhật chính xác.
5. [ ] Toàn bộ unit tests cả hai phía Frontend (`38/38`) và Backend (`25/25`) chạy thành công không có lỗi hồi quy.
6. [ ] Tạo bản ghi phát triển `docs/devProcess/2026-09-27-04-tai-cau-truc-thu-muc-tai-lieu-docs.md` ghi nhận toàn bộ hoạt động.
