# [S2.1] Cultural Guardrails Engine & Friendly Toast Alert Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hệ thống cảnh báo quy chuẩn văn hóa tinh tế (Cultural Guardrails Engine) gồm Backend REST API (`POST /api/rules/evaluate`) đánh giá tổ hợp trang phục theo Slot-Map Contract, và Frontend Toast/Banner component mang phong cách "Heritage Futurism", đồng hành gợi ý văn hóa thân thiện cho Gen Z mà không phán xét tiêu cực (US-06, UC-05).

**Architecture:** 
- **Backend:** `RulesService` phân tích `SlotMap` gửi lên từ Frontend, truy xuất thông tin tags của các món đồ đang mặc từ `ItemsService` / Database, so khớp với danh mục quy tắc `cultural_rules` (hỗ trợ các điều kiện JSONB: `MISSING_SLOT`, `INCOMPATIBLE_TAGS`, `REQUIRED_TAGS`), trả về danh sách `RuleViolation` và thông điệp khích lệ `encouragement`.
- **Frontend:** Zustand Store (`useOutfitStore.ts`) tự động kích hoạt evaluate API (với debounce 300ms) mỗi khi người dùng thay đổi trang phục trên Canvas; Component `GuardrailToast.tsx` hiển thị thông báo kính mờ tone hổ phách/vàng ấm, hỗ trợ nút "Mặc gợi ý" (Quick Fix) và tự động ẩn khi bộ đồ đã hợp chuẩn.

**Tech Stack:** Node.js, Express, TypeScript Strict Mode, React 18, Zustand, Tailwind CSS, Lucide React, Node test runner (`node:test`).

**Spec:** [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md) (Sprint 2, S2.1), [docs/USER-STORY.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USER-STORY.md) (US-06), [docs/USE-CASE.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USE-CASE.md) (UC-05), [docs/API-CONTRACTS.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/API-CONTRACTS.md) (Nhóm 3), [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md) (Mục 3), [GEMINI.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/GEMINI.md) (Mục 2.2).

---

## Global Constraints

- **Nguyên tắc giọng văn văn hóa (GEMINI.md 2.2):** Tuyệt đối không phán xét, không dùng từ ngữ tiêu cực (như "phối sai", "cấm", "lỗi"). Giữ giọng điệu người bạn đồng hành tích cực (vd: *"Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?"*).
- **Quy chuẩn Git & CONTRIBUTING.md:**
  - Nhánh phát triển: `feature/S2.1-cultural-guardrails-engine`.
  - Format commit: `<type>(<scope>): <mô tả tiếng Việt>` kèm `Refs: S2.1`. Scope: `guardrail` hoặc `api-rules`.
  - Không commit thẳng vào `main`.
- **Môi trường Windows:** Lệnh terminal bọc qua `cmd /c` và sử dụng `npm.cmd` / `npx.cmd`.

---

### Task 1: Định Nghĩa Dữ Liệu Quy Tắc Văn Hóa & Types Mở Rộng

**Files:**
- Modify: `backend/src/types/index.ts`
- Create: `backend/src/data/cultural-rules.seed.ts`
- Create: `backend/src/tests/cultural-rules-seed.test.ts`

**Interfaces:**
- Produces: `CulturalRuleEntity` interface:
  ```typescript
  export interface CulturalRuleCondition {
    type: 'MISSING_SLOT' | 'INCOMPATIBLE_TAGS' | 'REQUIRED_TAGS';
    required_slot?: SlotType;
    forbidden_tags?: string[];
    required_tags?: string[];
  }

  export interface CulturalRuleEntity {
    id: string;
    rule_code: string;
    trigger_slot: SlotType;
    trigger_tag: string;
    condition: CulturalRuleCondition;
    severity: 'INFO' | 'WARNING';
    message: string;
    suggestion: {
      target_slot: SlotType;
      action: string;
      recommended_tags: string[];
    };
  }
  ```
- Produces: `SEED_CULTURAL_RULES: CulturalRuleEntity[]` tối thiểu 4 quy tắc cốt lõi thời Nguyễn (Áo ngũ thân cần quần, Áo tấc cần quần, Nón/khăn đóng thời kỳ, v.v.).

- [ ] **Step 1: Viết test kiểm tra tính toàn vẹn của danh mục seed rules**

