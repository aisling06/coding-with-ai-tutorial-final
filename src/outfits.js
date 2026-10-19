// Asks Claude for themed outfits and checks that the answer has the shape we expect.
// Plain fetch (no SDK) so the same file runs in the Chrome popup and in Node.

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-opus-5-5';

// JSON Schema sent with the request. The API then guarantees the reply is JSON
// in this shape, but we still validate it ourselves in parseOutfits().
export const OUTFIT_SCHEMA = {
  type: 'object',
  properties: {
    outfits: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                search_phrase: { type: 'string' },
                why: { type: 'string' },
              },
              required: ['type', 'search_phrase', 'why'],
              additionalProperties: false,
            },
          },
        },
        required: ['title', 'items'],
        additionalProperties: false,
      },
    },
  },
  required: ['outfits'],
  additionalProperties: false,
};

export function buildPrompt({ person, season, category, color, budget }, count = 1) {
  const lines = [
    `Create ${count} themed outfit(s) inspired by the personal style of ${person} for ${season}.`,
  ];
  if (category) lines.push(`Every outfit must include this clothing category: ${category}.`);
  if (color) lines.push(`Feature this color: ${color}.`);
  if (budget) lines.push(`Keep items within this budget: ${budget}.`);
  lines.push(
    'Give each outfit a short theme title, like "Date Night" or "Sunday Brunch".',
    'List 4-6 items per outfit (e.g. top, bottom, shoes, bag, accessory).',
    'For each item:',
    '- "type": the kind of item, e.g. "top" or "shoes".',
    '- "search_phrase": a concrete phrase someone could type into Google Shopping,',
    '  including color, material and cut, e.g. "pink satin bias-cut midi skirt". No brand-only or vague phrases.',
    '- "why": one sentence on why it fits this person\'s style.',
  );
  return lines.join('\n');
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// Turns Claude's text reply into {outfits: [...]}, or throws an Error saying what is wrong.
export function parseOutfits(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Reply was not valid JSON');
  }

  if (!data || !Array.isArray(data.outfits) || data.outfits.length === 0) {
    throw new Error('Reply has no outfits');
  }

  data.outfits.forEach((outfit, i) => {
    if (!isNonEmptyString(outfit?.title)) {
      throw new Error(`Outfit ${i + 1} has no title`);
    }
    if (!Array.isArray(outfit.items) || outfit.items.length === 0) {
      throw new Error(`Outfit ${i + 1} has no items`);
    }
    outfit.items.forEach((item, j) => {
      for (const field of ['type', 'search_phrase', 'why']) {
        if (!isNonEmptyString(item?.[field])) {
          throw new Error(`Outfit ${i + 1}, item ${j + 1} is missing "${field}"`);
        }
      }
    });
  });

  return { outfits: data.outfits };
}

// fetchFn is a parameter so tests can pass a fake instead of calling the real API.
export async function generateOutfits(input, { apiKey, count = 1, fetchFn = fetch } = {}) {
  if (!apiKey) throw new Error('Missing Anthropic API key');

  const response = await fetchFn(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // Needed because the popup calls the API straight from the browser.
      'anthropic-dangerous-direct-browser-access': 'true',
      // If Claude declines a request, let the API retry it on a fallback model.
      'anthropic-beta': 'server-side-fallback-2026-07-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      fallbacks: 'default',
      // Outfit ideas don't need deep reasoning; low effort keeps the popup fast.
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: OUTFIT_SCHEMA },
      },
      messages: [{ role: 'user', content: buildPrompt(input, count) }],
    }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = (await response.json())?.error?.message ?? '';
    } catch {
      // Body wasn't JSON; the status code is enough.
    }
    throw new Error(`Claude API error ${response.status}${detail ? `: ${detail}` : ''}`);
  }

  const message = await response.json();
  if (message.stop_reason === 'refusal') {
    throw new Error('Claude declined this request. Try a different person.');
  }
  if (message.stop_reason === 'max_tokens') {
    throw new Error('Reply was cut off before it finished');
  }

  const textBlock = message.content?.find((block) => block.type === 'text');
  if (!textBlock) throw new Error('Reply had no text');
  return parseOutfits(textBlock.text);
}
