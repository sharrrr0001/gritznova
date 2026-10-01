# GRITZNOVA website

Marketing site for GRITZNOVA, with **Nova**, an AI assistant powered by Google Gemini (free tier) or Anthropic Claude.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 (design tokens) · Framer Motion · Radix UI (shadcn-style primitives) · Lucide · MDX · Google GenAI SDK (Gemini) / Anthropic SDK (Claude)

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY at minimum
npm run dev                  # http://localhost:3000
```

| Script              | What it does                      |
| ------------------- | --------------------------------- |
| `npm run dev`       | Local dev server with hot reload  |
| `npm run build`     | Production build                  |
| `npm start`         | Serve the production build        |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | TypeScript (`tsc --noEmit`)       |
| `npm run format`    | Prettier (sorts Tailwind classes) |

Requires Node 20+ (Netlify is pinned to Node 22).

---

## Folder structure

```
app/                       Routes (App Router)
  page.tsx                 Home: all 14 sections
  services/[slug]/         Service detail pages (generated from content/services.ts)
  work/, work/[slug]/      Portfolio + case studies
  about/ careers/ contact/ insights/ insights/[slug]/ privacy/ terms/
  not-found.tsx            Custom 404
  api/chat/                Streaming chat endpoint (Nova)
  api/lead/                Chat lead capture (+ AI transcript summary)
  api/contact/             Contact form
  api/newsletter/          Footer newsletter sign-up
  sitemap.ts robots.ts opengraph-image.tsx icon.svg
  globals.css              ← DESIGN TOKENS (colors, type scale, shadows, motion)
components/
  ui/                      Primitives: Button, Badge, Accordion, Field/Input/Select, SectionHeader, Reveal
  layout/                  Navbar, Footer, Logo, ThemeToggle, PageHeader, JSON-LD, Analytics
  sections/                Home-page sections (Hero, ServicesGrid, FeaturedWork, Process, Contact…)
  chat/                    Nova: launcher (always loaded) + panel (lazy-loaded on first open)
content/                   ← EDIT CONTENT HERE (typed data, no components)
  site.ts                  Company name, contact details, socials, location, booking link
  services.ts              The six services (cards + detail pages)
  work.ts                  Case studies
  home.ts                  Client logos, differentiators, process, tech stack, stats
  testimonials.ts faqs.ts team.ts (story, values, team, jobs)
  insights/                Blog: index.ts (registry) + one .mdx file per post
  chatbot-system-prompt.md ← NOVA'S KNOWLEDGE + RULES
lib/
  llm.ts                   LLM layer: Gemini (default) or Claude, streaming, system-prompt loader
  schemas.ts               Zod schemas shared by client and server validation
  deliver.ts               Sends leads/forms to Resend and/or a webhook
  rate-limit.ts seo.ts analytics.ts utils.ts
