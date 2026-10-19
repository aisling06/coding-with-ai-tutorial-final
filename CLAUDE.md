# CLAUDE.md

## Project
Style Finder: a Chrome extension (Manifest V3) that takes a person (character or celebrity),
season, and optional category/color/budget, asks Claude for themed outfits, and links every
item to Google Shopping. See PROJECT.md for scope and PLAN.md for the step list.

## My learning goals
- Understand how a Chrome extension is structured (manifest, popup, scripts) and build one myself.
- Learn to call an LLM API and get reliable structured JSON back (prompting + validation).
- Learn to call a third-party API (SerpApi) and handle errors, rate limits, and caching.
- Write small automated tests and run them before each commit.
- Practice breaking work into small steps and committing after each one.

## How to work with me
- I'm learning: explain *why* before writing a big chunk of code, and keep changes small.
- Work through PLAN.md one step at a time; stop after each step so I can test it.
- Prefer plain JavaScript and as few dependencies as possible.
- Never put API keys in code or commit them; read them from a local, git-ignored file.
- When you add logic (JSON parsing, link building), add or update a test for it.
- UI text is in English.
