# ĐẶC TẢ GIAO DIỆN LẬP TRÌNH ỨNG DỤNG (API-CONTRACTS.MD)

> **Dự án:** Synapse – V-Heritage Studio  
> **Phiên bản:** 1.0.0 | **Ngày ban hành:** 22/09/2026  
> **Kiến trúc:** RESTful API | **Định dạng dữ liệu:** JSON (`application/json`)  
> **Tiêu chuẩn lập trình:** TypeScript Strict Mode (Zero `any`)  

---

## 1. TIÊU CHUẨN CHUNG & QUY ƯỚC HỆ THỐNG (CONVENTIONS)

### 1.1. Base URL & Môi Trường
* **Development (Local):** `http://localhost:5000/api`
* **Production (Render.com):** `https://synapse-api.onrender.com/api`

### 1.2. Chuẩn Hóa Cấu Trúc Phản Hồi (Standard Response Envelope)

Mọi API của hệ thống Synapse đều được bọc trong một chuẩn Envelope thống nhất:

#### Phản Hồi Thành Công (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-09-22T04:00:00.000Z"
}
```

#### Phản Hồi Thất Bại (HTTP 400 / 404 / 500)
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Không tìm thấy trang phục với mã ID được cung cấp.",
    "details": null
  },
  "timestamp": "2026-09-22T04:00:00.000Z"
}
```

### 1.3. Bảng Mã Lỗi Hệ Thống (Standard Error Codes)
* `BAD_REQUEST` (400): Tham số gửi lên không đúng định dạng.
* `ITEM_NOT_FOUND` (404): Không tìm thấy trang phục hoặc tri thức tương ứng.
* `LOOKBOOK_NOT_FOUND` (404): Không tìm thấy tác phẩm Lookbook theo link chia sẻ.
* `INTERNAL_SERVER_ERROR` (500): Lỗi xử lý CSDL Supabase hoặc máy chủ.

---

## 2. ĐẶC TẢ CHI TIẾT CÁC ENDPOINTS

---

### NHÓM 1: TRANG PHỤC & DANH MỤC (ITEMS & CATALOG API)

#### 1.1. Lấy Danh Sách Trang Phục (`GET /api/items`)
* **Mô tả:** Lấy danh mục trang phục để hiển thị trong Drawer chọn đồ của Studio Workspace. Hỗ trợ lọc theo giới tính (`gender`), vị trí slot (`slot`), và thời kỳ (`era`).
* **Query Parameters:**
  * `gender` (*Tùy chọn*, `enum`): `MALE` | `FEMALE` | `UNISEX`.
  * `slot` (*Tùy chọn*, `enum`): `HEADWEAR` | `TOP` | `BOTTOM` | `PATTERN` | `ACCESSORY` | `FOOTWEAR`.
  * `era` (*Tùy chọn*, `string`): Lọc theo triều đại (vd: `nguyen`).

* **Ví dụ Request:**
  ```http
  GET /api/items?gender=FEMALE&slot=TOP HTTP/1.1
  Host: localhost:5000
  ```

* **Ví dụ Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "e4b2d5a1-7c8e-4a9b-8f12-3d4e5f6a7b8c",
        "name": "Áo tấc tay thụng",
        "gender": "FEMALE",
        "slot": "TOP",
        "layer_order": 30,
        "image_url": "https://xyz.supabase.co/storage/v1/object/public/item-assets/female_ao_tac_top.png",
        "color_customizable": true,
        "default_color": "#9E2A2B",
        "tags": ["nguyen", "formal", "ao_tac", "le_hoi"],
        "created_at": "2026-09-22T03:00:00.000Z"
      },
      {
        "id": "f8a1c3d2-5b7e-4e9a-9c23-4e5f6a7b8c9d",
        "name": "Áo ngũ thân tay chẽn",
        "gender": "FEMALE",
        "slot": "TOP",
        "layer_order": 30,
        "image_url": "https://xyz.supabase.co/storage/v1/object/public/item-assets/female_ao_ngu_than_top.png",
        "color_customizable": true,
        "default_color": "#264653",
        "tags": ["nguyen", "daily", "ao_ngu_than"],
        "created_at": "2026-09-22T03:00:00.000Z"
      }
    ],
    "timestamp": "2026-09-22T04:00:00.000Z"
  }
  ```

---

#### 1.2. Lấy Chi Tiết Một Món Đồ (`GET /api/items/:id`)
* **Mô tả:** Lấy thông tin chi tiết một trang phục cụ thể theo UUID.
* **Path Parameter:** `id` (UUID) – Mã định danh món đồ.
* **Ví dụ Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "e4b2d5a1-7c8e-4a9b-8f12-3d4e5f6a7b8c",
      "name": "Áo tấc tay thụng",
      "gender": "FEMALE",
      "slot": "TOP",
      "layer_order": 30,
      "image_url": "https://xyz.supabase.co/storage/v1/object/public/item-assets/female_ao_tac_top.png",
      "color_customizable": true,
      "default_color": "#9E2A2B",
      "tags": ["nguyen", "formal", "ao_tac", "le_hoi"]
    },
    "timestamp": "2026-09-22T04:00:00.000Z"
  }
  ```

