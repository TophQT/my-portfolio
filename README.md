# Developer Portfolio

A dark-first, responsive portfolio for **Christopher Cariaga** built with plain HTML, CSS, and JavaScript. No build step, no dependencies (only Google Fonts).

## Run it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | All page content and section structure |
| `style.css` | Design tokens (top of file) and every component style |
| `script.js` | Theme toggle, mobile menu, scroll reveal, active nav, image fallbacks |
| `assets/images/` | Screenshots, portrait and `resume.pdf` |

## Customize

- **Colours and fonts:** edit the custom properties in `:root` at the top of `style.css`. The light palette lives in `:root[data-theme="light"]`.
- **Name, title and SEO:** `index.html` `<title>`, `<meta name="description">`, the Open Graph tags, the header brand, the hero heading, and the footer.
- **About, experience, education, certifications:** the `#about` and `#experience` sections in `index.html`.
- **Skills:** edit the tag lists inside each `.skill-card` in `#skills`. Group them however you like — the grid reflows automatically.
- **Contact details:** the `.contact-card` links, `.socials` list and footer in `index.html`.

## Add a project

Copy an `<article class="project" data-project>` block inside `.project-grid` in `#projects`, then update:

- the `<img src>`, `alt`, `width`, `height` and `data-fallback` (the `data-fallback` text is shown if the image is missing);
- `.project-role`, `<h3>`, `.project-desc` and the `.project-points` list;
- the `mailto:` subject on the `data-project-ask` link.

### Live and repository links

The "View Project" and "Source Code" buttons stay hidden until you give them a real URL. Set one and it is revealed automatically (plus `target="_blank" rel="noopener noreferrer"`):

```html
<a class="btn btn-sm btn-primary" data-project-live href="https://example.com" hidden>View Project</a>
<a class="btn btn-sm btn-outline" data-project-repo href="https://github.com/TophQT/repo" hidden>Source Code</a>
```

A project with no live or repo URL keeps its "Request a walkthrough" link instead, so nothing ever points at a dead page.

## Resume

The Download Resume buttons point at `assets/images/resume.pdf`. Replace that file (keeping the filename), or update the `href` on each of the three buttons.

## Contact

There is no backend and nothing is stored on the site. The contact section lists email (`mailto:`), phone (`tel:`) and location, plus the social links, so every visitor path leads straight to an app they already have.

## Publish

- **GitHub Pages:** push the folder to a repo, then Settings → Pages → deploy from the branch root.
- **Netlify / Vercel / Cloudflare Pages:** drag and drop the folder, or connect the repo. No build command is needed.

## Features

Dark and light themes (saved in localStorage, follows the system preference by default and applied before first paint), responsive mobile menu, active nav highlighting, reveal-on-scroll animations, per-card pointer glow, graceful image fallbacks, skip link, and visible focus styles. All motion is disabled for `prefers-reduced-motion` users.
