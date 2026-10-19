# Plan (small, checkable steps)

1. **Repo setup:** empty GitHub repo, PROJECT.md, CLAUDE.md with learning goals. ✅ check: pushed.
2. **Hello extension:** Manifest V3 popup that loads in Chrome and shows a form
   (person, season, category, color). ✅ check: loads via "Load unpacked".
3. **Outfit generator (script first):** a small JS function that calls Claude and returns
   JSON `{outfits: [{title, items: [{type, search_phrase, why}]}]}`.
   ✅ check: running it for "Carrie Bradshaw, summer" prints valid JSON.
4. **First tests:** test JSON parsing/validation and the Google Shopping link builder.
   ✅ check: tests pass.
5. **Connect popup to generator:** submit form, show 1 outfit as a list of links.
   ✅ check: clicking an item opens Google Shopping. ← *smallest runnable version*
6. **More outfits:** 3 outfits per search + "Load more outfits" button.
   ✅ check: outfits have different themes, no duplicates.
7. **Product images:** for an opened outfit, fetch thumbnails/prices (SerpApi).
   ✅ check: images show; free-tier usage stays low.
8. **Polish:** aesthetic English UI, loading state, error messages.
   ✅ check: a friend can use it without help.
