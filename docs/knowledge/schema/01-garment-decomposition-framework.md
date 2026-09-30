# Khung Phân Rã Cấu Trúc Y Phục 11 Trục (Garment Decomposition Framework)

> **Tài liệu hướng dẫn kỹ thuật:** `docs/knowledge/schema/01-garment-decomposition-framework.md`  
> **Áp dụng cho:** Đội ngũ Đồ họa Asset, Canvas Engine và Cơ sở Dữ liệu Supabase  

---

## 1. Giới Thiệu Chung

Để số hóa một bộ trang phục truyền thống thành dữ liệu kỹ thuật có thể tương tác trên Canvas 2D và kiểm tra bằng luật văn hóa, mọi trang phục trong **Synapse** bắt buộc phải được bóc tách và phân rã qua **Khung 11 Trục Thuộc Tính Chuẩn Hóa**.

Mô hình này giúp phần mềm hiểu sâu sắc từng chi tiết cấu thành của bộ đồ thay vì chỉ coi trang phục là một bức ảnh phẳng vô hồn.

---

## 2. Chi Tiết 11 Trục Phân Rã Dữ Liệu

| STT | Trục Thuộc Tính | Mục đích & Ý nghĩa kỹ thuật | Các trường dữ liệu chuẩn (Fields) | Ví dụ cụ thể (Áo ngũ thân tay chẽn) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Identity** | Định danh thực thể trang phục trong cơ sở dữ liệu | `id`, `canonical_name`, `other_names`, `category`, `ethnic_group`, `subgroup`, `period`, `gender`, `social_status` | `id: KINH_NGU_THAN_TAY_CHEN`, Tên: Áo ngũ thân tay chẽn, Tộc: Kinh, Thời kỳ: Nguyễn, Giới tính: Unisex |
| **2** | **Silhouette** | Phom dáng hình học, tỷ lệ và đường nét cắt may | `collar_type`, `body_panels`, `sleeve_cut`, `slit_type`, `closure_method`, `length` | Cổ: Lập lĩnh (đứng cao 3–4cm), 5 thân, Tay: Chẽn (ống tay bó gọn sát cổ tay), Vạt dài quá gối, Cài cúc lệch phải |
| **3** | **Layering** | Trật tự mặc xếp lớp và vị trí hiển thị Z-Index | `layer_order`, `inner_layer_required`, `outer_allowed`, `slot_mapping` | `layer_order: 20`, Thuộc slot `TOP`, Yêu cầu mặc lớp trong che ngực hoặc áo lót đơn |
| **4** | **Lower Garment** | Cấu phần hạ y đi kèm hoàn chỉnh bộ phối | `lower_type`, `lower_cut`, `required_pair` | Quần lụa ống rộng màu trắng (nam/nữ) hoặc màu đen tuyền; không mặc cùng váy bó hoặc quần cộc |
| **5** | **Fastening** | Cơ chế cố định và đóng/mở vạt áo | `fastening_type`, `fastener_count`, `fastener_material`, `fastener_position` | 5 khuy cúc (đồng/ngọc/bọc vải) bố trí: 1 cúc cổ, 1 cúc xương quai xanh, 1 cúc nách, 2 cúc sườn phải |
| **6** | **Headwear** | Đồ đội đầu và kiểu tóc truyền thống đi cùng | `headwear_type`, `hair_style`, `headwear_options` | Khăn đóng (khăn xếp) màu đen hoặc quấn khăn lụa truyền thống; búi tóc gọn gàng |
| **7** | **Accessories** | Trang sức và phụ kiện hoàn chỉnh phục sức | `accessory_slots`, `allowed_accessories`, `forbidden_accessories` | Quạt lụa cầm tay, thẻ ngà/ngọc bội đeo thắt lưng, kính râm/túi xách hiện đại (ở chế độ Gen Z) |
| **8** | **Footwear** | Giày dép và phục sức phần chân | `footwear_type`, `traditional_footwear`, `modern_footwear` | Guốc mộc quai da/vải, hài thêu mũi cong; hoặc giày sneaker trắng (ở chế độ Gen Z) |
| **9** | **Material & Craft** | Chất liệu dệt và công nghệ thủ công truyền thống | `fabric_type`, `weaving_technique`, `dyeing_method`, `texture_map` | Sa kép (lớp ngoài sa đen mỏng, lớp trong lụa trắng); lụa Vạn Phúc, gấm tơ tằm |
| **10**| **Decoration & Motif**| Hoa văn, đồ án trang trí và quy chuẩn bố cục | `motif_name`, `motif_placement`, `color_palette`, `status_symbol` | Họa tiết thủy ba (sóng nước), chữ Thọ, hồi văn; dệt chìm trên mặt vải hoặc thêu tinh xảo |
| **11**| **Context & Evidence**| Không gian sử dụng và tài liệu kiểm chứng | `occasion`, `evidence_level`, `museum_id`, `source_url`, `confidence` | Thường nhật, lễ tết, sự kiện ngoại giao; Level A (Hiện vật Bảo tàng Lịch sử Quốc gia); `confidence: 1.0` |

---

## 3. Quy Chuẩn Kỹ Thuật Đồ Họa Trên Canvas 2D (Paper-Doll Overlay)

Để đảm bảo hiệu năng 60 FPS và cơ chế xếp lớp mượt mà trên Canvas HTML5 của Synapse:

```text
       ┌───────────────────────────────┐ (0, 0)
       │ HEADWEAR (Slot 1 - Z: 50)     │
       │   Khăn đóng, mấn, nón         │
       ├───────────────────────────────┤
       │ TOP (Slot 2 - Z: 20)          │
       │   Áo ngũ thân, áo tấc, yếm    │
       ├───────────────────────────────┤
       │ PATTERN / ACCESSORY (Z: 30)   │
       │   Hoa văn thêu, quạt, ngọc    │
       ├───────────────────────────────┤
       │ BOTTOM (Slot 3 - Z: 10)       │
       │   Quần lụa, váy ống, khố      │
       ├───────────────────────────────┤
       │ FOOTWEAR (Slot 6 - Z: 40)     │
       │   Guốc mộc, hài thêu, giày    │
       └───────────────────────────────┘ (800, 1200 px)
```

1. **Khung kích thước chuẩn cố định:** Toàn bộ ảnh Mannequin và các thành phần trang phục bắt buộc xuất file theo khung **`800 x 1200 px`** (tỉ lệ 2:3), định dạng `.png` trong suốt.
2. **Tọa độ tuyệt đối `(0, 0)`:** Chi tiết trang phục đã được căn chỉnh đúng vị trí giải phẫu trên cơ thể mẫu ngay từ file thiết kế. Canvas Engine chỉ cần render vẽ đè `drawImage(img, 0, 0, 800, 1200)` theo thứ tự `layer_order` mà không cần tính toán ma trận xoay/dịch chuyển phức tạp.
3. **Cơ chế hòa sắc (Color Multiply Tinting):** Các món đồ có cờ `color_customizable: true` phải được vẽ với sắc độ xám trung tính (grayscale / base neutral) để thuật toán Canvas Color Multiply áp dụng mã Hex chuẩn xác mà không bị lệch màu.
