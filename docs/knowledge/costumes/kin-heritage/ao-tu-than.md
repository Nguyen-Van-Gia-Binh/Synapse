---
id: KINH_TU_THAN
canonical_name: Áo Tứ Thân
other_names: ["Áo bốn thân", "Áo mớ ba mớ bảy", "Four-panel dress"]
category: traditional_costume
ethnic_group: Kinh
subgroup: Phụ nữ đồng bằng Bắc Bộ & Vùng văn hóa Kinh Bắc
period: Thế kỷ XVII đến nửa đầu thế kỷ XX (và di sản diễn xướng hiện nay)
gender: female
layer_order: 20
slot: TOP
evidence_level: B
confidence: 0.85
status: Active
---

# ÁO TỨ THÂN

> **Hồ sơ di sản y phục:** `docs/knowledge/costumes/kin-heritage/ao-tu-than.md`  
> **Thuộc hệ thống:** Nữ phục dân gian người Việt (Kinh) – Vùng Bắc Bộ  

---

## 1. Trục Phân Tích Lịch Sử & Văn Hóa (The 7 Pillars)

| Trục Phân Tích | Nội Dung Chi Tiết |
| :--- | :--- |
| **Nguồn gốc** | Không có căn cứ lịch sử nào xác nhận một năm ra đời hay một cá nhân phát minh duy nhất. Áo tứ thân định hình tự nhiên như một hệ nữ phục dân gian thích ứng hoàn hảo với đời sống nông nghiệp lúa nước và văn hóa làng xã Bắc Bộ. |
| **Quá trình hình thành** | Cấu trúc bốn thân bắt nguồn trực tiếp từ kỹ thuật may ghép các khổ vải dệt hẹp truyền thống (rộng khoảng 35–40 cm). Hai vạt sau được may ghép liền sống lưng thành một tà sau; hai vạt trước để rời thả buông hoặc buộc thắt gút trước bụng. Bộ trang phục tạo thành một chỉnh thể hoàn chỉnh gồm: Yếm lót trong, áo cánh, áo tứ thân khoác ngoài, váy xòe và dải thắt lưng lụa/ruột tượng. |
| **Biến đổi qua các thời kỳ** | Từng là thường phục lao động lẫn lễ phục hội hè phổ biến nhất của phụ nữ Bắc Bộ cho tới đầu thế kỷ XX. Khi quần lụa, áo dài tân thời và Âu phục lan rộng, áo tứ thân rút dần khỏi đời sống thường nhật. Từ nửa sau thế kỷ XX đến nay, áo tứ thân chuyển mạnh sang không gian di sản: Dân ca Quan họ Bắc Ninh, hội làng truyền thống, sân khấu chèo và nghệ thuật trình diễn. |
| **Gắn với** | Người phụ nữ nông thôn Bắc Bộ; không gian văn hóa làng xã Kinh Bắc; câu hát Quan họ; trang phục lao động và lễ hội dân gian. |
| **Giá trị** | Minh chứng sống động cho mối quan hệ hữu cơ giữa kỹ thuật dệt vải thủ công, môi trường canh tác nông nghiệp và tính thẩm mỹ mộc mạc, kín đáo nhưng duyên dáng của người phụ nữ Việt xưa. |
| **Ý nghĩa** | Biểu tượng thị giác kinh điển của văn hóa dân gian miền Bắc. Tuyệt đối không biến mọi áo tứ thân thành phục trang sân khấu sặc sỡ kim sa; cần bảo lưu sắc độ nền nã mộc mạc của vải tự nhiên (nhuộm nâu sồng, chàm, củ nâu). |
| **Evidence & Độ tin cậy** | **Mức B/C (Nghiên cứu & Bảo tàng):** Nguồn trưng bày tại Bảo tàng Phụ nữ Việt Nam xác nhận áo tứ thân và váy đụp là y phục chiếm ưu thế tuyệt đối của phụ nữ Bắc Bộ cho tới đầu thế kỷ XX. |

---

## 2. Phân Rã Cấu Trúc & Thành Phần (Decomposition Table)

