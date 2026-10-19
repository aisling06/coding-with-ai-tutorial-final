// Builds a Google Shopping search link for an item's search phrase.
export function shoppingUrl(searchPhrase) {
  const query = String(searchPhrase ?? '').trim();
  if (!query) throw new Error('Search phrase is empty');
  // encodeURIComponent turns spaces, &, # etc. into URL-safe codes.
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
}
