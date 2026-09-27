# Quy Chuẩn Thiết Kế Giao Diện (Design System): Heritage Futurism

> **Dự án:** Synapse – V-Heritage Studio  
> **Ngôn ngữ thẩm mỹ:** Heritage Futurism (Hội tụ nét cung đình cổ phong Việt Nam và thẩm mỹ vị lai kỹ thuật số)  
> **Tài liệu tham chiếu:** [GEMINI.md](../../GEMINI.md), [frontend/src/index.css](../../frontend/src/index.css)

---

## 1. Triết Lý Thiết Kế & Định Vị Thẩm Mỹ

Synapse không phải là một ứng dụng bảo tàng khô cứng, mà là một **Fashion-Tech Studio** dành riêng cho thế hệ Gen Z yêu chuộng di sản văn hóa. Phong cách **"Heritage Futurism"** kết hợp hai thái cực:
- **Heritage (Cội nguồn Di sản):** Tinh hoa cổ phục Việt Nam (Áo dài ngũ thân, Áo tấc, Áo Nhật bình, mấn, hài thêu, quạt lụa) với bảng màu cung đình triều Nguyễn và hoa văn truyền thống.
- **Futurism (Tương lai & Công nghệ):** Giao diện Dark mode huyền bí, hiệu ứng kính mờ (Glassmorphism), typography sắc sảo, micro-interactions mượt mà và Canvas tương tác thời gian thực 60 FPS.

---

## 2. Bảng 8 Màu Cổ Phong Việt Nam (Heritage Color Palette)

Hệ thống màu sắc cốt lõi được trích xuất từ màu vải cung đình và trang phục truyền thống Việt Nam, ánh xạ tương sinh tương khắc theo thuyết Ngũ Hành:

| Tên Màu Cổ Phong | Mã Hex | Hành Ngũ Hành | Ý Nghĩa Văn Hóa & Ứng Dụng |
| :--- | :--- | :--- | :--- |
| **Đỏ điều** | `#9E2A2B` | Hỏa | Màu của lễ nghi, đại hỷ, quyền quý; thường thấy trên Nhật bình, Áo tấc cô dâu. |
| **Vàng hoa mướp** | `#E9C46A` | Thổ | Màu hoàng gia, vương giả triều đình; tạo điểm nhấn ánh kim (Accent Gold). |
| **Xanh chàm / Thủy ba** | `#264653` | Thủy | Màu sóng nước thủy ba, nhuộm chàm dân tộc; biểu trưng cho sự thâm trầm, sâu lắng. |
| **Xanh cổ vịt** | `#2A9D8F` | Mộc | Sắc ngọc bích quý phái; mang hơi thở thiên nhiên và sự phát triển sinh sôi. |
| **Tía ngọc** | `#5A189A` | Hỏa/Thổ | Màu tím cung đình Huế, quý phái, bí ẩn; gắn với trang phục hoàng thân quốc thích. |
| **Trắng ngà / Giấy dó** | `#F4F1DE` | Kim | Tone giấy dó cổ truyền, lụa tơ tằm; dùng làm màu văn bản chính (Text Parchment). |
| **Đen mun** | `#1D1E2C` | Thủy | Nền tối sâu thẳm của màn đêm vũ trụ; làm bề mặt thẻ kính (Surface Card). |
| **Nâu sồng** | `#6F4E37` | Thổ | Màu vải thô mộc, áo tơi, đầm ấm dân dã; biểu trưng cho đất mẹ hiền hòa. |

---

## 3. Hệ Thống Màu Nền & Tokens (CSS Variables)

Được định nghĩa tại `:root` trong `frontend/src/index.css`:

```css
:root {
  --bg-primary: #0F1016;              /* Nền tối chủ đạo Studio (Obsidian Dark) */
  --bg-card: rgba(29, 30, 44, 0.7);   /* Nền thẻ kính mờ bán trong suốt */
  --border-subtle: rgba(244, 241, 222, 0.12); /* Đường viền mảnh màu giấy dó mờ */
  --text-parchment: #F4F1DE;          /* Màu chữ giấy dó ấm áp chống mỏi mắt */
  --accent-gold: #E9C46A;             /* Màu nhấn vàng hoàng kim */
}
```

---

## 4. Hệ Thống Typography (Phông Chữ)

Sử dụng bộ đôi phông chữ có hỗ trợ đầy đủ dấu thanh tiếng Việt:

### 4.1. Display & Heading Typography (Tiêu Đề & Tên Phục Trang)
- **Font-family:** `'Cinzel', 'Playfair Display', serif`
- **Đặc tính:** Font chữ có chân thanh thoát, quyền quý, gợi nhắc văn bia hoàng triều và chữ khắc cung đình.
- **Áp dụng:** Thẻ `h1`, `h2`, `h3`, tên trang phục, tên V-Lookbook và nhãn huy hiệu văn hóa.

### 4.2. UI & Body Typography (Giao Diện Tương Tác & Nội Dung)
- **Font-family:** `'Be Vietnam Pro', 'Inter', sans-serif`
- **Đặc tính:** Font chữ không chân hình học hiện đại, được thiết kế tối ưu tuyệt đối cho tiếng Việt, độ cao x-height lớn, dễ đọc trên màn hình di động.
- **Áp dụng:** Toàn bộ nội dung mô tả, nhãn nút bấm, thẻ tri thức (Cultural Factcard), tooltip và thông số hòa sắc.

---

## 5. Hiệu Ứng Chiều Sâu & Kính Mờ (Glassmorphism Components)

### 5.1. Thẻ Kính Mờ (.glass-card)
Sử dụng cho các thẻ tương tác trong Item Drawer, Cultural Factcard:
```css
.glass-card {
  background: rgba(29, 30, 44, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(244, 241, 222, 0.12);
}
```

### 5.2. Thanh Công Cụ & Bảng Điều Khiển (.glass-panel)
Sử dụng cho DockBar bên dưới và ColorBar tùy biến màu:
```css
.glass-panel {
  background: rgba(15, 16, 22, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(244, 241, 222, 0.08);
}
```

### 5.3. Nút Hoàng Kim (.gold-gradient-btn)
Nút hành động chính (Primary Action Button như Lưu tác phẩm, Xuất thẻ Lookbook):
```css
.gold-gradient-btn {
  background: linear-gradient(135deg, #E9C46A 0%, #D4A373 100%);
  color: #1D1E2C;
  font-weight: 600;
  transition: all 0.2s ease;
}
.gold-gradient-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
```

---

## 6. Nguyên Tắc Chuyển Động & Tương Tác (Micro-interactions)

1. **Fade & Smooth Transitions:** Mọi hành động chọn trang phục, đổi tab hoặc đóng mở modal phải có thời gian chuyển tiếp từ **150ms đến 200ms** với timing function `ease-out` hoặc `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Color Change Animation:** Khi đổi màu trang phục bằng bảng màu hoặc Color Picker, màu trên Canvas chuyển biến mượt mà, không giật màn hình hoặc nhấp nháy đen.
3. **Thanh Cuộn Tinh Chỉnh (Custom Scrollbar):** Thanh cuộn siêu mảnh (width 6px), track tối màu, thumb màu giấy dó mờ tăng sáng vàng hoàng kim khi di chuột (`hover`).
