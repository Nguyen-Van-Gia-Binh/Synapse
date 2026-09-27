# 📝 Nhật Ký Phát Triển: Tích Hợp Hạ Tầng Render & Đồng Bộ Supabase Cloud

- **Thời gian:** 09:30 - 14:15, ngày 27/09/2026
- **Phiên số:** 01 trong ngày
- **Người thực hiện:** Bình (Lead Dev) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #11 (Commit 445ff03)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/11) & [PR #12 (Commit 235b36a)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/12)

---

### 1. Mục tiêu phiên (Session Goal)
Thiết lập toàn diện hạ tầng Backend trên Render.com, kết nối cơ sở dữ liệu Supabase Cloud thực tế, đồng bộ bộ dữ liệu mẫu cổ phục (Seed Data) và giải quyết triệt để các lỗi build khi deploy production.

### 2. Những việc đã làm (What Was Done)
- **Backend / API / DB:**
  - Khởi tạo và liên kết Supabase Cloud project, chạy migration tạo 4 bảng lõi: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`.
  - Cấu hình Row Level Security (RLS) cho phép đọc công khai danh mục trang phục, bảo vệ dữ liệu lookbook.
  - Viết script nạp dữ liệu mẫu (`seed.ts`) với đầy đủ metadata lịch sử của các trang phục triều Nguyễn, áo dài ngũ thân, áo tấc, áo Nhật bình.
  - Cấu hình service Backend trên Render (Node.js/Express TypeScript).
- **Frontend / Vercel:**
  - Cập nhật biến môi trường `VITE_API_URL` trỏ về API Render live thay vì localhost.
  - Cấu hình CORS chặt chẽ giữa domain Vercel và Render.

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
- **Quyết định hạ tầng:** Tách biệt DB (Supabase Managed Postgres) và Web Service (Render) để tối ưu chi phí free-tier, tận dụng Supabase Storage cho tài nguyên ảnh trong tương lai.
- **Lỗi & Cách gỡ (Build Failure trên Render):**
  - *Hiện tượng:* Render chạy `npm install --omit=dev` khiến lệnh `tsc` báo lỗi `tsc: not found`.
  - *Giải pháp:* Chuyển `typescript` và `@types/node` từ `devDependencies` sang `dependencies` trong `backend/package.json`, đồng thời sửa Build Command thành `npm install && npm run build` (PR #12).

### 4. Kết quả kiểm thử (Verification)
- **Kiểm thử tự động:**
  - Backend: 25/25 tests pass qua Jest.
  - Frontend: 38/38 tests pass qua Vitest.
  - Build test: `npm run build` trên cả 2 thư mục đều hoàn thành với exit code 0.
- **Kiểm thử thực tế:**
  - Render Backend live tại: `https://synapse-backend-o6z5.onrender.com/health` phản hồi `{ status: "ok" }`.
  - Endpoint `GET /api/catalog` trả về đủ danh sách items kèm cultural facts từ Supabase.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [x] Tối ưu hóa Canvas Engine xử lý đa lớp và đổi màu vải mượt mà (chuyển sang Phiên 02).
- [ ] Thiết lập custom domain và caching Cloudflare nếu lưu lượng tăng cao.
