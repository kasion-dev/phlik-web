# Phlik Career — Web

Web companion to the [Phlik Career Android app](https://play.google.com/store/apps/details?id=dev.kasion.phlik.career).
Same brand, same backend (`kasion-ai-router`), no app-store friction.

## Features

- **Resume polish** — drop bullets → AI rewrites with ATS scoring + tone control
- **Interview prep** — role + industry → 20 likely questions with sample answers
- **Career journal** — 5-minute mood + event reflection, AI sees the pattern
- 4 languages: Thai · English · Spanish · Chinese (auto-detect on first load)
- Free during beta, no signup required

## Stack

- **Astro 5** static site, **Svelte 5** islands
- **Tailwind CSS** (CDN, dark-only)
- **Cloudflare Workers** (static assets via `wrangler deploy`)
- Talks to `kasion-ai-router` Worker (`/v1/invoke`)

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static dist/
npm run typecheck    # astro check
npm run deploy       # build + wrangler deploy
```

Override the AI gateway in dev with a `.env`:

```
PUBLIC_AI_GATEWAY_URL=http://localhost:8787
```

## Layout

```
src/
├── layouts/Layout.astro          # shell, header, footer, theme
├── components/
│   ├── ResumePolisher.svelte     # /resume island
│   ├── InterviewPrep.svelte      # /interview island
│   ├── Journal.svelte            # /journal island
│   └── LangPicker.svelte         # locale switcher
├── lib/
│   ├── ai_client.ts              # /v1/invoke wrapper
│   ├── identity.ts               # localStorage UUID + dev token
│   └── i18n.ts                   # 4-language strings
└── pages/                        # Astro routes (one .astro per URL)
```

## Backend contract

Mirrors `apps/phlik_career` (Flutter) so the same gateway prompts run for both.

```ts
POST /v1/invoke
Authorization: Bearer dev-<userId>-<tier>      // stealth-phase token
{
  "app_id": "phlik_career",
  "task":   "resume_polish" | "interview_prep" | "mood_reflect",
  "input":  { ... },
  "session_id": "<optional HMAC-scoped id>"
}
```

## Related

- [`kasion/packages/ai-router`](../../packages/ai-router) — backend Worker
- [`apps/phlik_career`](../phlik_career) — Flutter mobile app (same brand, more features)
- [`kasion-site`](../../kasion-site) — Kasion landing
