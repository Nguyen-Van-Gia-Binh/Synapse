# Hướng Dẫn Kỹ Thuật & Ngữ Cảnh Dành Cho AI Coding Agent (GEMINI.md)

> Tài liệu này được tự động nạp làm ngữ cảnh chỉ dẫn tối cao cho Gemini, Antigravity và các AI Coding Agent khi tham gia phát triển mã nguồn trong kho lưu trữ **Synapse**. Mọi đoạn mã sinh ra hoặc đề xuất kiến trúc đều phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

---

## 1. Định Vị Dự Án & Bản Sắc Thị Giác (Project Identity)

- **Tên dự án:** Synapse – V-Heritage Studio
- **Mục tiêu cốt lõi:** Nền tảng thời trang sáng tạo (Fashion-Tech Studio) kết hợp không gian khám phá tri thức văn hóa (Cultural Hub) cho giới trẻ, hỗ trợ phối trang phục truyền thống Việt Nam theo phong cách Gen Z cho cả **Nam** và **Nữ**.
- **Ngôn ngữ thẩm mỹ (Visual Language):** **"Heritage Futurism"**
  - **Màu sắc & Chất liệu:** Giao diện tối màu (Dark mode sang trọng) hoặc tone giấy dó/be ấm áp (Warm Parchment), phối hợp hiệu ứng kính mờ (Glassmorphism) để tôn vinh màu sắc sống động của các tà cổ phục.
  - **Typography:**
    - Tiêu đề & Tên trang phục: Font chữ có chân thanh thoát, mang hồn cốt truyền thống Việt (*Playfair Display* hoặc *Cinzel*).
    - Nội dung & Giao diện tương tác: Font không chân hiện đại, tối ưu hiển thị tiếng Việt hoàn hảo (*Be Vietnam Pro* hoặc *Inter*).
  - **Micro-interactions:** Chuyển cảnh mềm mại (fade transition 150-200ms), hiệu ứng đổi màu vải êm dịu, không giật lag.

---

## 2. Vùng Cấm Văn Hóa (Cultural Guardrails for AI)

Dự án mang trọng trách gìn giữ và lan tỏa bản sắc văn hóa Việt Nam. AI tuyệt đối phải tuân thủ:

1. **Tuyệt đối không bịa đặt dữ liệu lịch sử (No Hallucination on Culture):**
   - Không tự suy diễn hoặc bịa đặt niên đại, nguồn gốc xuất xứ, hay ý nghĩa tâm linh/văn hóa của các trang phục (Áo dài ngũ thân, Áo tấc, Áo Nhật bình, Áo giao lĩnh, Khăn đóng, Nón quai thao...).
   - Mọi tri thức văn hóa hiển thị trên giao diện phải được truy vấn từ bảng `cultural_facts` trong Supabase hoặc lấy từ tài liệu nghiên cứu đã duyệt trong [docs/PLAN.md](docs/PLAN.md) và [docs/ProjectBrief.md](docs/ProjectBrief.md).
2. **Giọng văn cảnh báo tích cực & lịch sự (Friendly Cultural Guidance):**
   - Khi tạo logic hoặc câu thông báo cho hệ thống cảnh báo (Cultural Guardrails), **tuyệt đối không dùng từ ngữ phán xét, gay gắt hay cấm đoán tiêu cực**.
   - Phải giữ giọng điệu tôn trọng sự sáng tạo của Gen Z, đóng vai trò như một người bạn đồng hành gợi ý văn hóa (vd: *"Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?"* thay vì *"Bạn phối đồ sai quy tắc lịch sử"*).

---

## 3. Quy Chuẩn Kiến Trúc Kỹ Thuật (Architecture Guardrails)

### 3.1. Cơ chế Canvas Xếp Lớp (Paper-Doll Overlay)
- **Tỉ lệ & Kích thước cố định:** Toàn bộ ảnh Mannequin và các chi tiết trang phục, phụ kiện bắt buộc tuân theo khung chuẩn **`800 x 1200 px`** (tỉ lệ 2:3), định dạng `.png` trong suốt.
- **Tọa độ tuyệt đối:** Mọi item đã được bóc nền và căn đúng vị trí trên cơ thể mẫu từ trước. Khi vẽ Canvas, chỉ cần render chồng các lớp lên vị trí gốc `(0, 0, 800, 1200)` theo thứ tự `layer_order` (Z-Index).
- **Hệ thống 6 Slot cố định:**
  1. `HEADWEAR`: Mũ, khăn đóng, mấn triều Nguyễn, nón quai thao (Z-Index cao nhất trên đầu).
  2. `TOP`: Áo ngũ thân, áo tấc, áo lót...
  3. `BOTTOM`: Quần lụa, quần tây, chân váy...
  4. `PATTERN`: Hoa văn thêu, họa tiết phụng bào, mây sóng thủy ba.
  5. `ACCESSORY`: Quạt lụa, ngọc bội, kính râm, túi xách...
  6. `FOOTWEAR`: Guốc mộc, hài thêu, giày sneaker hiện đại.

