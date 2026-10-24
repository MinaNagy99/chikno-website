# Chikno – concept website

A 10-page, bilingual (Arabic/English), dark/light restaurant site for Chikno (تشيكنو), Faisal – El Matbaa, Giza.
Built as a pitch demo; not the restaurant's official site.

## Open it
**Easiest:** open `dist/chikno-full.html` – the whole site (all 10 pages, navigation, cart) in one file. It works anywhere, even on its own.

Or open `dist/index.html` – the separate pages link to each other, so keep all files in the same folder.
No internet needed: the dish photos, fonts and animation libraries are all built into the files.

| File | Page |
| --- | --- |
| index.html | Home |
| menu.html | Full menu – 190 dishes, search, filters |
| offers.html | Deal of the day, boxes, family kilos, kids |
| order.html | Cart and checkout (sends the order to WhatsApp) |
| catering.html | Party orders and quote form |
| about.html | Story, what we cook, numbers |
| reviews.html | Ratings and real review excerpts |
| gallery.html | 143 dish photos with a lightbox |
| contact.html | Numbers, map, hours dial, FAQ |
| 404.html | Not-found page |

Useful links (separate pages): `menu.html#cat-pizza` opens a category, `menu.html#dish-g1` opens a dish, `contact.html#faq` jumps to the FAQ.
In the single file the same links look like `chikno-full.html#/menu.html#cat-pizza`.

## Edit
- Menu, prices and photos: `src/data.js`
- Shared look and behaviour: `src/core.css`, `src/core.js`, `src/partials/`
- Each page: `src/pages/*.html`
- Rebuild after changes: `python3 build.py` (writes `dist/`)

## To confirm with the owner before going live
- Logo and brand colours (the site currently uses the name as text)
- WhatsApp number (currently the hotline 01222440044)
- Current prices, pizza prices and sizes
- Delivery areas, delivery fee, payment methods, any dine-in charge
- Opening year / story details
- Real photos of Chikno's own food (the demo uses illustrative food photos – see Credits) and permission to use the review quotes

## Tech
Static HTML/CSS/JS, fully offline. GSAP 3.15 + ScrollTrigger and Lenis 1.1.13 are bundled in `assets/`;
fonts (Lalezar, IBM Plex Sans Arabic, Big Shoulders Display – SIL Open Font Licence) are embedded in `assets/fonts.css`;
dish photos are embedded in `assets/img.js`. The single file `chikno-full.html` contains all of it.
Works without the animation libraries and respects "reduce motion".

To swap in the restaurant's own photos: replace the matching entry in `assets_src/img.js`
(keys are the photo ids used in `src/data.js`), then run `python3 build.py`.

## Credits
Dish photos: illustrative images from the "food-images" collection (github.com/peacenharmony/food-images),
released under Creative Commons BY-SA 3.0; cropped, resized and colour-adjusted for this demo.
They are not photos of Chikno's food. Source file for each photo: `assets_src/img-sources.json`.
