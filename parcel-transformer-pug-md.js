const {Transformer} = require('@parcel/plugin');
const pug = require('pug');
const path = require('path');
const MarkdownIt = require('markdown-it');
const mdAttrs = require('markdown-it-attrs');
const mdAnchor = require('markdown-it-anchor');
const mdFootnote = require('markdown-it-footnote');
const mdDeflist = require('markdown-it-deflist');

const md = new MarkdownIt({ html: true })
  .use(mdAttrs)
  .use(mdFootnote)
  .use(mdDeflist)
  .use(mdAnchor, { permalink: false });

module.exports = new Transformer({
  async transform({asset}) {
    const code = await asset.getCode();
    const filePath = asset.filePath;
    const basedir = path.resolve(process.cwd(), 'src');

    const html = pug.render(code, {
      filename: filePath,
      basedir,
      pretty: false,
      filters: {
        'markdown-it': (text) => md.render(String(text))
      }
    });

    asset.type = 'html';
    asset.setCode(html);
    return [asset];
  }
});
