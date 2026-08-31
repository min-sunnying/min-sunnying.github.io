# min-sunnying.github.io

Personal academic site of **Minsun Kim** — research and design at the intersection of
human-centered AI, AI in education, and interactive systems.

**Live at [www.minsun.kim](https://www.minsun.kim/)**

---

## Built with

- [Jekyll](https://jekyllrb.com/) 4.3 with the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme (4.26)
- Ruby 3.2
- Deployed by GitHub Actions — `.github/workflows/jekyll.yml` builds and publishes to
  GitHub Pages on every push to `master`

## Run locally

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. Use `--livereload` to refresh on save, or
`--drafts` to include unpublished posts.

## Project structure

```
index.html              Landing page — hand-built Liquid, not a stock theme layout
_pages/                 Top-level pages, each with its own permalink
  publications.md         /publication/   grouped by year
  projects.md             /projects/      grouped by year
  news.md                 /news/          grouped by year
_posts/                 All entries; the `categories` field decides where they appear
_includes/about.md      The bio, pulled into index.html
_layouts/               Theme layouts plus a custom `collection` layout
_data/navigation.yml    Main nav links
assets/css/main.scss    ALL custom styling lives in this one file
assets/images/          Images and post thumbnails
assets/PDF/             PDFs linked from posts
admin/ + .pages.yml     PagesCMS browser-based editor
_config.yml             Site config, collections, and defaults
```

## Adding a post

Create a file in `_posts/` named `YYYY-MM-DD-short-title.md`.

**The `categories` value is what routes the post** — it determines which page the entry
shows up on. Use `Publication`, `Projects`, or `News`. A post may carry more than one.

Minimal post (News):

```yaml
---
layout: posts
title: "Accepted! LAK Poster"
date: 2026-01-20
categories:
  - News
---

Body text here.
```

Publications support extra fields, all optional, used by the year-grouped list on
`/publication/`:

```yaml
---
layout: posts
title: "Designing Prompt Analytics Dashboards..."
date: 2024-05-30
categories:
  - Publication
authors: "Minsun Kim, SeonGyeom Kim, ..."   # "Minsun Kim" is auto-bolded in the list
journal: "arXiv preprint"                   # venue line
abstract_short: "One-sentence summary..."   # falls back to the excerpt if omitted
thumbnail: "/assets/images/masterposter.jpg" # falls back to a letter placeholder
external_link: "https://arxiv.org/pdf/..."  # renders a "Full text" link
---
```

Projects use `role` and `organization` in place of `authors` and `journal`.

## Editing without a terminal

The site is wired for [PagesCMS](https://pagescms.org/) — `.pages.yml` defines the
content schema and `admin/index.html` is the entry point. Changes made there commit
straight to `master`, which triggers a deploy.

## Styling

All custom CSS is in **`assets/css/main.scss`**, which imports the Minimal Mistakes
theme and then overrides it. The design system is a set of CSS custom properties in the
`:root` block at the top — colors, spacing, border radius, and shadows. Adjust those
tokens to retune the look globally rather than editing individual rules.
