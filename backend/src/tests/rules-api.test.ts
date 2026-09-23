import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { rulesController } from '../controllers/rules.controller';
import { Request, Response } from 'express';

function createMockResponse() {
  const res: Partial<Response> & { statusCode: number; responseData: any } = {
    statusCode: 200,
    responseData: null,
    status(code: number) {
      this.statusCode = code;
      return this as Response;
    },
    json(data: any) {
      this.responseData = data;
      return this as Response;
    },
  };
  return res;
}

describe('RulesController - API POST /api/rules/evaluate', () => {
  test('Yêu cầu hợp lệ trả về status 200 OK kèm Envelope JSON data', async () => {
    const req = {
      body: {
        gender: 'FEMALE',
        slots: {
          HEADWEAR: null,
          TOP: '11111111-0000-0000-0000-000000000001',
          BOTTOM: '22222222-0000-0000-0000-000000000001',
          PATTERN: null,
          ACCESSORY: null,
          FOOTWEAR: null,
        },
      },
    } as Request;

    const res = createMockResponse();
    await rulesController.evaluateRules(req, res as unknown as Response);

    assert.equal(res.statusCode, 200);
    assert.equal(res.responseData.success, true);
    assert.equal(res.responseData.data.is_valid, true);
    assert.deepEqual(res.responseData.data.violations, []);
    assert.ok(res.responseData.timestamp);
  });

  test('Thiếu trường gender hoặc slots trả về 400 BAD_REQUEST', async () => {
    const req = {
      body: {
        // thiếu gender
        slots: { TOP: null },
      },
    } as Request;

    const res = createMockResponse();
    await rulesController.evaluateRules(req, res as unknown as Response);

    assert.equal(res.statusCode, 400);
    assert.equal(res.responseData.success, false);
    assert.equal(res.responseData.error.code, 'BAD_REQUEST');
  });

  test('Phát hiện vi phạm trả về 200 OK với is_valid = false và danh sách violations', async () => {
    const req = {
      body: {
        gender: 'FEMALE',
        slots: {
          HEADWEAR: null,
          TOP: '11111111-0000-0000-0000-000000000001', // Áo tấc
          BOTTOM: null, // thiếu quần
          PATTERN: null,
          ACCESSORY: null,
          FOOTWEAR: null,
        },
      },
    } as Request;

    const res = createMockResponse();
    await rulesController.evaluateRules(req, res as unknown as Response);

    assert.equal(res.statusCode, 200);
    assert.equal(res.responseData.success, true);
    assert.equal(res.responseData.data.is_valid, false);
    assert.ok(res.responseData.data.violations.length >= 1);
    assert.ok(res.responseData.data.violations[0].rule_code.includes('MISSING_BOTTOM'));
  });
});
