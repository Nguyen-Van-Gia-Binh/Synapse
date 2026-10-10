import { create } from 'zustand';
import { Gender, SlotType, ItemDto, CulturalFactDto, RuleViolation, OutfitSlotState, SlotMap } from '../types';
import { apiClient } from '../services/api';
import { HarmonyScoreDetail, calculateColorHarmony } from '../utils/harmonyScorer';

export interface OutfitHistoryState {
  slots: Record<SlotType, OutfitSlotState | null>;
  gender: Gender;
}

export interface OutfitStoreState {
  gender: Gender;
  slots: Record<SlotType, OutfitSlotState | null>;
  activeFactcard: CulturalFactDto | null;
  activeFactcardItem: ItemDto | null;
  isFactcardLoading: boolean;
  violations: RuleViolation[];
  harmonyScore: number;
  harmonyDetail: HarmonyScoreDetail | null;
  selectedSlotForColor: SlotType | null;
  
  // History for undo/redo
  history: OutfitHistoryState[];
  historyIndex: number;

  // Actions
  setGender: (gender: Gender) => void;
  selectItem: (slot: SlotType, item: ItemDto, initialColor?: string) => void;
  removeItem: (slot: SlotType) => void;
  setItemColor: (slot: SlotType, color: string) => void;
  setSelectedSlotForColor: (slot: SlotType | null) => void;
  setActiveFactcard: (fact: CulturalFactDto | null) => void;
  setActiveFactcardItem: (item: ItemDto | null) => void;
  setIsFactcardLoading: (isLoading: boolean) => void;
  setViolations: (violations: RuleViolation[]) => void;
  setHarmonyScore: (score: number) => void;
  updateHarmonyScore: () => void;
  evaluateGuardrails: () => Promise<void>;
  loadCulturalFactForItem: (item: ItemDto) => Promise<void>;
  resetOutfit: () => void;
  undo: () => void;
  redo: () => void;
}

const initialSlots: Record<SlotType, OutfitSlotState | null> = {
  HEADWEAR: null,
  TOP: null,
  BOTTOM: null,
  PATTERN: null,
  ACCESSORY: null,
  FOOTWEAR: null,
};

