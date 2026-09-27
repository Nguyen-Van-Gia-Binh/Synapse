# Tái Cấu Trúc Giao Diện Synapse Studio 2D Theo Phong Cách Canva

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tái cấu trúc toàn diện không gian làm việc của Synapse Studio 2D theo chuẩn thiết kế Canva và triết lý *Heritage Futurism*, bao gồm: thanh dock 4 icon chuyên nghiệp, tủ đồ cố định chống tràn ngang, thanh công cụ ngữ cảnh (Contextual Toolbar) trên cùng, gỡ bỏ các overlay thừa thãi và tối ưu cuộn mượt ẩn thanh cuộn.

**Architecture:** Chuyển đổi layout sang mô hình cố định toàn màn hình (`h-screen overflow-hidden flex flex-col`) với Header cố định trên cùng; thay thế thanh ColorBar đáy bằng Thanh ngữ cảnh (Contextual Toolbar) tự động đổi trạng thái khi chọn trang phục; loại bỏ overlay che chân Mannequin và chuẩn hóa độ rộng Tủ đồ (`w-80 flex-shrink-0`).

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, HTML5 Canvas API, Zustand (`useOutfitStore`).

**Spec:** [Bản thiết kế được duyệt trong phiên thảo luận 2026-09-27](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/GEMINI.md)

## Global Constraints

- Tuân thủ ngôn ngữ thị giác "Heritage Futurism": Dark mode sang trọng (`#0F1016`), điểm nhấn vàng hoa mướp (`#E9C46A`), đỏ điều (`#9E2A2B`), font có chân *Cinzel* cho tiêu đề và font không chân *Be Vietnam Pro* cho nội dung.
- Không sửa đổi schema CSDL 4 bảng Supabase cốt lõi.
- TypeScript Strict Mode: Không sử dụng kiểu `any`.
- Giữ nguyên toàn bộ logic kết nối API Backend, thuật toán Color Multiply trên Canvas và tính năng Xuất V-Lookbook 9:16.

---

### Task 1: Thiết Lập CSS Cuộn Mượt Ẩn Thanh Cuộn (`.scrollbar-none`)

**Files:**
- Modify: `frontend/src/index.css`

**Interfaces:**
- Produces: CSS utility class `.scrollbar-none` tương thích đa trình duyệt (Chrome, Safari, Firefox, Edge).

- [ ] **Step 1: Viết class `.scrollbar-none` vào `frontend/src/index.css`**
```css
/* Ẩn thanh cuộn nhưng vẫn giữ khả năng cuộn mượt bằng chuột/touch */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
.scrollbar-none::-webkit-scrollbar {
  display: none;             /* Chrome, Safari, Opera */
}
```

- [ ] **Step 2: Kiểm tra cú pháp và build CSS**
Run: `cmd /c "cd frontend && npm run build"`
Expected: Thành công không lỗi build.

- [ ] **Step 3: Commit Task 1**
```bash
git add frontend/src/index.css
git commit -m "style(css): bổ sung class scrollbar-none hỗ trợ cuộn mượt ẩn thanh cuộn"
```

---

### Task 2: Xây Dựng Component Canva Dock (`LeftDock.tsx`)

**Files:**
- Create: `frontend/src/components/studio/LeftDock.tsx`
- Test: Build TypeScript và render thử nghiệm

**Interfaces:**
- Produces:
  ```typescript
  export type DockTabType = 'TEMPLATES' | 'WARDROBE' | 'TEXT' | 'UPLOAD';
  export interface LeftDockProps {
    activeTab: DockTabType;
    onSelectTab: (tab: DockTabType) => void;
    isDrawerOpen: boolean;
    onToggleDrawer: () => void;
  }
  ```

- [ ] **Step 1: Tạo file `frontend/src/components/studio/LeftDock.tsx`**
Tạo component chứa 4 icon chuẩn phong cách Canva:
1. `LayoutTemplate` - Mẫu (Templates)
2. `Shirt` - Tủ đồ cổ phong (Wardrobe)
3. `Type` - Văn bản & Chú thích (Text)
4. `Upload` - Tải lên hoa văn / tự thiết kế (Upload - có badge "Sắp có")

- [ ] **Step 2: Viết giao diện dock với style Glassmorphism chuẩn Heritage**
Đảm bảo chiều rộng cố định `w-16 flex-shrink-0 border-r border-heritage-cream/10 flex flex-col items-center py-4 gap-4`.

