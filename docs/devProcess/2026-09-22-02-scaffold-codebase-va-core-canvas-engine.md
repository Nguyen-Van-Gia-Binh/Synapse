# 📝 Nhật Ký Phát Triển: Scaffold Codebase & Core Canvas Engine

- **Thời gian:** 11:35 - 13:00, ngày 22/09/2026
- **Phiên số:** 02 trong ngày
- **Người thực hiện:** Bình (Lead Dev) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #2 (S0.3)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/2) & [PR #3 (S1.1)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/3)

---

### 1. Mục tiêu phiên (Session Goal)

Khởi tạo cấu trúc dự án thực tế gồm Frontend (React + Vite + TypeScript) và Backend (Node.js + Express + TypeScript), đồng thời hiện thực hóa module Canvas Engine đầu tiên vẽ xếp lớp các trang phục cổ truyền.

### 2. Những việc đã làm (What Was Done)

- **Scaffold Codebase (Task S0.3):**
  - Khởi tạo thư mục `frontend/`: Cấu hình Vite, React 18, TypeScript Strict Mode, Tailwind CSS, Lucide Icons, Vitest harness.
  - Khởi tạo thư mục `backend/`: Cấu hình Express REST API, CORS middleware, TypeScript compiler (`tsconfig.json`), `tsx` development runner, Node test harness.
  - Thiết lập kiểu dữ liệu chung (`ClothingItem`, `OutfitLayer`, `SlotType`, `GenderType`).
- **Core Canvas Engine (Task S1.1):**
  - Xây dựng component `StudioCanvas` tuân thủ khung cố định `800 x 1200 px`.
  - Triển khai logic vẽ Canvas theo thứ tự Z-Index của 6 slot: `HEADWEAR`, `TOP`, `BOTTOM`, `PATTERN`, `ACCESSORY`, `FOOTWEAR`.
  - Quản lý trạng thái bộ đồ người dùng mặc bằng Zustand store (`useOutfitStore.ts`).

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)

- **Tọa độ tuyệt đối:** Toàn bộ ảnh asset cổ phục được bóc nền chuẩn 800x1200 px; Canvas chỉ cần gọi `ctx.drawImage(img, 0, 0, 800, 1200)` theo thứ tự slot, giảm thiểu tối đa phép tính tọa độ động phức tạp.
- **Xử lý tải ảnh bất đồng bộ:** Áp dụng Promise loader để chờ tất cả các lớp trang phục tải xong mới render lên Canvas nhằm tránh hiện tượng nhấp nháy (flickering).

### 4. Kết quả kiểm thử (Verification)

- Kiểm thử tự động:
  - Frontend: 12 tests pass cho Canvas rendering và outfit state logic.
  - Backend: Smoke tests khởi chạy server Express thành công.
- Kiểm thử thực tế: Trình duyệt hiển thị Mannequin và cho phép mặc/cởi thử áo tấc và quần lụa mượt mà.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)

- [X] Phát triển API Catalog lấy dữ liệu từ Backend và hiển thị Thẻ Cultural Factcard (chuyển sang Phiên 03 ngày 22/09).
- [X] Tích hợp bảng đổi màu cổ phong cho vải lụa.
