# Speedgate Logistics

Marketing website for **Speedgate Logistics** — car import services to Kenya.

## Run locally

Open `index.html` in a browser, or use a static server:

```bash
npx serve .
```

## Supabase (forms)

1. Run `supabase_schema.sql` in your Supabase SQL editor.
2. Set your anon key in `js/supabase-config.js`.
3. Contact form saves to `public.inquiries`; hero search logs to `public.hero_searches`.

## Edit content / layout

- **Styles:** `css/speedgate.css`
- **Page HTML:** `build_fragment.html` → run `node build.js` → regenerates `index.html`
- **Scripts:** `js/site.js`, `js/supabase-db.js`

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the repo at [vercel.com](https://vercel.com) — framework preset **Other**, output directory **`.`** (root).
3. Deploy. No build command required.

## Brand contact (from design)

- Phone: +254 789 071 061
- Email: info@speedgatelogistics.co.ke
- WhatsApp: [wa.me/254789071061](https://wa.me/254789071061)
