# Style Finder (working title)

A Chrome extension that turns "dress like this person" into shoppable outfits.

## Problem
I see a character (e.g. Carrie Bradshaw) or a celebrity whose style I love, but turning
"her vibe" into actual pieces I can buy takes a lot of searching.

## What it does
1. User opens the extension popup and enters: **person**, **season**, and optionally
   **clothing category**, **color**, **budget**.
2. Claude turns that into several themed outfits (e.g. "Date Night", "Sunday Brunch"),
   each a list of items (top, bottom, shoes, bag, hat...) with a specific search phrase
   and a one-line "why this fits her style".
3. Each item links to Google Shopping results so the user can click through and buy.
4. Later: show real product images and prices inside the extension.

## Scope for ~15 hours
**In scope**
- Chrome extension (Manifest V3) with an English UI
- Claude API call that returns outfits as structured JSON
- Google Shopping search links per item (no API needed)
- 3+ outfits per search, plus a "Load more outfits" button
- Product thumbnails via a search API (SerpApi) for the outfit the user opens

**Out of scope (for now)**
- Depop integration (no public API; scraping breaks its terms)
- User accounts, saved outfits, payments
- Training our own model or image recognition
- Polished visual design (do after it works)

## Technical approach
- **Style matching:** Claude generates a style profile + outfit items as JSON from the
  person's name and filters. No dataset needed; Claude already knows famous looks.
- **Shopping:** build `https://www.google.com/search?tbm=shop&q=<item phrase>` links.
  Optional upgrade: SerpApi Google Shopping endpoint for images/prices/links.
- **Cost control:** outfit ideas (text) are cheap, so generate many; only fetch product
  images for an outfit when the user opens it.
- **Keys:** stored locally for the class demo, never committed to GitHub.

## Success looks like
I type "Carrie Bradshaw, summer, skirt, pink" and within a few seconds see 3 distinct
outfits that feel like her, and every item opens a page where I could buy something similar.

## Risks
- Claude may suggest vague items -> prompt asks for concrete search phrases; tested.
- API free tiers are small -> lazy-load images, cache results.
- Celebrity names that Claude doesn't know -> show a friendly "not enough info" message.
