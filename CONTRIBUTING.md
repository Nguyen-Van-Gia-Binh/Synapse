# Quy trình làm việc với Git & Chuẩn mực Đóng góp

> **Synapse – V-Heritage Studio** — quy trình nhánh, commit, Pull Request, review và điều kiện hoàn thành (DoD) cho nhóm 3 thành viên trong lộ trình Agile Fast-Track 16 ngày.
>
> Kế hoạch phát triển chi tiết: [docs/PLAN.md](docs/PLAN.md)  
> Bối cảnh & Thử thách dự án: [docs/ProjectBrief.md](docs/ProjectBrief.md)  
> Chỉ dẫn AI Coding Agent: [GEMINI.md](GEMINI.md)

---

## Mục lục

1. [Mô hình nhánh](#1-mô-hình-nhánh)
2. [Đặt tên nhánh](#2-đặt-tên-nhánh)
3. [Quy ước commit](#3-quy-ước-commit)
4. [Pull Request](#4-pull-request)
5. [Quy trình Review (Code & Văn hóa)](#5-quy-trình-review-code--văn-hóa)
6. [Merge và xử lý xung đột](#6-merge-và-xử-lý-xung-đột)
7. [Definition of Done](#7-definition-of-done)
8. [Những thứ không được commit](#8-những-thứ-không-được-commit)
9. [Tra nhanh câu lệnh](#9-tra-nhanh-câu-lệnh)

---

## 1. Mô hình nhánh

Nhóm sử dụng mô hình **GitHub Flow** — duy nhất một nhánh chính (`main`), mỗi nhiệm vụ được triển khai trên một nhánh ngắn hạn. Mô hình này được lựa chọn vì tính tinh gọn, tốc độ phản hồi cao cho nhóm 3 người trong chu kỳ 16 ngày và tích hợp triển khai liên tục (CI/CD) tự động lên **Vercel** và **Render**.

```
main ────●────────●────────●────────●──────▶  Luôn luôn chạy được & sẵn sàng Demo
          \      /          \      /
           ●───●             ●───●
      feature/S1.1-...   asset/S0.5-...
```

| Nhánh | Vai trò |
| :--- | :--- |
| **`main`** | Nhánh chính duy nhất tồn tại lâu dài. **Luôn ở trạng thái chạy được** — build thành công, không lỗi linter/type. Đây là nhánh tự động deploy để báo cáo và demo sản phẩm. |
| **Nhánh nhiệm vụ** | Ngắn hạn, mỗi nhánh giải quyết **đúng một** đầu việc trong `docs/PLAN.md`. Merge xong thì xóa ngay. |

**Quy tắc cứng:**
- **Tuyệt đối không commit thẳng vào `main`.** Mọi thay đổi bắt buộc phải thông qua Pull Request.
- Một nhánh nhiệm vụ sống tối đa **3 ngày**. Nếu lâu hơn, nhiệm vụ đó quá lớn và phải chia nhỏ thành nhiều task con.
- Trước khi tách nhánh mới, luôn đứng tại `main` và thực hiện `git pull origin main`.

---

## 2. Đặt tên nhánh

Cú pháp: **`<loại>/<mã-task>-<mô-tả-ngắn>`**

| Loại | Dùng khi | Ví dụ |
| :--- | :--- | :--- |
| `feature/` | Chức năng mã nguồn mới (FE / BE) trong `PLAN.md` | `feature/S1.1-core-canvas-engine` |
| `asset/` | Nạp ảnh trang phục bóc nền chuẩn `800x1200 px` | `asset/S0.5-ao-ngu-than-assets` |
| `data/` | Dữ liệu văn hóa, SQL migration Supabase, mock data | `data/S1.3-seed-cultural-facts` |
| `fix/` | Sửa lỗi giao diện, logic canvas hoặc API | `fix/S2.2-color-harmony-calc` |
| `docs/` | Cập nhật tài liệu kỹ thuật, nghiên cứu, kế hoạch | `docs/S0.4-research-guidelines` |
| `chore/` | Cấu hình dự án, dependencies, script deploy | `chore/S0.1-init-governance` |
| `refactor/`| Tối ưu cấu trúc code, không làm thay đổi hành vi | `refactor/S1.4-canvas-layer-manager` |

**Quy tắc:**
- Phần mô tả viết bằng **tiếng Anh**, theo định dạng `kebab-case`, tối đa 5 từ, không dấu tiếng Việt.
- Mã task ghi đúng theo mã Sprint trong `docs/PLAN.md` (ví dụ: `S0.1`, `S1.2`). Công việc phát sinh đột xuất dùng mã `Sx` (ví dụ: `fix/Sx-canvas-mobile-flicker`).

---

## 3. Quy ước commit

Dự án áp dụng chuẩn **Conventional Commits** mở rộng cho đặc thù dự án văn hóa - công nghệ:

```text
<loại>(<phạm vi>): <mô tả ngắn>

<phần thân, không bắt buộc>

Refs: <mã task>
```

### 3.1. Loại commit

| Loại | Dùng khi |
| :--- | :--- |
| `feat` | Thêm tính năng mới cho người dùng (Canvas, Palette, Guardrails...) |
| `fix` | Sửa lỗi logic, hiển thị hoặc API |
| `asset` | Thêm mới hoặc cập nhật ảnh trang phục PNG `800x1200` bóc nền (Team Research) |
| `data` | Thêm dữ liệu fact văn hóa, quy tắc cấm kỵ hoặc script CSDL Supabase |
| `docs` | Cập nhật tài liệu hướng dẫn, kế hoạch trong `docs/` hoặc `README.md` |
| `refactor`| Tái cấu trúc mã nguồn, tách module |
| `style` | Định dạng, thụt lề, khoảng trắng, không ảnh hưởng logic |
| `chore` | Cập nhật cấu hình build, dependencies npm, `.gitignore` |
| `ci` | Cấu hình GitHub Actions, workflow kiểm thử tự động |

### 3.2. Phạm vi (`scope`)

- **Frontend:** `canvas`, `factcard`, `palette`, `guardrail`, `lookbook`, `fe-common`.
- **Backend:** `api-items`, `api-facts`, `api-rules`, `api-lookbook`, `be-common`.
- **CSDL & Dữ liệu:** `db`, `seed`, `schema`.
- **Chung:** `docs`, `config`, `assets`.

### 3.3. Mô tả commit

- Viết bằng **tiếng Việt**, thể mệnh lệnh: "thêm", "sửa", "tối ưu", "cập nhật" — không viết "đã thêm".
- Không quá 72 ký tự, không kết thúc bằng dấu chấm.
- Giữ nguyên các thuật ngữ chuyên môn: `Canvas`, `Z-Index`, `Factcard`, `Lookbook`, `Supabase`.

### 3.4. Ví dụ mẫu

```text
feat(canvas): tích hợp cơ chế xếp lớp Paper-Doll 6 slot

Triển khai vẽ tuần tự theo layer_order trên khung cố định 800x1200 px.

Refs: S1.1
```

```text
asset(assets): bổ sung bộ ảnh Áo ngũ thân tay chẽn nam bóc nền

Bộ ảnh gồm 5 góc chi tiết đạt chuẩn PNG trong suốt 800x1200 px.

Refs: S0.5
```

```text
data(db): nạp 6 thẻ fact văn hóa triều Nguyễn vào Supabase

Bổ sung fact nguồn gốc và ý nghĩa cấu trúc cúc ngũ thường cho Áo ngũ thân.

Refs: S1.3
```

---

## 4. Pull Request

### 4.1. Thời điểm mở PR
Mở Pull Request ngay khi bắt đầu triển khai nhiệm vụ và để ở trạng thái **Draft**. Việc này giúp toàn bộ 3 thành viên biết ai đang thao tác trên module nào, tránh sửa trùng file hoặc nạp đè tài nguyên. Khi hoàn thành và tự kiểm thử đạt yêu cầu thì chuyển sang **Ready for review**.

### 4.2. Tiêu đề Pull Request
Tuân thủ định dạng commit kèm mã task:
```text
[S1.1] feat(canvas): tích hợp cơ chế xếp lớp Paper-Doll 6 slot
```

### 4.3. Nội dung mô tả PR
Áp dụng mẫu có sẵn tại `.github/PULL_REQUEST_TEMPLATE.md`:
- Nêu rõ mã task tương ứng trong `docs/PLAN.md`.
- Liệt kê tóm tắt các thay đổi chính.
- Hướng dẫn các bước kiểm thử (test steps).
- Đánh dấu đầy đủ các mục trong checklist kiểm tra trước khi review.

### 4.4. Kích thước Pull Request
Một PR lý tưởng nên dưới **350 dòng thay đổi** (hoặc dưới 10 ảnh asset). PR quá lớn sẽ làm giảm chất lượng review. Hãy tách thành các PR nhỏ nối tiếp nhau.

---

## 5. Quy trình Review (Code & Văn hóa)

| Quy tắc | Nội dung chi tiết |
| :--- | :--- |
| **Số lượng phê duyệt** | Tối thiểu **1** thành viên duyệt chấp thuận (Approve) mới được phép merge vào `main`. |
| **Phân quyền duyệt** | • **Lead Dev**: Duyệt toàn bộ PR liên quan đến mã nguồn Frontend, Backend, API và CSDL Supabase.<br>• **Research Members**: Duyệt các PR liên quan đến tính xác thực của Fact văn hóa, quy chuẩn ảnh trang phục và nội dung quy tắc cấm kỵ. |
| **Thời gian phản hồi** | Trong vòng **12 đến 24 giờ** (do nhịp độ Sprint ngắn 16 ngày). |
| **Cấm tự duyệt** | Tuyệt đối không ai được tự approve Pull Request của chính mình. |

**Văn hóa góp ý:**
- Nhận xét mang tính xây dựng, chỉ rõ nguyên nhân và đề xuất giải pháp cụ thể.
- Phân biệt rõ góp ý bắt buộc sửa (`[Bắt buộc]`) và gợi ý cải tiến (`[Gợi ý]`).
- Tác giả PR phải phản hồi từng góp ý trước khi resolve conversation.

---

## 6. Merge và xử lý xung đột

### 6.1. Phương thức Merge
- Bắt buộc dùng **Squash and merge**. Toàn bộ các commit trong nhánh nhiệm vụ sẽ được gộp thành 1 commit duy nhất trên `main`, giúp lịch sử Git luôn sạch sẽ, rõ ràng và dễ dàng revert khi có sự cố.
- Tiêu đề commit squash lấy theo tiêu đề PR.
- Sau khi merge, **xóa nhánh nhiệm vụ ngay lập tức** trên GitHub.

### 6.2. Đồng bộ nhánh nhiệm vụ với `main`
Khi nhánh đang làm bị đi sau `main`, hãy dùng **rebase** để giữ lịch sử phẳng, không tạo commit merge rác:

```bash
git checkout feature/S1.1-core-canvas-engine
git fetch origin
git rebase origin/main
# Nếu có xung đột: mở file giải quyết, sau đó:
git add <các file đã sửa xung đột>
git rebase --continue
# Đẩy lên lại nhánh từ xa:
git push --force-with-lease
```

*Lưu ý:* Luôn dùng `--force-with-lease`, tuyệt đối không dùng `--force` để tránh ghi đè commit của đồng đội.

---

## 7. Definition of Done (DoD)

Một nhiệm vụ chỉ được coi là hoàn tất (`Done`) khi đáp ứng đủ các tiêu chí tương ứng:

### Đối với Nhiệm vụ Code (Frontend / Backend / Database)
- [ ] Code biên dịch không lỗi, chạy xanh toàn bộ trên môi trường local.
- [ ] TypeScript strict mode, không có lỗi linter.
- [ ] API phản hồi đúng cấu trúc JSON chuẩn đã thống nhất.
- [ ] Đã kiểm thử responsive trên cả Desktop và Mobile viewport.

### Đối với Nhiệm vụ Tài nguyên Hình ảnh (Asset)
- [ ] Ảnh định dạng `.png` trong suốt (transparent background), bóc nền sắc nét.
- [ ] Chuẩn kích thước cố định `800 x 1200 px` (tỉ lệ 2:3).
- [ ] Tọa độ trang phục khớp chính xác với vóc dáng của Mannequin mẫu (Nam / Nữ).

### Đối với Nhiệm vụ Nội dung Văn hóa (Research & Guardrails)
- [ ] Trích dẫn nguồn gốc lịch sử, niên đại chính xác dựa trên tài liệu nghiên cứu chuẩn mực.
- [ ] Lời nhắc vi phạm quy tắc văn hóa giữ giọng điệu tích cực, lịch sự, mang tính định hướng.

### Tiêu chí Chung
- [ ] Được ít nhất 1 thành viên review và phê duyệt (Approve).
- [ ] Đã Squash & Merge thành công vào nhánh `main`.
- [ ] Đánh dấu hoàn thành task tương ứng trong [docs/PLAN.md](docs/PLAN.md).

---

## 8. Những thứ không được commit

```gitignore
# Tệp bí mật & Khóa môi trường
.env
.env.local
.env.development.local
.env.production.local
*.pem
*.key

# Thư viện & Thư mục Build
node_modules/
dist/
build/
coverage/
*.tsbuildinfo

# Tệp của Hệ điều hành & IDE
.DS_Store
Thumbs.db
.vscode/* (ngoại trừ settings.json chung)
.idea/

# File tạm và log
*.log
npm-debug.log*
yarn-debug.log*
```

> **Cảnh báo bảo mật:** Kho chứa chỉ được phép chứa file mẫu `.env.example` với các giá trị giả lập. Nếu vô tình commit secret lên GitHub, phải **thu hồi (revoke) và tạo lại khóa mới ngay lập tức**, đồng thời thông báo cho toàn đội.

---

## 9. Tra nhanh câu lệnh

```bash
# Bắt đầu làm một nhiệm vụ mới
git checkout main
git pull origin main
git checkout -b feature/S1.1-core-canvas-engine

# Thêm file và commit theo chuẩn
git add .
git commit -m "feat(canvas): tích hợp cơ chế xếp lớp Paper-Doll 6 slot"

# Đẩy nhánh lên GitHub lần đầu
git push -u origin feature/S1.1-core-canvas-engine

# Cập nhật nhánh nhiệm vụ theo main mới nhất
git fetch origin
git rebase origin/main
git push --force-with-lease

# Xóa nhánh cục bộ sau khi PR đã merge thành công
git checkout main
git pull origin main
git branch -d feature/S1.1-core-canvas-engine

# Xem 15 commit gần nhất dưới dạng cây trực quan
git log --oneline --graph --decorate -15
```
