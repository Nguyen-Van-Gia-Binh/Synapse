# Đặc Tả Thiết Kế: Thiết Lập Nền Tảng Tài Liệu Quản Trị & Git Governance Cho Dự Án Synapse

- **Dự án:** Synapse – V-Heritage Studio (Nền tảng phối trang phục truyền thống theo phong cách Gen Z)
- **Tác giả:** Antigravity AI Pair Programmer & Lead Dev
- **Ngày lập:** 22/09/2026
- **Trạng thái:** Đã thống nhất thiết kế (Validated Design)
- **Tài liệu tham chiếu:** [docs/ProjectBrief.md](../../ProjectBrief.md), [docs/PLAN.md](../../PLAN.md)

---

## 1. Mục Tiêu & Bối Cảnh

Dự án Synapse bước vào Sprint 0 (21/09 - 23/09/2026) với thời hạn bàn giao 16 ngày (07/10/2026). Đội ngũ gồm 3 thành viên:
1. **Leader (Lead Dev & Product Owner):** Phụ trách kiến trúc kỹ thuật, Canvas Engine, mã nguồn Frontend/Backend và tích hợp cơ sở dữ liệu.
2. **2 Thành viên Nghiên cứu (Research & Content):** Phụ trách tư liệu lịch sử, chuẩn hóa ảnh bóc nền PNG `800x1200 px`, soạn thảo fact văn hóa và bộ quy tắc cấm kỵ (Cultural Rules).

Mục tiêu của đợt thiết lập này là xây dựng khung quản trị mã nguồn (Git Governance), quy chuẩn cộng tác, tệp chỉ dẫn dành riêng cho AI Coding Agent (`GEMINI.md`), và các tài liệu nền tảng nhằm bảo đảm tính kỷ luật kỹ thuật và sự tôn trọng chuẩn mực văn hóa truyền thống ngay từ ngày đầu.

---

## 2. Chi Tiết Các Tệp Quản Trị Cốt Lõi

### 2.1. `CONTRIBUTING.md` — Quy Trình Làm Việc Với Git & Chuẩn Mực Đóng Góp

Kế thừa và tối ưu từ tài liệu chuẩn mực của nhóm, văn bản này quy định:

#### A. Mô hình nhánh (GitHub Flow)
- **`main`**: Nhánh duy nhất tồn tại lâu dài, luôn luôn ở trạng thái build thành công và chạy được (Ready to Demo / Auto-deploy lên Vercel & Render). Nghiêm cấm commit trực tiếp lên `main`.
- **Nhánh nhiệm vụ (Task Branches)**: Tạo từ `main`, gắn với mã task trong `docs/PLAN.md`. Tuổi thọ nhánh không quá 3-5 ngày.
  - Cú pháp: `<loại>/<mã-task>-<mô-tả-ngắn>`
  - Bảng phân loại nhánh:
    | Tiền tố | Mục đích | Ví dụ |
    | :--- | :--- | :--- |
    | `feature/` | Chức năng mã nguồn mới | `feature/S1.1-canvas-engine` |
    | `asset/` | Nạp ảnh phục trang bóc nền PNG | `asset/S0.5-ngu-than-male-png` |
    | `data/` | Dữ liệu văn hóa / Migration Supabase | `data/S1.3-cultural-facts-seed` |
    | `fix/` | Sửa lỗi | `fix/S2.2-harmony-calc-bug` |
    | `docs/` | Chỉnh sửa tài liệu | `docs/S0.4-input-guidelines` |
    | `chore/` | Cấu hình, thư viện, CI/CD | `chore/S0.1-init-governance` |

#### B. Quy ước Commit (Conventional Commits Tinh Chỉnh)
- Cú pháp chuẩn:
  ```text
  <loại>(<phạm vi>): <mô tả ngắn bằng tiếng Việt>

  [phần thân giải thích lý do/bối cảnh nếu cần]

  Refs: <mã task trong docs/PLAN.md>
  ```
