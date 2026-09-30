# V-Heritage Knowledge Base
## Kho Tri Thức Văn Hóa & Lịch Sử Trang Phục Việt Nam

> **Dự án:** Synapse – V-Heritage Studio  
> **Phiên bản:** 2.0 (Kiến trúc Module hóa) • 2026  
> **Bản thảo tham chiếu gốc:** Arena AI Knowledge Base  
> **Ngôn ngữ thẩm mỹ:** *Heritage Futurism*  

---

## 1. Giới Thiệu Chung

**V-Heritage Knowledge Base** là kho dữ liệu tri thức văn hóa, lịch sử và phân rã kỹ thuật chuẩn mực phục vụ cho nền tảng thời trang sáng tạo **Synapse – V-Heritage Studio**. 

Kho tri thức này đóng vai trò là **"nguồn chân lý thực tế" (Ground Truth)** để:
1. Đảm bảo tính chính xác lịch sử của các thẻ tri thức văn hóa (`cultural_facts`).
2. Cung cấp logic học thuật và bộ quy tắc kiểm tra trang phục (`cultural_rules`) cho động cơ **Cultural Guardrails Engine**.
3. Định hướng cho đội ngũ đồ họa chuẩn hóa tài nguyên hình ảnh Mannequin và phục sức 6 slot theo khung chuẩn `800 x 1200 px`.
4. Ngăn chặn triệt để tình trạng AI suy diễn hoặc bịa đặt dữ liệu lịch sử (No Hallucination on Culture) theo tôn chỉ tại [GEMINI.md](../../GEMINI.md).

---

## 2. Nguyên Tắc Cốt Lõi Về Di Sản

* **Phân định rõ ranh giới hai lớp dữ liệu:**
  * **Cổ phục (Historical Costume):** Lớp y phục lịch sử gắn với các triều đại phong kiến, phẩm trật và chế độ mặc (dress code) đã khép lại theo thể chế (Giao lĩnh, Tứ thân, Ngũ thân, Áo tấc, Nhật Bình...).
  * **Trang phục truyền thống tộc người (Living Heritage):** Di sản văn hóa sống của các cộng đồng dân tộc (Thái, Dao, Hmông, Ê-đê, Ba-na...), hiện vẫn đang được cộng đồng thực hành và phát triển. Hai lớp dữ liệu này tuyệt đối không được đánh đồng hoặc trộn lẫn.
* **Bác bỏ định kiến tiến hóa đơn tuyến:** Lịch sử y phục Việt Nam không phải một chuỗi tiến hóa tuyến tính đơn giản `Giao lĩnh → Tứ thân → Ngũ thân → Áo dài`. Nhiều hệ trang phục từng đồng tồn tại theo vùng miền, tầng lớp, giới tính và không gian xã hội.
* **Độ tin cậy dựa trên bằng chứng (Evidence-Based):** Mọi thông tin phải được gán nhãn mức độ tin cậy từ A đến D (Hiện vật bảo tàng $\rightarrow$ Chuyên khảo $\rightarrow$ Cơ quan văn hóa $\rightarrow$ Diễn giải truyền miệng).

---

## 3. Bản Đồ Cấu Trúc Kho Tri Thức (Knowledge Directory Index)

Kho tri thức được tổ chức theo 5 phân vùng chức năng rõ ràng, độc lập và dễ dàng mở rộng:

