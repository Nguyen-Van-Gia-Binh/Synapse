# Kế Hoạch Tái Cấu Trúc Kho Tri Thức Văn Hóa (Cultural Knowledge Base Modularization Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển đổi và module hóa tài liệu khổng lồ `docs/knowledge/Arena-AI.md` (~8.5MB, chứa base64 và lặp lại nội dung) thành hệ thống tài liệu tri thức văn hóa có cấu trúc phân tầng, không lặp rác, liên kết chặt chẽ với CSDL Supabase và dễ dàng mở rộng.

**Architecture:** Tách bạch tài liệu thành 5 phân vùng: `guidelines/` (phương pháp luận & AI guardrails), `schema/` (khung phân rã & đặc tả ánh xạ CSDL), `costumes/` (11 hồ sơ trang phục độc lập gồm Cổ phục Kinh và Tộc người), `references/` (danh mục hiện vật bảo tàng & thư mục nguồn), `templates/` (khuôn mẫu mở rộng). Khử bỏ 100% chuỗi base64 và hợp nhất các bản thảo trùng lặp.

**Tech Stack:** Markdown (GitHub Flavored Markdown), YAML Frontmatter, Mermaid diagrams.

**Spec / Baseline Doc:** `docs/knowledge/Arena-AI.md`

## Global Constraints

- **Bảo toàn 100% tri thức văn hóa:** Không làm mất bất kỳ thông tin học thuật, hiện vật hay phân rã cấu trúc nào từ bản thảo gốc `Arena-AI.md`.
- **Tuyệt đối không nhúng Base64:** Mọi hình ảnh phải dùng URL trực tiếp hoặc đường dẫn file asset.
- **Tuân thủ quy chuẩn văn hóa [GEMINI.md](../../GEMINI.md):** Giữ đúng giọng điệu lịch sự, gợi mở, bảo vệ bản sắc, không phán xét tiêu cực.
- **Ánh xạ chính xác với Schema Supabase:** Thuộc tính trong hồ sơ trang phục phải tương thích trực tiếp với các bảng `items`, `cultural_facts`, `cultural_rules`.

---

### Task 1: Khởi tạo Cấu trúc Thư mục & File Cổng `docs/knowledge/README.md`

**Files:**
- Create: `docs/knowledge/README.md`

**Interfaces & Responsibilities:**
- Cung cấp tổng quan về kiến trúc kho tri thức V-Heritage Knowledge Base.
- Bảng chỉ mục dẫn hướng tới tất cả 5 phân vùng: `guidelines/`, `schema/`, `costumes/`, `references/`, `templates/`.
- Định vị vai trò của tài liệu đối với đội ngũ phát triển (Bình: Dev, Tho: Assets, Nghi: Content/Rules).

- [ ] **Step 1: Tạo file `docs/knowledge/README.md` với đầy đủ cấu trúc chỉ mục**
- [ ] **Step 2: Kiểm tra liên kết tương đối giữa các thư mục con**

---

### Task 2: Biên soạn Phân vùng Quy chuẩn Nghiên cứu & AI Guardrails (`docs/knowledge/guidelines/`)

**Files:**
- Create: `docs/knowledge/guidelines/01-methodology-and-evidence.md`
- Create: `docs/knowledge/guidelines/02-cultural-guardrails.md`
- Create: `docs/knowledge/guidelines/03-anti-hallucination-rules.md`

**Interfaces & Responsibilities:**
- `01-methodology-and-evidence.md`: Quy định nguyên tắc phân biệt "Cổ phục" vs "Di sản sống"; thang đo chứng cứ Level A (Hiện vật), B (Chuyên khảo), C (Báo chí), D (Diễn giải); bác bỏ tiến hóa đơn tuyến.
- `02-cultural-guardrails.md`: Đặc tả chi tiết 7 Cổng kiểm soát văn hóa AI (Identity, Period, Status, Layer, Technique, Occasion, Evidence Gate) kèm điều kiện kích hoạt và thông điệp cảnh báo tích cực.
- `03-anti-hallucination-rules.md`: Danh mục các tuyên bố cấm khẳng định tuyệt đối (Mốc 1744 Đàng Trong, ý nghĩa 5 cúc / 5 thân, định kiến tộc người, ảnh phục dựng hiện đại).

