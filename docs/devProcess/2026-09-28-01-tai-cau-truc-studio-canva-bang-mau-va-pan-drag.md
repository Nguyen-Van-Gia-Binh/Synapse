# 📝 Nhật Ký Phát Triển: Tái Cấu Trúc Studio Layout Canva, Bảng Màu Sắc & Pan Drag

- **Thời gian:** 00:00 - 00:45, ngày 28/09/2026
- **Phiên số:** 01 trong ngày
- **Người thực hiện:** Bình (Lead Dev) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [Nhánh feature/studio-canva-layout-refactor](https://github.com/Nguyen-Van-Gia-Binh/Synapse/tree/feature/studio-canva-layout-refactor) (`43645e5`)

---

### 1. Mục tiêu phiên (Session Goal)
Tái cấu trúc toàn diện không gian làm việc của Synapse Studio (V-Heritage Studio) theo phong cách thiết kế chuyên nghiệp Canva / Figma: chuyển đổi thanh công cụ và bảng màu thành Left Dock + Contextual Toolbar 1 hàng tinh gọn, tích hợp Bảng Màu Sắc Canva ở thanh bên trái với đầy đủ công cụ chọn màu và di sản 8 màu Cổ phong, hỗ trợ cơ chế bỏ chọn (Deselect) khi click ra ngoài và kéo rê tự do (Pan & Drag) khi phóng to Canvas.

---

### 2. Những việc đã làm (What Was Done)
- **Tái cấu trúc tổng thể Studio Layout (Canva Style):**
  - **LeftDock (`frontend/src/components/studio/LeftDock.tsx`):** Xây dựng thanh dock cố định 64px ở mép trái với 5 icon trực quan: *Mẫu (Templates)*, *Tủ đồ (Wardrobe)*, *Màu sắc (Color)*, *Văn bản (Text)*, *Tải lên (Upload)*, có thanh chỉ thị vàng hoàng gia (`bg-heritage-yellow`) khi tab đang mở và huy hiệu "Sắp có" cho tính năng đang thử nghiệm.
  - **ItemDrawer (`frontend/src/components/studio/ItemDrawer.tsx`):** Cố định bề rộng `w-80` (320px, chống phình to tràn ngang làm vỡ layout), thiết kế lưới 2 cột cho khối "Đang mặc", hỗ trợ chuyển đổi nội dung linh hoạt theo tab của LeftDock.
  - **Bố cục Viewport App (`frontend/src/App.tsx`):** Cố định màn hình `h-screen overflow-hidden flex flex-col`, dỡ bỏ hoàn toàn thanh `ColorBar` cồng kềnh dưới đáy, giải phóng tối đa diện tích cho Canvas mannequin trung tâm.
- **Thanh công cụ ngữ cảnh 1 hàng duy nhất (`frontend/src/components/studio/ContextualToolbar.tsx`):**
  - Khối trái cố định: `Studio: [ ↺ Hoàn tác ] [ ↻ Làm lại ] [ 🔄 Đặt lại ]`.
  - Khối phải cố định: `[ - 100% + ] [ ⤓ Tải nhanh ảnh PNG ]`.
  - Khối giữa linh hoạt:
    - Khi bỏ chọn món đồ: Hiển thị dòng trạng thái Studio tổng thể *"Chọn trang phục trên người mẫu để tùy chỉnh màu sắc & phụ kiện"*.
    - Khi chọn món đồ: Thu gọn thành 01 ô màu hiện tại (`[ 🎨 Swatch + Hex ]`) kèm icon `Palette` (nhấp để mở Bảng màu Canva bên trái) + 3 màu cơ bản nhanh (Đỏ điều `#9E2A2B`, Vàng hoa mướp `#E9C46A`, Trắng ngà `#F4F1DE`) + nút `[ 🗑️ Cởi bỏ ]`. Đối với trang phục hoàng cung, tự động hiển thị khóa màu theo quy chế triều đình.
- **Bảng Màu Sắc Canva bên thanh drawer trái (`activeDockTab === 'COLOR'`):**
  - Ô tìm kiếm mã màu / tên màu (`Thử "màu lam" hoặc "#9E2A2B"`), tự động gợi ý áp dụng ngay nếu nhập mã Hex hợp lệ.
  - **Màu đồ họa:** Nút tròn `(+)` với viền chuyển sắc cầu vồng (*conic gradient*) mở popover chỉnh màu / nhập Hex tùy biến; nút bút hút màu (**Pipette** / Eyedropper API) lấy màu trực tiếp từ màn hình; swatch màu hiện tại của món đồ với viền sáng đôi (*Canva ring indicator*).
  - **Màu trong thiết kế này (*Document Colors*):** Tự động quét và gom nhóm các màu trang phục đang mặc trên người mẫu.
  - **8 Màu Cổ Phong Việt Nam:** Lưới 8 màu di sản Triều Nguyễn kèm tên Việt và hành Ngũ Hành (*Đỏ điều, Vàng hoa mướp, Xanh chàm, Xanh cổ vịt, Tía ngọc, Trắng ngà, Đen mun, Nâu sồng*).
  - **Dải màu mở rộng:** Bảng màu hiện đại Gen Z cho phép sáng tạo không giới hạn.
- **Cơ chế Bỏ Chọn (Deselect) khi click ra ngoài (`frontend/src/components/studio/CanvasViewport.tsx`):**
  - Khi click vào khoảng trống background của Studio hoặc 2 bên lề mannequin (`xRatio < 0.18 || xRatio > 0.82`), hệ thống tự động reset `selectedSlotForColor` về `null`, đưa thanh công cụ về trạng thái tổng thể.
- **Kéo rê khung nhìn (Pan & Drag) khi Zoom > 100%:**
  - Khi `zoomScale > 1`, con trỏ chuột chuyển sang dạng bàn tay (`cursor-grab / grabbing`).
  - Hỗ trợ nhấn giữ chuột kéo rê tự do theo 4 hướng với `panOffset = { x, y }`, giới hạn biên độ để không bị trôi mất mẫu khỏi màn hình.
  - Tách biệt rõ ràng giữa sự kiện Click (ngưỡng di chuyển <= 3px) và Drag (di chuyển > 3px) để không bị chọn nhầm đồ khi đang kéo màn hình.
  - Bấm nút `100%` tự động đưa canvas về giữa và đặt lại `panOffset = { x: 0, y: 0 }`.
- **Cập nhật State Store (`frontend/src/store/useOutfitStore.ts`):**
  - Chuyển `selectedSlotForColor` sang kiểu nullable `SlotType | null` (khởi tạo `null`).
  - Tự động deselect khi gọi `removeItem(slot)` và `resetOutfit()`.

---

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
- **Quyết định chuyển Bảng màu sang Left Drawer thay vì Floating Popover:** 
  - Đặt bảng màu ở drawer bên trái vừa tái sử dụng được khung nhìn `w-80` sẵn có của `ItemDrawer`, vừa tránh tình trạng popover trôi nổi che khuất người mẫu mannequin trên màn hình laptop.
- **Quyết định 1 hàng duy nhất cho ContextualToolbar:** 
  - Cố định 2 đầu Studio Controls và Zoom Controls, ở giữa chỉ hiển thị ô màu thu gọn và các nút thao tác nhanh. Tuyệt đối không để rớt dòng (`flex-nowrap`, `h-[52px]`), tạo cảm giác chắc chắn và cao cấp.
- **Giải pháp phân biệt Click vs Pan Drag trên Canvas:** 
  - Đo khoảng cách `dx, dy` trong `onMouseMove`. Nếu chuột di chuyển quá 3px thì đánh dấu cờ `hasMoved = true` và bỏ qua logic chọn slot trang phục trong `onClick`, giúp trải nghiệm kéo rê mượt mà ở 60fps không bị gián đoạn.

---

### 4. Kết quả kiểm thử (Verification)
- **Kiểm thử tự động:**
  - Frontend: `38/38` unit tests PASS (`tsx --test "src/**/*.test.ts" --run`, thời gian thực thi: ~400ms).
- **Kiểm thử Build:**
  - `npm run build` thành công trong `2.19s`, không có cảnh báo hay lỗi TypeScript (`tsc` 0 errors).
- **Kiểm thử Dev Server:**
  - Vite Dev Server chạy trơn tru tại cổng `http://localhost:5173/` (và `http://localhost:5174/`).

---

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [ ] Chờ duyệt từ người dùng để thực thi Approval Workflow (tạo PR, squash merge vào `main` và đồng bộ local).
- [ ] Bổ sung các preset phối đồ tiếp theo và tối ưu hiển thị trên các màn hình tỉ lệ nhỏ (Mobile / Tablet).
