import { Request, Response } from 'express';
import { rulesService } from '../services/rules.service';
import { ApiResponse, EvaluateRulesRequestDto, EvaluateRulesResponseDto } from '../types';

export class RulesController {
  async evaluateRules(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as EvaluateRulesRequestDto;
      if (!dto.gender || !dto.slots) {
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Thiếu thông tin giới tính hoặc danh sách slots.',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await rulesService.evaluateRules(dto);
      const response: ApiResponse<EvaluateRulesResponseDto> = {
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
          message: 'Lỗi đánh giá quy tắc văn hóa',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const rulesController = new RulesController();
