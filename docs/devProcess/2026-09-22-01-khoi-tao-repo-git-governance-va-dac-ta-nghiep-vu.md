# 📝 Nhật Ký Phát Triển: Khởi Tạo Repo, Git Governance & Đặc Tả Nghiệp Vụ

- **Thời gian:** 09:56 - 11:15, ngày 22/09/2026
- **Phiên số:** 01 trong ngày
- **Người thực hiện:** Bình (Lead Dev & PO), Nghi (Research) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #1 (docs/S0.1)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/1) & [PR #5](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/5)

---

### 1. Mục tiêu phiên (Session Goal)

Khởi tạo kho lưu trữ mã nguồn GitHub, thiết lập chỉ dẫn kỹ thuật tối cao cho AI Coding Agent (`GEMINI.md`), quy chuẩn đóng góp nhóm (`CONTRIBUTING.md`) và hoàn thiện bộ đặc tả User Stories & Use Cases chi tiết.

### 2. Những việc đã làm (What Was Done)

- **Quản trị Dự án & Git Governance:**
  - Khởi tạo repository `Nguyen-Van-Gia-Binh/Synapse` trên GitHub.
  - Ban hành `GEMINI.md`: Định vị dự án, Vùng cấm văn hóa, Quy chuẩn kiến trúc Canvas, Lược đồ 4 bảng Supabase, Tech Stack và Quy chuẩn lập trình.
  - Ban hành `CONTRIBUTING.md`: Quy ước phân nhánh (`feature/`, `fix/`, `docs/`, `chore/`), Conventional Commits và tiêu chí nghiệm thu (DoD).
  - Bổ sung quy tắc vàng: Tuyệt đối cấm commit trực tiếp vào nhánh `main` (PR #5).
- **Đặc tả Nghiệp vụ (Agile Specifications):**
  - Xây dựng `docs/USER-STORY.md`: Định nghĩa 4 bộ Epic lớn từ góc nhìn người dùng trẻ (Gen Z, Nhà thiết kế thời trang, Người yêu văn hóa).
  - Xây dựng `docs/USE-CASE.md`: Mô tả 16 trường hợp sử dụng từ UC-01 đến UC-16 với luồng chính (Main Flow), luồng ngoại lệ (Alternative Flow) và điều kiện tiên quyết.

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)

- **Quy tắc Git bất biến:** Mọi thành viên và AI Agent bắt buộc phải tạo nhánh riêng, mở Pull Request và chỉ merge vào `main` thông qua `gh pr merge --squash` sau khi vượt qua toàn bộ test suite.
- **Bảo toàn Văn hóa:** Đưa quy tắc "Không bịa đặt lịch sử" và "Giọng điệu tích cực" thành điều khoản bắt buộc trong `GEMINI.md`.

### 4. Kết quả kiểm thử (Verification)

- Toàn bộ tài liệu được push lên remote và merge vào `main` qua PR #1 và PR #5.
- Cấu trúc Git repo đồng bộ, nhánh `main` sạch và sẵn sàng cho công đoạn scaffold code.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)

- [X] Khởi tạo cấu trúc thư mục Frontend và Backend (chuyển sang Phiên 02 ngày 22/09).
- [X] Dựng khung Canvas Engine xử lý render lớp ảnh đầu tiên.
