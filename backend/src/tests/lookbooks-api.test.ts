import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Request, Response } from 'express';
import { lookbooksController } from '../controllers/lookbooks.controller';
import { CreateLookbookDto } from '../types';

function createMockReqRes(body: unknown = {}, params: Record<string, string> = {}) {
  const req = {
    body,
    params,
    query: {},
  } as unknown as Request;

  let statusCode = 200;
  let jsonResponse: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonResponse = data;
      return this;
    },
  } as unknown as Response;

  return {
    req,
    res,
    getStatusCode: () => statusCode,
    getJSON: () => jsonResponse,
  };
}

describe('LookbooksController - REST API POST /api/lookbooks & GET /api/lookbooks/:id', () => {
  const sampleLookbook: CreateLookbookDto = {
    title: 'Dạo Phố Đông Kinh 2026',
    gender: 'FEMALE',
    harmony_score: 95,
    outfit_data: {
      slots: {
        HEADWEAR: null,
        TOP: { item_id: '11111111-0000-0000-0000-000000000001', color: '#9E2A2B' },
        BOTTOM: { item_id: '22222222-0000-0000-0000-000000000001', color: '#E9C46A' },
        PATTERN: null,
        ACCESSORY: null,
        FOOTWEAR: null,
      },
      palette_used: ['#9E2A2B', '#E9C46A'],
    },
  };

  test('Tạo mới Lookbook hợp lệ trả về status 201 Created và share_url', async () => {
    const { req, res, getStatusCode, getJSON } = createMockReqRes(sampleLookbook);

    await lookbooksController.createLookbook(req, res);

    assert.equal(getStatusCode(), 201);
    const body = getJSON();
    assert.equal(body.success, true);
    assert.ok(body.data.id);
    assert.equal(body.data.title, 'Dạo Phố Đông Kinh 2026');
    assert.equal(body.data.harmony_score, 95);
    assert.ok(body.data.share_url.includes(body.data.id));
  });

  test('Thiếu trường bắt buộc trả về status 400 BAD_REQUEST', async () => {
    const invalidBody = { title: 'Không có outfit_data' };
    const { req, res, getStatusCode, getJSON } = createMockReqRes(invalidBody);

    await lookbooksController.createLookbook(req, res);

    assert.equal(getStatusCode(), 400);
    const body = getJSON();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'BAD_REQUEST');
  });

  test('Lấy Lookbook theo ID thành công trả về 200 OK', async () => {
    // Tạo trước
    const createReqRes = createMockReqRes(sampleLookbook);
    await lookbooksController.createLookbook(createReqRes.req, createReqRes.res);
    const createdId = createReqRes.getJSON().data.id;

    // Lấy lại
    const { req, res, getStatusCode, getJSON } = createMockReqRes({}, { id: createdId });
    await lookbooksController.getLookbookById(req, res);

    assert.equal(getStatusCode(), 200);
    const body = getJSON();
    assert.equal(body.success, true);
    assert.equal(body.data.id, createdId);
    assert.equal(body.data.title, sampleLookbook.title);
  });

  test('Lấy Lookbook ID không tồn tại trả về 404 LOOKBOOK_NOT_FOUND', async () => {
    const { req, res, getStatusCode, getJSON } = createMockReqRes({}, { id: 'lb-not-found-999' });

    await lookbooksController.getLookbookById(req, res);

    assert.equal(getStatusCode(), 404);
    const body = getJSON();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'LOOKBOOK_NOT_FOUND');
  });
});
