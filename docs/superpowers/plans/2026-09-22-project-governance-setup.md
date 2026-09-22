# Project Governance Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khởi tạo bộ tài liệu quản trị dự án, quy chế Git Flow & Conventional Commits (`CONTRIBUTING.md`), chỉ dẫn AI Agent (`GEMINI.md`), các tệp gốc (`README.md`, `.gitignore`, `LICENSE`, `.github/PULL_REQUEST_TEMPLATE.md`), đồng thời khởi tạo Git local và liên kết remote `https://github.com/Nguyen-Van-Gia-Binh/Synapse.git`.

**Architecture:** Thiết lập nền tảng quản trị repository theo mô hình GitHub Flow, tối ưu cho nhóm 3 người (1 Lead Dev + 2 Research members) trong lịch trình 16 ngày (Agile Fast-Track); thiết lập các ràng buộc kỹ thuật (Paper-Doll Canvas 800x1200 px, 6 slot, Supabase 4 bảng) và Cultural Guardrails (tôn trọng văn hóa Việt phục) ngay tại tầng tài liệu & AI context.

**Tech Stack:** Git, Markdown, GitHub Actions Templates, Conventional Commits.

**Spec:** [docs/superpowers/specs/2026-09-22-project-governance-setup-design.md](../../superpowers/specs/2026-09-22-project-governance-setup-design.md)

## Global Constraints

- Mọi tệp tài liệu tiếng Việt phải sử dụng bộ gõ Unicode chuẩn, hành văn mạch lạc, thuật ngữ kỹ thuật giữ nguyên tiếng Anh khi cần thiết.
- Khung ảnh phục trang quy chuẩn bắt buộc là `800 x 1200 px` (tỉ lệ 2:3), PNG trong suốt.
- Hệ thống 6 slot trang phục cố định: `TOP`, `BOTTOM`, `PATTERN`, `ACCESSORY`, `FOOTWEAR`, `HEADWEAR`.
- 4 bảng CSDL Supabase: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`.
- Remote GitHub: `https://github.com/Nguyen-Van-Gia-Binh/Synapse.git`.
- Nhánh chính mặc định: `main`.

---

### Task 1: Thiết lập `.gitignore` và `LICENSE` (MIT)

**Files:**
- Create: `.gitignore`
- Create: `LICENSE`

**Interfaces:**
- Consumes: Yêu cầu bảo mật và bản quyền từ Spec.
- Produces: Màng lọc loại trừ các file bí mật/build rác và căn cứ pháp lý nguồn mở.

- [ ] **Step 1: Soạn thảo tệp `.gitignore`**
  Chặn triệt để:
  - Secrets: `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`
  - Build/Deps: `node_modules/`, `dist/`, `build/`, `.vite/`, `out/`, `*.tsbuildinfo`, `coverage/`
  - IDE & OS: `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`
  - Logs: `*.log`, `npm-debug.log*`

- [ ] **Step 2: Soạn thảo tệp `LICENSE`**
  Áp dụng MIT License đầy đủ, ghi nhận bản quyền năm 2026 cho Synapse Team / Nguyen-Van-Gia-Binh.

- [ ] **Step 3: Kiểm tra tính hợp lệ của `.gitignore` và `LICENSE`**
  Xác minh tệp tồn tại ở thư mục gốc và không có ký tự lỗi.

---

### Task 2: Soạn thảo `CONTRIBUTING.md` (Quy trình Git & Đóng góp)

**Files:**
- Create: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: Mẫu quy trình làm việc Git của người dùng và thiết kế tại Spec § 2.1.
- Produces: Bộ quy tắc hoạt động cho cả 3 thành viên (Lead Dev và 2 Research members).

- [ ] **Step 1: Soạn thảo toàn văn `CONTRIBUTING.md`**
  Nội dung gồm 9 mục hoàn chỉnh:
  1. Mô hình nhánh (GitHub Flow: nhánh `main` luôn chạy được, nhánh nhiệm vụ ngắn hạn `<loại>/<mã-task>-<mô-tả>`).
  2. Đặt tên nhánh (`feature/`, `asset/`, `data/`, `fix/`, `docs/`, `chore/`).
  3. Quy ước commit (Conventional Commits: `feat`, `fix`, `asset`, `data`, `docs`, `refactor`, `style`, `chore`; cấu trúc `Refs: <mã task>`).
  4. Pull Request (Mở Draft sớm, tiêu đề chuẩn, mô tả theo template, kích thước < 400 dòng).
  5. Review code & Nội dung (Lead Dev duyệt code/DB; Research duyệt ảnh/fact; tối thiểu 1 approval, không tự duyệt).
  6. Merge và xử lý xung đột (Squash and merge, rebase cập nhật với `main`, `--force-with-lease`).
  7. Definition of Done (DoD) chuẩn hóa cho cả code, ảnh `800x1200`, fact văn hóa và `docs/PLAN.md`.
  8. Những thứ không được commit (Đối chiếu `.gitignore`).
  9. Tra nhanh câu lệnh Git thường dùng.

- [ ] **Step 2: Kiểm tra liên kết chéo**
  Xác minh các đường dẫn trỏ đến `docs/PLAN.md`, `docs/ProjectBrief.md` đều chính xác.

