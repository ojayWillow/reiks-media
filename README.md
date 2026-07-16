# REIKS — Official Website

Multi-page website for **REIKS** (Arvis Šķirus) — Latvian rapper, songwriter, producer and media expert from Rīga, Ziepniekkalns.

**Live:** [reiks.lv](https://reiks.lv)

## Pages

| Route | File | Content |
|-------|------|---------|
| `/` | `index.html` | Hero, about teaser, capabilities preview, featured tracks, metrics, CTA |
| `/about` | `about.html` | Full bio, photo slideshow, career timeline, gallery |
| `/music` | `music.html` | Featured tracks (embed-ready), achievements, discography |
| `/services` | `services.html` | 6 services, process, packages, contact form |

## Stack

Vanilla HTML/CSS/JS — no build step, no dependencies. Deployed on Vercel (`vercel.json` handles clean URLs, security headers, asset caching).

## Local development

Any static server works, e.g.:

```bash
python -m http.server 8080
```

Note: internal links use clean URLs (`/about`), which plain static servers don't resolve — append `.html` locally or use `vercel dev`.

## TODO before/after launch

- [ ] Replace SVG placeholders in `assets/images/` with real photos (slides 4:5, gallery 1:1, hero landscape)
- [ ] Paste real YouTube/Spotify embeds in `music.html` and `index.html` (see HTML comments)
- [ ] Add real YouTube/Spotify profile URLs in `services.html` socials
- [ ] Wire contact form to Formspree or a backend (see `script.js` §7)
- [ ] Add an `og-image` (1200×630 PNG) and reference it in each page's OG tags
