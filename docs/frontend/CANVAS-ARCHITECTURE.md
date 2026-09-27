# Kiến Trúc Core Canvas Paper-Doll Engine

> **Dự án:** Synapse – V-Heritage Studio  
> **Module:** `frontend/src/canvas/` (`engine.ts`, `tinting.ts`, `export.ts`, `index.ts`)  
> **Tài liệu tham chiếu:** [docs/shared/BUSINESS-LOGIC-SPECIFICATION.md](../shared/BUSINESS-LOGIC-SPECIFICATION.md), [GEMINI.md](../../GEMINI.md)

---

## 1. Tổng Quan Kiến Trúc Canvas Xếp Lớp (Paper-Doll Overlay)

Mô hình Paper-Doll (búp bê giấy truyền thống) là nền tảng cốt lõi của Studio thời trang Synapse:
- **Tỉ lệ & Độ phân giải chuẩn:** **`800 x 1200 px`** (tỉ lệ 2:3).
- **Tọa độ tuyệt đối (0, 0):** Toàn bộ hình ảnh Ma-nơ-canh gốc và các chi tiết cổ phục đều được xử lý bóc nền trong suốt (`.png`), đồng bộ kích thước và căn chỉnh chính xác vào cơ thể mẫu từ trước. Khi render, canvas chỉ cần vẽ đè các lớp lên vị trí gốc `(0, 0, 800, 1200)` theo đúng thứ tự tầng lớp (`layer_order`).
- **Hỗ trợ High-DPI / Retina:** Tự động nhân tỉ lệ `devicePixelRatio` giúp hiển thị sắc nét trên mọi loại màn hình (màn hình di động, máy tính bảng và desktop).

---

## 2. Hệ Thống 6 Slot & Z-Index Cố Định

Quy tắc xếp lớp từ trong ra ngoài (thấp đến cao theo trục Z):

```text
[Z-Index 10] HEADWEAR   (Khăn đóng, mấn triều Nguyễn, nón quai thao)
[Z-Index 8]  ACCESSORY  (Quạt lụa, ngọc bội, kính mát, túi xách)
[Z-Index 6]  FOOTWEAR   (Guốc mộc, hài thêu, sneaker hiện đại)
[Z-Index 5]  PATTERN    (Hoa văn thêu, thủy ba sóng nước, phụng bào)
[Z-Index 4]  TOP        (Áo tấc, Áo ngũ thân, Áo Nhật bình, Áo giao lĩnh)
[Z-Index 2]  BOTTOM     (Quần lụa trắng, quần tây, chân váy)
[Z-Index 0]  MANNEQUIN  (Hình thể mẫu Nam / Nữ bóc nền gốc)
```

| Slot Code | Tên Slot | Z-Index Mặc Định | Mô Tả Trách Nhiệm |
| :--- | :--- | :--- | :--- |
| `MANNEQUIN` | Mẫu gốc | 0 | Cơ thể mẫu Nam hoặc Nữ làm nền tảng. |
| `BOTTOM` | Trang phục dưới | 2 | Quần lụa ngũ thân, quần âu hoặc chân váy. |
| `TOP` | Trang phục trên | 4 | Tà áo cổ trang, áo dài truyền thống. |
| `PATTERN` | Họa tiết | 5 | Họa tiết rồng phượng, hoa văn sóng nước thủy ba thêu nổi. |
| `FOOTWEAR` | Giày dép | 6 | Hài nhung, guốc mộc truyền thống hoặc sneaker Gen Z. |
| `ACCESSORY` | Phụ kiện | 8 | Quạt cầm tay, chuỗi ngọc, trâm cài, kính râm. |
| `HEADWEAR` | Mũ nón | 10 | Mấn nữ, khăn đóng nam, nón ba tầm, nón lá. |

---

## 3. Thuật Toán Hòa Trộn Màu Sắc Vải (Dual Offscreen Canvas Multiply Tinting)

Để giữ nguyên nếp nhăn, độ bóng của tơ tằm, gấm lụa mà vẫn đổi được màu sắc tùy biến theo thời gian thực (60 FPS), engine sử dụng thuật toán **Dual Offscreen Canvas**:

```text
[Ảnh Texture Trang Phục Gốc (Grayscale/Base)] 
                     │
                     ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Offscreen Canvas (Kích thước 800 x 1200 px)             │
  │ 1. ctx.drawImage(img, 0, 0, 800, 1200)                  │
  │ 2. ctx.globalCompositeOperation = 'multiply'            │
  │ 3. ctx.fillStyle = tintColor (Hex hoặc Bảng 8 màu)      │
  │ 4. ctx.fillRect(0, 0, 800, 1200)                        │
  │ 5. ctx.globalCompositeOperation = 'destination-in'      │
  │ 6. ctx.drawImage(img, 0, 0, 800, 1200)                  │
  └─────────────────────────────────────────────────────────┘
                     │
                     ▼
  [Lớp Vải Đã Nhuộm Màu (Bảo Toàn Alpha & Nếp Nhăn Lụa)]
                     │
                     ▼
  [Vẽ Đè Lên Main Canvas Viewport Theo Z-Index]
```

### Ưu điểm vượt trội:
- **Tốc độ:** Xử lý bằng phần cứng GPU (Hardware accelerated 2D Canvas), không dùng CPU duyệt mảng pixel `getImageData` thủ công.
- **Tương thích:** Chạy mượt mà trên cả điện thoại di động cấu hình yếu mà không gây tụt khung hình.

---

## 4. Cơ Chế Xuất Bản Thẻ Lookbook 9:16 (V-Lookbook Card Export)

Tỉ lệ chuẩn định dạng dọc **`9:16`** (`1080 x 1920 px`), tối ưu chia sẻ Story trên Instagram, Facebook Reels, TikTok:

### Cấu trúc 7 Thành Phần Bắt Buộc:
1. **Khung nền tối & Gradient viền hoàng gia:** Nền Obsidian Dark `#0F1016` viền kim loại Paper/Gold.
2. **Hình ảnh bộ phối trung tâm:** Render đầy đủ mannequin và 6 slot trang phục từ Core Canvas Engine.
3. **Logo Synapse Studio:** Dấu ấn thương hiệu "Synapse V-Heritage Studio" góc trên.
4. **Tiêu đề tác phẩm & Giới tính:** Do người dùng đặt (hoặc tên mặc định phong vị cổ điển).
5. **Dải Bảng Mã Màu (Color Palette Swatches):** Liệt kê các mã Hex của trang phục trong bộ phối.
6. **Thẻ Tri Thức Văn Hóa Trích Dẫn:** Thông tin niên đại triều đại và ý nghĩa biểu trưng từ bảng `cultural_facts`.
7. **Chỉ Số Hòa Sắc & Huy Hiệu:** Điểm số Color Harmony Score (0 - 100) và huy hiệu "Chuẩn Văn Hóa" / "Sáng Tạo Đột Phá".

### API Xuất Bản:
- Hàm `exportLookbookBlob(canvas, options)`: Trả về đối tượng `Blob` định dạng `image/png`.
- Hàm `downloadLookbookImage(canvas, filename)`: Kích hoạt tải tệp PNG trực tiếp về máy người dùng.
