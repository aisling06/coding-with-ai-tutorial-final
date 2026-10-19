import { generateOutfits } from './src/outfits.js';
import { shoppingUrl } from './src/links.js';

const form = document.getElementById('search-form');
const button = form.querySelector('button');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

// The key lives in the git-ignored config.local.js. A dynamic import lets us show
// a helpful message instead of a blank popup when that file is missing.
async function loadApiKey() {
  try {
    const config = await import('./config.local.js');
    return config.ANTHROPIC_API_KEY;
  } catch {
    throw new Error('Missing config.local.js. Copy config.example.js and add your API key.');
  }
}

// Builds elements with textContent (not innerHTML) so text from the API
// can never be run as HTML in the popup.
function renderOutfit(outfit) {
  const section = document.createElement('section');
  section.className = 'outfit';

  const heading = document.createElement('h2');
  heading.textContent = outfit.title;
  section.append(heading);

  const list = document.createElement('ul');
  for (const item of outfit.items) {
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = shoppingUrl(item.search_phrase);
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = `${item.type}: ${item.search_phrase}`;

    const why = document.createElement('span');
    why.className = 'why';
    why.textContent = item.why;

    li.append(link, why);
    list.append(li);
  }
  section.append(list);
  return section;
}

form.addEventListener('submit', async (event) => {
  // Stop the browser from reloading the popup on submit.
  event.preventDefault();
  const input = Object.fromEntries(new FormData(form));

  button.disabled = true;
  resultsEl.replaceChildren();
  showStatus('Finding outfits…');

  try {
    const apiKey = await loadApiKey();
    const { outfits } = await generateOutfits(input, { apiKey, count: 1 });
    resultsEl.replaceChildren(...outfits.map(renderOutfit));
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
});
