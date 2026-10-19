# Style Finder

A Chrome extension that turns "dress like this person" into outfits you can shop for.
See PROJECT.md for scope and PLAN.md for the step list.

## Setup
1. Copy `config.example.js` to `config.local.js` and paste your Anthropic API key into it.
   `config.local.js` is git-ignored, so the key is never committed.
2. In Chrome, open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**,
   and pick this folder.
3. Click the Style Finder icon, fill in a person and season, and press **Find outfits**.

## Development (needs Node.js 18+)
- `npm test`: run the tests in `tests/`
- `npm run generate -- "Carrie Bradshaw" summer`: print outfits as JSON from the terminal
