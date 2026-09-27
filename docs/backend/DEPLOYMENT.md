# Hướng Dẫn Triển Khai & Vận Hành Hạ Tầng (Deployment Guide)

> **Dự án:** Synapse – V-Heritage Studio  
> **Nền tảng:** Render.com (Backend API), Vercel (Frontend Client), Supabase (Database & Storage)  
> **Tài liệu tham chiếu:** [render.yaml](../../render.yaml), [vercel.json](../../vercel.json), [docs/shared/DATABASE-SCHEMA.sql](../shared/DATABASE-SCHEMA.sql)

---

## 1. Kiến Trúc Hạ Tầng Triển Khai (Cloud Infrastructure)

Hệ thống Synapse được triển khai theo mô hình phân tán không máy chủ (Serverless / Cloud Managed Services):

```text
       [Khách Hàng / Trình Duyệt Web]
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
[Vercel Cloud]              [Render.com Cloud]
Frontend React Vite         Backend Node.js API
(synapse-studio.vercel.app) (synapse-api.onrender.com)
                                   │
                                   ▼
                            [Supabase Cloud]
                            - PostgreSQL (Database)
                            - Supabase Storage (PNG Assets)
```

---

## 2. Triển Khai Backend Lên Render.com

### 2.1. Cấu Hình Dịch Vụ (`render.yaml`)
Backend được khai báo tự động thông qua Infrastructure-as-Code trong tệp `render.yaml`:

```yaml
services:
  - type: web
    name: synapse-api
    runtime: node
    plan: free
    rootDir: backend
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CLIENT_URL
        value: https://synapse-studio.vercel.app
```

### 2.2. Danh Sách Biến Môi Trường (Environment Variables)

| Tên Biến | Ý Nghĩa | Bắt Buộc | Giá Trị Mẫu |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Môi trường chạy | Có | `production` / `development` |
| `PORT` | Cổng HTTP lắng nghe | Có | `10000` (Render mặc định) hoặc `3001` |
| `CLIENT_URL` | URL Frontend cho CORS | Có | `https://synapse-studio.vercel.app` |
| `SUPABASE_URL` | Địa chỉ project Supabase | Có | `https://xyzcompany.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Khóa đặc quyền DB | Có | `eyJhbGciOi...` (Bảo mật bí mật) |
| `SUPABASE_PUBLISHABLE_KEY` | Khóa công khai Supabase | Không | `eyJhbGciOi...` |

### 2.3. Giám Sát Sức Khỏe Dịch Vụ (Health Check)
Render.com tự động thăm dò endpoint định kỳ để bảo đảm container luôn sống:
- **Đường dẫn:** `GET /api/health`
- **Phản hồi mẫu:**
  ```json
  {
    "success": true,
    "data": {
      "status": "healthy",
      "service": "synapse-backend",
      "environment": "production"
    },
    "timestamp": "2026-09-27T23:00:00.000Z"
  }
  ```

---

## 3. Khởi Tạo Cơ Sở Dữ Liệu Supabase

Khi thiết lập môi trường mới hoặc cập nhật cấu trúc bảng:
1. Đăng nhập Supabase Dashboard -> Truy cập mục **SQL Editor**.
2. Mở tệp [docs/shared/DATABASE-SCHEMA.sql](../shared/DATABASE-SCHEMA.sql).
3. Sao chép toàn bộ nội dung và thực thi để khởi tạo:
   - 4 Bảng cốt lõi: `items`, `cultural_facts`, `cultural_rules`, `lookbooks`.
   - Các chỉ mục tối ưu tìm kiếm (`indexes`).
   - Chính sách Row Level Security (RLS) bảo vệ dữ liệu.
   - Dữ liệu mẫu khởi đầu (Seed data 8 cổ phục và bộ quy tắc cấm kỵ).