Tạo `backend/src/tests/cultural-rules-seed.test.ts`:
```typescript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SEED_CULTURAL_RULES } from '../data/cultural-rules.seed';

describe('Cultural Rules Seed Data Integrity', () => {
  test('SEED_CULTURAL_RULES phải chứa tối thiểu 3 quy tắc văn hóa chuẩn triều Nguyễn', () => {
    assert.ok(SEED_CULTURAL_RULES.length >= 3);
  });

  test('Mỗi quy tắc phải có rule_code, trigger_slot, message thân thiện và suggestion', () => {
    for (const rule of SEED_CULTURAL_RULES) {
      assert.ok(rule.rule_code.startsWith('RULE_'));
      assert.ok(rule.trigger_slot);
      assert.ok(rule.message.length > 20);
      assert.ok(rule.suggestion?.target_slot);
      // Kiểm tra không chứa từ ngữ phán xét tiêu cực
      assert.ok(!rule.message.toLowerCase().includes('sai quy tắc'));
      assert.ok(!rule.message.toLowerCase().includes('cấm'));
    }
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

```bash
cmd /c "cd backend && npm.cmd test"
```
Kỳ vọng: Thất bại do chưa tồn tại module `cultural-rules.seed.ts`.

- [ ] **Step 3: Khai báo types và hiện thực seed data**

Tạo `backend/src/data/cultural-rules.seed.ts` chứa dữ liệu văn hóa chuẩn mực từ [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md#L225-L237).

- [ ] **Step 4: Chạy test xác nhận test pass**

```bash
cmd /c "cd backend && npm.cmd test"
```
Kỳ vọng: `cultural-rules-seed.test.ts` PASS 100%.

- [ ] **Step 5: Commit task 1**

```bash
git add backend/src/types/ backend/src/data/ backend/src/tests/
git commit -m "feat(guardrail): định nghĩa dữ liệu seed quy tắc văn hóa chuẩn mực" -m "Refs: S2.1, US-06"
```

---

### Task 2: Phát Triển Guardrails Evaluation Engine Trong RulesService

**Files:**
- Modify: `backend/src/services/rules.service.ts`
- Create: `backend/src/tests/rules-engine.test.ts`

**Interfaces:**
- Consumes: `SEED_CULTURAL_RULES`, `itemsService` (để tra cứu item tags).
- Produces: `evaluateRules(dto: EvaluateRulesRequestDto): Promise<EvaluateRulesResponseDto>`
  - Thuật toán so khớp theo sơ đồ Mermaid trong docs:
    1. Lấy danh sách item đang mặc từ `dto.slots`.
    2. Nếu slot rỗng hoặc không có item, bỏ qua.
    3. Lấy item tương ứng và danh sách `tags`.
    4. Quét qua `SEED_CULTURAL_RULES`: nếu `rule.trigger_slot === slot` và item có chứa `rule.trigger_tag`:
       - `condition.type === 'MISSING_SLOT'`: kiểm tra `dto.slots[condition.required_slot]`. Nếu `null` $\rightarrow$ Thêm vi phạm `WARNING`.
       - `condition.type === 'INCOMPATIBLE_TAGS'`: kiểm tra các item ở slot khác có chứa tag trong `forbidden_tags` không.
    5. Trả về `{ is_valid: violations.length === 0, violations, encouragement }`.

- [ ] **Step 1: Viết bộ test kiểm thử nghiệp vụ Guardrails Engine**

Tạo `backend/src/tests/rules-engine.test.ts`:
- Test 1: Mặc Áo ngũ thân (TOP) nhưng không mặc Quần (BOTTOM) $\rightarrow$ Vi phạm `RULE_AODAI_MISSING_BOTTOM` với lời nhắc thân thiện.
- Test 2: Mặc Áo ngũ thân kèm Quần lụa $\rightarrow$ Hợp lệ (`is_valid = true`, không có vi phạm).
- Test 3: Outfit rỗng hoặc chỉ có phụ kiện $\rightarrow$ Không kích hoạt cảnh báo sai lệch.

- [ ] **Step 2: Chạy test để xác nhận kiểm thử thất bại**

```bash
cmd /c "cd backend && npm.cmd test"
```

- [ ] **Step 3: Hoàn thiện logic RulesService theo đặc tả Business Logic 3.2**

Hiện thực hóa toàn diện `RulesService.evaluateRules` xử lý khớp nối dữ liệu thật và mock fallback.

- [ ] **Step 4: Chạy test xác nhận pass và kiểm tra build**

```bash
cmd /c "cd backend && npm.cmd test && npm.cmd run build"
```
Kỳ vọng: Toàn bộ test pass, build không có lỗi type.

- [ ] **Step 5: Commit Rules Engine**

```bash
git add backend/src/services/rules.service.ts backend/src/tests/rules-engine.test.ts
git commit -m "feat(api-rules): triển khai thuật toán so khớp quy chuẩn văn hóa Guardrails Engine" -m "Refs: S2.1, US-06, UC-05"
```

---

### Task 3: Hoàn Thiện REST Controller & Integration Test Cho Route `POST /api/rules/evaluate`

**Files:**
- Modify: `backend/src/controllers/rules.controller.ts` (nếu chưa có thì tạo mới)
- Modify: `backend/src/routes/rules.routes.ts`
- Create: `backend/src/tests/rules-api.test.ts`

**Interfaces:**
- Produces: Endpoint `POST /api/rules/evaluate` chuẩn Envelope JSON response:
  - Status 200 OK với body dạng `{ success: true, data: { is_valid, violations, encouragement }, timestamp }`.
  - Status 400 BAD_REQUEST khi payload thiếu trường `gender` hoặc `slots`.

- [ ] **Step 1: Viết integration test cho endpoint HTTP**

Tạo `backend/src/tests/rules-api.test.ts` gọi trực tiếp controller hoặc mock request kiểm tra mã HTTP status và cấu trúc response DTO.

- [ ] **Step 2: Chạy test xác nhận kiểm thử**

```bash
cmd /c "cd backend && npm.cmd test"
```

- [ ] **Step 3: Triển khai Controller & Route chuẩn Envelope**

- [ ] **Step 4: Chạy test và verify build backend**

```bash
cmd /c "cd backend && npm.cmd test && npm.cmd run build"
```

- [ ] **Step 5: Commit REST API**

```bash
git add backend/src/controllers/ backend/src/routes/ backend/src/tests/
git commit -m "feat(api-rules): hoàn thiện endpoint REST API POST /api/rules/evaluate" -m "Refs: S2.1, US-06"
```

---

### Task 4: Xây Dựng Component `GuardrailToast.tsx` Chuẩn Heritage Futurism

**Files:**
- Create: `frontend/src/components/cultural/GuardrailToast.tsx`
- Create: `frontend/src/components/cultural/GuardrailToast.test.ts`

**Interfaces:**
- Consumes: `RuleViolation` từ `frontend/src/types`.
- Produces: Component `GuardrailToast` hiển thị thông báo dạng Toast nổi ở góc dưới hoặc gắn trên thanh Cultural Inspector:
  - Tone màu: Hổ phách / Vàng đồng (`bg-amber-950/80 border-amber-500/40 text-amber-100`).
  - Biểu tượng: `Sparkles` hoặc `Info` (không dùng icon cấm đoán màu đỏ gay gắt).
  - Nút "Thử kết hợp ngay" (Quick Action): Click vào tự động chọn món đồ thuộc `recommended_tags` để bổ sung vào slot đang thiếu.
  - Tự động ẩn nhẹ nhàng khi `violations.length === 0`.

- [ ] **Step 1: Viết unit test cho logic hiển thị và callback của GuardrailToast**

Tạo `frontend/src/components/cultural/GuardrailToast.test.ts`.

- [ ] **Step 2: Chạy test kiểm tra**

```bash
cmd /c "cd frontend && npm.cmd test"
```

- [ ] **Step 3: Hiện thực GuardrailToast component với hiệu ứng Fade-in 150ms**

- [ ] **Step 4: Chạy test và build Frontend**

```bash
cmd /c "cd frontend && npm.cmd test && npm.cmd run build"
```

- [ ] **Step 5: Commit component**

```bash
git add frontend/src/components/cultural/
git commit -m "feat(guardrail): xây dựng component GuardrailToast mang phong cách Heritage Futurism" -m "Refs: S2.1, US-06"
```

---

### Task 5: Tích Hợp Đánh Giá Tự Động Vào Zustand Store & Workspace Studio

**Files:**
- Modify: `frontend/src/store/useOutfitStore.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/cultural/CulturalFactcard.tsx`

**Interfaces:**
- In `useOutfitStore`:
  - Thêm action: `evaluateGuardrails: () => Promise<void>`.
  - Tự động kích hoạt sau mỗi lần `selectItem` hoặc `removeItem` (áp dụng debounce chống spam API).
  - Tự động dọn sạch `violations` khi outfit hợp chuẩn.

- [ ] **Step 1: Viết test cho store action evaluateGuardrails**

- [ ] **Step 2: Cập nhật useOutfitStore và gắn GuardrailToast vào App.tsx**

- [ ] **Step 3: Chạy toàn bộ kiểm thử frontend và backend**

```bash
cmd /c "cd frontend && npm.cmd test && npm.cmd run build && cd ../backend && npm.cmd test && npm.cmd run build"
```
Kỳ vọng: PASS 100%.

- [ ] **Step 4: Commit tích hợp toàn diện**

```bash
git add frontend/src/store/ frontend/src/App.tsx frontend/src/components/
git commit -m "feat(guardrail): tích hợp tự động đánh giá quy tắc văn hóa vào Studio Workspace" -m "Refs: S2.1, US-06, UC-05"
```

---

## Verification Plan

### Automated Tests
```bash
cmd /c "cd backend && npm.cmd test && npm.cmd run build"
cmd /c "cd frontend && npm.cmd test && npm.cmd run build"
```

### Manual Verification
1. Mở `http://localhost:5173`.
2. Mặc "Áo tấc tay thụng" (`TOP`) và gỡ bỏ Quần (`BOTTOM`) $\rightarrow$ Toast cảnh báo màu hổ phách xuất hiện với thông điệp lịch sự: *"Áo tấc truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm..."*.
3. Bấm nút gợi ý hoặc chọn "Quần lụa trắng" $\rightarrow$ Toast cảnh báo ngay lập tức biến mất trong 150ms, thay bằng lời khích lệ hòa hợp di sản.
