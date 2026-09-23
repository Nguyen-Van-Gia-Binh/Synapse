import { create } from 'zustand';
import { Gender, SlotType, ItemDto, CulturalFactDto, RuleViolation, OutfitSlotState } from '../types';

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
  selectedSlotForColor: SlotType;
  
  // History for undo/redo
  history: OutfitHistoryState[];
  historyIndex: number;

  // Actions
  setGender: (gender: Gender) => void;
  selectItem: (slot: SlotType, item: ItemDto, initialColor?: string) => void;
  removeItem: (slot: SlotType) => void;
  setItemColor: (slot: SlotType, color: string) => void;
  setSelectedSlotForColor: (slot: SlotType) => void;
  setActiveFactcard: (fact: CulturalFactDto | null) => void;
  setActiveFactcardItem: (item: ItemDto | null) => void;
  setIsFactcardLoading: (isLoading: boolean) => void;
  setViolations: (violations: RuleViolation[]) => void;
  setHarmonyScore: (score: number) => void;
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

export const useOutfitStore = create<OutfitStoreState>((set, get) => ({
  gender: 'FEMALE',
  slots: initialSlots,
  activeFactcard: null,
  activeFactcardItem: null,
  isFactcardLoading: false,
  violations: [],
  harmonyScore: 85,
  selectedSlotForColor: 'TOP',
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
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
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
  },

  setSelectedSlotForColor: (slot) => set({ selectedSlotForColor: slot }),
  setActiveFactcard: (fact) => set({ activeFactcard: fact }),
  setActiveFactcardItem: (item) => set({ activeFactcardItem: item }),
  setIsFactcardLoading: (isLoading) => set({ isFactcardLoading: isLoading }),
  setViolations: (violations) => set({ violations }),
  setHarmonyScore: (harmonyScore) => set({ harmonyScore }),

  resetOutfit: () => {
    set((state) => {
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({ slots: initialSlots, gender: state.gender });
      return {
        slots: initialSlots,
        activeFactcard: null,
        activeFactcardItem: null,
        isFactcardLoading: false,
        violations: [],
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
    }
  },
}));