```text
docs/knowledge/
├── README.md                               # [Bản đồ chỉ mục hiện tại]
│
├── guidelines/                             # Quy chuẩn học thuật & cơ chế kiểm soát AI
│   ├── 01-methodology-and-evidence.md      # Phương pháp luận nghiên cứu & Thang đo bằng chứng (A/B/C/D)
│   ├── 02-cultural-guardrails.md           # Đặc tả 7 Cổng kiểm soát văn hóa AI (Identity, Period, Layer...)
│   └── 03-anti-hallucination-rules.md      # Các điều cấm kỵ & những claim không được khẳng định tuyệt đối
│
├── schema/                                 # Khung phân rã kỹ thuật & Ánh xạ CSDL
│   ├── 01-garment-decomposition-framework.md # Khung 11 lớp phân rã trang phục (Silhouette, Layering...)
│   └── 02-database-mapping-spec.md         # Quy chuẩn chuyển đổi sang CSDL Supabase (items, facts, rules)
│
├── costumes/                               # Hồ sơ chi tiết từng loại trang phục
│   ├── kin-heritage/                       # Cổ phục người Việt (Kinh) theo lịch sử
│   │   ├── ao-giao-linh.md                 # 1. Áo Giao lĩnh / Tràng vạt (Tiền Nguyễn)
│   │   ├── ao-tu-than.md                   # 2. Áo Tứ thân (Nữ phục dân gian Bắc Bộ)
│   │   ├── ao-ngu-than-tay-chen.md         # 3. Áo Ngũ thân lập lĩnh tay chẽn (Đàng Trong / Thời Nguyễn)
│   │   ├── ao-tac-tay-thung.md             # 4. Áo Tấc / Ngũ thân tay thụng (Lễ phục truyền thống)
│   │   ├── ao-nhat-binh.md                 # 5. Áo Nhật Bình (Nữ phục cung đình Nguyễn)
│   │   └── ao-dai-hien-dai.md              # 6. Áo dài hiện đại (Heritage-derived modern dress TK XX-XXI)
│   │
│   └── ethnic-groups/                      # Trang phục truyền thống dân tộc thiểu số (Di sản sống)
│       ├── thai.md                         # 7. Người Thái (Áo cóm, cúc bướm, váy xỉn, khăn piêu)
│       ├── dao-do.md                       # 8. Người Dao Đỏ (Hiện vật Nà Tông 1995, nẹp thêu chỉ đỏ)
│       ├── hmong-hoa.md                    # 9. Người Hmông (Case Hmông Hoa Mù Cang Chải, vải lanh, batik)
│       ├── e-de.md                         # 10. Người Ê-đê (Dệt tấm Nam Đảo Tây Nguyên, hoa văn dệt)
│       └── ba-na.md                        # 11. Người Ba-na (Làng Kon, dệt bông, hoa văn hình học)
│
├── references/                             # Thư viện bằng chứng & tư liệu đối chiếu
│   ├── 01-museum-artifacts-catalog.md      # Danh mục hiện vật bảo tàng gốc có mã số và xuất xứ
│   └── 02-bibliography.md                  # Danh mục tài liệu tham khảo, bài báo khoa học & link kiểm chứng
│
└── templates/                              # Khuôn mẫu chuẩn để mở rộng tri thức
    ├── costume-profile-template.md         # Mẫu hồ sơ 7 trục khi nghiên cứu bổ sung trang phục mới
    └── cultural-rule-template.md           # Mẫu định nghĩa quy tắc phối đồ (Cultural Rule) mới
```

---

## 4. Hướng Dẫn Sử Dụng Theo Vai Trò Trong Dự Án

* **Dành cho Lead Developer (Bình):**
  * Tra cứu [schema/02-database-mapping-spec.md](schema/02-database-mapping-spec.md) để viết script nạp dữ liệu (seed data) vào Supabase.
  * Tra cứu [guidelines/02-cultural-guardrails.md](guidelines/02-cultural-guardrails.md) để hiện thực hóa các luật kiểm tra logic trong `backend/src/services/rules.service.ts` và `frontend/src/services/guardrails.service.ts`.
* **Dành cho Chuyên viên Đồ họa & Asset (Tho):**
  * Tra cứu bảng phân rã cấu trúc tại từng file trong [costumes/](costumes/) để bóc tách layer PNG chuẩn `800 x 1200 px` đúng thứ tự `layer_order` và vị trí tọa độ `(0, 0)`.
  * Xem danh mục hiện vật tại [references/01-museum-artifacts-catalog.md](references/01-museum-artifacts-catalog.md) để tham chiếu màu sắc, họa tiết gốc.
* **Dành cho Chuyên viên Nội dung & Tri thức (Nghi):**
  * Sử dụng [templates/costume-profile-template.md](templates/costume-profile-template.md) để viết tiếp hồ sơ cho các dân tộc tiếp theo (Chăm, Khmer, Mường...).
  * Dùng [templates/cultural-rule-template.md](templates/cultural-rule-template.md) để bổ sung các quy tắc phối đồ mới vào hệ thống, đảm bảo tuân thủ [guidelines/03-anti-hallucination-rules.md](guidelines/03-anti-hallucination-rules.md).