---

### Task 3: Soạn thảo `GEMINI.md` (Chỉ dẫn AI Coding Agent)

**Files:**
- Create: `GEMINI.md`

**Interfaces:**
- Consumes: Thiết kế tại Spec § 2.2 và thông số kiến trúc từ `PLAN.md`.
- Produces: Context và guardrails định hướng cho Gemini / Antigravity AI Agent.

- [ ] **Step 1: Soạn thảo toàn văn `GEMINI.md`**
  Bao gồm các phần cốt lõi:
  1. Tổng quan Dự án & Tinh thần Thiết kế: Synapse – V-Heritage Studio; phong cách "Heritage Futurism"; Dark mode kết hợp Glassmorphism và màu Giấy Dó (Warm Parchment).
  2. Vùng cấm Văn hóa (Cultural Guardrails): Cấm tuyệt đối bịa đặt dữ liệu lịch sử/triều đại; giọng điệu cảnh báo sai quy chuẩn văn hóa phải tinh tế, mang tính định hướng tích cực (Friendly Guidance).
  3. Ràng buộc Kỹ thuật Cốt lõi:
     - Paper-Doll Canvas Engine: khung chuẩn `800x1200 px` (tỉ lệ 2:3), xếp lớp theo `layer_order` (Z-Index).
     - 6 Slot trang phục cố định: `TOP`, `BOTTOM`, `PATTERN`, `ACCESSORY`, `FOOTWEAR`, `HEADWEAR`.
     - Supabase 4 bảng schema: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`.
     - Bảng màu cổ phong Việt Nam (8 màu chuẩn) kết hợp Custom Hex Picker.
     - Lookbook Card tỉ lệ 9:16.
  4. Quy tắc Lập trình: TypeScript Strict Mode, phân tầng module rõ ràng, tuân thủ Conventional Commits từ `CONTRIBUTING.md`.

- [ ] **Step 2: Rà soát kiểm tra**
  Xác minh không thiếu bất kỳ ràng buộc nào đã thống nhất trong Spec.

---

### Task 4: Soạn thảo `README.md` và `.github/PULL_REQUEST_TEMPLATE.md`

**Files:**
- Create: `README.md`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`

**Interfaces:**
- Consumes: Spec § 2.3 và § 2.4.
- Produces: Trang bìa giới thiệu dự án và form tạo Pull Request trên GitHub.

- [ ] **Step 1: Soạn thảo `README.md`**
  Bao gồm:
  - Hero Header với tên dự án Synapse – V-Heritage Studio, slogan và badges.
  - Các tính năng nổi bật (Canvas 6 slot, Cultural Factcard, Cultural Guardrails, Bảng màu Cổ phong, Lookbook 9:16).
  - Tech Stack & Hạ tầng Cloud (React, Vite, Node.js, Express, Supabase, Vercel, Render).
  - Cấu trúc thư mục repository (`frontend/`, `backend/`, `docs/`, `.github/`).
  - Lộ trình 16 ngày (4 Sprint) tóm tắt từ `docs/PLAN.md`.
  - Hướng dẫn đóng góp liên kết tới `CONTRIBUTING.md`.

- [ ] **Step 2: Soạn thảo `.github/PULL_REQUEST_TEMPLATE.md`**
  Khuôn mẫu PR gồm:
  - Nhiệm vụ / Mã Task liên kết `PLAN.md`.
  - Loại thay đổi (Feature, Asset ảnh 800x1200, Data fact/rule, Fix bug, Docs).
  - Nội dung thay đổi chi tiết.
  - Cách thức kiểm thử (Test steps).
  - Checklist tự kiểm tra trước khi yêu cầu review.

- [ ] **Step 3: Kiểm tra định dạng hiển thị Markdown**
  Đảm bảo bảng biểu, checklist và liên kết hiển thị đúng chuẩn GitHub Flavored Markdown.

---

### Task 5: Khởi tạo Git Local, Commit Đầu Tiên & Liên Kết Remote GitHub

**Files:**
- Modify: Git repository state

**Interfaces:**
- Consumes: Toàn bộ các file tài liệu đã tạo từ Task 1-4.
- Produces: Repository Git hoàn chỉnh sẵn sàng đẩy lên GitHub.

- [ ] **Step 1: Khởi tạo Git với nhánh mặc định `main`**
  ```powershell
  git init -b main
  ```

- [ ] **Step 2: Cấu hình remote GitHub**
  ```powershell
  git remote add origin https://github.com/Nguyen-Van-Gia-Binh/Synapse.git
  ```

- [ ] **Step 3: Thêm toàn bộ tệp vào staging và kiểm tra status**
  ```powershell
  git add .
  git status
  ```
  Xác minh các file secret không bị lọt vào staging.

- [ ] **Step 4: Tạo commit ban đầu (Initial Commit)**
  ```powershell
  git commit -m "chore: khởi tạo cấu trúc governance và tài liệu nền tảng cho dự án Synapse"
  ```

- [ ] **Step 5: Kiểm tra lịch sử Git**
  ```powershell
  git log -1 --stat
  git remote -v
  ```
