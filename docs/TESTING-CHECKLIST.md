# HƯỚNG DẪN KIỂM THỬ ĐA NỀN TẢNG & HIỆU NĂNG (TESTING-CHECKLIST.MD)

> **Mã nhiệm vụ:** `S3.2` | **Phiên bản:** 1.0.0 | **Ngày ban hành:** 23/09/2026  
> **Dự án:** Synapse – V-Heritage Studio  

---

## 1. PHƯƠNG PHÁP KIỂM THỬ (TESTING METHODOLOGY)

* **Nòng cốt:** **Kiểm thử Bán tự động / Thủ công (Manual QA + Device Emulation)** trên Google Chrome DevTools và thiết bị thực tế.
* **Tự động hóa:** Tích hợp **Lighthouse CI** trên GitHub Actions (`.github/workflows/lighthouse-ci.yml`) để tự động chặn các commit/PR làm suy giảm chỉ số Accessibility, Best Practices và Performance.

---

## 2. MA TRẬN THIẾT BỊ MỤC TIÊU (TARGET DEVICE MATRIX)

| Phân khúc | Thiết bị tham chiếu | Độ phân giải CSS | Mục tiêu kiểm tra |
| :--- | :--- | :--- | :--- |
| **Mobile nhỏ & tiêu chuẩn** | iPhone 13/14/15, Galaxy S22/S23 | **390 x 844** & **360 x 800** | Layout không tràn ngang, thanh slider màu vừa vặn ngón tay chạm (`touch-action: pan-x`), không kích hoạt cuộn trang ngoài ý muốn, Canvas hiển thị trọn vẹn màn hình đầu (above-the-fold). |
| **Tablet** | iPad Air / iPad 10th gen | **820 x 1180** | Layout co giãn hài hòa, không phóng to quá mức hoặc để trống 2 bên quá nhiều. |
| **Desktop / Laptop** | Màn hình văn phòng / Laptop | **1920 x 1080** & **1366 x 768** | Hiển thị 4 phân vùng Canva-style đầy đủ: Dock bar (70px), Drawer (320px), Canvas trung tâm và Cultural Inspector bên phải. |

---

## 3. TIÊU CHÍ HIỆU NĂNG CHẤP NHẬN (ACCEPTANCE CRITERIA)

### 3.1. Điểm Chuẩn Google Lighthouse
* **Desktop:**
  * Performance: **$\ge$ 90**
  * Accessibility: **$\ge$ 90**
  * Best Practices & SEO: **$\ge$ 90**
* **Mobile (Giả lập 4G + CPU Throttling 4x):**
  * Performance: **$\ge$ 75 – 80**
  * Accessibility: **$\ge$ 90**

### 3.2. Tốc Độ Khung Hình (FPS) & Độ Trễ
* **Kéo thanh màu Hex (Real-time color slider):** Đạt tốc độ **$\ge$ 45 FPS** trên mobile tầm trung (thuật toán Dual Offscreen Canvas Multiply xử lý dưới 5ms).
* **Đổi trang phục (Asset swap):** Không giật đứng khung hình quá **100ms** (có hiệu ứng fade transition nhẹ nhàng).

---

## 4. CHECKLIST KIỂM THỬ THỦ CÔNG (MANUAL QA CHECKLIST)

### A. Kiểm thử Canvas & Đổi Màu (Canvas Engine)
- [ ] Bấm chọn Nam mẫu $\rightarrow$ Canvas đổi sang phom Nam trong suốt.
- [ ] Bấm chọn Nữ mẫu $\rightarrow$ Canvas đổi sang phom Nữ trong suốt.
- [ ] Mặc Áo ngũ thân / Áo tấc $\rightarrow$ Canvas xếp lớp đúng vị trí `(0, 0, 800, 1200)`.
- [ ] Kéo thanh chọn màu Hex hoặc click 8 màu cổ phong $\rightarrow$ Vải áo đổi màu êm dịu, giữ nguyên nếp gấp 3D.
- [ ] Kiểm tra trang phục không cho đổi màu (Áo Nhật bình thêu ngũ sắc) $\rightarrow$ Hiện icon Khóa và banner quy chế triều đình.

### B. Kiểm thử Cảnh Báo Văn Hóa & Tri Thức (Guardrails & Facts)
- [ ] Chỉ mặc Áo ngũ thân mà không mặc Quần $\rightarrow$ Hiện Toast cảnh báo văn minh màu hổ phách.
- [ ] Bấm vào nút "Mặc quần gợi ý" trên Toast $\rightarrow$ Tự động mặc Quần lụa và Toast biến mất.
- [ ] Click vào từng trang phục $\rightarrow$ Thẻ Cultural Factcard cập nhật đúng niên đại, ý nghĩa ngũ thường và mẹo phối Gen Z.

### C. Kiểm thử Xuất V-Lookbook (9:16 Cinematic Card)
- [ ] Bấm nút `[✨ Xuất V-Lookbook]` $\rightarrow$ Modal hiển thị thẻ 9:16 sắc nét.
- [ ] Bấm `[💾 Tải ảnh PNG]` $\rightarrow$ Tải file ảnh chất lượng cao về máy trong $< 2\text{ giây}$.
- [ ] Bấm `[🔗 Sao chép Link bộ phối]` $\rightarrow$ Copy link chia sẻ trực tiếp dạng `https://synapse-studio.vercel.app/lookbook/:id`.

### D. Kiểm thử Hạ Tầng Cloud & Khởi Động Nguội (Cloud Infra & Cold Start)
- [ ] Khi Backend Render đang ngủ $\rightarrow$ Frontend hiển thị banner: *"🏮 Đang kết nối máy chủ V-Heritage (có thể mất ~30 giây)..."*.
- [ ] Khi Backend phản hồi HTTP 200 $\rightarrow$ Banner chuyển sang trạng thái xanh và tự động ẩn.
- [ ] Khi ngắt kết nối mạng $\rightarrow$ Backend tự động fallback về In-Memory Mock, không gây lỗi 500 hay crash ứng dụng.
