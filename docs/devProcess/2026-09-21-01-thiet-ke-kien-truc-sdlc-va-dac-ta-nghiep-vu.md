# 📝 Nhật Ký Phát Triển: Thiết Kế Kiến Trúc SDLC & Đặc Tả Nghiệp Vụ

- **Thời gian:** 08:39 - 18:30, ngày 21/09/2026
- **Phiên số:** 01 trong ngày
- **Người thực hiện:** Bình (Lead Dev & PO), Tho (Research), Nghi (Research) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Tài liệu sinh ra:** `docs/PLAN.md`, `docs/ProjectBrief.md`

---

### 1. Mục tiêu phiên (Session Goal)
Định hình toàn diện kiến trúc sản phẩm Synapse – V-Heritage Studio theo quy chuẩn SDLC: xác lập tầm nhìn "Heritage Futurism", phân rã kiến trúc Canvas 6 slot cố định và xây dựng lộ trình 4 Sprint chi tiết.

### 2. Những việc đã làm (What Was Done)
- **Đặc tả sản phẩm & Nghiệp vụ (BA/PO):**
  - Định vị sản phẩm: Nền tảng Fashion-Tech kết hợp Cultural Hub, hỗ trợ Gen Z phối cổ phục Việt Nam (Nam và Nữ) với phong cách đương đại.
  - Phân tích luồng trải nghiệm người dùng: Chọn giới tính $\rightarrow$ Chọn Mannequin $\rightarrow$ Thử đồ theo 6 slot $\rightarrow$ Tùy biến màu sắc $\rightarrow$ Nhận diện hài hòa $\rightarrow$ Xuất thẻ Lookbook 9:16.
- **Kiến trúc Kỹ thuật (System Architecture):**
  - Xác lập quy chuẩn Canvas Xếp lớp (Paper-Doll Overlay) cố định `800 x 1200 px` với 6 slot: `HEADWEAR`, `TOP`, `BOTTOM`, `PATTERN`, `ACCESSORY`, `FOOTWEAR`.
  - Phác thảo lược đồ CSDL Postgres với 4 bảng: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`.
  - Phân rã lộ trình phát triển thành 4 Sprint: S0 (Foundation), S1 (Studio Core), S2 (Cultural Hub & Harmony), S3 (Production & Polish).
- **Văn hóa & Đạo đức AI (Cultural Guardrails):**
  - Đặt ra nguyên tắc: Tuyệt đối không bịa đặt sử liệu (No cultural hallucination).
  - Thiết lập giọng điệu cảnh báo: Thân thiện, tôn trọng sáng tạo của Gen Z, không dùng từ ngữ phán xét tiêu cực.

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
- **Quyết định kiến trúc Canvas:** Lựa chọn Canvas 2D tọa độ tuyệt đối `(0, 0, 800, 1200)` thay vì mô hình 3D phức tạp nhằm đảm bảo tốc độ tải trang cực nhanh trên điện thoại di động và dễ dàng chuẩn hóa asset ảnh trong suốt.
- **Quyết định Tech Stack:** Chọn React 18 + Vite (Frontend), Node.js Express TypeScript (Backend) và Supabase (CSDL Postgres & Storage).

### 4. Kết quả kiểm thử (Verification)
- Kế hoạch tổng thể `docs/PLAN.md` hoàn thành với 22 task chi tiết, định rõ Definition of Done (DoD) cho từng task.
- Nhóm thống nhất 100% về kiến trúc 6 slot và bảng màu cổ phong.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [x] Khởi tạo Git repo và ban hành quy chuẩn đóng góp `CONTRIBUTING.md`, `GEMINI.md` (chuyển sang ngày 22/09).
- [ ] Soạn thảo bộ User Story và Use Case chi tiết.
