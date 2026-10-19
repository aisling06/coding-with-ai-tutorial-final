// Try the outfit generator from the terminal:
//   node scripts/generate.mjs "Carrie Bradshaw" summer
import { generateOutfits } from '../src/outfits.js';

const [person, season] = process.argv.slice(2);
if (!person || !season) {
  console.error('Usage: node scripts/generate.mjs "<person>" <season>');
  process.exit(1);
}

let apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  try {
    ({ ANTHROPIC_API_KEY: apiKey } = await import('../config.local.js'));
  } catch {
    console.error('No API key: set ANTHROPIC_API_KEY or create config.local.js (see config.example.js)');
    process.exit(1);
  }
}

try {
  const result = await generateOutfits({ person, season }, { apiKey });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
