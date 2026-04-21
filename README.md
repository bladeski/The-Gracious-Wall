# The Gracious Wall — Diary

A companion diary to *The Gracious Wall*, a personal creative writing project by Jonathan Blades.

The diary is written from the perspectives of characters within the story, giving an intimate, first-person view into their lives, thoughts, and the world they inhabit.

**Read it online:** [bladeski.github.io/The-Gracious-Wall](https://bladeski.github.io/The-Gracious-Wall/)

---

## Development

This site is built with [Pug](https://pugjs.org/) and bundled with [Parcel](https://parceljs.org/).

### Prerequisites

- Node.js
- Yarn

### Setup

```bash
yarn install
```

### Local development

```bash
yarn dev
```

### Production build

```bash
yarn build
```

### Adding content

Each character has a directory under `src/characters/`. To add a new entry, drop a numbered Markdown file (e.g. `2.md`) into the relevant character's directory. Frontmatter is supported for setting the entry title:

```markdown
---
title: April 18th, Year 90
---

Entry content here...
```

To add a new character, create a new directory under `src/characters/` and add their Markdown files. All Pug files are generated automatically before each build — they live in `src/.generated/` and are excluded from source control.

---

## Copyright

All written content, characters, and story elements are the original work of Jonathan Blades and are protected by copyright.

See the [Copyright Notice](https://bladeski.github.io/The-Gracious-Wall/copyright.pug) for full details.
