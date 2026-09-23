# [S2.2] Color Harmony Scorer & Visual Harmony Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai thuật toán chấm điểm hòa sắc mỹ thuật và văn hóa di sản (thang điểm 0 – 100) kết hợp giữa Nguyên lý bánh xe màu sắc (Hue spread 40%), Độ tương phản chuẩn WCAG (Luminance contrast 30%), Điểm thưởng Ngũ Hành tương sinh Việt Nam (Heritage bonus 30%), cùng Component trực quan `HarmonyRadar.tsx` phản ứng thời gian thực khi phối đồ (US-07, UC-06).

**Architecture:**
- **Tầng Thuật toán lõi (Pure Math & Logic):** Tách thành các hàm tính toán độc lập không phụ thuộc UI:
  1. `colorMetrics.ts`: Chuyển đổi mã Hex $\rightarrow$ RGB $\rightarrow$ HSL, tính góc lệch nhỏ nhất $\Delta\theta$ và độ chói tương đối theo chuẩn WCAG.
  2. `heritageWuXing.ts`: Ánh xạ 8 màu Cổ phong sang Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ) và kiểm tra quan hệ Tương sinh.
  3. `harmonyScorer.ts`: Tổng hợp 3 chỉ số theo công thức chuẩn hóa, phân loại thế màu (*ANALOGOUS, COMPLEMENTARY, TRIADIC, NEUTRAL*) và sinh lời bình phẩm mỹ thuật.
- **Tầng Trạng thái & Giao diện:** Tích hợp vào Zustand Store (`useOutfitStore.ts`), tự động tính toán lại điểm mỗi khi màu áo (`TOP`), quần (`BOTTOM`), hoặc mũ (`HEADWEAR`) thay đổi; Component `HarmonyRadar.tsx` hiển thị điểm số, biểu đồ radar 3 trục (Sắc độ, Tương phản, Di sản) và huy hiệu văn hóa.

**Tech Stack:** TypeScript Strict Mode, React 18, Zustand, Tailwind CSS, SVG / Canvas mini chart, Lucide React, Node test runner (`node:test`).

**Spec:** [docs/PLAN.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/PLAN.md) (Sprint 2, S2.2), [docs/USER-STORY.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USER-STORY.md) (US-07), [docs/USE-CASE.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/USE-CASE.md) (UC-06), [docs/BUSINESS-LOGIC-SPECIFICATION.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md) (Mục 2).

---

## Global Constraints

- **Công thức tính điểm chuẩn:** Bắt buộc tuân thủ 100% công thức:
  $$\text{Total Score} = (\text{Score}_{\text{Hue}} \times 0.40) + (\text{Score}_{\text{Contrast}} \times 0.30) + (\text{Score}_{\text{Heritage}} \times 0.30)$$
- **Quy chuẩn Git & CONTRIBUTING.md:**
  - Nhánh phát triển: `feature/S2.2-color-harmony-scorer`.
  - Format commit: `<type>(<scope>): <mô tả tiếng Việt>` kèm `Refs: S2.2`. Scope: `palette` hoặc `fe-common`.
  - Không commit trực tiếp vào `main`.
- **Môi trường Windows:** Lệnh terminal bọc qua `cmd /c` và sử dụng `npm.cmd` / `npx.cmd`.

---

### Task 1: Xây Dựng Thư Viện Chuyển Đổi Không Gian Màu & Độ Chói WCAG

**Files:**
- Create: `frontend/src/utils/colorMetrics.ts`
- Create: `frontend/src/utils/colorMetrics.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface HSL { h: number; s: number; l: number; }
  export interface RGB { r: number; g: number; b: number; }
  export function hexToRgb(hex: string): RGB | null;
  export function hexToHsl(hex: string): HSL | null;
  export function calculateDeltaTheta(hue1: number, hue2: number): number;
  export function calculateRelativeLuminance(rgb: RGB): number;
  export function calculateContrastRatio(rgb1: RGB, rgb2: RGB): number;
  ```

- [ ] **Step 1: Viết test kiểm thử các hàm tính toán góc màu và độ chói WCAG**

Tạo `frontend/src/utils/colorMetrics.test.ts` kiểm thử:
- Đổi mã `#9E2A2B` (Đỏ điều) sang HSL.
- Tính $\Delta\theta$ giữa Đỏ điều và Xanh chàm.
- Tính tỷ lệ tương phản WCAG giữa Trắng ngà (`#F4F1DE`) và Đen mun (`#1D1E2C`) đạt $\ge 7:1$.