### 3.2. Đổi Màu Sắc Vải (Color Multiply / Canvas Tinting)
- Cung cấp sẵn **Bảng 8 màu cổ phong Việt Nam**: *Đỏ điều (`#9E2A2B`), Vàng hoa mướp (`#E9C46A`), Xanh chàm/thủy ba (`#264653`), Xanh cổ vịt (`#2A9D8F`), Tía ngọc (`#5A189A`), Trắng ngà (`#F4F1DE`), Đen mun (`#1D1E2C`), Nâu sồng (`#6F4E37`)*.
- Hỗ trợ Hex Color Picker cho phép người dùng mở rộng sáng tạo tự do.

### 3.3. Cấu Trúc Thẻ V-Lookbook Xuất Bản (9:16)
- Thẻ kết quả phối đồ có tỉ lệ dọc `9:16` (chuẩn Instagram Story / TikTok / Reels).
- Bao gồm: Logo Synapse Studio, hình ảnh bộ phối hoàn chỉnh, tên tác phẩm, bảng mã màu đã dùng, Thẻ tri thức văn hóa trích dẫn, và Điểm hòa sắc (Color Harmony Score).

### 3.4. Mô Hình CSDL Supabase (Core Schema)
AI không được tự ý sửa đổi cấu trúc 4 bảng chính này nếu chưa có sự thống nhất trong `docs/PLAN.md`:
- `items`: Danh mục trang phục & phụ kiện (`id`, `name`, `gender`, `slot`, `layer_order`, `image_url`, `color_customizable`, `default_color`, `tags`).
- `cultural_facts`: Thẻ tri thức (`id`, `item_id`, `era`, `origin_story`, `symbolic_meaning`, `modern_styling_tip`).
- `cultural_rules`: Quy tắc kiểm tra phối đồ (`id`, `rule_code`, `trigger_slot`, `trigger_tag`, `condition`, `severity`, `message`).
- `lookbooks`: Tác phẩm người dùng lưu (`id`, `title`, `gender`, `outfit_data`, `harmony_score`, `created_at`).

---

## 4. Tech Stack & Môi Trường Triển Khai

- **Frontend:** React 18+ với Vite, TypeScript, Tailwind CSS / Vanilla CSS cao cấp, HTML5 Canvas API (Deploy lên **Vercel**).
- **Backend:** Node.js với Express hoặc NestJS, TypeScript, RESTful API (Deploy lên **Render.com**).
- **Database & Storage:** PostgreSQL trên **Supabase** + Supabase Storage chứa ảnh asset PNG.

---

## 5. Quy Chuẩn Lập Trình Cho AI (Coding Standards)

1. **TypeScript Strict Mode:** Bắt buộc định nghĩa interface / type rõ ràng cho mọi thực thể (`Item`, `CulturalFact`, `OutfitLayer`, `ColorPalette`). Cấm sử dụng kiểu `any`.
2. **Kiến trúc Module hóa (Separation of Concerns):**
   - Tách biệt rõ ràng giữa logic Canvas Engine, tầng gọi API (Services), và tầng hiển thị Component UI.
   - Viết code dễ đọc, có chú thích giải nghĩa cho các thuật toán hòa sắc và xử lý pixel Canvas.
3. **Tuân thủ Quy trình Git:** Mọi commit và Pull Request tạo bởi hoặc được gợi ý bởi AI phải tuân thủ chuẩn mực trong [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 6. Quy Trình Tự Động Hóa Duyệt Công Việc (Approval Workflow: "OK")

Khi Người dùng phản hồi: **"OK"** (hoặc *"Duyệt"*, *"Đồng ý"*), AI Coding Agent hiểu rằng Người dùng đã duyệt công việc của task hiện tại và **tự động thực thi 100% chuỗi hành động sau qua GitHub CLI (`gh`) và Git**:

1. **Đẩy nhánh lên Remote:** Đảm bảo toàn bộ commit của nhánh tính năng hiện tại (`feature/...`, `fix/...`, v.v.) đã được push lên `origin`.
2. **Tạo Pull Request với mô tả chuẩn:**
   - Dùng lệnh: `gh pr create --title "..." --body "..." --base main`.
   - Tiêu đề chuẩn Conventional Commits (ví dụ: `feat(catalog): phát triển API Catalog & Thẻ Cultural Factcard (S1.2)`).
   - Nội dung `body` gồm: Tổng quan, danh sách chi tiết tính năng FE/BE đã hoàn thành, kết quả kiểm thử (`npm test`, build status) và mã task liên kết (`Refs: ...`).
3. **Squash and Merge:**
   - Tự động thực thi lệnh: `gh pr merge --squash --delete-branch` để gộp toàn bộ commit thành 1 commit duy nhất trên `main` và xóa nhánh tính năng trên GitHub (remote).
4. **Dọn dẹp và Đồng bộ Local:**
   - Chuyển về nhánh chính: `git checkout main`.
   - Cập nhật mã nguồn mới nhất: `git pull origin main`.
   - Xóa nhánh tính năng ở máy local: `git branch -D <feature-branch>`.
5. **Sẵn sàng cho task tiếp theo:**
   - Thông báo ngắn gọn kết quả cho Người dùng.
   - Khi bắt đầu task tiếp theo, luôn đứng từ `main` đã cập nhật để tạo nhánh mới: `git checkout -b <loại>/<mã-task>-<mô-tả-ngắn>`.