- [ ] **Step 3: Kiểm tra build TypeScript**
Run: `cmd /c "cd frontend && npm run build"`
Expected: Build thành công không có lỗi type.

- [ ] **Step 4: Commit Task 2**
```bash
git add frontend/src/components/studio/LeftDock.tsx
git commit -m "feat(studio): phát triển thanh LeftDock 4 icon chuẩn Canva"
```

---

### Task 3: Tái Cấu Trúc Tủ Đồ Cổ Phong (`ItemDrawer.tsx`)

**Files:**
- Modify: `frontend/src/components/studio/ItemDrawer.tsx`

**Interfaces:**
- Consumes: `useOutfitStore` (slots, selectedSlotForColor, setSelectedSlotForColor, removeItem)
- Produces: Drawer cố định `w-80 flex-shrink-0` (320px), danh sách "Đang mặc" dạng lưới 2 cột chống phình ngang, danh sách trang phục áp dụng `scrollbar-none`.

- [ ] **Step 1: Sửa kích thước Drawer từ `w-84` thành `w-80 flex-shrink-0`**
Thay thế class của thẻ `aside` trong `ItemDrawer.tsx` để bảo đảm độ rộng cố định 320px tuyệt đối không bị co giãn.

- [ ] **Step 2: Tái cấu trúc khu vực "Đang mặc"**
Chuyển danh sách chip trang phục đang mặc thành lưới 2 cột nhỏ gọn (`grid grid-cols-2 gap-1.5`) với chiều cao giới hạn `max-h-28 overflow-y-auto scrollbar-none`. Thêm nút cởi bỏ `✕` nhanh chóng cho từng món.

- [ ] **Step 3: Áp dụng `scrollbar-none` cho danh mục trang phục**
Cập nhật container danh sách item với `flex-1 overflow-y-auto scrollbar-none p-3 space-y-2.5`.

- [ ] **Step 4: Kiểm tra build**
Run: `cmd /c "cd frontend && npm run build"`
Expected: Build thành công không có lỗi.

- [ ] **Step 5: Commit Task 3**
```bash
git add frontend/src/components/studio/ItemDrawer.tsx
git commit -m "refactor(drawer): cố định chiều rộng 320px và tái cấu trúc danh sách Đang mặc chống tràn"
```

---

### Task 4: Xây Dựng Thanh Công Cụ Ngữ Cảnh (`ContextualToolbar.tsx`)

**Files:**
- Create: `frontend/src/components/studio/ContextualToolbar.tsx`

**Interfaces:**
- Consumes:
  ```typescript
  export interface ContextualToolbarProps {
    zoomScale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onExportSnapshot: () => void;
  }
  ```
- Uses: `useOutfitStore` (`slots`, `selectedSlotForColor`, `setSelectedSlotForColor`, `setItemColor`, `removeItem`, `undo`, `redo`, `resetOutfit`, `activeFactcardItem`, `loadCulturalFactForItem`).

- [ ] **Step 1: Tạo component `ContextualToolbar.tsx`**
Cài đặt 2 chế độ hiển thị:
1. **Chế độ Mặc định (Khi không chọn món đồ nào):**
   - Nút `Undo`, `Redo`, `Đặt lại outfit`.
   - Nút `Zoom Out (-)`, `Zoom Scale (100%)`, `Zoom In (+)`, `Vừa khung (100%)`.
   - Nút `Tải nhanh ảnh Canvas PNG`.
2. **Chế độ Ngữ Cảnh (Khi đang chọn 1 món đồ như Áo, Quần, Mấn...):**
   - Huy hiệu Tên món đồ + Slot (`TOP`, `BOTTOM`, etc.).
   - Bộ đổi màu: Nếu `color_customizable: true`, hiển thị swatch màu hiện tại + Bảng 8 màu Cổ Phong Việt Nam + nút mở Hex Picker. Nếu `color_customizable: false` (Áo Nhật bình), hiển thị huy hiệu `[ 🔒 Giữ màu gốc triều đình ]`.
   - Nút `📖 Thẻ tri thức` (kích hoạt mở factcard bên phải).
   - Nút `🗑️ Cởi bỏ` (gỡ món đồ).
   - Nút `✕ Bỏ chọn` (trở về Chế độ Mặc định).

- [ ] **Step 2: Thêm popover chọn màu Hex Picker mở rộng**
Tích hợp input mã màu Hex và input color native ngay trong thanh ngữ cảnh.

- [ ] **Step 3: Kiểm tra build TypeScript**
Run: `cmd /c "cd frontend && npm run build"`
Expected: Không có lỗi TypeScript.