---

### NHÓM 2: TRI THỨC VĂN HÓA (CULTURAL FACTS API)

#### 2.1. Lấy Thẻ Tri Thức Của Món Đồ (`GET /api/items/:id/facts`)
* **Mô tả:** Truy vấn nội dung Thẻ Tri Thức Văn Hóa (Cultural Factcard) hiển thị tại cột phải của Studio khi người dùng nhấp chọn trang phục.
* **Path Parameter:** `id` (UUID) – Mã món đồ (`item_id`).
* **Ví dụ Request:**
  ```http
  GET /api/items/e4b2d5a1-7c8e-4a9b-8f12-3d4e5f6a7b8c/facts HTTP/1.1
  Host: localhost:5000
  ```

* **Ví dụ Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "item_id": "e4b2d5a1-7c8e-4a9b-8f12-3d4e5f6a7b8c",
      "era": "Triều Nguyễn (Thế kỷ 19 - 20)",
      "origin_story": "Áo tấc (còn gọi là áo ngũ thân tay thụng) là lễ phục trang trọng thời Nguyễn, thường được mặc trong các dịp đại lễ, hôn lễ, cúng tế.",
      "symbolic_meaning": "Tà áo rộng mang dáng dấp uy nghi; cổ áo đứng cài 5 hạt khuy tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.",
      "modern_styling_tip": "Gen Z có thể phối áo tấc với quần lụa ống rộng màu trắng ngà hoặc phối cùng giày sneaker trắng tối giản để tạo phong cách thanh lịch, trẻ trung."
    },
    "timestamp": "2026-09-22T04:00:00.000Z"
  }
  ```

---

### NHÓM 3: CẢNH BÁO QUY CHUẨN VĂN HÓA (CULTURAL GUARDRAILS API)

#### 3.1. Đánh Giá Cấu Trúc Bộ Phối Đồ (`POST /api/rules/evaluate`)
* **Mô tả:** Đánh giá danh sách các lớp đồ hiện tại trên người mẫu đối chiếu với các quy tắc lịch sử/văn hóa trong CSDL. Trả về cảnh báo thân thiện nếu phát hiện sai lệch phom dáng trang phục truyền thống.
* **Request Body (Slot-Map Contract):**
  ```json
  {
    "gender": "FEMALE",
    "slots": {
      "HEADWEAR": "3df12345-42cd-8000-0001-000000000001",
      "TOP": "e4b2d5a1-7c8e-4a9b-8f12-3d4e5f6a7b8c",
      "BOTTOM": null,
      "PATTERN": null,
      "ACCESSORY": "3df12345-42cd-8000-0001-000000000005",
      "FOOTWEAR": "3df12345-42cd-8000-0001-000000000006"
    }
  }
  ```

* **Ví dụ Response Khi Có Cảnh Báo (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "is_valid": false,
      "violations": [
        {
          "rule_code": "RULE_AODAI_MISSING_BOTTOM",
          "trigger_slot": "TOP",
          "severity": "WARNING",
          "message": "Áo ngũ thân truyền thống luôn đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?",
          "suggestion": {
            "target_slot": "BOTTOM",
            "action": "ADD_RECOMMENDED_ITEM",
            "recommended_tags": ["quan_ong_rong", "silk"]
          }
        }
      ],
      "encouragement": "Bạn đang tạo nên một nét phá cách thú vị, hãy cân nhắc thêm quần để giữ trọn vẻ đẹp di sản nhé!"
    },
    "timestamp": "2026-09-22T04:00:00.000Z"
  }
  ```