```

---

## Editing content

All copy lives in `content/` as typed TypeScript. You don't need to touch components.

- **Company details:** `content/site.ts`. Email, phone, address, socials, and the booking link (`booking.url`, e.g. Calendly). If `booking.url` is empty, every "Book a consultation" button scrolls to the contact form.
- **Services:** `content/services.ts`. Adding an entry creates a card on the home page, a `/services/<slug>` page, a sitemap entry and a contact-form option automatically.
- **Case studies:** `content/work.ts`. Set `image: "/work/foo.jpg"` (file in `/public/work`) to replace the generated cover art.
- **Blog posts:** add `content/insights/<slug>.mdx`, then register it in `content/insights/index.ts`.
- **Stats:** `content/home.ts`. **Real numbers only.** While `value` is `null`, a dashed placeholder is shown.
- **Placeholders:** anything with `placeholder: true` shows a visible "Placeholder" tag. Set it to `false` once the content is real.

### Design tokens

Colors, the fluid type scale, radii, shadows and animations are defined once in `app/globals.css` (`:root` for light, `.dark` for dark) and exposed to Tailwind via `@theme`. Every text/background pairing was checked for WCAG AA contrast. Keep that in mind if you change values.

### Hero 3D scene ("Digital Engineering Core")

Lives in `components/hero/`:

| File                   | What it does                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `hero-visual.tsx`      | Wrapper: loads the scene when the browser is idle, detects WebGL, pauses off-screen, handles errors |
| `hero-fallback.tsx`    | Static SVG version. Shown instantly, and permanently if WebGL is unavailable or the scene fails     |
| `scene/config.ts`      | **Edit here:** ecosystem nodes (labels, hover text, orbits), rings, intro timing                    |
| `scene/core.tsx`       | Central core: rotating machined metal bands, glass shell, lit interior                              |
| `scene/rings.tsx`      | Orbital rings                                                                                       |
| `scene/ecosystem.tsx`  | Nodes, data paths, travelling packets, hover labels                                                 |
| `scene/particles.tsx`  | GPU particle field (one draw call) that reacts to the cursor and to hovered nodes                   |
| `scene/hero-scene.tsx` | Canvas, lighting, procedural reflections, camera rig (parallax and scroll)                          |

Performance and accessibility:

- three.js is code-split and only downloaded after first paint, so it never blocks the page.
- Pixel ratio is capped, and drops automatically on slow devices (`PerformanceMonitor`).
- There's no post-processing; glows are additive sprites. Rendering stops while the hero is off-screen.
- On mobile (<1024px) the scene is simpler: 4 nodes, 2 rings, ~900 particles, no hover. It sits below the CTAs.
- With `prefers-reduced-motion`, it renders one static, fully formed frame.
- Labels are decorative (`aria-hidden`). The headline and CTAs carry the message.

### Brand system

- **Colour:** near-black background, white text, and logo red `#E10600` as the only highlight, used on about 5% of the page (buttons, the key word in headlines, active links). `--brand` is the exact logo red, for fills and large headline words. `--accent-text` is a contrast-safe red for small text: `#FF4A42` on dark, `#C40500` on light.
- **Logo shapes:** the › from the logo (`<Chevron />` in `components/layout/logo.tsx`) is used for buttons, bullets, eyebrows, breadcrumbs and the process steps. The red circle becomes the soft `brand-glow` behind the hero visual and the CTA band.
- **GRITZ / NOVA split:** pass `highlight="word"` to `<SectionHeader>` or `<CtaBand>` to set the key word in red.
- **Fonts:** Montserrat for headings (wide, like the logo lettering) and Inter for body text. Both are self-hosted from npm.
- **Logo:** `LogoMark` and `Wordmark` in `components/layout/logo.tsx` are SVG recreations. "GRITZ" follows the text colour, so it turns dark in light mode. If you have an official SVG export, paste its paths into `LogoMark` and `app/icon.svg`. The same mark is used as the chat launcher and Nova's avatar.

---

## Nova (the AI assistant)

**How it works**

1. The floating launcher (`components/chat/chat-launcher.tsx`) is tiny. The panel, markdown renderer and lead form are only downloaded when a visitor first opens it.
2. Messages stream from `POST /api/chat`, which calls the configured LLM (see **Choosing the AI model** below).
3. History is kept in `sessionStorage` for the browser session. "Clear chat" resets it.
4. When the visitor shows buying intent, the model adds a `[[LEAD_FORM]]` token, which the UI swaps for an inline form. The form also appears if the visitor types an email address or taps "Talk to a human".
5. Leads go to `POST /api/lead`, which asks the same LLM for a short sales summary of the conversation and delivers name, email, details, summary and full transcript to your configured destination.

**Editing Nova's knowledge:** edit `content/chatbot-system-prompt.md`. It contains the company overview, services, process, FAQs, contact details, tone and rules (stay on topic, never invent prices or clients, when to collect leads). In development it is re-read on every request. In production it's read once per server instance, so redeploy after editing. Keep it in sync with `content/` when you change services or FAQs.

**Safety and limits:** API keys stay server-side only (never `NEXT_PUBLIC_`). Each IP gets 12 messages a minute and 150 a day. Messages are capped at 2,000 characters, history at 30 turns, and inputs are sanitized. Markdown is rendered without raw HTML, and only safe link protocols are allowed. Errors show a friendly fallback message.

**Choosing the AI model**