- Phân loại commit:
  - `feat`: Thêm tính năng cho người dùng.
  - `fix`: Sửa lỗi hệ thống.
  - `asset`: Nạp hình ảnh trang phục bóc nền đúng chuẩn `800x1200 px` (cho team research).
  - `data`: Nạp dữ liệu fact văn hóa, quy tắc cấm kỵ, script SQL Supabase.
  - `docs`: Cập nhật tài liệu kỹ thuật/nghiên cứu.
  - `refactor`, `style`, `chore`, `test`.
- Phạm vi (`scope`): `canvas`, `factcard`, `guardrail`, `lookbook`, `palette`, `auth`, `db`, `docs`, `fe`, `be`.

#### C. Quy trình Pull Request & Review Code
- Mở PR dạng **Draft** ngay khi bắt đầu làm task để tránh xung đột công việc.
- **Tiêu đề PR:** `[<Mã-Task>] <loại>(<phạm vi>): <mô tả>` (vd: `[S1.1] feat(canvas): tích hợp bộ xếp lớp Paper-Doll 6 slot`).
- **Phân bổ thẩm quyền duyệt:**
  - Lead Dev duyệt: Mọi PR đụng vào mã nguồn Frontend, Backend, API, Database Schema.
  - Research Members duyệt: Các PR liên quan đến tính chuẩn xác của Fact văn hóa, quy chuẩn trang phục triều Nguyễn/dân gian, chất lượng ảnh asset.
- **Quy tắc duyệt:** Ít nhất 1 phê duyệt (Approval) trước khi merge. Nghiêm cấm tự duyệt PR của chính mình.
- **Chiến lược Merge:** **Squash and merge** để giữ lịch sử nhánh `main` luôn thẳng thớm, sạch sẽ. Xóa nhánh sau khi merge.

#### D. Definition of Done (DoD)
Một task chỉ được coi là hoàn tất khi:
1. Code build thành công, không có lỗi TypeScript / Linter.
2. File ảnh trang phục đạt chuẩn: PNG trong suốt, đúng kích thước `800x1200 px`, đúng tâm tọa độ cơ thể.
3. Nội dung văn hóa trích dẫn có căn cứ lịch sử, câu từ nhắc nhở tinh tế, không phán xét tiêu cực.
4. Có ít nhất 1 thành viên review và phê duyệt PR.
5. Task tương ứng trong `docs/PLAN.md` đã được đánh dấu hoàn thành.

---

### 2.2. `GEMINI.md` — Quy Chuẩn Dành Riêng Cho Trợ Lý AI Coding Agent

Tệp chỉ dẫn tối cao cho AI (Gemini, Antigravity) khi thực hiện tác vụ kỹ thuật trong repository:

#### A. Định vị Sản phẩm & Thẩm mỹ ("Heritage Futurism")
- Synapse là nền tảng kết hợp giữa tính thời trang hiện đại cho Gen Z và tri thức văn hóa cổ phục Việt Nam.
- Giao diện Dark mode sang trọng hoặc Warm Parchment giấy dó, kết hợp Glassmorphism.
- Font tiêu đề có chân thanh thoát (*Playfair Display*); font nội dung tối ưu tiếng Việt (*Be Vietnam Pro*).

#### B. Vùng cấm Văn hóa (Cultural Guardrails)
- **Không ảo giác về lịch sử:** AI không tự bịa đặt niên đại, ý nghĩa hoa văn, quy chế y quan triều Nguyễn hoặc dân gian. Mọi dữ liệu phải đối chiếu tài liệu nghiên cứu hoặc bảng `cultural_facts` trên Supabase.
- **Giọng điệu cảnh báo thân thiện (Friendly Guidance):** Khi AI sinh câu thông báo vi phạm văn hóa, phải giữ thái độ văn minh, tích cực, giải thích ý nghĩa thay vì cấm đoán cực đoan.

