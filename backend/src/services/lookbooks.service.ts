import { CreateLookbookDto, LookbookResponseDto } from '../types';
import { supabaseClient, isSupabaseConfigured } from '../config/supabase';

export class LookbooksService {
  private inMemoryLookbooks: Map<string, LookbookResponseDto> = new Map();

  async createLookbook(dto: CreateLookbookDto): Promise<LookbookResponseDto> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('lookbooks')
          .insert({
            title: dto.title,
            gender: dto.gender,
            outfit_data: dto.outfit_data,
            harmony_score: dto.harmony_score,
          })
          .select()
          .single();

        if (!error && data) {
          const result: LookbookResponseDto = {
            id: data.id,
            title: data.title,
            gender: data.gender,
            outfit_data: data.outfit_data,
            harmony_score: data.harmony_score,
            share_url: `https://synapse-studio.vercel.app/lookbook/${data.id}`,
            created_at: data.created_at,
          };
          this.inMemoryLookbooks.set(data.id, result);
          return result;
        }
        if (error) {
          console.warn('[LookbooksService] Supabase insert error, falling back to In-Memory:', error.message);
        }
      } catch (err) {
        console.warn('[LookbooksService] Supabase insert exception, falling back to In-Memory:', err);
      }
    }

    // Fallback In-Memory
    const id = `lb-${Date.now()}`;
    const result: LookbookResponseDto = {
      ...dto,
      id,
      share_url: `https://synapse-studio.vercel.app/lookbook/${id}`,
      created_at: new Date().toISOString(),
    };
    this.inMemoryLookbooks.set(id, result);
    return result;
  }

  async getLookbookById(id: string): Promise<LookbookResponseDto | null> {
    if (isSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('lookbooks')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            gender: data.gender,
            outfit_data: data.outfit_data,
            harmony_score: data.harmony_score,
            share_url: `https://synapse-studio.vercel.app/lookbook/${data.id}`,
            created_at: data.created_at,
          };
        }
        if (error) {
          console.warn('[LookbooksService] Supabase getLookbookById error, falling back to In-Memory:', error.message);
        }
      } catch (err) {
        console.warn('[LookbooksService] Supabase getLookbookById exception, falling back to In-Memory:', err);
      }
    }

    return this.inMemoryLookbooks.get(id) || null;
  }
}

export const lookbooksService = new LookbooksService();