- [ ] **Step 2: Chạy test xác nhận kiểm thử thất bại**

```bash
cmd /c "cd frontend && npm.cmd test"
```

- [ ] **Step 3: Triển khai mã nguồn colorMetrics.ts**

Hiện thực hóa chuyển đổi không gian màu chuẩn xác từ [docs/BUSINESS-LOGIC-SPECIFICATION.md mục 2.2 & 2.3](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md#L93-L115).

- [ ] **Step 4: Chạy test xác nhận pass**

```bash
cmd /c "cd frontend && npm.cmd test"
```

- [ ] **Step 5: Commit module chuyển đổi màu**

```bash
git add frontend/src/utils/colorMetrics.ts frontend/src/utils/colorMetrics.test.ts
git commit -m "feat(palette): xây dựng module đo lường không gian màu HSL và độ chói WCAG" -m "Refs: S2.2, US-07"
```

---

### Task 2: Xây Dựng Hệ Thống Ngũ Hành Tương Sinh & Điểm Thưởng Di Sản

**Files:**
- Create: `frontend/src/utils/heritageWuXing.ts`
- Create: `frontend/src/utils/heritageWuXing.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type WuXingElement = 'KIM' | 'MOC' | 'THUY' | 'HOA' | 'THO';
  export function getColorWuXing(hex: string): WuXingElement | null;
  export function checkGeneratingRelationship(elem1: WuXingElement, elem2: WuXingElement): boolean;
  export function calculateHeritageBonus(hex1: string, hex2: string): { bonusScore: number; isGenerating: boolean; note: string };
  ```

- [ ] **Step 1: Viết test cho quan hệ Ngũ hành (Kim sinh Thủy, Thủy sinh Mộc...)**

Tạo `frontend/src/utils/heritageWuXing.test.ts`:
- Kiểm thử cặp Trắng ngà (Kim) + Xanh chàm (Thủy) $\rightarrow$ Tương sinh (+10 điểm thưởng).
- Kiểm thử màu ngoài bảng di sản $\rightarrow$ Không được điểm thưởng tối đa.

- [ ] **Step 2: Chạy test xác nhận kiểm thử**

```bash
cmd /c "cd frontend && npm.cmd test"
```

- [ ] **Step 3: Hiện thực heritageWuXing.ts**

Ánh xạ chuẩn 8 màu Cổ phong với ngũ hành theo [docs/BUSINESS-LOGIC-SPECIFICATION.md mục 2.4](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/Synapse/docs/BUSINESS-LOGIC-SPECIFICATION.md#L117-L133).

- [ ] **Step 4: Chạy test xác nhận pass**

```bash
cmd /c "cd frontend && npm.cmd test"
```

- [ ] **Step 5: Commit module ngũ hành**

```bash
git add frontend/src/utils/heritageWuXing.ts frontend/src/utils/heritageWuXing.test.ts
git commit -m "feat(palette): tích hợp quy luật ngũ sắc tương sinh và điểm thưởng di sản" -m "Refs: S2.2, US-07"
```

---

### Task 3: Hoàn Thiện Thuật Toán Tổng Hợp `calculateColorHarmony`

**Files:**
- Create: `frontend/src/utils/harmonyScorer.ts`
- Create: `frontend/src/utils/harmonyScorer.test.ts`

**Interfaces:**
- Consumes: `colorMetrics.ts`, `heritageWuXing.ts`.
- Produces:
  ```typescript
  export interface HarmonyScoreDetail {
    totalScore: number;
    hueScore: number;
    contrastScore: number;
    heritageScore: number;
    hueType: 'ANALOGOUS' | 'COMPLEMENTARY' | 'TRIADIC' | 'NEUTRAL' | 'CLASHING';
    isGeneratingWuXing: boolean;
    title: string;
    comment: string;
  }
  export function calculateColorHarmony(topHex: string, bottomHex: string): HarmonyScoreDetail;
  ```

- [ ] **Step 1: Viết test cho hàm tính điểm tổng hợp**

Kiểm thử các cặp màu:
- Đỏ điều + Vàng mướp (Hỏa sinh Thổ) $\rightarrow$ Điểm cao (90-98đ), `hueType = 'ANALOGOUS'` hoặc `TRIADIC`.
- Cặp màu tương phản cao (Complementary) $\rightarrow$ Lời bình phẩm mang tính tôn vinh nét hiện đại nổi bật.

- [ ] **Step 2: Chạy test xác nhận thất bại**

- [ ] **Step 3: Hiện thực harmonyScorer.ts chuẩn hóa thang điểm 0-100**

- [ ] **Step 4: Chạy test và kiểm tra build**

```bash
cmd /c "cd frontend && npm.cmd test && npm.cmd run build"
```

- [ ] **Step 5: Commit thuật toán hòa sắc**

```bash
git add frontend/src/utils/harmonyScorer.ts frontend/src/utils/harmonyScorer.test.ts
git commit -m "feat(palette): hoàn thiện thuật toán tính điểm hòa sắc Color Harmony Scorer" -m "Refs: S2.2, US-07, UC-06"
```

---

### Task 4: Xây Dựng Component `HarmonyRadar.tsx` & Trực Quan Hóa 3 Trục Điểm

**Files:**
- Create: `frontend/src/components/cultural/HarmonyRadar.tsx`
- Modify: `frontend/src/components/cultural/index.ts`

**Interfaces:**
- Consumes: `HarmonyScoreDetail` từ `harmonyScorer.ts`.
- Produces: Component `HarmonyRadar` hiển thị:
  1. Vòng tròn điểm số trung tâm (Radial Score Badge) với hiệu ứng phát sáng vàng hổ phách.
  2. Biểu đồ Radar 3 trục mini (SVG): Sắc độ (Hue), Tương phản (Contrast), Di sản (Heritage).
  3. Huy hiệu thế màu (*Tone-sur-tone thanh thoát*, *Tương phản xuất sắc*, *Ngũ sắc tương sinh*).
  4. Lời nhận xét chuyên gia mỹ thuật Gen Z.

- [ ] **Step 1: Thiết kế giao diện SVG Radar 3 trục tương tác nhẹ nhàng**

- [ ] **Step 2: Kiểm tra build TypeScript**

```bash
cmd /c "cd frontend && npm.cmd run build"
```

- [ ] **Step 3: Commit component HarmonyRadar**

```bash
git add frontend/src/components/cultural/HarmonyRadar.tsx
git commit -m "feat(palette): xây dựng component HarmonyRadar trực quan hóa 3 trục hòa sắc" -m "Refs: S2.2, US-07"
```

---

### Task 5: Tích Hợp Đánh Giá Hòa Sắc Vào Zustand Store & Right Inspector

**Files:**
- Modify: `frontend/src/store/useOutfitStore.ts`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- In `useOutfitStore`:
  - Lưu trạng thái: `harmonyDetail: HarmonyScoreDetail | null`.
  - Tự động gọi `calculateColorHarmony` mỗi khi `slots.TOP` hoặc `slots.BOTTOM` đổi màu.
- In `App.tsx`: Thay thế badge điểm tĩnh cũ bằng component `<HarmonyRadar />` sinh động trên cột phải `Cultural Inspector`.

- [ ] **Step 1: Viết test kiểm tra cập nhật điểm số trong store**

- [ ] **Step 2: Cập nhật useOutfitStore và App.tsx**

- [ ] **Step 3: Chạy toàn bộ kiểm thử tự động frontend và backend**

```bash
cmd /c "cd frontend && npm.cmd test && npm.cmd run build && cd ../backend && npm.cmd test && npm.cmd run build"
```
Kỳ vọng: Toàn bộ test pass 100%.

- [ ] **Step 4: Commit hoàn tất task S2.2**

```bash
git add frontend/src/store/ frontend/src/App.tsx
git commit -m "feat(studio): tích hợp Harmony Radar thời gian thực vào Cultural Inspector" -m "Refs: S2.2, US-07, UC-06"
```

---

## Verification Plan

### Automated Tests
```bash
cmd /c "cd frontend && npm.cmd test && npm.cmd run build"
```

### Manual Verification
1. Mở `http://localhost:5173`.
2. Mặc "Áo tấc" màu Đỏ điều và "Quần lụa" màu Vàng mướp $\rightarrow$ Điểm hòa sắc nhảy lên $\ge 92/100$, hiển thị huy hiệu *"Hỏa Sinh Thổ"* và nhận xét hài hòa thanh nhã.
3. Đổi Quần sang màu Đen mun $\rightarrow$ Điểm tương phản sáng tối và biểu đồ 3 trục cập nhật tức thì trong `< 5ms`.
