import { ItemDto, CulturalFactDto, Gender, SlotType } from '../types';
import { supabaseClient, isSupabaseConfigured } from '../config/supabase';

export class ItemsService {
  /**
   * Danh mục trang phục mock chuẩn 100% theo docs/shared/DATABASE-SCHEMA.sql
   */
  private mockItems: ItemDto[] = [
    {
      id: '11111111-0000-0000-0000-000000000001',
      name: 'Áo tấc tay thụng thời Nguyễn',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_tac_top.png',
      color_customizable: true,
      default_color: '#9E2A2B',
      tags: ['nguyen', 'formal', 'ao_tac', 'le_hoi'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000002',
      name: 'Áo ngũ thân tay chẽn Nam',
      gender: 'MALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/male_ao_ngu_than_top.png',
      color_customizable: true,
      default_color: '#264653',
      tags: ['nguyen', 'daily', 'ao_ngu_than', 'nam'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000003',
      name: 'Áo Nhật bình thêu ngũ sắc',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_nhat_binh.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['nguyen', 'royal', 'ao_nhat_binh', 'hoang_cung'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000004',
      name: 'Quần lụa ống rộng truyền thống',
      gender: 'UNISEX',
      slot: 'BOTTOM',
      layer_order: 20,
      image_url: '/assets/mock/unisex_quan_lua.png',
      color_customizable: true,
      default_color: '#F4F1DE',
      tags: ['nguyen', 'basic', 'quan_ong_rong', 'silk'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000005',
      name: 'Khăn đóng xếp nếp truyền thống',
      gender: 'MALE',
      slot: 'HEADWEAR',
      layer_order: 60,
      image_url: '/assets/mock/male_khan_dong.png',
      color_customizable: true,
      default_color: '#1D1E2C',
      tags: ['nguyen', 'formal', 'khan_dong'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000006',
      name: 'Mấn nhung đính ngọc',
      gender: 'FEMALE',
      slot: 'HEADWEAR',
      layer_order: 60,
      image_url: '/assets/mock/female_man_nhung.png',
      color_customizable: true,
      default_color: '#5A189A',
      tags: ['nguyen', 'royal', 'man_nhung'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000007',
      name: 'Quạt lụa vẽ tranh thủy mặc',
      gender: 'UNISEX',
      slot: 'ACCESSORY',
      layer_order: 50,
      image_url: '/assets/mock/unisex_quat_lua.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['phu_kien', 'quat_lua', 'nghe_thuat'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000008',
      name: 'Giày Sneaker tối giản Gen Z',
      gender: 'UNISEX',
      slot: 'FOOTWEAR',
      layer_order: 10,
      image_url: '/assets/mock/unisex_sneaker.png',
      color_customizable: false,
      default_color: '#FFFFFF',
      tags: ['modern', 'streetwear', 'sneaker'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000009',
      name: 'Áo Giao lĩnh cổ truyền',
      gender: 'UNISEX',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/unisex_ao_giao_linh.png',
      color_customizable: true,
      default_color: '#264653',
      tags: ['ly_tran_le', 'traditional', 'giao_linh', 'unisex'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000010',
      name: 'Áo Đối khâm cung đình',
      gender: 'FEMALE',
      slot: 'TOP',
      layer_order: 30,
      image_url: '/assets/mock/female_ao_doi_kham.png',
      color_customizable: true,
      default_color: '#9E2A2B',
      tags: ['le_nguyen', 'royal', 'doi_kham', 'nu'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000011',
      name: 'Váy quây xếp ly cổ truyền',
      gender: 'FEMALE',
      slot: 'BOTTOM',
      layer_order: 20,
      image_url: '/assets/mock/female_vay_quay.png',
      color_customizable: true,
      default_color: '#1D1E2C',
      tags: ['le_nguyen', 'traditional', 'vay_quay', 'nu'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000012',
      name: 'Nón Ba Tầm (Nón Quai Thao)',
      gender: 'FEMALE',
      slot: 'HEADWEAR',
      layer_order: 60,
      image_url: '/assets/mock/female_non_ba_tam.png',
      color_customizable: false,
      default_color: '#E9C46A',
      tags: ['dan_gian', 'kinh_bac', 'non_quai_thao', 'le_hoi'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000013',
      name: 'Hoa văn Thủy Ba & Sóng Mây',
      gender: 'UNISEX',
      slot: 'PATTERN',
      layer_order: 40,
      image_url: '/assets/mock/unisex_hoa_van_thuy_ba.png',
      color_customizable: false,
      default_color: '#2A9D8F',
      tags: ['nguyen', 'pattern', 'thuy_ba', 'cung_dinh'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000014',
      name: 'Ngọc Bội Thao Thiết Như Ý',
      gender: 'UNISEX',
      slot: 'ACCESSORY',
      layer_order: 50,
      image_url: '/assets/mock/unisex_ngoc_boi.png',
      color_customizable: false,
      default_color: '#2A9D8F',
      tags: ['quy_toc', 'accessory', 'ngoc_boi', 'cung_dinh'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000015',
      name: 'Guốc Mộc quai vải cổ truyền',
      gender: 'UNISEX',
      slot: 'FOOTWEAR',
      layer_order: 10,
      image_url: '/assets/mock/unisex_guoc_moc.png',
      color_customizable: true,
      default_color: '#6F4E37',
      tags: ['dan_gian', 'footwear', 'guoc_moc', 'unisex'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
    {
      id: '11111111-0000-0000-0000-000000000016',
      name: 'Hài Thêu Mũi Cong Cung Đình',
      gender: 'FEMALE',
      slot: 'FOOTWEAR',
      layer_order: 10,
      image_url: '/assets/mock/female_hai_theu.png',
      color_customizable: false,
      default_color: '#9E2A2B',
      tags: ['nguyen', 'royal', 'hai_theu', 'cung_dinh'],
      created_at: '2026-09-22T04:00:00.000Z',
    },
  ];

  /**
   * Thẻ tri thức văn hóa lịch sử mock chuẩn 100% theo docs/shared/DATABASE-SCHEMA.sql
   */
  private mockFacts: Record<string, CulturalFactDto> = {
    '11111111-0000-0000-0000-000000000001': {
      id: 'fact-01',
      item_id: '11111111-0000-0000-0000-000000000001',
      era: 'Triều Nguyễn (Thế kỷ 19 - 20)',
      origin_story: 'Áo tấc (còn gọi là áo ngũ thân tay thụng) là lễ phục trang trọng thời Nguyễn, quy định cho cả nam lẫn nữ trong các dịp lễ tiết, hôn lễ, cúng bái tổ tiên.',
      symbolic_meaning: 'Tà áo rộng mang dáng dấp đĩnh đạc; cổ áo đứng cài 5 hạt khuy tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín; 5 thân áo tượng trưng cho tứ thân phụ mẫu che chở đứa con ở giữa.',
      modern_styling_tip: 'Gen Z có thể kết hợp áo tấc với quần lụa trắng ngà hoặc quần tây ống đứng, phối cùng túi xách mây tre đan hoặc giày mule thanh lịch.',
    },
    '11111111-0000-0000-0000-000000000002': {
      id: 'fact-02',
      item_id: '11111111-0000-0000-0000-000000000002',
      era: 'Triều Nguyễn (Thế kỷ 18 - 19)',
      origin_story: 'Được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1837 nhằm thống nhất y phục Đại Nam, thể hiện tinh thần tự chủ văn hóa.',
      symbolic_meaning: 'Tay chẽn gọn gàng tượng trưng cho sự nhanh nhẹn, quyết đoán của người quân tử. Cổ đứng cao giữ cho dáng người luôn thẳng thắn, trang nghiêm.',
      modern_styling_tip: 'Các bạn nam có thể phối áo ngũ thân tay chẽn màu xanh chàm với giày sneaker trắng hoặc kính râm đen phong cách Retro Cyberpunk.',
    },
    '11111111-0000-0000-0000-000000000003': {
      id: 'fact-03',
      item_id: '11111111-0000-0000-0000-000000000003',
      era: 'Triều Nguyễn (Cung đình Huế)',
      origin_story: 'Nguyên bản là thường phục của Hoàng hậu, Công chúa và mệnh phụ quý tộc triều Nguyễn. Tên gọi Nhật bình bắt nguồn từ dải cổ áo to bản ghép lại tạo thành hình chữ nhật trước ngực.',
      symbolic_meaning: 'Dải ngũ sắc nơi tay áo tượng trưng cho Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ). Hoa văn thêu loan phụng và mây sóng thủy ba biểu trưng cho sự tôn quý và an định đất nước.',
      modern_styling_tip: 'Nên giữ nguyên áo khoác ngoài Nhật bình kết hợp bên trong là áo lót trắng hoặc chân váy xòe xếp ly hiện đại khi tham dự triển lãm nghệ thuật.',
    },
    '11111111-0000-0000-0000-000000000004': {
      id: 'fact-04',
      item_id: '11111111-0000-0000-0000-000000000004',
      era: 'Dân gian & Cung đình',
      origin_story: 'Quần lụa ống rộng màu trắng ngà là trang phục kinh điển đồng hành cùng áo tấc và áo ngũ thân.',
      symbolic_meaning: 'Ống quần rộng tạo bước đi khoan thai, uyển chuyển, tượng trưng cho sự thuần khiết và thanh cao.',
      modern_styling_tip: 'Phối cùng thắt lưng vải lụa hoặc sneaker đế cao tối giản.',
    },
    '11111111-0000-0000-0000-000000000005': {
      id: 'fact-05',
      item_id: '11111111-0000-0000-0000-000000000005',
      era: 'Triều Nguyễn (Nam giới)',
      origin_story: 'Khăn đóng (khăn xếp) là nét đặc trưng không thể thiếu của nam giới người Việt khi mặc áo ngũ thân hoặc áo tấc trong các dịp trang trọng.',
      symbolic_meaning: 'Các nếp gấp hình chữ Nhất (-) hoặc chữ Nhân (人) phía trước trán tượng trưng cho đạo làm người ngay thẳng, khiêm nhường.',
      modern_styling_tip: 'Kết hợp cùng áo ngũ thân cách tân tối giản và kính mắt gọng kim loại thanh mảnh.',
    },
    '11111111-0000-0000-0000-000000000006': {
      id: 'fact-06',
      item_id: '11111111-0000-0000-0000-000000000006',
      era: 'Triều Nguyễn (Nữ giới Quý tộc)',
      origin_story: 'Mấn nhung hoặc mấn vấn khăn bằng vải quý là phụ kiện đội đầu trang nhã của phụ nữ quý tộc thời Nguyễn khi mặc lễ phục.',
      symbolic_meaning: 'Tôn vinh khuôn mặt đoan trang, thể hiện nét đài các, dịu dàng của người phụ nữ truyền thống Việt Nam.',
      modern_styling_tip: 'Mấn nhung tím hoặc đen kết hợp cùng khuyên tai ngọc trai và áo dài ngũ thân màu nhạt.',
    },
    '11111111-0000-0000-0000-000000000007': {
      id: 'fact-07',
      item_id: '11111111-0000-0000-0000-000000000007',
      era: 'Cổ truyền Việt Nam',
      origin_story: 'Quạt lụa cầm tay vẽ tranh thủy mặc hoặc phong cảnh non nước là phụ kiện tao nhã của tầng lớp văn nhân thi sĩ.',
      symbolic_meaning: 'Biểu trưng cho phong thái tự tại, thanh tao và tình yêu đối với vẻ đẹp thiên nhiên đất nước.',
      modern_styling_tip: 'Cầm tay tạo dáng chụp ảnh Lookbook hoặc dắt nhẹ vào dải thắt lưng áo.',
    },
    '11111111-0000-0000-0000-000000000008': {
      id: 'fact-08',
      item_id: '11111111-0000-0000-0000-000000000008',
      era: 'Đương đại (Gen Z Streetwear)',
      origin_story: 'Giày sneaker trắng tối giản là biểu tượng thời trang đường phố toàn cầu thế kỷ 21, được giới trẻ Việt ưa chuộng.',
      symbolic_meaning: 'Sự năng động, phóng khoáng và tinh thần phá cách, mang cổ phục bước vào đời sống thường nhật.',
      modern_styling_tip: 'Phối cùng tà áo dài ngũ thân hoặc áo tấc để tạo nét giao thoa Heritage Futurism đầy cuốn hút.',
    },
    '11111111-0000-0000-0000-000000000009': {
      id: 'fact-09',
      item_id: '11111111-0000-0000-0000-000000000009',
      era: 'Thời Lý – Trần – Lê (Thế kỷ 11 - 18)',
      origin_story: 'Áo giao lĩnh (tràng vạt) là kiểu áo cổ giao chéo vạt phải truyền thống của người Việt, từng có vị trí quan trọng trong cả đời sống dân gian lẫn lễ nghi tiền Nguyễn.',
      symbolic_meaning: 'Vạt áo giao nhau trước ngực tượng trưng cho sự giao hòa của đất trời và âm dương; thắt lưng lụa buộc eo mang phong thái tao nhã, tự tại của người xưa.',
      modern_styling_tip: 'Gen Z có thể khoác mở tà áo giao lĩnh bên ngoài áo phông basic, kết hợp quần ống suông hoặc thắt đai lụa bản mảnh tạo phong cách Neo-Heritage.',
    },
    '11111111-0000-0000-0000-000000000010': {
      id: 'fact-10',
      item_id: '11111111-0000-0000-0000-000000000010',
      era: 'Thời Lê – Nguyễn (Cung đình)',
      origin_story: 'Áo đối khâm có hai vạt song song buông thẳng trước ngực, thường dùng làm áo khoác ngoài cho hoàng tộc, mệnh phụ và quý tộc trong các dịp lễ tiết.',
      symbolic_meaning: 'Hai vạt áo buông song song tượng trưng cho sự ngay thẳng, chính trực và vẻ đẹp đoan trang, đài các của phụ nữ chốn khuê các xưa.',
      modern_styling_tip: 'Mặc khoác ngoài chân váy xếp ly hiện đại hoặc đầm dài trơn màu như một chiếc áo choàng duster coat thanh lịch.',
    },
    '11111111-0000-0000-0000-000000000011': {
      id: 'fact-11',
      item_id: '11111111-0000-0000-0000-000000000011',
      era: 'Thời Lê – Nguyễn (Hạ y truyền thống)',
      origin_story: 'Váy quây đen hoặc chàm buông dài chấm gót là trang phục hạ y kinh điển của phụ nữ Việt thời Lê và vùng đồng bằng Bắc Bộ khi mặc cùng áo giao lĩnh hoặc tứ thân.',
      symbolic_meaning: 'Dáng váy xòe nhẹ xếp nếp tôn lên dáng vẻ e ấp, kín đáo và bước đi uyển chuyển, duyên dáng của người phụ nữ truyền thống.',
      modern_styling_tip: 'Kết hợp cùng áo croptop tối giản hoặc sơ vin cùng áo thun và mang bốt cổ thấp phong cách Bohemian Heritage.',
    },
    '11111111-0000-0000-0000-000000000012': {
      id: 'fact-12',
      item_id: '11111111-0000-0000-0000-000000000012',
      era: 'Dân gian Kinh Bắc (Thời Lê – Nguyễn)',
      origin_story: 'Nón ba tầm có vành tròn dẹt rộng đan bằng lá gồi, kèm quai thao đính quả tua bằng lụa tơ tằm buông rủ, là nét văn hóa đặc sắc gắn liền với các liền chị quan họ Kinh Bắc.',
      symbolic_meaning: 'Vành nón rộng che chở dung nhan người thiếu nữ; dải quai thao mềm mại tượng trưng cho sự thủy chung, duyên dáng và tình tứ.',
      modern_styling_tip: 'Đội hơi nghiêng nhẹ hoặc cầm tay làm đạo cụ chụp hình Lookbook ngoại cảnh kết hợp cùng tà áo truyền thống hoặc áo cách tân.',
    },
    '11111111-0000-0000-0000-000000000013': {
      id: 'fact-13',
      item_id: '11111111-0000-0000-0000-000000000013',
      era: 'Mỹ thuật Triều Nguyễn',
      origin_story: 'Họa tiết Thủy Ba (sóng nước cuộn trào) và mây ngũ sắc thêu tỉ mỉ nơi gấu áo thường phục và lễ phục triều Nguyễn, biểu hiện đỉnh cao của nghệ thuật thêu tay truyền thống.',
      symbolic_meaning: 'Sóng nước biểu trưng cho sự trù phú, an định lãnh thổ; mây ngũ sắc tượng trưng cho cát tường, hòa bình và sự trường tồn của giang sơn.',
      modern_styling_tip: 'Xếp lớp chồng lên các mẫu áo đơn sắc (áo tấc, áo ngũ thân) để tạo điểm nhấn thị giác đậm chất vương giả mà không làm rối mắt.',
    },
    '11111111-0000-0000-0000-000000000014': {
      id: 'fact-14',
      item_id: '11111111-0000-0000-0000-000000000014',
      era: 'Cổ truyền & Cung đình',
      origin_story: 'Ngọc bội chạm ngọc cẩm thạch kết hợp nút thắt lụa cát tường là tín vật hộ thân và phụ kiện đeo bên hông tà áo của bậc văn nhân, quyền quý phương Đông.',
      symbolic_meaning: 'Ngọc quý tượng trưng cho 5 đức tính của người quân tử: Nhân, Nghĩa, Trí, Dũng, Khiết. Tiếng ngọc va nhẹ vào nhau nhắc nhở bước đi luôn đoan chính, ung dung.',
      modern_styling_tip: 'Treo bên hông tà áo dài hoặc móc vào thắt lưng quần tây, quai túi xách hiện đại tạo điểm nhấn văn hóa tinh tế.',
    },
    '11111111-0000-0000-0000-000000000015': {
      id: 'fact-15',
      item_id: '11111111-0000-0000-0000-000000000015',
      era: 'Dân gian Việt Nam',
      origin_story: 'Guốc mộc đẽo từ gỗ mít, gỗ xoan hoặc thông với quai bằng vải nhung/cói là vật dụng đi chân phổ biến của người Việt từ kinh kỳ đến làng quê suốt nhiều thế kỷ.',
      symbolic_meaning: 'Biểu tượng của sự mộc mạc, gần gũi và nếp sống thanh bần mà tao nhã của người Việt xưa.',
      modern_styling_tip: 'Đi cùng tất lửng trắng hoặc phối cùng tà áo dài ngũ thân dạo phố mang lại cảm giác hoài cổ mộc mạc và chân thực.',
    },
    '11111111-0000-0000-0000-000000000016': {
      id: 'fact-16',
      item_id: '11111111-0000-0000-0000-000000000016',
      era: 'Triều Nguyễn (Cung đình Huế)',
      origin_story: 'Hài gấm mũi vuốt cong thêu hoa mai và chỉ kim tuyến là trang phục đi chân cao quý của các bậc hoàng thái hậu, hoàng hậu và công chúa triều Nguyễn khi vận triều phục, lễ phục.',
      symbolic_meaning: 'Mũi hài cong nhẹ biểu thị phong thái đài các và sự cao quý; hoa văn thêu tỉ mỉ tượng trưng cho phẩm hạnh và vẻ đẹp vương giả.',
      modern_styling_tip: 'Kết hợp cùng áo Nhật bình hoặc áo tấc để tái hiện trọn vẹn 100% diện mạo cung đình Huế chuẩn sử liệu.',
    },
  };

  /**
   * Lấy danh sách trang phục theo bộ lọc (Ưu tiên Supabase, Fallback In-Memory)
   */
  async getItems(filters?: { gender?: Gender; slot?: SlotType; era?: string }): Promise<ItemDto[]> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        let query = supabaseClient.from('items').select('*').order('layer_order', { ascending: true });

        if (filters?.gender && filters.gender !== 'UNISEX') {
          query = query.in('gender', [filters.gender, 'UNISEX']);
        }
        if (filters?.slot) {
          query = query.eq('slot', filters.slot);
        }
        if (filters?.era) {
          query = query.contains('tags', JSON.stringify([filters.era.toLowerCase()]));
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as ItemDto[];
        }
        if (error) {
          console.warn('[ItemsService] Supabase query error, falling back to In-Memory mock:', error.message);
        }
      } catch (err) {
        console.warn('[ItemsService] Supabase query exception, falling back to In-Memory mock:', err);
      }
    }

    // Fallback In-Memory Filter
    return this.mockItems.filter((item) => {
      if (filters?.gender && filters.gender !== 'UNISEX' && item.gender !== filters.gender && item.gender !== 'UNISEX') {
        return false;
      }
      if (filters?.slot && item.slot !== filters.slot) {
        return false;
      }
      if (filters?.era) {
        const eraQuery = filters.era.toLowerCase();
        const hasEra = item.tags.some((tag) => tag.toLowerCase() === eraQuery);
        if (!hasEra) return false;
      }
      return true;
    });
  }

  /**
   * Lấy chi tiết một món đồ theo ID (Ưu tiên Supabase, Fallback In-Memory)
   */
  async getItemById(id: string): Promise<ItemDto | null> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('items').select('*').eq('id', id).maybeSingle();
        if (!error && data) {
          return data as ItemDto;
        }
        if (error) {
          console.warn('[ItemsService] Supabase getItemById error, falling back to In-Memory mock:', error.message);
        }
      } catch (err) {
        console.warn('[ItemsService] Supabase getItemById exception, falling back to In-Memory mock:', err);
      }
    }
    return this.mockItems.find((item) => item.id === id) || null;
  }

  /**
   * Lấy thẻ tri thức văn hóa theo Item ID (Ưu tiên Supabase, Fallback In-Memory)
   */
  async getCulturalFact(itemId: string): Promise<CulturalFactDto | null> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('cultural_facts').select('*').eq('item_id', itemId).maybeSingle();
        if (!error && data) {
          return data as CulturalFactDto;
        }
        if (error) {
          console.warn('[ItemsService] Supabase getCulturalFact error, falling back to In-Memory mock:', error.message);
        }
      } catch (err) {
        console.warn('[ItemsService] Supabase getCulturalFact exception, falling back to In-Memory mock:', err);
      }
    }
    return this.mockFacts[itemId] || null;
  }
}

export const itemsService = new ItemsService();
