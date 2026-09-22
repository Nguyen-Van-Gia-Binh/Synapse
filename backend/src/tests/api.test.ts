import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { itemsController } from '../controllers/items.controller';
import { Request, Response } from 'express';

function createMockResponse() {
  let statusCode = 200;
  let responseBody: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(body: any) {
      responseBody = body;
      return this;
    },
    getStatusCode() {
      return statusCode;
    },
    getBody() {
      return responseBody;
    },
  };

  return res as unknown as Response & { getStatusCode: () => number; getBody: () => any };
}

describe('ItemsController - Envelope & Status Codes', () => {
  test('getItems trả về Envelope JSON chuẩn 200 OK với mảng dữ liệu', async () => {
    const req = {
      query: {},
    } as unknown as Request;
    const res = createMockResponse();

    await itemsController.getItems(req, res);

    assert.equal(res.getStatusCode(), 200);
    const body = res.getBody();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.equal(body.data.length, 8);
    assert.ok(body.timestamp);
  });

  test('getItemById trả về 200 OK cho ID hợp lệ và 404 ITEM_NOT_FOUND cho ID sai', async () => {
    // 1. Valid ID
    const validReq = {
      params: { id: '11111111-0000-0000-0000-000000000001' },
    } as unknown as Request;
    const validRes = createMockResponse();
    await itemsController.getItemById(validReq, validRes);
    assert.equal(validRes.getStatusCode(), 200);
    assert.equal(validRes.getBody().success, true);
    assert.equal(validRes.getBody().data.id, '11111111-0000-0000-0000-000000000001');

    // 2. Invalid ID
    const invalidReq = {
      params: { id: 'non-existent-uuid' },
    } as unknown as Request;
    const invalidRes = createMockResponse();
    await itemsController.getItemById(invalidReq, invalidRes);
    assert.equal(invalidRes.getStatusCode(), 404);
    assert.equal(invalidRes.getBody().success, false);
    assert.equal(invalidRes.getBody().error.code, 'ITEM_NOT_FOUND');
  });

  test('getCulturalFact trả về mã lỗi chuẩn ITEM_NOT_FOUND khi ID không tồn tại', async () => {
    const invalidReq = {
      params: { id: 'non-existent-uuid' },
    } as unknown as Request;
    const invalidRes = createMockResponse();

    await itemsController.getCulturalFact(invalidReq, invalidRes);

    assert.equal(invalidRes.getStatusCode(), 404);
    const body = invalidRes.getBody();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'ITEM_NOT_FOUND');
  });

  test('getCulturalFact trả về 200 OK và Fact văn hóa đầy đủ cho Áo tấc', async () => {
    const validReq = {
      params: { id: '11111111-0000-0000-0000-000000000001' },
    } as unknown as Request;
    const validRes = createMockResponse();

    await itemsController.getCulturalFact(validReq, validRes);

    assert.equal(validRes.getStatusCode(), 200);
    const body = validRes.getBody();
    assert.equal(body.success, true);
    assert.equal(body.data.era, 'Triều Nguyễn (Thế kỷ 19 - 20)');
    assert.ok(body.data.modern_styling_tip);
  });
});
