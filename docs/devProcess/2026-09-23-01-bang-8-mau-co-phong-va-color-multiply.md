# 📝 Nhật Ký Phát Triển: Bảng 8 Màu Cổ Phong, Canvas Color Multiply & Ràng Buộc Model Gemini

- **Thời gian:** 10:30 - 21:30, ngày 23/09/2026
- **Phiên số:** 01 trong ngày
- **Người thực hiện:** Bình (Lead Dev), Tho (Research) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #6 (S1.3)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/6) & [PR #10 (docs/rules)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/10)

---

### 1. Mục tiêu phiên (Session Goal)
Nâng cấp Canvas Engine với khả năng đổi màu vải lụa bằng kỹ thuật Color Multiply bảo toàn nếp nhăn, tích hợp Bảng 8 màu cổ phong Việt Nam và ban hành điều lệ kỹ thuật bắt buộc sử dụng dòng model Gemini cho toàn bộ dự án.

### 2. Những việc đã làm (What Was Done)
- **Bảng 8 Màu Cổ Phong Việt Nam:**
  - Định nghĩa bộ màu di sản: Đỏ điều (`#9E2A2B`), Vàng hoa mướp (`#E9C46A`), Xanh chàm/thủy ba (`#264653`), Xanh cổ vịt (`#2A9D8F`), Tía ngọc (`#5A189A`), Trắng ngà (`#F4F1DE`), Đen mun (`#1D1E2C`), Nâu sồng (`#6F4E37`).
  - Cung cấp giao diện chọn màu nhanh (Quick Palette Swatches) kèm mã màu HEX chuẩn xác và Color Picker tự do.
- **Canvas Color Multiply Tinting (Task S1.3):**
  - Xây dựng thuật toán hòa trộn pixel sử dụng `Dual Offscreen Canvas`:
    - Canvas phụ 1: Giữ nguyên chi tiết bóng đổ và vân nếp vải.
    - Canvas phụ 2: Tô màu người dùng chọn với `globalCompositeOperation = 'multiply'`.
    - Kết hợp bằng mặt nạ `'destination-in'` để màu sắc chỉ phủ lên tà áo mà không lem ra ngoài khung hình.
- **Ràng buộc Model AI Gemini (GEMINI.md § 7 - PR #10):**
  - Phát hiện tình trạng Antigravity IDE lưu cấu hình model toàn cục dễ bị nhảy model ngoài ý muốn (Claude, GPT...) làm ảnh hưởng đến độ chính xác văn hóa tiếng Việt.
  - Ban hành Mục 7 trong `GEMINI.md`: Bắt buộc sử dụng các model thuộc dòng `Gemini` (Gemini 3.8 Pro, Flash...). Agent phải từ chối viết code nếu phát hiện bị đổi model khác.

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
- **Tại sao không dùng CSS Filter?** Các thuộc tính CSS như `filter: hue-rotate(...)` hoặc `sepia` làm bệt màu và biến đổi toàn bộ điểm ảnh, khiến chất liệu lụa gấm trông như đồ nhựa giả. Kỹ thuật Offscreen Canvas Multiply giữ nguyên 100% bóng đổ tự nhiên của tà áo.
- **Tối ưu xung đột Port:** Bổ sung cơ chế phát hiện port bận, tự động fallback giúp người dùng chạy song song nhiều dự án trên cùng máy tính mà không bị lỗi mạng.

### 4. Kết quả kiểm thử (Verification)
- **Kiểm thử tự động:**
  - 28 unit tests pass cho Canvas Tinting, thuật toán chuyển đổi mã màu Hex/RGB và validation màu cổ phong.
  - Test case xác nhận từ chối đổi màu với các trang phục có cờ `color_customizable = false`.
- **Kiểm thử thực tế:** Chuyển đổi linh hoạt giữa 8 màu cổ phong trên tà Áo ngũ thân tay chẽn, vân áo hiển thị sắc nét và tự nhiên.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [x] Tích hợp bộ quy tắc văn hóa Cultural Guardrails cảnh báo phối sai quy chuẩn (Sprint 2).
- [x] Đưa toàn bộ hạ tầng lên Render và Supabase Cloud (Sprint 3).
