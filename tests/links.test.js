import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shoppingUrl } from '../src/links.js';

test('builds a Google Shopping URL', () => {
  assert.equal(
    shoppingUrl('pink midi skirt'),
    'https://www.google.com/search?tbm=shop&q=pink%20midi%20skirt',
  );
});

test('encodes special characters so they stay in the query', () => {
  const url = new URL(shoppingUrl('black & white #1 tee'));
  assert.equal(url.searchParams.get('q'), 'black & white #1 tee');
  assert.equal(url.searchParams.get('tbm'), 'shop');
});

test('trims surrounding spaces', () => {
  assert.equal(shoppingUrl('  tote bag  '), shoppingUrl('tote bag'));
});

test('rejects an empty phrase', () => {
  assert.throws(() => shoppingUrl('   '), /empty/);
  assert.throws(() => shoppingUrl(undefined), /empty/);
});
