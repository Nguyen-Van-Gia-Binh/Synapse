import { CreateLookbookDto, LookbookResponseDto } from '../types';

export class LookbooksService {
  private lookbooks: Map<string, LookbookResponseDto> = new Map();

  async createLookbook(dto: CreateLookbookDto): Promise<LookbookResponseDto> {
    const id = `lb-${Date.now()}`;
    const result: LookbookResponseDto = {
      ...dto,
      id,
      share_url: `https://synapse-studio.vercel.app/lookbook/${id}`,
      created_at: new Date().toISOString(),
    };
    this.lookbooks.set(id, result);
    return result;
  }

  async getLookbookById(id: string): Promise<LookbookResponseDto | null> {
    return this.lookbooks.get(id) || null;
  }
}

export const lookbooksService = new LookbooksService();
