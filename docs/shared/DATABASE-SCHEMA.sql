-- ==============================================================================
-- SYNAPSE – V-HERITAGE STUDIO
-- DATABASE MIGRATION & SEED SCRIPT (PostgreSQL on Supabase)
-- Phiên bản: 1.0.0 | Ngày ban hành: 22/09/2026
-- ==============================================================================

-- 1. BẬT TIỆN ÍCH TỰ ĐỘNG SINH MÃ UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DỌN DẸP BẢNG CŨ NẾU ĐÃ TỒN TẠI (ĐẢM BẢO TÍNH IDEMPOTENT)
DROP TABLE IF EXISTS lookbooks CASCADE;
DROP TABLE IF EXISTS cultural_rules CASCADE;
DROP TABLE IF EXISTS cultural_facts CASCADE;
DROP TABLE IF EXISTS items CASCADE;

-- ==============================================================================
-- 3. KHỞI TẠO 4 BẢNG DỮ LIỆU CỐT LÕI
-- ==============================================================================

-- 3.1. BẢNG ITEMS (KHO TRANG PHỤC & PHỤ KIỆN)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'UNISEX')),
    slot VARCHAR(20) NOT NULL CHECK (slot IN ('HEADWEAR', 'TOP', 'BOTTOM', 'PATTERN', 'ACCESSORY', 'FOOTWEAR')),
    layer_order INT NOT NULL DEFAULT 10,
    image_url TEXT NOT NULL,
    color_customizable BOOLEAN NOT NULL DEFAULT true,
    default_color VARCHAR(10) NOT NULL DEFAULT '#F4F1DE',
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index tối ưu truy vấn lọc catalog theo giới tính và slot
CREATE INDEX idx_items_gender_slot ON items(gender, slot);
CREATE INDEX idx_items_tags ON items USING GIN(tags);

-- 3.2. BẢNG CULTURAL_FACTS (THẺ TRI THỨC VĂN HÓA LỊCH SỬ)
CREATE TABLE cultural_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    era VARCHAR(255) NOT NULL,
    origin_story TEXT NOT NULL,
    symbolic_meaning TEXT NOT NULL,
    modern_styling_tip TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index khóa ngoại tra cứu nhanh Factcard theo item_id
CREATE INDEX idx_cultural_facts_item_id ON cultural_facts(item_id);

-- 3.3. BẢNG CULTURAL_RULES (QUY TẮC CẢNH BÁO GUARDRAILS)
CREATE TABLE cultural_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_code VARCHAR(100) UNIQUE NOT NULL,
    trigger_slot VARCHAR(20) NOT NULL CHECK (trigger_slot IN ('HEADWEAR', 'TOP', 'BOTTOM', 'PATTERN', 'ACCESSORY', 'FOOTWEAR')),
    trigger_tag VARCHAR(100) NOT NULL,
    condition JSONB NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cultural_rules_trigger ON cultural_rules(trigger_slot, trigger_tag);
CREATE INDEX idx_cultural_rules_condition ON cultural_rules USING GIN(condition);

-- 3.4. BẢNG LOOKBOOKS (TÁC PHẨM NGƯỜI DÙNG LƯU TRỮ & CHIA SẺ)
CREATE TABLE lookbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    outfit_data JSONB NOT NULL,
    harmony_score INT NOT NULL CHECK (harmony_score >= 0 AND harmony_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lookbooks_created_at ON lookbooks(created_at DESC);

-- ==============================================================================
-- 4. CẤU HÌNH BẢO MẬT & PHÂN QUYỀN ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Bật RLS trên toàn bộ 4 bảng
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbooks ENABLE ROW LEVEL SECURITY;

-- 4.1. Quyền xem công khai (Khách vãng lai và người dùng web đều đọc được)
CREATE POLICY "Cho phép đọc công khai danh mục items" 
    ON items FOR SELECT USING (true);

CREATE POLICY "Cho phép đọc công khai tri thức cultural_facts" 
    ON cultural_facts FOR SELECT USING (true);

CREATE POLICY "Cho phép đọc công khai quy tắc cultural_rules" 
    ON cultural_rules FOR SELECT USING (true);

CREATE POLICY "Cho phép đọc công khai lookbooks đã lưu" 
    ON lookbooks FOR SELECT USING (true);

-- 4.2. Quyền tạo mới Lookbook (Người dùng ẩn danh có thể lưu tác phẩm của mình)
CREATE POLICY "Cho phép người dùng tạo mới lookbook" 
    ON lookbooks FOR INSERT WITH CHECK (true);

-- 4.3. Quyền ghi danh mục items, facts, rules (Chỉ mở cho Service Role hoặc Authenticated User)
CREATE POLICY "Cho phép service_role toàn quyền quản trị items" 
    ON items FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép service_role toàn quyền quản trị facts" 
    ON cultural_facts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép service_role toàn quyền quản trị rules" 
    ON cultural_rules FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. CẤU HÌNH SUPABASE STORAGE BUCKET
-- ==============================================================================

-- Khởi tạo bucket chứa ảnh PNG 800x1200 công khai
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-assets', 'item-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép mọi người đọc ảnh trong bucket item-assets
CREATE POLICY "Cho phép đọc ảnh công khai từ item-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'item-assets');

-- Cho phép upload ảnh qua service_role
CREATE POLICY "Cho phép service_role upload ảnh vào item-assets"
    ON storage.objects FOR INSERT 
    TO service_role
    WITH CHECK (bucket_id = 'item-assets');

-- ==============================================================================
-- 6. DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED MOCK DATA)
-- ==============================================================================

