import assert from 'node:assert/strict';
import test from 'node:test';
import { nativeDraftModel, parseDraftResult } from '../lib/quick-draft.js';

const response = { summary: '导师会议', date: '2026-11-20', startTime: '15:00', endTime: '16:00', location: '302' };
const body = { provider: 'fixture', model: 'vision', timeZone: 'Asia/Shanghai', text: '周五下午三点到四点在 302 开会' };
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j/1cAAAAASUVORK5CYII=';

test('normalizes model output and leaves uncertain or invalid calendar fields blank', () => {
  const fields = parseDraftResult(JSON.stringify({ ...response, date: '2026-02-30', endTime: '24:00', uid: 'ignored' }));
  assert.equal(fields.date, '');
  assert.equal(fields.endTime, '');
  assert.equal(fields.startTime, '15:00');
  assert.ok(!('uid' in fields));
  assert.throws(() => parseDraftResult('{}'), /未从材料中识别/);
});

test('text and screenshots use the selected DSH model without granting calendar tools', async () => {
  const calls = [];
  const images = [];
  const llm = {
    listProviders: () => [{ id: 'fixture' }],
    listModels: async () => [{
      id: 'vision', inputModalities: ['text', 'image'],
    }, { id: 'text', inputModalities: ['text'] }],
    prepareCall: async route => ({
      config: route, inputModalities: route.model === 'vision' ? ['text', 'image'] : ['text'],
      async *stream(request) {
        calls.push(request);
        yield { type: 'text-delta', index: 0, text: JSON.stringify(response) };
        yield { type: 'finish', reason: { kind: 'stop' } };
      },
    }),
  };
  const model = nativeDraftModel(llm, {
    async saveImages(data) { images.push(...data); return [{ id: 'fixture-image' }]; },
  });
  assert.deepEqual((await model.routes()).map(model => model.image), [true, false]);
  assert.equal((await model.suggest(body)).summary, response.summary);
  assert.equal(images.length, 0);
  const draft = await model.suggest({ ...body, text: '', image: png });
  assert.equal(draft.location, response.location);
  assert.equal(images[0].mediaType, 'image/png');
  assert.deepEqual(calls[1].tools, []);
  assert.deepEqual(calls[1].messages[0].content[1].attachment, { id: 'fixture-image' });
  await assert.rejects(model.suggest({ ...body, model: 'text', image: png }), /支持图片输入/);
  assert.equal(calls.length, 2);
});
