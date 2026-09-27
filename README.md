<div align="center">

## 🌟 Giới Thiệu Dự Án

Áo dài ngũ thân, Áo tấc, Áo Nhật bình và các loại trang phục truyền thống Việt Nam đang nhận được sự quan tâm mạnh mẽ từ giới trẻ. Tuy nhiên, rào cản lớn hiện nay là người dùng trẻ chưa dễ dàng tiếp cận kiến thức chuẩn xác về nguồn gốc, cấu trúc, cũng như cách phối đồ sao cho vừa hiện đại, cá tính nhưng vẫn tôn trọng giá trị văn hóa cốt lõi.

**Synapse – V-Heritage Studio** ra đời như một không gian sáng tạo thời trang công nghệ (**Fashion-Tech Studio**) kết hợp cổng khám phá tri thức văn hóa (**Cultural Hub**), giúp thế hệ Gen Z tự do thể hiện phong cách cá nhân trên nền di sản cha ông.

---

## ✨ Tính Năng Nổi Bật

| Tính năng                              | Mô tả trải nghiệm                                                                                                                                                                           |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 👗**Paper-Doll Canvas 6 Slot**     | Cơ chế xếp lớp trang phục 2D tỉ lệ chuẩn`800x1200 px` mượt mà với 6 vị trí: `Áo`, `Quần`, `Họa tiết`, `Phụ kiện`, `Giày`, `Mũ/Mấn` cho cả mẫu Nam & Nữ. |
| 📜**Cultural Factcard Động**     | Khám phá nguồn gốc lịch sử triều Nguyễn, ý nghĩa cúc ngũ thường, cổ áo và các mẹo phối đồ hiện đại hiển thị tức thì khi click vào trang phục.                    |
| 🛡️**Cultural Guardrails Engine** | Hệ thống gợi ý và cảnh báo thông minh, tích cực khi outfit vi phạm quy tắc văn hóa (vd: mặc áo ngũ thân thiếu quần) với câu từ văn minh, thân thiện.                  |
| 🎨**Dual Color Palette**           | Bảng 8 sắc màu Cổ phong Việt Nam (*Đỏ điều, Vàng hoa mướp, Xanh chàm, Xanh cổ vịt, Tía ngọc...*) kết hợp Hex Color Picker tùy biến tự do.                               |
| 📸**Xuất Bản V-Lookbook 9:16**   | Render thẻ ảnh tỷ lệ 9:16 chất lượng cao kèm trích dẫn văn hóa và Điểm hòa sắc để dễ dàng chia sẻ lên Instagram Story, TikTok, Facebook.                                 |

---

## 🛠️ Kiến Trúc & Tech Stack

Dự án được xây dựng theo triết lý **Data-Driven & Extensible**, tách biệt hoàn toàn giữa mã nguồn và dữ liệu văn hóa:

```
Synapse Platform
├── Frontend (React + TypeScript + HTML5 Canvas / SVG)  ──▶ Deploy: Vercel
├── Backend API (Node.js + Express / TypeScript)        ──▶ Deploy: Render.com
└── Database & Storage (PostgreSQL on Supabase)         ──▶ Supabase Cloud
```

