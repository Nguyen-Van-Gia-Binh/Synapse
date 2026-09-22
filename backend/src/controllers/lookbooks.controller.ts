import { Request, Response } from 'express';
import { lookbooksService } from '../services/lookbooks.service';
import { ApiResponse, CreateLookbookDto, LookbookResponseDto } from '../types';

export class LookbooksController {
  async createLookbook(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as CreateLookbookDto;
      if (!dto.title || !dto.gender || !dto.outfit_data) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Thiếu thông tin bắt buộc để tạo Lookbook.',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await lookbooksService.createLookbook(dto);
      const response: ApiResponse<LookbookResponseDto> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Lỗi lưu trữ tác phẩm Lookbook',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getLookbookById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await lookbooksService.getLookbookById(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: 'LOOKBOOK_NOT_FOUND',
            message: 'Không tìm thấy tác phẩm Lookbook theo link chia sẻ.',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse<LookbookResponseDto> = {
        success: true,
        data: result,
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

export const lookbooksController = new LookbooksController();