#### C. Ràng buộc Kỹ thuật Cốt lõi
- **Canvas Xếp lớp (Paper-Doll Overlay):** Kích thước chuẩn cố định `800 x 1200 px` (tỉ lệ 2:3). Vẽ theo thứ tự `layer_order` (Z-Index).
- **6 Slot Trang phục Cố định:** `TOP`, `BOTTOM`, `PATTERN`, `ACCESSORY`, `FOOTWEAR`, `HEADWEAR`.
- **Cơ sở dữ liệu Supabase 4 Bảng:** `items`, `cultural_facts`, `cultural_rules`, `lookbooks`. Tuyệt đối không tự ý thay đổi cột khi chưa cập nhật `docs/PLAN.md`.
- **Bảng màu:** Cung cấp sẵn 8 mã màu cổ phong Việt Nam (*Đỏ điều, Vàng hoa mướp, Xanh chàm/thủy ba, Xanh cổ vịt, Tía ngọc, Trắng ngà, Đen mun...*) + Color Picker tự do.

---

### 2.3. `README.md` — Bộ Mặt Dự Án Synapse

Bao gồm:
1. **Hero Section:** Tên dự án, huy hiệu (License MIT, React, Vite, Node.js, Supabase, TypeScript), slogan.
2. **Tính năng đột phá:** Canvas 6 slot, Thẻ tri thức văn hóa, Bộ não cảnh báo văn hóa thông minh, Bảng màu cổ phong, Xuất V-Lookbook 9:16.
3. **Kiến trúc & Tech Stack:** React + Vite (Frontend) | Node.js + Express (Backend) | Supabase (Database) | Vercel & Render (Deploy).
4. **Cấu trúc Thư mục:** Định hình cấu trúc phân cấp tương lai (`frontend/`, `backend/`, `docs/`, `.github/`).
5. **Lộ trình 16 ngày (Sprint 0 - Sprint 3):** Tóm tắt các mốc từ khởi tạo đến bàn giao.
6. **Hướng dẫn Đóng góp & Tham chiếu:** Dẫn tới `CONTRIBUTING.md`, `docs/PLAN.md` và `docs/ProjectBrief.md`.

---

### 2.4. Các Tệp Bổ Trợ & Bảo Mật

1. **`.gitignore`**:
   - Chặn rò rỉ bí mật: `.env`, `.env.local`, `.env.*.local`, `*.pem`.
   - Chặn file biên dịch & thư viện: `node_modules/`, `dist/`, `build/`, `*.tsbuildinfo`, `coverage/`.
   - Chặn file rác IDE & OS: `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`.
2. **`.github/PULL_REQUEST_TEMPLATE.md`**:
   - Biểu mẫu tạo PR chuẩn hóa với checklist tự động (Code build pass, ảnh đúng kích thước `800x1200`, fact chuẩn, không commit secret).
3. **`LICENSE`**:
   - Giấy phép nguồn mở MIT License (2026 Synapse Team / Nguyen-Van-Gia-Binh).

---

## 3. Quy Trình Khởi Tạo Git & Đồng Bộ Remote

1. Khởi tạo Git repository cục bộ với nhánh mặc định `main`:
   ```bash
   git init -b main
   git remote add origin https://github.com/Nguyen-Van-Gia-Binh/Synapse.git
   ```
2. Thêm toàn bộ các file quản trị và tài liệu:
   ```bash
   git add .
   git commit -m "chore: khởi tạo cấu trúc governance và tài liệu nền tảng cho dự án Synapse"
   ```
3. Đẩy nhánh `main` lên GitHub repository:
   ```bash
   git push -u origin main
   ```

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification Plan)

1. **Kiểm tra tính toàn vẹn của tệp:**
   - Xác minh tất cả các file (`README.md`, `CONTRIBUTING.md`, `GEMINI.md`, `.gitignore`, `LICENSE`, `.github/PULL_REQUEST_TEMPLATE.md`) tồn tại ở đúng vị trí.
2. **Kiểm tra liên kết chéo (Markdown Link Integrity):**
   - Đảm bảo mọi đường dẫn liên kết giữa các tài liệu (`docs/PLAN.md`, `docs/ProjectBrief.md`, `CONTRIBUTING.md`) hoạt động chính xác.
3. **Kiểm tra trạng thái Git:**
   - Chạy `git status` và `git log` để xác minh commit đầu tiên chuẩn Conventional Commits.
   - Chạy `git remote -v` để xác minh remote trỏ chính xác về `https://github.com/Nguyen-Van-Gia-Binh/Synapse.git`.
