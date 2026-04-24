#!/usr/bin/env node
// Generates all pug files from src/characters/ directory structure.
// Each character dir should contain only markdown files named by entry id (e.g. 1.md).
// Run before parcel (via predev/prebuild hooks).
//
// All output goes to src/.generated/ — add that to .gitignore.
//
// src/.generated/
//   characters.pug
//   character-entries-includes.pug
//   characters/{name}/
//     {name}.pug                    -- entry point
//     entries.pug                   -- entries[] array
//     entry-markdown-includes.pug   -- static if/include blocks
//     {id}.md                       -- frontmatter-stripped markdown

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const charsDir = path.join(srcDir, 'characters');
const genBase = path.join(srcDir, '.generated');

const charDirs = fs.readdirSync(charsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const characters = charDirs.map(d => d.charAt(0).toUpperCase() + d.slice(1));

fs.mkdirSync(genBase, { recursive: true });

// 1. .generated/characters.pug
fs.writeFileSync(
  path.join(genBase, 'characters.pug'),
  `-\n  var characters = [${characters.map(c => `'${c}'`).join(', ')}]\n`,
  'utf8'
);

// 2. .generated/character-entries-includes.pug
// Included from index.pug (src/), so paths are relative to src/.generated/
const charIncludeBlocks = characters.map(c =>
  `if character === '${c}'\n  include ./characters/${c.toLowerCase()}/entries.pug`
).join('\nelse ');

fs.writeFileSync(
  path.join(genBase, 'character-entries-includes.pug'),
  charIncludeBlocks + '\n',
  'utf8'
);

// 3. Per-character generated files
for (const dir of charDirs) {
  const name = dir.charAt(0).toUpperCase() + dir.slice(1);
  const charDir = path.join(charsDir, dir);
  const genDir = path.join(genBase, 'characters', dir);

  // Collect markdown files directly in the character dir
  const mdFiles = fs.readdirSync(charDir)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => parseInt(a) - parseInt(b));

  const ids = mdFiles.map(f => path.basename(f, '.md'));

  fs.mkdirSync(genDir, { recursive: true });

  // Strip frontmatter and write clean markdown copies
  for (const id of ids) {
    const raw = fs.readFileSync(path.join(charDir, `${id}.md`), 'utf8');
    const stripped = raw.replace(/^---[\s\S]*?---\s*\n?/, '');
    fs.writeFileSync(path.join(genDir, `${id}.md`), stripped, 'utf8');
  }

  // entries.pug
  const entriesArray = ids.map(id => `    { title: '${titleFromFilename(dir, id)}', id: '${id}' }`).join(',\n');
  fs.writeFileSync(
    path.join(genDir, 'entries.pug'),
    `-\n  var entries = [\n${entriesArray}\n  ]\n`,
    'utf8'
  );

  // entry-markdown-includes.pug
  const mdBlocks = ids.map(id =>
    `if entry.id === '${id}'\n  .entry\n    include:marked ${id}.md`
  ).join('\nelse ');

  fs.writeFileSync(
    path.join(genDir, 'entry-markdown-includes.pug'),
    mdBlocks + '\n',
    'utf8'
  );

  // {name}.pug entry point — lives at src/characters/{name}.pug so Parcel outputs dist/characters/{name}.html
  // Supporting files remain in .generated/; paths are relative to src/characters/
  fs.writeFileSync(
    path.join(charsDir, `${dir}.pug`),
    `extends ../templates/character.pug\nblock vars\n  - var title = '${name}'\n  - var basePath = '../'\nblock content\n  include ../.generated/characters/${dir}/entries.pug\n  each entry in entries\n    h2(id=entry.id)= entry.title\n    include ../.generated/characters/${dir}/entry-markdown-includes.pug\n`,
    'utf8'
  );

  console.log(`Generated files for ${name}: entries [${ids.join(', ')}]`);
}

console.log(`Done. Characters: ${characters.join(', ')}`);

// Derive a human-readable title from the markdown file.
// Reads YAML frontmatter `title:` first, then first `#` heading, then falls back to `Entry {id}`.
function titleFromFilename(charDir, id) {
  const mdPath = path.join(charsDir, charDir, `${id}.md`);
  const content = fs.readFileSync(mdPath, 'utf8');

  // YAML frontmatter: ---\ntitle: My Title\n---
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleLine = frontmatterMatch[1].match(/^title:\s*(.+)$/m);
    if (titleLine) return titleLine[1].trim().replace(/^['"]|['"]$/g, '');
  }

  // First # heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  return `Entry ${id}`;
}

