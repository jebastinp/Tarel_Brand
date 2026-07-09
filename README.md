# Tarel — Premium Seafood & Meat Website

A polished, **mobile-first**, fully responsive marketing website for **Tarel**,
a UK-based seafood and meat business delivering fresh across Scotland every week.

Slogan: **Ethical · Pure · Fresh** — Tagline: **Farm to Fork**

Colours are taken from your logo and are unchanged:
Deep Forest Green `#2E4237` · Natural Leaf Green `#708E52` ·
Warm Cream `#EAE2D7` · Soft Gold `#C9A24B`.
Typography: Fraunces (display) + Manrope (body).

---

## Run it

```bash
./run
```

Open **http://localhost:8080**. Use another port with `./run 3000`.
Stop with `Ctrl+C`. No build step — you can also open `index.html` directly.

> Tip: view it in a normal browser (Chrome, Safari, Firefox, Edge). The site
> uses modern CSS (backdrop blur, gradients over images, CSS grid) that older
> preview tools can't render but every current browser handles perfectly.

---

## What's in this premium build

**Scroll rhythm** — sections alternate cream / white / dark green / photo /
crushed-ice backgrounds, with curved wave dividers and subtle grain texture.

**Hero** — soft animated background blobs, floating quality badges (Cold Chain,
Fresh Weekly, Trusted Farms), trust avatars and a rotating quality seal.

**This Week's Fresh Catch** — crushed-ice background, premium product cards with
Fresh / Limited badges, cut options (Whole / Steak / Fillet / Cleaned),
availability and a per-product WhatsApp **Order** button. Swipeable on mobile.

**Delivery Coverage** — a postcode checker (try `EH11`, `G1`, `AB10`, `DD1`,
`IV1`, `TD1`, `DG1`) plus an interactive Scotland map; tap a region for its
delivery day, cities, minimum order and fee.

**Countdown** — live timers for "pre-order closes" (Friday cut-off) and "next
delivery" (Wednesday).

**Also** — editorial category cards, upgraded numbered process timeline, premium
Why-Choose cards, gold trust badges, kitchen-backed business section, a recipe
carousel, a strong image-backed Become-a-Vendor CTA, glass order/vendor forms,
Google-style verified review carousel, animated statistics, an Instagram-style
gallery with lightbox, newsletter + certification badges in the footer.

**Conversion & mobile**
- Sticky CTA — a floating pill on desktop, a bottom bar on mobile (appears after
  you scroll past the hero, hides at the footer).
- Mobile bottom navigation (Home / Products / WhatsApp / Business / Contact).
- Carousels for products, recipes and reviews on phones; grids on desktop.
- Footer collapses into accordions on mobile.

**Order & Vendor forms** — real input fields; fill them in and tap to send the
completed message to WhatsApp (**+44 7553 132674**). The vendor form can also
send by email. Business & vendor enquiries: **sales@tarel.co.uk**.

**Delivery schedule** — pre-order by **Friday**, delivered every **Wednesday**.

**Reviews** — four named customers: Jackuline, Jerome, Josh, Jebastin.

**Stats** — 500+ customers · 70+ weekly orders · 10+ trusted suppliers · 99%.

**Under the hood** — semantic HTML, JSON-LD, OpenGraph & Twitter cards, ARIA
labels, visible focus states, `prefers-reduced-motion` support, lazy-loaded
images, and count-up / reveal animations.

---

## Change contact details
- WhatsApp: edit `WHATSAPP_NUMBER` at the top of `script.js` and the `tel:`
  links in `index.html`.
- Email: edit `SALES_EMAIL` in `script.js` and the `mailto:` links in `index.html`.

## Adjust the Fresh Catch / product cards
Product data lives in the `catchItems` and `meatItems` arrays near the top of
`script.js` (`{ name, img, opts, fresh, limited, avail }`). Images are in
`assets/products/`.

## Edit delivery regions / postcode areas
See the `regions` object in `script.js` — each region lists its delivery day,
cities, minimum order, fee and postcode prefixes.

## A note on photography
All imagery is from the photos you provided plus a few subtle generated textures
(grain, marble, ocean). To reach a full "editorial photography" look later, drop
higher-resolution lifestyle photos into `assets/` and swap the filenames in
`index.html` / `script.js` — the layouts are already built for them.

## Deploy
Static site — drop the folder on Netlify, Vercel, Cloudflare Pages, GitHub Pages
or any host. No server required.

## Files
```
tarel/
├── run              # one-command launcher
├── index.html       # the site
├── styles.css       # mobile-first premium styles (logo palette)
├── script.js        # menu, reveals, count-up, carousels, postcode checker,
│                     # map, countdowns, gallery/lightbox, forms→WhatsApp
├── assets/          # logo, photos, product images, avatars, map, textures
└── *.bak            # backups of the previous version
```
