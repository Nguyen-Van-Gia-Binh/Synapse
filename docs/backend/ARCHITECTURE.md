# Kiến Trúc Dịch Vụ API Backend

> **Dự án:** Synapse – V-Heritage Studio  
> **Công nghệ:** Node.js, Express, TypeScript, Supabase PostgreSQL  
> **Tài liệu tham chiếu:** [docs/shared/API-CONTRACTS.md](../shared/API-CONTRACTS.md), [docs/shared/DATABASE-SCHEMA.sql](../shared/DATABASE-SCHEMA.sql)

---

## 1. Mô Hình Phân Tầng Kiến Trúc (Layered Architecture)

Backend được xây dựng theo mô hình phân tầng chặt chẽ (Separation of Concerns), đảm bảo tính module hóa và dễ kiểm thử độc lập:

```text
[HTTP Requests] (Frontend React / Postman / Tests)
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ 1. Routing Layer (`backend/src/routes/`)               │
│    - Định tuyến URL (/api/items, /api/rules, ...)      │
│    - Gắn middleware xác thực / validate input          │
└────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ 2. Controller Layer (`backend/src/controllers/`)       │
│    - Tiếp nhận Request, bóc tách params/body           │
│    - Đóng gói chuẩn ApiResponse<T>                     │
│    - Xử lý mã HTTP Status (200, 201, 400, 404, 500)   │
└────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ 3. Service Layer (`backend/src/services/`)             │
│    - Xử lý nghiệp vụ thuần túy (Business Logic)        │
│    - Thuật toán kiểm tra Cultural Guardrails           │
│    - Tính toán điểm hòa sắc & tra cứu tri thức         │
└────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ 4. Persistence Layer (`backend/src/config/supabase.ts`)│
│    - Dual-Mode: Supabase PostgreSQL (Cloud)           │
│    - In-Memory Mock Store (Khi offline hoặc unit test) │
└────────────────────────────────────────────────────────┘
```

---

## 2. Danh Mục Các Phân Hệ Dịch Vụ (Service Subsystems)

### 2.1. Items & Factcard Subsystem (`items.service.ts`)
- **Nhiệm vụ:**
  - Cung cấp danh mục cổ phục Việt Nam theo giới tính (`male`, `female`, `unisex`) và vị trí slot (`HEADWEAR`, `TOP`, `BOTTOM`...).
  - Tra cứu thẻ tri thức lịch sử chuyên sâu (`cultural_facts`) theo từng món trang phục (triều đại, câu chuyện nguồn gốc, gợi ý phối hiện đại).
- **Cơ chế Fallback:** Tích hợp sẵn 8 trang phục mẫu chuẩn 100% theo [DATABASE-SCHEMA.sql](../shared/DATABASE-SCHEMA.sql) để ứng dụng luôn hoạt động mượt mà ngay cả khi mất kết nối cơ sở dữ liệu.

### 2.2. Cultural Guardrails Engine Subsystem (`rules.service.ts`)
- **Nhiệm vụ:**
  - Kiểm tra bộ phối trang phục của người dùng theo thời gian thực dựa trên tập luật văn hóa.
  - Phân tích xung đột cấm kỵ (ví dụ: mặc áo Nhật bình nhưng thiếu quần ống rộng, hoặc phối đồ vi phạm tôn ti cung đình).
  - Trả về cảnh báo nhẹ nhàng, mang tính gợi mở sáng tạo kèm gợi ý thay thế (`suggestion_action`), tuân thủ tuyệt đối [GEMINI.md](../../GEMINI.md).

### 2.3. Lookbooks Subsystem (`lookbooks.service.ts`)
- **Nhiệm vụ:**
  - Lưu trữ tác phẩm phối đồ do người dùng tạo gồm ảnh chụp canvas, bảng màu, điểm hòa sắc và dữ liệu slot.
  - Lấy danh sách lookbook cộng đồng để người dùng tham khảo và học hỏi phong cách.

---

## 3. Quy Chuẩn Xử Lý Lỗi & Phản Hồi Dữ Liệu (Standardized API Response)

Mọi phản hồi từ Backend đều tuân thủ cấu trúc đồng nhất được định nghĩa tại `backend/src/types/index.ts`:

### 3.1. Cấu Trúc Thành Công
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string; // ISO 8601
}
```

### 3.2. Cấu Trúc Báo Lỗi
```typescript
interface ApiResponse<never> {
  success: false;
  error: {
    code: string;        // Ví dụ: 'ITEM_NOT_FOUND', 'VALIDATION_ERROR'
    message: string;     // Thông điệp thân thiện bằng tiếng Việt
    details?: unknown;   // Chi tiết lỗi kỹ thuật khi ở môi trường development
  };
  timestamp: string;
}
```

### 3.3. Bảng Mã Lỗi Chuẩn (Error Codes)
- `ITEM_NOT_FOUND`: Trang phục hoặc thẻ tri thức không tồn tại trong hệ thống.
- `VALIDATION_ERROR`: Dữ liệu đầu vào sai định dạng hoặc thiếu trường bắt buộc.
- `GUARDRAIL_VIOLATION`: Bộ phối vi phạm quy tắc văn hóa nghiêm trọng.
- `LOOKBOOK_NOT_FOUND`: Tác phẩm lookbook không tồn tại.
- `INTERNAL_SERVER_ERROR`: Lỗi máy chủ không xác định.

---

## 4. Cơ Chế Dual-Mode Persistence (Độ Bền Vững & Ngoại Tuyến)

Để đảm bảo quy trình kiểm thử tự động (Unit Test / CI/CD) không phụ thuộc vào hạ tầng mạng bên ngoài:
1. **Chế độ Trực tuyến (Production / Cloud):** Sử dụng `@supabase/supabase-js` kết nối PostgreSQL trên Supabase.
2. **Chế độ Ngoại tuyến / Test (In-Memory Fallback):** Khi biến môi trường `SUPABASE_URL` chưa được cung cấp hoặc khi chạy test (`NODE_ENV === 'test'`), hệ thống tự động sử dụng bộ nhớ RAM (In-Memory Seed Data) để thực thi toàn bộ logic đọc/ghi mà không phát sinh lỗi kết nối.
