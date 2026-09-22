import { Request, Response } from 'express';
import { itemsService } from '../services/items.service';
import { ApiResponse, Gender, ItemDto, CulturalFactDto, SlotType } from '../types';

export class ItemsController {
  async getItems(req: Request, res: Response): Promise<void> {
    try {
      const { gender, slot, era } = req.query;
      const items = await itemsService.getItems({
        gender: gender as Gender,
        slot: slot as SlotType,
        era: era as string,
      });

      const response: ApiResponse<ItemDto[]> = {
        success: true,
        data: items,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Không thể tải danh sách trang phục',
          details: error instanceof Error ? error.message : null,
        },
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await itemsService.getItemById(id);

      if (!item) {
        const response: ApiResponse<never> = {
          success: false,
          error: {
            code: 'ITEM_NOT_FOUND',
            message: 'Không tìm thấy trang phục với mã ID được cung cấp.',
          },
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ItemDto> = {
        success: true,
        data: item,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Lỗi máy chủ',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getCulturalFact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const fact = await itemsService.getCulturalFact(id);

      if (!fact) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ITEM_NOT_FOUND',
            message: 'Không tìm thấy thông tin văn hóa cho trang phục này.',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse<CulturalFactDto> = {
        success: true,
        data: fact,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Lỗi máy chủ',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const itemsController = new ItemsController();
