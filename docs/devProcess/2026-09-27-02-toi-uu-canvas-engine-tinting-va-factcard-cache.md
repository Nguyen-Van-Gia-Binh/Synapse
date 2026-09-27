# 📝 Nhật Ký Phát Triển: Tối Ưu Canvas Engine, Color Tinting & Factcard Cache

- **Thời gian:** 14:30 - 18:45, ngày 27/09/2026
- **Phiên số:** 02 trong ngày
- **Người thực hiện:** Bình (Lead Dev) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #13 (Commit eeeb4e2)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/13)

---

### 1. Mục tiêu phiên (Session Goal)
Hoàn thiện kiến trúc Canvas 6 slot cố định (Paper-Doll Overlay 800x1200), thuật toán Color Multiply Tinting bảo toàn vân vải và cơ chế bộ nhớ đệm (Cache) cho Thẻ tri thức văn hóa (Cultural Factcard).

### 2. Những việc đã làm (What Was Done)
- **Frontend / Canvas Engine:**
  - Hoàn thiện render 6 slot cố định: `HEADWEAR`, `TOP`, `BOTTOM`, `PATTERN`, `ACCESSORY`, `FOOTWEAR` với tọa độ chuẩn `(0, 0, 800, 1200)`.
  - Hỗ trợ màn hình độ phân giải cao (Retina / High-DPI) thông qua tự động căn chỉnh tỉ lệ `window.devicePixelRatio` mà không làm mờ viền pixel.
  - Tích hợp Bảng 8 màu cổ phong Việt Nam (Đỏ điều, Vàng hoa mướp, Xanh chàm...) và Color Picker linh hoạt.
- **Color Tinting & Pixel Processing:**
  - Áp dụng kỹ thuật `Dual Offscreen Canvas` với `globalCompositeOperation = 'multiply'` kết hợp `'destination-in'` để nhuộm màu vải mà vẫn giữ nguyên nếp nhăn và độ sâu của chất liệu vải cổ trang.
- **Cultural Factcard:**
  - Thiết kế component hiển thị thẻ tri thức văn hóa tương ứng ngay khi người dùng chọn trang phục.
  - Tích hợp LRU / In-memory Cache trong frontend store để tránh việc gọi lại API nhiều lần cho cùng một item.

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
- **Quyết định Canvas Tinting:** Không áp dụng filter CSS `hue-rotate` hoặc `tint` đơn giản vì làm biến dạng màu sắc thực của vải lụa. Sử dụng Offscreen Canvas với `ctx.fillStyle` và chế độ hòa trộn `multiply` đem lại kết quả chân thực nhất theo bản sắc mỹ thuật truyền thống.
- **Lỗi & Cách gỡ:**
  - *Hiện tượng:* Khi đổi màu liên tục, Canvas bị giật do tạo lại đối tượng `Image` liên tục.
  - *Giải pháp:* Tích hợp bộ đệm ảnh `ImageCache` trong Canvas Hook, tái sử dụng các HTMLImageElement đã tải về bộ nhớ RAM.

### 4. Kết quả kiểm thử (Verification)
- **Kiểm thử tự động:**
  - 38/38 unit tests pass trong `frontend/src/canvas/` và `frontend/src/store/`.
  - Build Vite thành công trong 1.48s không sinh cảnh báo TypeScript.
- **Kiểm thử thực tế:**
  - Kiểm tra thao tác khoác áo ngũ thân, đổi 8 màu cổ phong liên tiếp: tốc độ khung hình đạt 60fps mượt mà.
  - Thẻ Cultural Factcard hiển thị tức thì (0ms latency khi lấy từ cache).

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [x] Đồng bộ tiến độ vào Notion Sprint Database và PLAN.md (chuyển sang Phiên 03).
- [ ] Chụp/bóc nền thêm bộ ảnh Mannequin nam/nữ thực tế cho đầy đủ danh mục slot.
