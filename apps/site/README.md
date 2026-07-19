# frontendienst

Portfolio site for frontendienst — Astro + TypeScript, no framework runtime,
static output.

## Commands

| Command          | Action                                      |
| :--------------- | :------------------------------------------ |
| `bun install`     | Install dependencies                        |
| `bun run dev`     | Start the dev server at `localhost:4321`    |
| `bun run build`   | Build the production site to `./dist/`      |
| `bun run preview` | Preview the production build locally        |

## Where to edit things

- **Business details** (your name, email, tagline, location, social links) —
  `src/site.config.ts`. Everything there is marked with a `TODO` comment.
- **Project copy & tech stack tags** — `src/data/projects.ts`.
- **Placeholder media** — every project ships a generated SVG placeholder
  (and SpinTop ships a placeholder MP4) so the layout is real from day one.
  Replace them with actual recordings:
  1. Record/export a screenshot, GIF, or short screen capture from the app.
  2. Drop the file into `public/images/projects/<project>/` (images) or
     `public/video/` (video).
  3. Update the matching `media.image` / `media.video` path in
     `src/data/projects.ts` to point at the new file.
  A project card renders a `<video>` automatically if `media.video` is set,
  otherwise it falls back to `media.image`.
- **Sections/layout** — each section of the page is its own component under
  `src/components/` (`Hero`, `Services`, `Projects`, `About`, `Contact`,
  `Footer`), assembled in `src/pages/index.astro`.
- **Colors/fonts/spacing** — CSS custom properties in `src/styles/global.css`.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push
to `main` using GitHub's official Pages actions.

1. Push this repo to GitHub.
2. In the repo's **Settings → Pages**, set **Source** to "GitHub Actions".
3. Push to `main` (or run the workflow manually) — the site publishes to
   `https://<your-username>.github.io/<repo-name>/`.

`astro.config.mjs` reads `GITHUB_REPOSITORY` (which GitHub Actions sets
automatically) to compute the `site`/`base` config, so no username or repo
name needs to be hardcoded. The one exception: if this repo IS your user/org
page (named exactly `<your-username>.github.io`), it's served from the domain
root — the config already detects that case and uses `base: "/"`.

If you'd rather use a custom domain, add a `public/CNAME` file with your
domain in it and point its DNS at GitHub Pages — `base` should then be `"/"`
too (edit `astro.config.mjs` to hardcode `base: "/"` in that case, since the
repo name no longer matters).