- [ ] **Step 4: Commit Task 4**
```bash
git add frontend/src/components/studio/ContextualToolbar.tsx
git commit -m "feat(studio): xây dựng ContextualToolbar ngữ cảnh trên cùng theo chuẩn Canva"
```

---

### Task 5: Tinh Gọn Canvas Viewport & Click-to-Select (`CanvasViewport.tsx`)

**Files:**
- Modify: `frontend/src/components/studio/CanvasViewport.tsx`

**Interfaces:**
- Consumes: `useOutfitStore` (slots, setSelectedSlotForColor, loadCulturalFactForItem)
- Produces: Khung Canvas 800x1200 sạch sẽ, hỗ trợ click trực tiếp lên người mẫu để kích hoạt món đồ tương ứng.

- [ ] **Step 1: Gỡ bỏ toolbar nổi trên cùng và badge 6 slot dưới chân**
Xóa bỏ khối JSX `absolute top-3` (zoom toolbar) và `absolute bottom-3` (slot active badges 4/6 lớp).

- [ ] **Step 2: Bổ sung logic Click-to-Select theo tọa độ Canvas**
Xử lý sự kiện click trên container Canvas:
- Khi người dùng click vào phần đầu (Y: 0 - 30%): Nếu có `HEADWEAR` đang mặc $\rightarrow$ Kích hoạt `HEADWEAR`.
- Khi người dùng click vào phần thân (Y: 30% - 65%): Nếu có `TOP` đang mặc $\rightarrow$ Kích hoạt `TOP`.
- Khi người dùng click vào phần chân (Y: 65% - 100%): Nếu có `BOTTOM` $\rightarrow$ Kích hoạt `BOTTOM`; nếu không có mà có `FOOTWEAR` $\rightarrow$ Kích hoạt `FOOTWEAR`.

- [ ] **Step 3: Kiểm tra build**
Run: `cmd /c "cd frontend && npm run build"`
Expected: Build thành công không có cảnh báo.

- [ ] **Step 4: Commit Task 5**
```bash
git add frontend/src/components/studio/CanvasViewport.tsx
git commit -m "refactor(canvas): gỡ bỏ overlay thừa và bổ sung cơ chế click-to-select trên Mannequin"
```

---

### Task 6: Tích Hợp Toàn Diện Trong `App.tsx` & Kiểm Thử Toàn Bộ Ứng Dụng

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Cố định layout `h-screen overflow-hidden flex flex-col`**
Cập nhật container gốc của `App.tsx` thành chuẩn cố định toàn màn hình, Header `h-16 flex-shrink-0`.

- [ ] **Step 2: Tích hợp `LeftDock` mới và điều khiển hiển thị `ItemDrawer`**
Kết nối `activeTab` giữa `LeftDock` và `ItemDrawer`.

- [ ] **Step 3: Đưa `ContextualToolbar` vào khu vực trung tâm và DỠ BỎ `<ColorBar />` đáy**
Đặt `ContextualToolbar` nằm trên cùng của `<main>`, giải phóng toàn bộ không gian phía dưới cho Mannequin.

- [ ] **Step 4: Áp dụng `scrollbar-none` cho Sidebar bên phải (`Cultural Inspector`)**
Cập nhật `<aside className="w-80 glass-panel border-l border-heritage-cream/10 p-5 flex flex-col gap-4 z-20 overflow-y-auto scrollbar-none flex-shrink-0">`.

- [ ] **Step 5: Chạy toàn bộ kiểm thử Unit Test và Build Production**
Run: `cmd /c "cd frontend && npm test -- --run"`
Run: `cmd /c "cd frontend && npm run build"`
Expected: Toàn bộ test pass và bundle build thành công 100%.

- [ ] **Step 6: Commit Task 6**
```bash
git add frontend/src/App.tsx
git commit -m "feat(studio): hoàn thiện tích hợp layout Studio chuẩn Canva và dỡ bỏ ColorBar đáy"
```

---

## Plan Review Checklist

1. **Spec Coverage:** Toàn bộ 5 vấn đề người dùng phản ánh và yêu cầu Canva toolbar/contextual dye đều có Task riêng tương ứng.
2. **No Placeholders:** Mọi bước đều có mã nguồn cụ thể, lệnh chạy và tiêu chuẩn kiểm chứng.
3. **Type Consistency:** Đồng bộ hoàn toàn `SlotType`, `ItemDto`, `RenderLayerOptions` từ `src/types/index.ts`.