-- 6.1. SEED TRANG PHỤC TIÊU BIỂU THỜI NGUYỄN (ITEMS)
INSERT INTO items (id, name, gender, slot, layer_order, image_url, color_customizable, default_color, tags) VALUES
-- Áo Tấc Nữ
('11111111-0000-0000-0000-000000000001', 'Áo tấc tay thụng thời Nguyễn', 'FEMALE', 'TOP', 30, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_ao_tac.png', true, '#9E2A2B', '["nguyen", "formal", "ao_tac", "le_hoi"]'::jsonb),

-- Áo Ngũ Thân Tay Chẽn Nam
('11111111-0000-0000-0000-000000000002', 'Áo ngũ thân tay chẽn Nam', 'MALE', 'TOP', 30, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/male_ao_ngu_than.png', true, '#264653', '["nguyen", "daily", "ao_ngu_than", "nam"]'::jsonb),

-- Áo Nhật Bình Cung Đình (Không đổi màu vải)
('11111111-0000-0000-0000-000000000003', 'Áo Nhật bình thêu ngũ sắc', 'FEMALE', 'TOP', 30, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_ao_nhat_binh.png', false, '#E9C46A', '["nguyen", "royal", "ao_nhat_binh", "hoang_cung"]'::jsonb),

-- Quần Lụa Trắng Ống Rộng (Dùng chung Nam/Nữ)
('11111111-0000-0000-0000-000000000004', 'Quần lụa ống rộng truyền thống', 'UNISEX', 'BOTTOM', 20, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_quan_lua.png', true, '#F4F1DE', '["nguyen", "basic", "quan_ong_rong", "silk"]'::jsonb),

-- Khăn Đóng Nam
('11111111-0000-0000-0000-000000000005', 'Khăn đóng xếp nếp truyền thống', 'MALE', 'HEADWEAR', 60, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/male_khan_dong.png', true, '#1D1E2C', '["nguyen", "formal", "khan_dong"]'::jsonb),

-- Mấn Triều Nguyễn Nữ
('11111111-0000-0000-0000-000000000006', 'Mấn nhung đính ngọc', 'FEMALE', 'HEADWEAR', 60, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_man_nhung.png', true, '#5A189A', '["nguyen", "royal", "man_nhung"]'::jsonb),

-- Quạt Lụa Phụ Kiện
('11111111-0000-0000-0000-000000000007', 'Quạt lụa vẽ tranh thủy mặc', 'UNISEX', 'ACCESSORY', 50, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_quat_lua.png', false, '#E9C46A', '["phu_kien", "quat_lua", "nghe_thuat"]'::jsonb),

-- Giày Sneaker Trắng Gen Z
('11111111-0000-0000-0000-000000000008', 'Giày Sneaker tối giản Gen Z', 'UNISEX', 'FOOTWEAR', 10, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_sneaker.png', false, '#FFFFFF', '["modern", "streetwear", "sneaker"]'::jsonb),

-- Áo Giao Lĩnh Cổ Truyền
('11111111-0000-0000-0000-000000000009', 'Áo Giao lĩnh cổ truyền', 'UNISEX', 'TOP', 30, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_ao_giao_linh.png', true, '#264653', '["ly_tran_le", "traditional", "giao_linh", "unisex"]'::jsonb),

-- Áo Đối Khâm Cung Đình
('11111111-0000-0000-0000-000000000010', 'Áo Đối khâm cung đình', 'FEMALE', 'TOP', 30, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_ao_doi_kham.png', true, '#9E2A2B', '["le_nguyen", "royal", "doi_kham", "nu"]'::jsonb),

-- Váy Quây Xếp Ly Cổ Truyền
('11111111-0000-0000-0000-000000000011', 'Váy quây xếp ly cổ truyền', 'FEMALE', 'BOTTOM', 20, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_vay_quay.png', true, '#1D1E2C', '["le_nguyen", "traditional", "vay_quay", "nu"]'::jsonb),

-- Nón Ba Tầm (Nón Quai Thao)
('11111111-0000-0000-0000-000000000012', 'Nón Ba Tầm (Nón Quai Thao)', 'FEMALE', 'HEADWEAR', 60, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_non_ba_tam.png', false, '#E9C46A', '["dan_gian", "kinh_bac", "non_quai_thao", "le_hoi"]'::jsonb),

-- Hoa Văn Thủy Ba & Sóng Mây
('11111111-0000-0000-0000-000000000013', 'Hoa văn Thủy Ba & Sóng Mây', 'UNISEX', 'PATTERN', 40, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_hoa_van_thuy_ba.png', false, '#2A9D8F', '["nguyen", "pattern", "thuy_ba", "cung_dinh"]'::jsonb),

-- Ngọc Bội Thao Thiết Như Ý
('11111111-0000-0000-0000-000000000014', 'Ngọc Bội Thao Thiết Như Ý', 'UNISEX', 'ACCESSORY', 50, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_ngoc_boi.png', false, '#2A9D8F', '["quy_toc", "accessory", "ngoc_boi", "cung_dinh"]'::jsonb),

-- Guốc Mộc Quai Vải Cổ Truyền
('11111111-0000-0000-0000-000000000015', 'Guốc Mộc quai vải cổ truyền', 'UNISEX', 'FOOTWEAR', 10, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/unisex_guoc_moc.png', true, '#6F4E37', '["dan_gian", "footwear", "guoc_moc", "unisex"]'::jsonb),

-- Hài Thêu Mũi Cong Cung Đình
('11111111-0000-0000-0000-000000000016', 'Hài Thêu Mũi Cong Cung Đình', 'FEMALE', 'FOOTWEAR', 10, 'https://raw.githubusercontent.com/Nguyen-Van-Gia-Binh/Synapse/main/assets/mock/female_hai_theu.png', false, '#9E2A2B', '["nguyen", "royal", "hai_theu", "cung_dinh"]'::jsonb);

-- 6.2. SEED THẺ TRI THỨC VĂN HÓA (CULTURAL_FACTS)
INSERT INTO cultural_facts (item_id, era, origin_story, symbolic_meaning, modern_styling_tip) VALUES
-- Fact cho Áo Tấc Nữ
('11111111-0000-0000-0000-000000000001', 
 'Triều Nguyễn (Thế kỷ 19 - 20)', 
 'Áo tấc (còn gọi là áo ngũ thân tay thụng) là lễ phục trang trọng thời Nguyễn, quy định cho cả nam lẫn nữ trong các dịp lễ tiết, hôn lễ, cúng bái tổ tiên.', 
 'Tà áo rộng mang dáng dấp đĩnh đạc; cổ áo đứng cài 5 hạt khuy tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín; 5 thân áo tượng trưng cho tứ thân phụ mẫu che chở đứa con ở giữa.', 
 'Gen Z có thể kết hợp áo tấc với quần lụa trắng ngà hoặc quần tây ống đứng, phối cùng túi xách mây tre đan hoặc giày mule thanh lịch.'),

-- Fact cho Áo Ngũ Thân Nam
('11111111-0000-0000-0000-000000000002', 
 'Triều Nguyễn (Thế kỷ 18 - 19)', 
 'Được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1837 nhằm thống nhất y phục Đại Nam, thể hiện tinh thần tự chủ văn hóa.', 
 'Tay chẽn gọn gàng tượng trưng cho sự nhanh nhẹn, quyết đoán của người quân tử. Cổ đứng cao giữ cho dáng người luôn thẳng thắn, trang nghiêm.', 
 'Các bạn nam có thể phối áo ngũ thân tay chẽn màu xanh chàm với giày sneaker trắng hoặc kính râm đen phong cách Retro Cyberpunk.'),

-- Fact cho Áo Nhật Bình
('11111111-0000-0000-0000-000000000003', 
 'Triều Nguyễn (Cung đình Huế)', 
 'Nguyên bản là thường phục của Hoàng hậu, Công chúa và mệnh phụ quý tộc triều Nguyễn. Tên gọi Nhật bình bắt nguồn từ dải cổ áo to bản ghép lại tạo thành hình chữ nhật trước ngực.', 
 'Dải ngũ sắc nơi tay áo tượng trưng cho Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ). Hoa văn thêu loan phụng và mây sóng thủy ba biểu trưng cho sự tôn quý và an định đất nước.', 
 'Nên giữ nguyên áo khoác ngoài Nhật bình kết hợp bên trong là áo lót trắng hoặc chân váy xòe xếp ly hiện đại khi tham dự triển lãm nghệ thuật.'),

-- Fact cho Áo Giao Lĩnh
('11111111-0000-0000-0000-000000000009',
 'Thời Lý – Trần – Lê (Thế kỷ 11 - 18)',
 'Áo giao lĩnh (tràng vạt) là kiểu áo cổ giao chéo vạt phải truyền thống của người Việt, từng có vị trí quan trọng trong cả đời sống dân gian lẫn lễ nghi tiền Nguyễn.',
 'Vạt áo giao nhau trước ngực tượng trưng cho sự giao hòa của đất trời và âm dương; thắt lưng lụa buộc eo mang phong thái tao nhã, tự tại của người xưa.',
 'Gen Z có thể khoác mở tà áo giao lĩnh bên ngoài áo phông basic, kết hợp quần ống suông hoặc thắt đai lụa bản mảnh tạo phong cách Neo-Heritage.'),

-- Fact cho Áo Đối Khâm
('11111111-0000-0000-0000-000000000010',
 'Thời Lê – Nguyễn (Cung đình)',
 'Áo đối khâm có hai vạt song song buông thẳng trước ngực, thường dùng làm áo khoác ngoài cho hoàng tộc, mệnh phụ và quý tộc trong các dịp lễ tiết.',
 'Hai vạt áo buông song song tượng trưng cho sự ngay thẳng, chính trực và vẻ đẹp đoan trang, đài các của phụ nữ chốn khuê các xưa.',
 'Mặc khoác ngoài chân váy xếp ly hiện đại hoặc đầm dài trơn màu như một chiếc áo choàng duster coat thanh lịch.'),

-- Fact cho Váy Quây Xếp Ly
('11111111-0000-0000-0000-000000000011',
 'Thời Lê – Nguyễn (Hạ y truyền thống)',
 'Váy quây đen hoặc chàm buông dài chấm gót là trang phục hạ y kinh điển của phụ nữ Việt thời Lê và vùng đồng bằng Bắc Bộ khi mặc cùng áo giao lĩnh hoặc tứ thân.',
 'Dáng váy xòe nhẹ xếp nếp tôn lên dáng vẻ e ấp, kín đáo và bước đi uyển chuyển, duyên dáng của người phụ nữ truyền thống.',
 'Kết hợp cùng áo croptop tối giản hoặc sơ vin cùng áo thun và mang bốt cổ thấp phong cách Bohemian Heritage.'),

-- Fact cho Nón Ba Tầm
('11111111-0000-0000-0000-000000000012',
 'Dân gian Kinh Bắc (Thời Lê – Nguyễn)',
 'Nón ba tầm có vành tròn dẹt rộng đan bằng lá gồi, kèm quai thao đính quả tua bằng lụa tơ tằm buông rủ, là nét văn hóa đặc sắc gắn liền với các liền chị quan họ Kinh Bắc.',
 'Vành nón rộng che chở dung nhan người thiếu nữ; dải quai thao mềm mại tượng trưng cho sự thủy chung, duyên dáng và tình tứ.',
 'Đội hơi nghiêng nhẹ hoặc cầm tay làm đạo cụ chụp hình Lookbook ngoại cảnh kết hợp cùng tà áo truyền thống hoặc áo cách tân.'),

-- Fact cho Hoa Văn Thủy Ba
('11111111-0000-0000-0000-000000000013',
 'Mỹ thuật Triều Nguyễn',
 'Họa tiết Thủy Ba (sóng nước cuộn trào) và mây ngũ sắc thêu tỉ mỉ nơi gấu áo thường phục và lễ phục triều Nguyễn, biểu hiện đỉnh cao của nghệ thuật thêu tay truyền thống.',
 'Sóng nước biểu trưng cho sự trù phú, an định lãnh thổ; mây ngũ sắc tượng trưng cho cát tường, hòa bình và sự trường tồn của giang sơn.',
 'Xếp lớp chồng lên các mẫu áo đơn sắc (áo tấc, áo ngũ thân) để tạo điểm nhấn thị giác đậm chất vương giả mà không làm rối mắt.'),

-- Fact cho Ngọc Bội
('11111111-0000-0000-0000-000000000014',
 'Cổ truyền & Cung đình',
 'Ngọc bội chạm ngọc cẩm thạch kết hợp nút thắt lụa cát tường là tín vật hộ thân và phụ kiện đeo bên hông tà áo của bậc văn nhân, quyền quý phương Đông.',
 'Ngọc quý tượng trưng cho 5 đức tính của người quân tử: Nhân, Nghĩa, Trí, Dũng, Khiết. Tiếng ngọc va nhẹ vào nhau nhắc nhở bước đi luôn đoan chính, ung dung.',
 'Treo bên hông tà áo dài hoặc móc vào thắt lưng quần tây, quai túi xách hiện đại tạo điểm nhấn văn hóa tinh tế.'),

-- Fact cho Guốc Mộc
('11111111-0000-0000-0000-000000000015',
 'Dân gian Việt Nam',
 'Guốc mộc đẽo từ gỗ mít, gỗ xoan hoặc thông với quai bằng vải nhung/cói là vật dụng đi chân phổ biến của người Việt từ kinh kỳ đến làng quê suốt nhiều thế kỷ.',
 'Biểu tượng của sự mộc mạc, gần gũi và nếp sống thanh bần mà tao nhã của người Việt xưa.',
 'Đi cùng tất lửng trắng hoặc phối cùng tà áo dài ngũ thân dạo phố mang lại cảm giác hoài cổ mộc mạc và chân thực.'),

-- Fact cho Hài Thêu
('11111111-0000-0000-0000-000000000016',
 'Triều Nguyễn (Cung đình Huế)',
 'Hài gấm mũi vuốt cong thêu hoa mai và chỉ kim tuyến là trang phục đi chân cao quý của các bậc hoàng thái hậu, hoàng hậu và công chúa triều Nguyễn khi vận triều phục, lễ phục.',
 'Mũi hài cong nhẹ biểu thị phong thái đài các và sự cao quý; hoa văn thêu tỉ mỉ tượng trưng cho phẩm hạnh và vẻ đẹp vương giả.',
 'Kết hợp cùng áo Nhật bình hoặc áo tấc để tái hiện trọn vẹn 100% diện mạo cung đình Huế chuẩn sử liệu.');

-- 6.3. SEED QUY TẮC CẢNH BÁO VĂN HÓA (CULTURAL_RULES)
INSERT INTO cultural_rules (rule_code, trigger_slot, trigger_tag, condition, severity, message) VALUES
-- Luật 1: Áo dài ngũ thân bắt buộc phải đi cùng quần
('RULE_AODAI_MISSING_BOTTOM', 
 'TOP', 
 'ao_ngu_than', 
 '{"type": "MISSING_SLOT", "required_slot": "BOTTOM"}'::jsonb, 
 'WARNING', 
 'Áo ngũ thân truyền thống luôn đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?'),

-- Luật 2: Áo tấc lễ phục bắt buộc đi cùng quần
('RULE_AOTAC_MISSING_BOTTOM', 
 'TOP', 
 'ao_tac', 
 '{"type": "MISSING_SLOT", "required_slot": "BOTTOM"}'::jsonb, 
 'WARNING', 
 'Áo tấc là lễ phục cổ truyền, trang phục sẽ trọn vẹn và thanh thoát hơn rất nhiều khi bạn kết hợp cùng một chiếc quần lụa ống rộng.');