* **Ví dụ Response Khi Bộ Phối Chuẩn Mực (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "is_valid": true,
      "violations": [],
      "encouragement": "Sự kết hợp tuyệt vời! Bạn đã dung hòa hoàn hảo nét trang nghiêm cổ phong với phong cách năng động của Gen Z."
    },
    "timestamp": "2026-09-22T04:00:00.000Z"
  }
  ```

---

### NHÓM 4: TRIỂN LÃM & XUẤT BẢN LOOKBOOK (LOOKBOOK API)

#### 4.1. Lưu Bộ Phối Đồ Lookbook (`POST /api/lookbooks`)
* **Mô tả:** Lưu trữ bộ phối đồ người dùng đã sáng tạo lên CSDL Supabase để phục vụ việc chia sẻ đường link công khai hoặc triển lãm cộng đồng.
* **Request Body:**
  ```json
  {
    "title": "Dạo Phố Đông Kinh 2026",
    "gender": "FEMALE",
    "harmony_score": 92,
    "outfit_data": {
      "slots": {
        "HEADWEAR": { "item_id": "uuid-khan-dong", "color": "#1D1E2C" },
        "TOP": { "item_id": "uuid-ao-tac", "color": "#9E2A2B" },
        "BOTTOM": { "item_id": "uuid-quan-lua", "color": "#F4F1DE" },
        "PATTERN": null,
        "ACCESSORY": { "item_id": "uuid-quat-lua", "color": "#E9C46A" },
        "FOOTWEAR": { "item_id": "uuid-sneaker-trang", "color": "#FFFFFF" }
      },
      "palette_used": ["#9E2A2B", "#F4F1DE", "#1D1E2C", "#E9C46A"]
    }
  }
  ```

* **Ví dụ Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
      "title": "Dạo Phố Đông Kinh 2026",
      "gender": "FEMALE",
      "harmony_score": 92,
      "share_url": "https://synapse-studio.vn/lookbook/7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
      "created_at": "2026-09-22T04:15:00.000Z"
    },
    "timestamp": "2026-09-22T04:15:00.000Z"
  }
  ```

---

#### 4.2. Lấy Chi Tiết Lookbook Theo Link Chia Sẻ (`GET /api/lookbooks/:id`)
* **Mô tả:** Xem lại bộ phối đồ hoàn chỉnh bằng mã định danh Lookbook (khi người khác bấm vào link chia sẻ).
* **Path Parameter:** `id` (UUID) – Mã định danh tác phẩm.
* **Ví dụ Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
      "title": "Dạo Phố Đông Kinh 2026",
      "gender": "FEMALE",
      "harmony_score": 92,
      "outfit_data": {
        "slots": {
          "HEADWEAR": { "item_id": "uuid-khan-dong", "color": "#1D1E2C" },
          "TOP": { "item_id": "uuid-ao-tac", "color": "#9E2A2B" },
          "BOTTOM": { "item_id": "uuid-quan-lua", "color": "#F4F1DE" },
          "PATTERN": null,
          "ACCESSORY": { "item_id": "uuid-quat-lua", "color": "#E9C46A" },
          "FOOTWEAR": { "item_id": "uuid-sneaker-trang", "color": "#FFFFFF" }
        },
        "palette_used": ["#9E2A2B", "#F4F1DE", "#1D1E2C", "#E9C46A"]
      },
      "created_at": "2026-09-22T04:15:00.000Z"
    },
    "timestamp": "2026-09-22T04:15:00.000Z"
  }
  ```

---

## 3. TYPESCRIPT INTERFACES CHUẨN (SHARED DTOS)

Các Interface này được chia sẻ dùng chung giữa Frontend và Backend để đảm bảo **TypeScript Strict Mode 100%**:

```typescript
export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';
export type SlotType = 'HEADWEAR' | 'TOP' | 'BOTTOM' | 'PATTERN' | 'ACCESSORY' | 'FOOTWEAR';
export type RuleSeverity = 'INFO' | 'WARNING';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface ItemDto {
  id: string;
  name: string;
  gender: Gender;
  slot: SlotType;
  layer_order: number;
  image_url: string;
  color_customizable: boolean;
  default_color: string;
  tags: string[];
  created_at?: string;
}

export interface CulturalFactDto {
  id: string;
  item_id: string;
  era: string;
  origin_story: string;
  symbolic_meaning: string;
  modern_styling_tip: string;
}

export interface SlotMap {
  HEADWEAR: string | null;
  TOP: string | null;
  BOTTOM: string | null;
  PATTERN: string | null;
  ACCESSORY: string | null;
  FOOTWEAR: string | null;
}

export interface EvaluateRulesRequestDto {
  gender: Gender;
  slots: SlotMap;
}

export interface RuleViolation {
  rule_code: string;
  trigger_slot: SlotType;
  severity: RuleSeverity;
  message: string;
  suggestion?: {
    target_slot: SlotType;
    action: string;
    recommended_tags?: string[];
  };
}

export interface EvaluateRulesResponseDto {
  is_valid: boolean;
  violations: RuleViolation[];
  encouragement: string;
}

export interface LookbookOutfitData {
  slots: Record<SlotType, { item_id: string; color: string } | null>;
  palette_used: string[];
}

export interface CreateLookbookDto {
  title: string;
  gender: Gender;
  harmony_score: number;
  outfit_data: LookbookOutfitData;
}

export interface LookbookResponseDto extends CreateLookbookDto {
  id: string;
  share_url: string;
  created_at: string;
}
```
