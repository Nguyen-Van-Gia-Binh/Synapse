import axios from 'axios';
import { ApiResponse, ItemDto, CulturalFactDto, EvaluateRulesRequestDto, EvaluateRulesResponseDto, CreateLookbookDto, LookbookResponseDto } from '../types';

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  // Health Check
  getHealth: async (): Promise<ApiResponse<{ status: string; service: string }>> => {
    const res = await api.get<ApiResponse<{ status: string; service: string }>>('/health');
    return res.data;
  },

  // Items API
  getItems: async (params?: { gender?: string; slot?: string; era?: string }): Promise<ItemDto[]> => {
    const res = await api.get<ApiResponse<ItemDto[]>>('/items', { params });
    return res.data.data || [];
  },

  getItemById: async (id: string): Promise<ItemDto | null> => {
    const res = await api.get<ApiResponse<ItemDto>>(`/items/${id}`);
    return res.data.data || null;
  },

  getCulturalFact: async (itemId: string): Promise<CulturalFactDto | null> => {
    const res = await api.get<ApiResponse<CulturalFactDto>>(`/items/${itemId}/facts`);
    return res.data.data || null;
  },

  // Cultural Rules Guardrail API
  evaluateRules: async (dto: EvaluateRulesRequestDto): Promise<EvaluateRulesResponseDto> => {
    const res = await api.post<ApiResponse<EvaluateRulesResponseDto>>('/rules/evaluate', dto);
    return res.data.data || { is_valid: true, violations: [], encouragement: '' };
  },

  // Lookbooks API
  createLookbook: async (dto: CreateLookbookDto): Promise<LookbookResponseDto> => {
    const res = await api.post<ApiResponse<LookbookResponseDto>>('/lookbooks', dto);
    if (!res.data.data) throw new Error('Không thể tạo Lookbook');
    return res.data.data;
  },

  getLookbookById: async (id: string): Promise<LookbookResponseDto | null> => {
    const res = await api.get<ApiResponse<LookbookResponseDto>>(`/lookbooks/${id}`);
    return res.data.data || null;
  },
};

export default api;
