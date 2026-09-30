# Mẫu Khai Báo Quy Tắc Phối Đồ Văn Hóa (Cultural Rule Template)

> **Tài liệu khuôn mẫu:** `docs/knowledge/templates/cultural-rule-template.md`  
> **Áp dụng cho:** Chuyên viên Nội dung & Tri thức (Nghi) và Backend Developer (Bình)  
> **Áp dụng vào bảng CSDL:** `cultural_rules`  

---

## 1. Nguyên Tắc Viết Thông Điệp Cảnh Báo (Tone Guidelines)

Tuân thủ nghiêm ngặt tinh thần **Người Bạn Đồng Hành Văn Hóa** tại [GEMINI.md](../../GEMINI.md):
1. **Tuyệt đối không dùng từ cấm đoán, tiêu cực:** Không dùng các từ như *"Sai rồi"*, *"Vi phạm"*, *"Cấm phối"*, *"Không được phép"*, *"Lỗi trang phục"*.
2. **Luôn dùng câu hỏi gợi mở & tôn vinh sáng tạo:** *"Bạn có muốn thử kết hợp thêm..."*, *"Để tôn vinh trọn vẹn nét trang nghiêm của cổ phục xưa, bạn có thể ghé ngăn..."*, *"Đây là một sự kết hợp phá cách thú vị! Bạn có muốn khám phá thêm..."*.
3. **Luôn cung cấp giải pháp hành động (Suggested Action):** Mỗi cảnh báo phải kèm theo một nút bấm dẫn thẳng người dùng đến món đồ cần bổ sung.

---

## 2. Khuôn Mẫu Định Nghĩa Luật (Rule Schema Definition)

```yaml
# ==============================================================================
# ĐỊNH NGHĨA QUY TẮC VĂN HÓA MỚI (CULTURAL RULE SPECIFICATION)
# ==============================================================================
rule_code: RULE_[TEN_VIET_TAT_CUA_LUAT] # Ví dụ: RULE_TU_THAN_INNER_YEM_SUGGESTION
name: "Lời nhắc phối yếm bên trong áo tứ thân"
description: "Nhắc nhở người dùng bổ sung lớp yếm che ngực truyền thống khi mặc áo tứ thân Bắc Bộ"

# --- Điều kiện kích hoạt (Trigger) ---
trigger_slot: TOP # [HEADWEAR | TOP | BOTTOM | PATTERN | ACCESSORY | FOOTWEAR]
trigger_tags:
  - "tu_than"
  - "kinh_heritage"

# --- Cổng kiểm soát liên quan ---
gate: "LAYER" # [IDENTITY | PERIOD | STATUS | LAYER | TECHNIQUE | OCCASION | EVIDENCE]

# --- Điều kiện kiểm tra logic (Condition JSON) ---
condition:
  type: "REQUIRE_ANY" # [REQUIRE_ANY | CONFLICT_ANY | MUTUAL_EXCLUSIVE]
  target_slot: "TOP"  # hoặc slot liên quan
  required_tags:
    - "yem_lot"
    - "inner_wear"

# --- Cấp độ hiển thị ---
severity: "suggestion" # [suggestion | cultural_note | info] - CẤM dùng 'error'

# --- Thông điệp gửi người dùng (User-facing Message) ---
message: >-
  Áo tứ thân truyền thống Bắc Bộ sẽ duyên dáng và kín đáo nhất khi đi cùng một chiếc yếm lót hình thoi mềm mại bên trong. Bạn có muốn ghé ngăn Áo để thử thêm một chiếc yếm hoa đào không?

# --- Hành động gợi ý (Suggested Action CTA) ---
suggested_action:
  action_label: "Thêm Yếm Lót Duyên Dáng"
  target_drawer_tab: "TOP"
  filter_tag: "yem_lot"
  recommended_item_id: "INNER_KINH_YEM_LUA_TRANG"

# --- Căn cứ tư liệu học thuật (Provenance Reference) ---
evidence_reference:
  source_doc: "docs/knowledge/costumes/kin-heritage/ao-tu-than.md"
  museum_ref: "Bảo tàng Phụ nữ Việt Nam (Bộ sưu tập Yếm lụa cổ truyền)"
  evidence_level: "B"
```

---

## 3. Mẫu Câu Lệnh SQL Nạp Dữ Liệu Vào Supabase

```sql
INSERT INTO cultural_rules (
    rule_code,
    trigger_slot,
    trigger_tag,
    condition,
    severity,
    message
) VALUES (
    'RULE_TU_THAN_INNER_YEM_SUGGESTION',
    'TOP',
    'tu_than',
    '{"type": "REQUIRE_ANY", "target_slot": "TOP", "required_tags": ["yem_lot"]}'::jsonb,
    'suggestion',
    'Áo tứ thân truyền thống Bắc Bộ sẽ duyên dáng và kín đáo nhất khi đi cùng một chiếc yếm lót mềm mại bên trong. Bạn có muốn thử thêm một chiếc yếm lụa không?'
);
```
