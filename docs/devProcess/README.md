# 📜 QUẢN TRỊ NHẬT KÝ PHÁT TRIỂN (DEV PROCESS LOGS)

> Thư mục này lưu trữ toàn bộ nhật ký ghi lại diễn biến, mục tiêu, quyết định kỹ thuật và kết quả kiểm thử của từng phiên làm việc (Development Sessions) trong dự án **Synapse – V-Heritage Studio**.

---

## 1. Quy Ước Đặt Tên Tệp (Naming Convention)

Mỗi phiên làm việc được lưu thành **một tệp Markdown độc lập** theo cấu trúc:

$$\mathbf{YYYY-MM-DD\text{-}NN\text{-}\langle\text{mo-ta-ngan-khong-dau}\rangle.md}$$

- `YYYY-MM-DD`: Ngày thực hiện phiên (ví dụ: `2026-09-27`).
- `NN`: Số thứ tự phiên trong ngày (`01`, `02`, `03`... reset về `01` khi sang ngày mới).
- `<mo-ta-ngan>`: Tóm tắt nội dung chính đã giải quyết, viết bằng tiếng Việt không dấu, nối nhau bằng dấu gạch ngang `-`.

*Ví dụ:*
- `2026-09-27-01-tich-hop-ha-tang-render-va-dong-bo-supabase.md`
- `2026-09-27-02-toi-uu-canvas-engine-tinting-va-factcard-cache.md`
- `2026-09-27-03-di-chuyen-task-notion-sang-sprint-va-cap-nhat-vai-tro.md`

---

## 2. Khung Mẫu Nhật Ký Phiên (Session Log Template)

*Sao chép đoạn mã dưới đây khi bắt đầu một phiên làm việc mới:*

```markdown
# 📝 Nhật Ký Phát Triển: [Tiêu đề ngắn gọn của phiên]

- **Thời gian:** [Giờ bắt đầu - Giờ kết thúc], ngày DD/MM/YYYY
- **Phiên số:** [NN] trong ngày
- **Người thực hiện:** Bình (Lead Dev) / Thơ (Research) / Nghi (Research) / AI Coding Agent
- **Trạng thái:** ✅ Hoàn thành / 🟡 Tạm dừng / 🔴 Gặp lỗi chặn (Blocker)
- **Pull Request / Commit:** [Link PR hoặc mã commit hash]

---

### 1. Mục tiêu phiên (Session Goal)
*1 - 2 câu nêu rõ vì sao mở phiên này và đích đến cần đạt được.*

### 2. Những việc đã làm (What Was Done)
- **Frontend / Canvas:** [Tóm tắt 1-2 gạch đầu dòng về giao diện, tương tác, canvas]
- **Backend / API / DB:** [Tóm tắt thay đổi endpoint, dữ liệu Supabase, logic xử lý]
- **Tài nguyên & Tư liệu:** [Ảnh bóc nền, fact lịch sử, quy tắc văn hóa đã cập nhật]

### 3. Quyết định kỹ thuật & Giải pháp (Key Decisions & Fixes)
*Ghi lại các quyết định "tại sao làm cách A thay vì B" hoặc cách gỡ lỗi phức tạp để sau này đọc lại hiểu ngay:*
- **Quyết định:** [Ví dụ: Dùng Dual Offscreen Canvas để đổi màu vải không làm mất bóng đổ nếp gấp].
- **Lỗi & Cách gỡ:** [Ví dụ: Bị lỗi SSL khi gọi API dồn dập -> bổ sung cơ chế Retry 5 lần].

### 4. Kết quả kiểm thử (Verification)
- **Kiểm thử tự động:** [X/X tests pass, frontend & backend build 0 lỗi]
- **Kiểm thử thực tế:** [Đã click test trên web live / kết quả hiển thị thực tế]

### 5. Tồn đọng & Việc cần làm tiếp theo (Next Steps)
- [ ] [Đầu việc cần làm ngay ở phiên tiếp theo]
- [ ] [Nội dung cần người trong nhóm phối hợp hoặc review]
```

---

## 3. Mục Lục Lịch Sử Các Phiên (Session Timeline Index)

| Ngày | Phiên | Tiêu đề phiên | Người thực hiện | Trạng thái | Tệp liên kết |
| :---: | :---: | :--- | :---: | :---: | :--- |
| 27/09/2026 | 01 | Tích hợp hạ tầng Render & Đồng bộ Supabase Cloud | Bình & AI Agent | ✅ Hoàn thành | [2026-09-27-01](2026-09-27-01-tich-hop-ha-tang-render-va-dong-bo-supabase.md) |
| 27/09/2026 | 02 | Tối ưu Canvas Engine, Color Tinting & Factcard Cache | Bình & AI Agent | ✅ Hoàn thành | [2026-09-27-02](2026-09-27-02-toi-uu-canvas-engine-tinting-va-factcard-cache.md) |
| 27/09/2026 | 03 | Di chuyển Task Notion sang Sprint & Chuẩn hóa vai trò | Bình & AI Agent | ✅ Hoàn thành | [2026-09-27-03](2026-09-27-03-di-chuyen-task-notion-sang-sprint-va-cap-nhat-vai-tro.md) |