| Thành phần | Đặc điểm nhận diện | Vai trò & Cách mặc | Lưu ý khi số hóa trên Canvas 2D |
| :--- | :--- | :--- | :--- |
| **Áo ngoài tứ thân** | Gồm 4 thân vải: 2 thân sau may ghép sống lưng, 2 thân trước để rời. Chiều dài chấm bắp chân; không đơm cúc phía trước ngực. | Lớp áo khoác ngoài tạo phom dáng thướt tha. | Hỗ trợ 2 trạng thái render: (1) Hai tà trước buông tự nhiên; (2) Hai tà trước buộc thắt gút gọn gàng trước eo. |
| **Yếm lót trong** | Tấm vải hình thoi hoặc vuông che kín ngực, có dây buộc sau gáy và sau lưng (yếm cổ xây, yếm cổ nhạn). | Lớp lót cốt lõi tạo độ kín đáo và điểm nhấn màu sắc nơi cổ áo. | Lớp Z-Index nằm trong cùng (`layer_order: 15`). Màu yếm thường dùng: trắng ngà, nâu sồng, hồng đào, đỏ điều. |
| **Hạ y (Váy đụp / Váy kín)** | Váy lụa hoặc vải thô màu đen/chàm, may rộng rãi dài chấm mắt cá chân. | Trang phục nửa thân dưới truyền thống. | **Không tự ý thay váy bằng quần dài** khi đang ở chế độ phục dựng chuẩn dân gian Bắc Bộ. |
| **Dải thắt lưng & Ruột tượng** | Dải lụa mềm mại màu xanh hoa lý, hồng sen hoặc ruột tượng bằng vải đựng tiền buộc quanh eo. | Giữ nếp áo, cố định váy và tạo điểm nhấn hòa sắc rực rỡ. | Thắt lưng quấn quanh eo, hai đầu dải buông rủ mềm mại phía trước. |
| **Khăn mỏ quạ & Nón quai thao** | Khăn vuông gập chéo chít hình mỏ quạ ôm sát khuôn mặt; nón quai thao (nón ba tầm) rộng vành quai tơ tằm. | Phụ kiện che nắng và tôn vinh nét duyên dáng. | Nón quai thao chỉ nên gợi ý trong bối cảnh hội hè/trình diễn; không bắt buộc cho trang phục lao động thường ngày. |

---

## 3. Quy Tắc Phối Đồ Văn Hóa (Cultural Rules)

* **Rule 1 (Bắt buộc lớp yếm):** Mặc áo tứ thân bắt buộc phải có lớp yếm che ngực bên trong. Không để ngực áo trống rỗng.
* **Rule 2 (Phối hạ y chuẩn mực):** Áo tứ thân dân gian Bắc Bộ đi kèm chân váy đụp màu sẫm. Nếu người dùng chọn phối cùng quần lụa, hệ thống Guardrails sẽ hiển thị thông báo gợi ý về nét đặc trưng của váy Bắc Bộ xưa.
* **Rule 4 (Bối cảnh Nón quai thao):** Nón quai thao là món đồ đi kèm trong dịp lễ hội mùa xuân (hội Lim, hội chùa Hương), không xuất hiện trong bối cảnh làm đồng ngày thường.

---

## 4. Dẫn Chứng Hiện Vật & Thư Mục Nguồn

1. **Bảo tàng Phụ nữ Việt Nam:** Trưng bày chuyên đề *"Thời trang nữ qua các thời kỳ lịch sử"*, tư liệu hiện vật áo tứ thân và sưu tập yếm lụa cổ truyền. [Xem tại đây](https://baotangphunu.org.vn/fr/thoi-trang-nu-3/).
2. **Khảo cứu dân tộc học:** Đỗ Thị Hòa, *Trang phục truyền thống các dân tộc Việt Nam*, NXB Văn hóa Dân tộc.
3. **Hình ảnh đối chiếu:** [Wikimedia Commons – Nữ phục Tứ Thân Bắc Bộ](https://commons.wikimedia.org/wiki/File:Ao_Tu_Than.jpg).