* **Frontend:** React 18, Vite, TypeScript, Canvas API, Tailwind CSS / Custom Glassmorphism CSS.
* **Backend:** Node.js, Express, TypeScript, RESTful API.
* **Database & Assets:** Supabase (PostgreSQL 4 bảng cốt lõi: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`) & Supabase Storage.
* **Quy chuẩn đồ họa:** Khung ảnh bóc nền cố định `800 x 1200 px` (tỉ lệ 2:3), định dạng `.png` trong suốt.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
Synapse/
├── .github/                      # GitHub Issue & PR Templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                         # Kho tài liệu đặc tả chuẩn Agile & RUP
│   ├── PLAN.md                   # Kế hoạch chi tiết 16 ngày & cấu trúc CSDL
│   ├── srs/                      # Yêu cầu phần mềm (ProjectBrief, USER-STORY, USE-CASE, DoD)
│   ├── shared/                   # Hợp đồng chung (API-CONTRACTS, BUSINESS-LOGIC, SCHEMA)
│   ├── frontend/                 # Đặc tả UI/UX (DESIGN-SYSTEM, CANVAS-ARCHITECTURE)
│   ├── backend/                  # Đặc tả kỹ thuật API (ARCHITECTURE, DEPLOYMENT)
│   ├── devProcess/               # Nhật ký phát triển / PR hằng ngày
│   └── superpowers/              # Tài liệu thiết kế & kế hoạch kỹ thuật tự sinh của AI
├── frontend/                     # Ứng dụng Giao diện React 18 + Vite + TypeScript
├── backend/                      # Dịch vụ API Node.js + Express + TypeScript
├── CONTRIBUTING.md               # Quy trình làm việc với Git, nhánh, commit & review
├── GEMINI.md                     # Chỉ dẫn bối cảnh & vùng cấm văn hóa cho AI Agent
├── .gitignore                    # Bộ lọc bảo mật và tệp build
├── LICENSE                       # Giấy phép nguồn mở MIT
└── README.md                     # Trang giới thiệu tổng quan dự án
```

---

## 📅 Lộ Trình 16 Ngày (Agile Fast-Track)

- **Sprint 0 (21/09 - 23/09):** Khởi tạo nền tảng, thiết lập Git Governance, tài liệu chuẩn hóa và cấu hình Supabase.
- **Sprint 1 (24/09 - 29/09):** Xây dựng Core Canvas Engine (xếp lớp 6 slot), đổi màu vải và API Catalog & Factcard.
- **Sprint 2 (30/09 - 05/10):** Tích hợp Cultural Guardrails Engine, tính điểm hòa sắc và xuất Lookbook 9:16.
- **Sprint 3 (06/10 - 07/10):** Nạp dữ liệu thực tế từ đội ngũ nghiên cứu, kiểm thử toàn diện, deploy Vercel + Render và tổng duyệt bàn giao.

---

## 👥 Đội Ngũ Phát Triển (Team Members)

- **Bình (Leader / Lead Dev & Product Owner):** Thiết kế kiến trúc tổng thể, Canvas Engine, phát triển Frontend/Backend, tích hợp Supabase Cloud và triển khai Vercel/Render.
- **Tho (Cultural Researcher & Asset Specialist):** Nghiên cứu tư liệu lịch sử, chuẩn hóa và bóc nền ảnh phục trang chuẩn `800x1200 px` cho Mannequin Nam/Nữ và hệ thống trang phục cổ phong.
- **Nghi (Cultural Researcher & Content Specialist):** Biên soạn Cultural Facts văn hóa, xây dựng bộ quy tắc ứng xử di sản (Cultural Guardrails), nghiên cứu Persona người dùng và tài liệu báo cáo.

---

## 🤝 Đóng Góp & Quy Chuẩn Git

Mọi đóng góp vào dự án đều phải tuân thủ quy trình làm việc được định nghĩa tại **[CONTRIBUTING.md](CONTRIBUTING.md)**:

- Sử dụng mô hình **GitHub Flow** (nhánh `main` luôn chạy được, nhánh task ngắn hạn `<loại>/<mã-task>-<mô-tả>`).
- Tuân thủ chuẩn commit **Conventional Commits** (hỗ trợ thêm loại `asset` và `data`).
- Mọi Pull Request đều phải qua kiểm duyệt (Review) và đạt tiêu chuẩn **Definition of Done (DoD)** trước khi Squash & Merge.

---

## 📄 Giấy Phép (License)

Dự án được phân phối dưới giấy phép **[MIT License](LICENSE)**. Bản quyền © 2026 Synapse Team / Nguyen-Van-Gia-Binh.
