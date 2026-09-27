# 📝 Nhật Ký Phát Triển: Catalog API & Thẻ Cultural Factcard

- **Thời gian:** 22:45 - 23:45, ngày 22/09/2026
- **Phiên số:** 03 trong ngày
- **Người thực hiện:** Bình (Lead Dev), Nghi (Research & Content) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #4 (S1.2)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/4)

---

### 1. Mục tiêu phiên (Session Goal)
Xây dựng API Backend cung cấp danh mục trang phục truyền thống (`/api/catalog`) kèm Thẻ tri thức văn hóa (`CulturalFact`), đồng thời phát triển giao diện Cultural Factcard Popover mang đậm hồn cốt di sản Việt Nam.

### 2. Những việc đã làm (What Was Done)
- **Backend / RESTful API:**
  - Thiết kế cấu trúc dữ liệu `items` và `cultural_facts` chuẩn PostgreSQL.
  - Xây dựng controller và service cho endpoint:
    - `GET /api/catalog`: Hỗ trợ bộ lọc `gender`, `slot`, `era` (thời Nguyễn, Lê, Lý - Trần).
    - `GET /api/catalog/:id`: Lấy chi tiết trang phục kèm tri thức văn hóa tương ứng.
    - `GET /api/catalog/:id/cultural-fact`: Endpoint chuyên dụng lấy Thẻ tri thức văn hóa.
- **Frontend / Cultural Factcard UI:**
  - Thiết kế thanh chọn trang phục (Catalog Sidebar) phân nhóm trực quan theo 6 slot.
  - Thiết kế component `CulturalFactCard` dạng Glassmorphism sang trọng với typography cổ điển *Playfair Display* cho tiêu đề và *Be Vietnam Pro* cho nội dung.
  - Hiển thị 4 trường thông tin bắt buộc: Niên đại lịch sử (`era`), Điển tích nguồn gốc (`origin_story`), Ý nghĩa biểu tượng (`symbolic_meaning`), và Mẹo phối đồ hiện đại cho Gen Z (`modern_styling_tip`).

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
- **Tuân thủ Vùng cấm văn hóa (GEMINI.md § 2):**
  - Mọi nội dung lịch sử đều được trích dẫn chuẩn xác từ tư liệu nghiên cứu thời Nguyễn (Áo tấc, Áo ngũ thân, Khăn đóng), tuyệt đối không để AI sinh nội dung ngẫu nhiên.
  - Văn phong hướng dẫn phối đồ trẻ trung, tôn vinh nét thanh lịch truyền thống, không mang tính phán xét.

### 4. Kết quả kiểm thử (Verification)
- **Kiểm thử tự động:**
  - 18 unit tests frontend & backend kiểm tra định dạng API Envelope, mã trạng thái HTTP (200, 404) và tính hợp lệ của dữ liệu thẻ Factcard.
  - Test case xác thực thẻ Factcard từ chối nội dung nếu thiếu bất kỳ trường nào trong 4 trường bắt buộc.
- **Kiểm thử thực tế:** Chọn thử Áo tấc tay thụng trên giao diện $\rightarrow$ Factcard mở mượt mà hiển thị nguồn gốc lễ phục triều Nguyễn.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [x] Tích hợp Bảng 8 màu cổ phong và Color Multiply Canvas (chuyển sang ngày 23/09).
- [ ] Xây dựng thuật toán chấm điểm hòa sắc và phát hiện quy chuẩn phối đồ.
