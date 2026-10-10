<div align="center">

# 🇻🇳 SYNAPSE – V-HERITAGE STUDIO 👘
### Nền tảng Thời trang Sáng tạo Cổ phục Việt Nam (Fashion-Tech Studio) & Không gian Tri thức Văn hóa (Cultural Hub) cho Thế hệ Gen Z

[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Style-Heritage%20Futurism%20Glassmorphism-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-69%2F69%20Passed%20(100%25)-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License MIT](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

<br/>

**Phong cách Thẩm mỹ:** *"Heritage Futurism"* (Hồn Xưa Dáng Nay — Tôn vinh tà áo truyền thống trong nhịp sống đương đại)

[🌟 Tính Năng Nổi Bật](#-tính-năng-cốt-lõi-core-features) • [🏛️ Tri Thức Lịch Sử](#-vùng-cấm-văn-hóa--nguồn-sử-liệu) • [🛠️ Kiến Trúc Hệ Thống](#%EF%B8%8F-kiến-trúc-kỹ-thuật--tech-stack) • [📁 Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục-dự-án) • [🚀 Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt--chạy-thực-nghiệm) • [👥 Đội Ngũ](#-đội-ngũ-phát-triển)

</div>

---

## 🌟 Bối Cảnh & Tuyên Ngôn Dự Án (Problem Statement & Vision)

Trang phục truyền thống Việt Nam — từ **Áo dài ngũ thân, Áo tấc tay thụng, Áo Nhật bình triều Nguyễn** cho đến **Áo giao lĩnh, Váy quây xếp ly thời Lê** — đang đón nhận làn sóng yêu thích nồng nhiệt từ giới trẻ. Tuy nhiên, người dùng trẻ hiện nay gặp phải 3 rào cản lớn:

1. **Thiếu không gian trải nghiệm trực quan:** Chưa có công cụ kỹ thuật số nào cho phép thử nghiệm phối cổ phục với phụ kiện đương đại (sneaker, kính râm, túi xách) một cách tiện lợi.
2. **Khó tiếp cận tri thức chuẩn xác:** Dữ liệu lịch sử, ý nghĩa ngũ thường (5 cúc áo) hay ngũ hành (hoa văn tay áo) thường nằm rải rác trong các nghiên cứu hàn lâm khó tiếp cận.
3. **E ngại phối sai quy tắc văn hóa:** Thiếu hệ thống đồng hành hướng dẫn hòa hợp di sản mà không mang tính phán xét, gay gắt.

**Synapse – V-Heritage Studio** ra đời nhằm giải quyết triệt để bài toán trên: Cung cấp một phòng studio số hóa chuẩn mực, trao quyền cho Gen Z tự do sáng tạo và khám phá chiều sâu văn hóa dân tộc trong từng tà áo.

---

## ✨ Tính Năng Cốt Lõi (Core Features)

| Icon | Tính Năng | Mô Tả Trải Nghiệm & Giá Trị Đột Phá |
| :---: | :--- | :--- |
| 👗 | **Paper-Doll Canvas 6 Slot** | Cơ chế xếp lớp 2D tỉ lệ vàng `800 x 1200 px` (2:3) với 6 vị trí chuẩn mực: `HEADWEAR` (Mũ/Mấn), `TOP` (Áo), `BOTTOM` (Quần/Váy), `PATTERN` (Hoa văn), `ACCESSORY` (Phụ kiện), `FOOTWEAR` (Giày/Hài). Tự động phân tầng Z-Index mượt mà cho cả **Nam** và **Nữ**. |
| 📜 | **Cultural Inspector & Factcard Động** | Khám phá tức thì (0ms latency) **Niên đại, Nguồn gốc xuất xứ, Ý nghĩa biểu tượng ngũ thường & ngũ hành** và **Mẹo phối Gen Z**. Tích hợp thanh **Quick Switcher Chips** cho phép chuyển đổi soi nhanh từng món đang mặc trên người mẫu chỉ bằng 1 cú click. |
| 🛡️ | **Cultural Guardrails Engine** | Hệ thống bảo trợ văn hóa tích cực: Tự động phát hiện các vi phạm quy tắc phối (vd: mặc áo ngũ thân thiếu quần) và đưa ra gợi ý thân thiện, mang tính cổ vũ sáng tạo theo quy chuẩn [GEMINI.md](GEMINI.md). |
| 🎨 | **Dual Palette & Canvas Color Multiply** | Bảng **8 sắc màu Cổ phong Việt Nam** (*Đỏ điều, Vàng hoa mướp, Xanh chàm, Xanh cổ vịt, Tía ngọc, Trắng ngà, Đen mun, Nâu sồng*) kết hợp công cụ **Hex Color Picker** mở rộng cho phép nhuộm màu vải bằng thuật toán nhân pixel Canvas thời gian thực. |
| ⚡ | **Real-time Color Harmony Radar** | Thuật toán chấm điểm hòa sắc độc bản (0 - 100 điểm) kết hợp biểu đồ tam giác SVG 3 trục: **Sắc độ (Hue)**, **Tương phản (WCAG 2.1)** và **Di sản (Thuyết Ngũ hành tương sinh)** kèm lời bình mỹ học chuyên sâu. |
| 📸 | **Xuất Bản V-Lookbook 9:16** | Render thẻ ảnh chuẩn dọc `9:16` (1080 x 1920 px) tối ưu hóa chia sẻ trực tiếp lên **Instagram Story, TikTok, Facebook Reels** gồm logo thương hiệu, bộ phối hoàn chỉnh, bảng mã màu đã dùng, điểm hòa sắc và thẻ trích dẫn văn hóa. |

---

## 🛠️ Kiến Trúc Kỹ Thuật & Tech Stack

Dự án áp dụng mô hình **Decoupled Architecture (Tách biệt hoàn toàn Client - Server - Database)** theo chuẩn mực Enterprise:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SYNAPSE V-HERITAGE STUDIO                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌────────────────────────────────────┐    ┌────────────────────────────────────┐
│      FRONTEND (Client-Side)        │    │       BACKEND (API Service)        │
│  • React 18 + TypeScript + Vite    │    │  • Node.js + Express + TypeScript  │
│  • HTML5 Canvas 2D Engine (Tinting)│    │  • Guardrails Pipeline & Scorer    │
│  • Zustand State (useOutfitStore)  │    │  • Strict Data Contracts (DTOs)    │
│  • Tailwind CSS Glassmorphism      │    │  • Unit & Integration Test Suites  │
│  Deploy: Vercel Cloud              │    │  Deploy: Render.com Cloud          │
└──────────────────┬─────────────────┘    └─────────────────┬──────────────────┘
                   │                                        │
                   └──────────────────┬─────────────────────┘
                                      ▼
                   ┌────────────────────────────────────┐
                   │    DATABASE & ASSETS STORAGE       │
                   │  • PostgreSQL 15 on Supabase       │
                   │  • 4 Bảng cốt lõi: items, facts,   │
                   │    cultural_rules, lookbooks       │
                   │  • Supabase Storage (PNG Assets)   │
                   └────────────────────────────────────┘
```

### Chi Tiết Công Nghệ Lựa Chọn:
* **Frontend:** React 18, Vite, TypeScript (Strict Mode), HTML5 Canvas 2D API, Lucide Icons, Tailwind CSS & Vanilla CSS Design Tokens.
* **Backend:** Node.js, Express, TypeScript, CORS, Axios, RESTful API.
* **Database & Cloud:** PostgreSQL trên **Supabase Cloud**, triển khai CI/CD trên **Vercel** (FE) và **Render.com** (BE).
* **Quy chuẩn Asset đồ họa:** Khung ảnh bóc nền cố định chuẩn `800 x 1200 px` (tỉ lệ 2:3), định dạng `.png` trong suốt.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
Synapse/
├── .github/                      # Quy chuẩn GitHub & mẫu Pull Request
│   └── PULL_REQUEST_TEMPLATE.md  # Template mô tả PR chuẩn Conventional Commits
├── backend/                      # Dịch vụ Backend REST API (Node.js + Express)
│   ├── src/
│   │   ├── config/               # Cấu hình môi trường & Supabase Client
│   │   ├── controllers/          # API Controllers (Items, Rules, Lookbooks)
│   │   ├── data/                 # Seed data tri thức lịch sử & quy tắc văn hóa
│   │   ├── routes/               # REST Endpoints (/items, /rules, /lookbooks)
│   │   ├── services/             # Business Logic, Cultural Guardrails, Scorer
│   │   ├── tests/                # Test suites tự động (26/26 tests passed)
│   │   └── types/                # DTOs & TypeScript Interfaces đồng bộ
│   ├── package.json
│   └── tsconfig.json
├── frontend/                     # Ứng dụng Giao diện Người dùng (React 18 + Vite)
│   ├── public/assets/mock/       # Kho ảnh phục trang PNG bóc nền chuẩn 800x1200 px
│   ├── src/
│   │   ├── components/
│   │   │   ├── cultural/         # CulturalFactcard, GuardrailToast, HarmonyRadar
│   │   │   ├── lookbook/         # LookbookModal & Canvas 9:16 Export Engine
│   │   │   ├── studio/           # CanvasViewport, ItemDrawer, LeftDock, Toolbar
│   │   │   └── ui/               # Button, Badges, ServerWakeupBanner
│   │   ├── services/             # Axios API Client kết nối máy chủ
│   │   ├── store/                # Zustand State Store (useOutfitStore)
│   │   ├── utils/                # Thuật toán Hòa sắc, WCAG Contrast, Ngũ Hành
│   │   └── types/                # TypeScript Types đồng nhất với Backend
│   ├── package.json
│   └── vite.config.ts
├── docs/                         # Kho tài liệu đặc tả chuẩn RUP & Agile
│   ├── PLAN.md                   # Kế hoạch tổng thể 16 ngày & mô hình CSDL
│   ├── srs/                      # Yêu cầu phần mềm (ProjectBrief, USER-STORY, USE-CASE)
│   └── shared/                   # Hợp đồng API (API-CONTRACTS, BUSINESS-LOGIC, SCHEMA)
├── CONTRIBUTING.md               # Quy chuẩn làm việc Git, phân nhánh & Review
├── GEMINI.md                     # Vùng cấm văn hóa & Quy chuẩn kỹ thuật tối cao
├── LICENSE                       # Giấy phép bản quyền nguồn mở MIT
└── README.md                     # Tài liệu tổng quan dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thực Nghiệm

Hội đồng giám khảo và lập trình viên có thể khởi chạy toàn bộ hệ thống trên môi trường máy cá nhân chỉ với vài bước đơn giản:

### 1. Yêu Cầu Tiên Quyết
* **Node.js:** Phiên bản `18.x` hoặc `20.x` LTS trở lên
* **Trình quản lý gói:** `npm` (đi kèm Node.js) hoặc `pnpm` / `yarn`
* **Git:** Phiên bản `2.30+`

### 2. Tải Mã Nguồn
```bash
git clone https://github.com/Nguyen-Van-Gia-Binh/Synapse.git
cd Synapse
```

### 3. Khởi Chạy Backend API Service (Cổng 5000)
```bash
cd backend
npm install
npm run dev
```
> Server API sẽ khởi động tại: **`http://localhost:5000`** (Kiểm tra sức khỏe hệ thống: `http://localhost:5000/api/health`).

### 4. Khởi Chạy Frontend Studio (Cổng 5173)
Mở một cửa sổ Terminal mới:
```bash
cd frontend
npm install
npm run dev
```
> Mở trình duyệt và truy cập: **`http://localhost:5173`** để bước vào không gian sáng tạo **Synapse Studio**.

### 5. Chạy Toàn Bộ Kiểm Thử Tự Động (Unit & Integration Tests)
Dự án được bảo vệ nghiêm ngặt bằng **69 kiểm thử tự động (100% Passed)**:

```bash
# Kiểm thử Frontend (43 tests - Canvas, Z-Index, Color Math, WCAG, Factcard, Store)
cd frontend
npm test -- --run

# Kiểm thử Backend (26 tests - API Endpoints, Guardrails Matching, Seed Data)
cd backend
npm test
```

---

## 🏛️ Vùng Cấm Văn Hóa & Nguồn Sử Liệu (Cultural Guardrails)

Dự án cam kết phụng sự và bảo tồn di sản dân tộc một cách nghiêm túc, tuân thủ chặt chẽ chỉ dẫn tại **[GEMINI.md](GEMINI.md)**:

1. **Tuyệt đối không bịa đặt lịch sử (No Cultural Hallucination):** Toàn bộ dữ liệu hiển thị về niên đại, nguồn gốc xuất xứ, cấu trúc áo (ngũ thân, áo tấc, áo giao lĩnh, áo đối khâm) và ý nghĩa biểu tượng đều được đối chiếu từ:
   * **Bảo tàng Lịch sử Quốc gia Việt Nam**
   * Công trình nghiên cứu *Ngàn năm áo mũ* (Học giả Trần Quang Đức)
   * Trung tâm Bảo tồn Di tích Cố đô Huế & Viện Sử học
2. **Ngôn ngữ cảnh báo văn minh, tích cực:** Khi người dùng phối đồ phá cách hoặc thiếu món đồ cơ bản, hệ thống đóng vai trò như một người bạn đồng hành gợi ý (*"Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?"*), tuyệt đối không dùng từ ngữ phán xét tiêu cực.

---

## 👥 Đội Ngũ Phát Triển (Team Members)

| Thành Viên | Vai Trò | Trách Nhiệm Chính Trong Dự Án |
| :--- | :--- | :--- |
| **Nguyễn Văn Gia Bình** | **Leader & Fullstack Architect** | Thiết kế kiến trúc tổng thể, Paper-Doll Canvas Engine, xây dựng hệ thống Frontend React & Backend Express, thuật toán hòa sắc Ngũ hành, tích hợp Supabase Cloud và CI/CD. |
| **Phạm Huỳnh Vĩnh Thọ** | **Cultural Researcher & Asset Specialist** | Nghiên cứu tư liệu phục trang các thời kỳ, bóc tách và chuẩn hóa bộ tài nguyên ảnh đồ họa Mannequin & Cổ phục chuẩn `800x1200 px` trong suốt. |
| **Phan Thảo Nghi** | **Cultural Researcher & Content Specialist** | Biên soạn hệ thống thẻ tri thức (Cultural Factcards), xây dựng luật bảo tồn di sản (Cultural Guardrails), khảo sát Persona thế hệ Gen Z và hoàn thiện tài liệu đặc tả SRS. |

---

## 🤝 Quy Chuẩn Kỹ Thuật & Đóng Góp (Git Governance)

Toàn bộ quá trình phát triển mã nguồn tuân thủ nghiêm ngặt quy trình kỹ nghệ phần mềm chuyên nghiệp:
* **Quy tắc vàng về Git:** Tuyệt đối không commit trực tiếp vào nhánh `main`. Mọi thay đổi đều được phân nhánh theo cú pháp: `<loại>/<mã-task>-<mô-tả-ngắn>`.
* **Tiêu chuẩn Commit:** Tuân thủ 100% [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`).
* **Đảm bảo chất lượng (Definition of Done):** Mọi Pull Request bắt buộc vượt qua toàn bộ test suite và build kiểm tra trước khi được Squash and Merge vào `main`.

---

## 📄 Giấy Phép Bản Quyền (License)

Dự án được phân phối dưới giấy phép nguồn mở **[MIT License](LICENSE)**.  
Bản quyền thuộc về **© 2026 Synapse Team / Nguyen-Van-Gia-Binh**. Phụng sự và phát triển vì tình yêu với di sản văn hóa Việt Nam.
