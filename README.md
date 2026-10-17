# Macbeth Story Adventure 🏰

A bilingual (English + Arabic), interactive, scene-by-scene literary storytelling website for
William Shakespeare's *Macbeth* — styled as a dark medieval castle adventure for university students and literature learners.

- **5 Acts · 28 Scenes** following the complete structure of Shakespeare's tragedy
  (Act I: 7 scenes · Act II: 4 · Act III: 6 · Act IV: 3 · Act V: 8)
- **117 narrative segments** in polished, contemporary English narration, each paired with a literary Modern Standard Arabic (الفصحى المعاصرة) translation written from scratch
- Dark-castle visual theme: near-black stone, antique gold, deep burgundy, parchment reading panels
- Reading modes: **Both / English only / العربية only** (switching never loses your place)
- Progress tracking with `localStorage` — completed scenes, current position, language preference
- Scene unlocking follows the play's actual order; completing an act unseals the next
- Keyboard navigation (`←` / `→`) between parts
- Fully responsive (phones, tablets, desktop), RTL-aware Arabic typography (self-hosted Amiri font)
- No build step, no server, no external dependencies — plain HTML, CSS, and JavaScript

---

## Deploy to GitHub Pages (no build required)

1. **Create a GitHub repository** (for example `macbeth-story-adventure`).
2. **Upload the project files** — everything inside this folder (`index.html`,
   `assets/`, `README.md`, `LICENSE`, `.nojekyll`). You can drag & drop them on the
   repository's *upload files* page, or use git:
   ```bash
   git init
   git add .
   git commit -m "Macbeth Story Adventure — Professionally Revised"
   git branch -M main
   git remote add origin https://github.com/USERNAME/macbeth-story-adventure.git
   git push -u origin main
   ```
3. Open the repository's **Settings**.
4. In the sidebar, navigate to **Pages**.
5. Under *Build and deployment*, set **Source** to **Deploy from a branch**.
6. Select the **main** branch and the **/(root)** folder, then **Save**.
7. Wait about a minute, then open the published URL:
   `https://USERNAME.github.io/macbeth-story-adventure/`

All asset paths are **relative** (`assets/...`), so the site works both at the root of a
domain and from a repository subpath such as `https://USERNAME.github.io/REPOSITORY/`.
The included `.nojekyll` file tells GitHub Pages to serve files as-is.

## Run locally

Just open `index.html` in any modern browser — everything is self-contained
(fonts and images are bundled in `assets/`). Alternatively serve it with any static
server, e.g. `python3 -m http.server`.

## Project structure

```
macbeth-story-adventure/
├── index.html                 # single-page app shell (semantic HTML)
├── assets/
│   ├── css/
│   │   └── style.css          # dark-castle theme, parchment panels, responsive, RTL
│   ├── js/
│   │   ├── app.js             # view rendering + event wiring
│   │   ├── navigation.js      # view state machine, breadcrumb, progress chrome
│   │   ├── progress.js        # localStorage progress with safe fallback
│   │   ├── story.js           # act aggregation + unlock rules
│   │   └── data/
│   │       ├── act1.js … act5.js   # professionally revised bilingual story data
│   ├── images/                # atmospheric artwork (hero + 5 act banners + favicon)
│   └── fonts/                 # self-hosted Cinzel, EB Garamond, Amiri (woff2)
├── README.md
├── LICENSE
└── .nojekyll
```

## Story content

The narrative content follows the 5-act, 28-scene structure and dramatic progression of
William Shakespeare's *Macbeth*, verified against the *No Fear Shakespeare — Macbeth*
reference edition. All English narration and Arabic literary translations are original
educational retellings crafted specifically for this interactive experience.

Each scene contains:

- a location label (EN + AR),
- a spoiler-conscious preview (EN + AR),
- 2–6 narrative segments (each: polished contemporary English narration + idiomatic Modern Standard Arabic translation),
- a faithful scene recap shown on completion (EN + AR).

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on Android, iOS,
and desktop. Progress is stored per-browser via `localStorage`; if storage is
unavailable (private mode), the site still works seamlessly for the session.

## License

Code and design: MIT (see `LICENSE`). Story narration and Arabic translations are
original educational content based on Shakespeare's public-domain play.
