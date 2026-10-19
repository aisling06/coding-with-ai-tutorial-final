import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPrompt, parseOutfits, generateOutfits } from '../src/outfits.js';

const goodReply = {
  outfits: [
    {
      title: 'Sunday Brunch',
      items: [
        { type: 'skirt', search_phrase: 'pink tulle midi skirt', why: 'Her signature tutu moment.' },
        { type: 'shoes', search_phrase: 'satin pointed-toe pumps', why: 'She lives in heels.' },
      ],
    },
  ],
};

// A stand-in for fetch that returns whatever response we want, and remembers the request.
function fakeFetch(status, body) {
  const calls = [];
  const fn = async (url, options) => {
    calls.push({ url, options });
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
  fn.calls = calls;
  return fn;
}

test('buildPrompt includes required and optional filters', () => {
  const prompt = buildPrompt({ person: 'Carrie Bradshaw', season: 'summer', color: 'pink' });
  assert.match(prompt, /Carrie Bradshaw/);
  assert.match(prompt, /summer/);
  assert.match(prompt, /pink/);
  assert.doesNotMatch(prompt, /budget/);
});

test('parseOutfits accepts a valid reply', () => {
  assert.deepEqual(parseOutfits(JSON.stringify(goodReply)), goodReply);
});

test('parseOutfits rejects text that is not JSON', () => {
  assert.throws(() => parseOutfits('Here are some outfits!'), /not valid JSON/);
});

test('parseOutfits rejects a reply with no outfits', () => {
  assert.throws(() => parseOutfits('{"outfits": []}'), /no outfits/);
  assert.throws(() => parseOutfits('{}'), /no outfits/);
});

test('parseOutfits names the item that is missing a field', () => {
  const bad = structuredClone(goodReply);
  bad.outfits[0].items[1].search_phrase = '';
  assert.throws(() => parseOutfits(JSON.stringify(bad)), /Outfit 1, item 2 is missing "search_phrase"/);
});

test('generateOutfits sends the key and returns parsed outfits', async () => {
  const fetchFn = fakeFetch(200, {
    stop_reason: 'end_turn',
    content: [{ type: 'text', text: JSON.stringify(goodReply) }],
  });
  const result = await generateOutfits({ person: 'Carrie Bradshaw', season: 'summer' }, { apiKey: 'test-key', fetchFn });

  assert.deepEqual(result, goodReply);
  assert.equal(fetchFn.calls[0].options.headers['x-api-key'], 'test-key');
  const body = JSON.parse(fetchFn.calls[0].options.body);
  assert.equal(body.output_config.format.type, 'json_schema');
});

test('generateOutfits reports API errors with the message', async () => {
  const fetchFn = fakeFetch(401, { error: { message: 'invalid x-api-key' } });
  await assert.rejects(
    generateOutfits({ person: 'X', season: 'fall' }, { apiKey: 'bad', fetchFn }),
    /401: invalid x-api-key/,
  );
});

test('generateOutfits reports a refusal', async () => {
  const fetchFn = fakeFetch(200, { stop_reason: 'refusal', content: [] });
  await assert.rejects(
    generateOutfits({ person: 'X', season: 'fall' }, { apiKey: 'k', fetchFn }),
    /declined/,
  );
});

test('generateOutfits requires an API key', async () => {
  await assert.rejects(generateOutfits({ person: 'X', season: 'fall' }, {}), /API key/);
});