const FALLBACK_CULTURAL_FACTS: Record<string, CulturalFactDto> = {
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

const factCache = new Map<string, CulturalFactDto>();

export const useOutfitStore = create<OutfitStoreState>((set, get) => ({
  gender: 'FEMALE',
  slots: initialSlots,
  activeFactcard: null,
  activeFactcardItem: null,
  isFactcardLoading: false,
  violations: [],
  harmonyScore: 85,
  harmonyDetail: null,
  selectedSlotForColor: null,
  history: [{ slots: initialSlots, gender: 'FEMALE' }],
  historyIndex: 0,

  setGender: (gender) => {
    set((state) => {
      const nextSlots = initialSlots;
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({ slots: nextSlots, gender });
      return {
        gender,
        slots: nextSlots,
        activeFactcard: null,
        activeFactcardItem: null,
        isFactcardLoading: false,
        violations: [],
        harmonyScore: 85,
        harmonyDetail: null,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  selectItem: (slot, item, initialColor) => {
    set((state) => {
      const color = initialColor || item.default_color || '#9E2A2B';
      const newSlots = {
        ...state.slots,
        [slot]: { item, color },
      };
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({ slots: newSlots, gender: state.gender });
      return {
        slots: newSlots,
        selectedSlotForColor: item.color_customizable ? slot : state.selectedSlotForColor,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
    get().evaluateGuardrails();
    get().updateHarmonyScore();
    get().loadCulturalFactForItem(item);
  },

  removeItem: (slot) => {
    set((state) => {
      const newSlots = {
        ...state.slots,
        [slot]: null,
      };
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({ slots: newSlots, gender: state.gender });
      return {
        slots: newSlots,
        selectedSlotForColor: state.selectedSlotForColor === slot ? null : state.selectedSlotForColor,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
    get().evaluateGuardrails();
    get().updateHarmonyScore();
  },

  setItemColor: (slot, color) => {
    set((state) => {
      const current = state.slots[slot];
      if (!current) return state;
      // Khóa đổi màu theo quy chế triều đình / văn hóa (US-03 Scenario 3.2)
      if (current.item && current.item.color_customizable === false) {
        return state;
      }
      const newSlots = {
        ...state.slots,
        [slot]: { ...current, color },
      };
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({ slots: newSlots, gender: state.gender });
      return {
        slots: newSlots,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
    get().updateHarmonyScore();
  },

  setSelectedSlotForColor: (slot) => set({ selectedSlotForColor: slot }),
  setActiveFactcard: (fact) => set({ activeFactcard: fact }),
  setActiveFactcardItem: (item) => set({ activeFactcardItem: item }),
  setIsFactcardLoading: (isLoading) => set({ isFactcardLoading: isLoading }),
  setViolations: (violations) => set({ violations }),
  setHarmonyScore: (harmonyScore) => set({ harmonyScore }),

  updateHarmonyScore: () => {
    const { slots } = get();
    if (slots.TOP && slots.BOTTOM) {
      const detail = calculateColorHarmony(slots.TOP.color, slots.BOTTOM.color);
      set({
        harmonyDetail: detail,
        harmonyScore: detail.totalScore,
      });
    } else {
      set({
        harmonyDetail: null,
        harmonyScore: 85,
      });
    }
  },

  loadCulturalFactForItem: async (item: ItemDto) => {
    set({ activeFactcardItem: item, isFactcardLoading: true });

    // 1. Kiểm tra cache trong bộ nhớ
    const cached = factCache.get(item.id);
    if (cached) {
      set({ activeFactcard: cached, isFactcardLoading: false });
      return;
    }

    try {
      const fact = await apiClient.getCulturalFact(item.id);
      if (fact) {
        factCache.set(item.id, fact);
        set({ activeFactcard: fact });
        return;
      }
    } catch {
      // Khi offline hoặc test môi trường không có backend, fallback sang dữ liệu dự phòng
    } finally {
      // Nếu chưa có fact từ backend, nạp từ từ điển dự phòng
      if (!factCache.has(item.id)) {
        const fallbackFact = FALLBACK_CULTURAL_FACTS[item.id] || null;
        if (fallbackFact) {
          factCache.set(item.id, fallbackFact);
          set({ activeFactcard: fallbackFact });
        }
      }
      set({ isFactcardLoading: false });
    }
  },

  evaluateGuardrails: async () => {
    const { gender, slots } = get();
    const slotMap: SlotMap = {
      HEADWEAR: slots.HEADWEAR ? slots.HEADWEAR.item.id : null,
      TOP: slots.TOP ? slots.TOP.item.id : null,
      BOTTOM: slots.BOTTOM ? slots.BOTTOM.item.id : null,
      PATTERN: slots.PATTERN ? slots.PATTERN.item.id : null,
      ACCESSORY: slots.ACCESSORY ? slots.ACCESSORY.item.id : null,
      FOOTWEAR: slots.FOOTWEAR ? slots.FOOTWEAR.item.id : null,
    };

    try {
      const result = await apiClient.evaluateRules({ gender, slots: slotMap });
      if (result.violations && result.violations.length > 0) {
        set({ violations: result.violations });
      } else if (slots.TOP && !slots.BOTTOM) {
        // Fallback văn hóa khi item là mock hoặc Backend rule chưa nạp tag của item
        set({
          violations: [
            {
              rule_code: 'RULE_AODAI_MISSING_BOTTOM',
              trigger_slot: 'TOP',
              severity: 'WARNING',
              message: 'Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?',
              suggestion: {
                target_slot: 'BOTTOM',
                action: 'ADD_RECOMMENDED_ITEM',
                recommended_tags: ['quan_lua', 'silk'],
              },
            },
          ],
        });
      } else {
        set({ violations: [] });
      }
    } catch {
      // Graceful fallback nếu Backend offline
      const fallbackViolations: RuleViolation[] = [];
      if (slots.TOP && !slots.BOTTOM) {
        fallbackViolations.push({
          rule_code: 'RULE_AODAI_MISSING_BOTTOM',
          trigger_slot: 'TOP',
          severity: 'WARNING',
          message: 'Áo ngũ thân truyền thống thường đi cùng quần ống rộng để giữ dáng đứng trang nghiêm, bạn có muốn thử kết hợp thêm quần không?',
          suggestion: {
            target_slot: 'BOTTOM',
            action: 'ADD_RECOMMENDED_ITEM',
            recommended_tags: ['quan_lua', 'silk'],
          },
        });
      }
      set({ violations: fallbackViolations });
    }
  },

  resetOutfit: () => {
    set((state) => {
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({ slots: initialSlots, gender: state.gender });
      return {
        slots: initialSlots,
        selectedSlotForColor: null,
        activeFactcard: null,
        activeFactcardItem: null,
        isFactcardLoading: false,
        violations: [],
        harmonyScore: 85,
        harmonyDetail: null,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({
        slots: prev.slots,
        gender: prev.gender,
        historyIndex: historyIndex - 1,
      });
      get().updateHarmonyScore();
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({
        slots: next.slots,
        gender: next.gender,
        historyIndex: historyIndex + 1,
      });
      get().updateHarmonyScore();
    }
  },
}));