| Provider                    | Env vars                                                                      | Cost      | Notes                                                                                                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google Gemini** (default) | `GEMINI_API_KEY`, optional `GEMINI_MODEL` (default `gemini-flash-latest`)     | Free tier | Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). The free tier has per-minute/day request limits, and Google may use free-tier prompts to improve its products. Use a paid tier for confidential chats. |
| **Anthropic Claude**        | `ANTHROPIC_API_KEY`, optional `ANTHROPIC_MODEL` (default `claude-sonnet-5-5`) | Paid      | Uses prompt caching, low effort for fast replies, and server-side refusal fallback.                                                                                                                                                   |

If both keys are set, Gemini is used unless `LLM_PROVIDER=anthropic`. When the free quota runs out, visitors see a friendly "try again in a minute" message.

---

## Lead and form delivery

Configure at least one destination (both can be active at once):

| Option  | Env vars                                             | Notes                                                                                  |
| ------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Email   | `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` | Verify your sending domain in Resend                                                   |
| Webhook | `LEAD_WEBHOOK_URL`                                   | Receives JSON. Works with Formspree, Zapier/Make, Google Apps Script (Sheets) or a CRM |

Spam protection: a hidden honeypot field (bots get a fake success) plus per-IP rate limits. In local development with no destination set, submissions are logged to the console. **In production they fail with an error**, so you'll notice a missing configuration instead of losing leads silently.

> Rate limits are in-memory per server instance, which is enough to stop casual abuse. For strict global limits across serverless instances, swap `lib/rate-limit.ts` to Upstash Redis (`@upstash/ratelimit`). The function signature can stay the same.

---

## Analytics

Set `NEXT_PUBLIC_GA_ID` (GA4) and/or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Scripts load only when set. Tracked events: `cta_click`, `contact_submit`, `newsletter_submit`, `chat_open`, `chat_message`, `chat_lead`, `whatsapp_click`.

---

## Deploying to Netlify

1. Push the repo to GitHub/GitLab and click **Add new site → Import an existing project** in Netlify.
2. Build settings are read from `netlify.toml` (`npm run build`, Node 22). Netlify's Next.js runtime is applied automatically and turns `/api/*` routes into functions with streaming support.
3. In **Site configuration → Environment variables**, add everything from `.env.example`. At minimum, set `GEMINI_API_KEY`, `NEXT_PUBLIC_SITE_URL` and one lead destination.
4. Deploy. Then test the chatbot and contact form on the live URL.

**Vercel** works out of the box too: import the repo and add the same environment variables.

---

## Quality checklist (verified)

- `npm run build`, `lint` and `typecheck` pass with zero warnings
- No horizontal scroll at 360 / 768 / 1024 / 1440 px on every page
- Per-page metadata, canonical URLs, OG/Twitter cards, a generated OG image, `sitemap.xml` and `robots.txt`
- JSON-LD: Organization, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting
- Semantic landmarks, skip link, visible focus rings, labelled fields with inline errors, and `prefers-reduced-motion` respected
- Chat panel: focus trap, Esc to close, live-region announcements of completed replies

Run Lighthouse on the deployed URL to confirm scores. Real images and logos should go through `next/image`.

---

## Placeholders to replace before launch

Search the codebase for `[` to find them all. The main ones:

| Where                              | What                                                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `content/site.ts`                  | Legal name, city/country, address, email, phone, hours/timezone, LinkedIn, GitHub, founded year, booking URL, map embed |
| `content/chatbot-system-prompt.md` | City/country, email, phone (keep in sync with `site.ts`)                                                                |
| `content/home.ts` → `clientLogos`  | Real client logos (files in `/public/logos`) you have permission to use                                                 |
| `content/home.ts` → `stats`        | Real, verifiable numbers                                                                                                |
| `content/work.ts`                  | Client names, result metrics, years, case-study body text, screenshots                                                  |
| `content/testimonials.ts`          | Real quotes with names, roles, companies, photos (with permission)                                                      |
| `content/team.ts`                  | Founding story, team names/bios/photos, open roles                                                                      |
| `app/privacy`, `app/terms`         | Dates, processors, retention periods, governing law. Get a legal review                                                 |
| `.env`                             | API key, site URL, lead destination, WhatsApp number, analytics IDs                                                     |
