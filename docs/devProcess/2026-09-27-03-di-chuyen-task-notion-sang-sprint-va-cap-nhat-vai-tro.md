# 📝 Nhật Ký Phát Triển: Di Chuyển Task Notion Sang Sprint & Chuẩn Hóa Vai Trò

- **Thời gian:** 19:15 - 22:30, ngày 27/09/2026
- **Phiên số:** 03 trong ngày
- **Người thực hiện:** Bình (Lead Dev), Tho (Research), Nghi (Research) & AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành
- **Pull Request / Commit:** [PR #14 (Nhánh docs/S1-S3-progress-tracking)](https://github.com/Nguyen-Van-Gia-Binh/Synapse/pull/14)

---

### 1. Mục tiêu phiên (Session Goal)

Dọn dẹp và hợp nhất quản trị công việc trên trang Notion Synapse (chuyển toàn bộ 6 task từ inline DB `Task` sang `Sprint`, xóa inline DB `Task`), cập nhật tiến độ thực tế 12/16 task và làm rõ vai trò chuyên môn của từng thành viên trong tài liệu dự án và quy chuẩn ghi nhật ký phát triển `docs/devProcess/`.

### 2. Những việc đã làm (What Was Done)

- **Quản trị Notion Database:**
  - Viết script tự động trích xuất đệ quy toàn bộ 163+ blocks (child blocks, toggles, callouts, tables) từ 6 task trong inline DB `Task`.
  - Tạo mới các trang tương ứng trong database `📌 Synapse – Sprint Backlog & Task Tracker` với đầy đủ properties (Assignee, Sprint, Priority, Status, Epic, Dates).
  - Sao chép chính xác 100% nội dung phân cấp blocks vào các task mới trong Sprint DB.
  - Xóa bỏ an toàn inline database `Task` cũ để trang Notion gọn gàng, liền mạch.
- **Tài liệu & Chuẩn hóa Vai trò Thành viên:**
  - Cập nhật mục 1.2 và mục 6 trong `docs/PLAN.md`, ghi nhận rõ phân công:
    - **Bình**: Leader / Lead Dev & Product Owner (Phụ trách kiến trúc hệ thống, FE/BE, Canvas, CI/CD, Deployment).
    - **Tho**: Cultural Researcher & Asset Specialist (Nghiên cứu hình thức, thẩm định mỹ thuật phục chế, chuẩn hóa bộ ảnh 800x1200 và tư liệu hiện vật).
    - **Nghi**: Cultural Researcher & Content Specialist (Biên soạn Cultural facts, hệ thống quy tắc phối đồ Guardrails, xây dựng kịch bản personas).
  - Đồng bộ cập nhật vai trò vào `README.md`, `CONTRIBUTING.md`, `docs/USER-STORY.md` và `docs/USE-CASE.md`.
- **Hệ thống Nhật ký Phát triển (Dev Process Logs):**
  - Thiết lập thư mục `docs/devProcess/` cùng `README.md` định nghĩa quy chuẩn đặt tên `YYYY-MM-DD-NN-<mo-ta-ngan>.md` và template chuẩn.
  - Khởi tạo 3 file nhật ký đầu tiên ghi lại chặng đường phát triển ngày 27/09/2026.
- **Frontend Bugfix nhẹ:**
  - Bổ sung fallback kiểm tra cultural guardrail phía client trong `frontend/src/store/useOutfitStore.ts` khi chạy unit test ngoại tuyến với mock items.

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)

- **Quyết định Notion Migration:** Sử dụng cơ chế recursive block fetching/creating qua Notion MCP API theo từng mẻ (batching) để tránh giới hạn payload của Notion API.
- **Bảo mật Git (Secret Scanning):**
  - *Sự cố:* GitHub Push Protection chặn commit do phát hiện Notion API key trong script tạm.
  - *Giải pháp:* Tách biệt hoàn toàn mã bí mật, chỉ dùng biến môi trường tạm thời và xóa các file script tạm thời sau khi hoàn tất tác vụ migration. Không bao giờ commit token lên Git.

### 4. Kết quả kiểm thử (Verification)

- **Kiểm thử tự động:**
  - Frontend: `38/38` unit tests pass (`npm test --prefix frontend`).
  - Backend: `25/25` unit tests pass (`npm test --prefix backend`).
  - Type-check & Build: Cả Frontend (Vite) và Backend (TypeScript) đều build thành công không lỗi (`exit code 0`).
- **Kiểm thử thực tế trên Notion:**
  - Toàn bộ 22 task hiển thị đồng nhất trong bảng `📌 Synapse – Sprint Backlog & Task Tracker`.
  - Database `Task` cũ đã được dọn sạch hoàn toàn khỏi trang Notion.

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)

- [X] Merge PR #14 vào nhánh chính `main` sau khi người dùng duyệt ("OK").
- [ ] Bắt đầu triển khai các task còn lại của Sprint 3 (S3.3: Visual Polish & Responsive, S3.4: Accessibility & SEO).