- [ ] **Step 1: Tạo `01-methodology-and-evidence.md`**
- [ ] **Step 2: Tạo `02-cultural-guardrails.md`**
- [ ] **Step 3: Tạo `03-anti-hallucination-rules.md`**
- [ ] **Step 4: Kiểm tra nội dung đảm bảo không sót nguyên tắc nào trong Phần 0, III, IV của bản gốc**

---

### Task 3: Biên soạn Khung Phân rã Kỹ thuật & Ánh xạ CSDL (`docs/knowledge/schema/`)

**Files:**
- Create: `docs/knowledge/schema/01-garment-decomposition-framework.md`
- Create: `docs/knowledge/schema/02-database-mapping-spec.md`

**Interfaces & Responsibilities:**
- `01-garment-decomposition-framework.md`: Đặc tả 11 lớp phân rã cấu trúc trang phục (Identity, Silhouette, Layering, Lower garment, Fastening, Headwear, Accessories, Material & Craft, Decoration, Context, Evidence).
- `02-database-mapping-spec.md`: Bảng ánh xạ cụ thể từ taxonomy tri thức sang các trường trong 4 bảng CSDL Supabase của Synapse: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`.

- [ ] **Step 1: Tạo `01-garment-decomposition-framework.md`**
- [ ] **Step 2: Tạo `02-database-mapping-spec.md` với bảng mapping và mẫu JSON tương thích**
- [ ] **Step 3: Đối chiếu với `docs/shared/DATABASE-SCHEMA.sql` để đảm bảo khớp 100% cột dữ liệu**

---

### Task 4: Hồ sơ Chi tiết Cổ phục Người Việt (Kinh) (`docs/knowledge/costumes/kin-heritage/`)

**Files:**
- Create: `docs/knowledge/costumes/kin-heritage/ao-giao-linh.md`
- Create: `docs/knowledge/costumes/kin-heritage/ao-tu-than.md`
- Create: `docs/knowledge/costumes/kin-heritage/ao-ngu-than-tay-chen.md`
- Create: `docs/knowledge/costumes/kin-heritage/ao-tac-tay-thung.md`
- Create: `docs/knowledge/costumes/kin-heritage/ao-nhat-binh.md`
- Create: `docs/knowledge/costumes/kin-heritage/ao-dai-hien-dai.md`

**Interfaces & Responsibilities:**
- Mỗi file bắt buộc có Frontmatter YAML chuẩn (id, canonical_name, category, period, gender, layer_order, evidence_level).
- Mỗi file triển khai đầy đủ: 7 trục phân tích lịch sử, Bảng phân rã cấu trúc (thân, cổ, tay, tà, hạ y, phụ kiện), Lưu ý khi số hóa trên Canvas, Quy tắc phối đồ (Cultural Rules liên kết), và Dẫn chứng hiện vật/nguồn kiểm chứng (URL sạch, không base64).

- [ ] **Step 1: Tạo `ao-giao-linh.md`**
- [ ] **Step 2: Tạo `ao-tu-than.md`**
- [ ] **Step 3: Tạo `ao-ngu-than-tay-chen.md`**
- [ ] **Step 4: Tạo `ao-tac-tay-thung.md`**
- [ ] **Step 5: Tạo `ao-nhat-binh.md`**
- [ ] **Step 6: Tạo `ao-dai-hien-dai.md`**
- [ ] **Step 7: Rà soát kiểm chứng thông tin so với các nguồn Bảo tàng Lịch sử Quốc gia, Bảo tàng Phụ nữ VN, Sở VHTT Huế**

---

### Task 5: Hồ sơ Trang phục Dân tộc Thiểu số (`docs/knowledge/costumes/ethnic-groups/`)

**Files:**
- Create: `docs/knowledge/costumes/ethnic-groups/thai.md`
- Create: `docs/knowledge/costumes/ethnic-groups/dao-do.md`
- Create: `docs/knowledge/costumes/ethnic-groups/hmong-hoa.md`
- Create: `docs/knowledge/costumes/ethnic-groups/e-de.md`
- Create: `docs/knowledge/costumes/ethnic-groups/ba-na.md`

**Interfaces & Responsibilities:**
- Mỗi file có Frontmatter YAML chuẩn (nhóm địa phương, ngữ hệ, phân vùng cư trú, evidence level).
- Cung cấp mô hình lịch sử 4 lớp: Community history, Material history, Garment history, Living history.
- Tích hợp case study hiện vật cụ thể từ Bảo tàng Dân tộc học Việt Nam (Áo dài Dao Đỏ Nà Tông 1995, Váy Hmông Hoa Mù Cang Chải 1995/2000, Dệt tấm Ê-đê, Ba-na).

- [ ] **Step 1: Tạo `thai.md`**
- [ ] **Step 2: Tạo `dao-do.md`**
- [ ] **Step 3: Tạo `hmong-hoa.md`**
- [ ] **Step 4: Tạo `e-de.md`**
- [ ] **Step 5: Tạo `ba-na.md`**
- [ ] **Step 6: Rà soát đảm bảo các quy tắc chống dán nhãn đồng nhất (subgroup lock) được ghi rõ**

---

### Task 6: Thư viện Hiện vật & Thư mục Nguồn Tham khảo (`docs/knowledge/references/`)

**Files:**
- Create: `docs/knowledge/references/01-museum-artifacts-catalog.md`
- Create: `docs/knowledge/references/02-bibliography.md`

**Interfaces & Responsibilities:**
- `01-museum-artifacts-catalog.md`: Bảng kê chi tiết tất cả các hiện vật bảo tàng được trích dẫn (Bảo tàng Lịch sử Quốc gia, Bảo tàng Dân tộc học VN, Bảo tàng Phụ nữ VN) gồm mã hiện vật, địa bàn thu thập, năm sưu tầm, chất liệu, kỹ thuật.
- `02-bibliography.md`: Thư mục toàn bộ sách chuyên khảo (Ngàn năm áo mũ...), công trình nghiên cứu, báo cáo khoa học, bài viết cơ quan quản lý kèm liên kết URL chính thức và ghi chú bản quyền.

- [ ] **Step 1: Tạo `01-museum-artifacts-catalog.md`**
- [ ] **Step 2: Tạo `02-bibliography.md`**

---

### Task 7: Khuôn Mẫu Mở Rộng Dành Cho Nghiên Cứu Viên (`docs/knowledge/templates/`)

**Files:**
- Create: `docs/knowledge/templates/costume-profile-template.md`
- Create: `docs/knowledge/templates/cultural-rule-template.md`

**Interfaces & Responsibilities:**
- `costume-profile-template.md`: Khung mẫu chuẩn hóa 7 trục phân tích và bảng phân rã cấu trúc để các bạn nghiên cứu (Tho, Nghi) dễ dàng bổ sung trang phục mới trong tương lai.
- `cultural-rule-template.md`: Khung mẫu chuẩn hóa để khai báo thêm luật phối đồ vào cơ sở tri thức.

- [ ] **Step 1: Tạo `costume-profile-template.md`**
- [ ] **Step 2: Tạo `cultural-rule-template.md`**

---

### Task 8: Dọn dẹp File Cũ, Kiểm tra Toàn Vẹn & Báo Cáo

**Files:**
- Remove: `docs/knowledge/Arena-AI.md`
- Remove: `docs/knowledge/Arena AI.md` (nếu còn tồn tại trong git index)

- [ ] **Step 1: Xóa các file cũ khổng lồ `Arena-AI.md` và `Arena AI.md`**
- [ ] **Step 2: Kiểm tra tổng thể các file mới tạo trong `docs/knowledge/`**
- [ ] **Step 3: Chạy `git status` xác nhận sạch sẽ và tất cả các file mới đã được thêm vào**
- [ ] **Step 4: Commit toàn bộ công việc lên nhánh `docs/S2.4-cultural-knowledge-base-modularization`**
