const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const styleMatch = html.match(/<style>\n?([\s\S]*?)\n?<\/style>/);
if (!styleMatch) throw new Error('Inline style block not found');
let css = styleMatch[1];

const fontFaces = [...css.matchAll(/@font-face\{[^}]*\}/g)].map(m => m[0]);
if (!fontFaces.length) throw new Error('No @font-face rules found');
for (const rule of fontFaces) css = css.replace(rule, '');
css = css.replace(/^\n+/, '');

const cssImage = css.match(/url\(['"]?(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+)['"]?\)/);
if (!cssImage) throw new Error('CSS background data URI not found');
const staticAssets = [`const BG=${JSON.stringify(cssImage[1])};`];
css = css.replace(cssImage[0], 'var(--bg-src)');

html = html.replace(styleMatch[0], '<link rel="stylesheet" href="css/fonts.css">\n<link rel="stylesheet" href="css/style.css">');

const scriptMatch = html.match(/<script>\n("use strict";[\s\S]*?)\n<\/script>/);
if (!scriptMatch) throw new Error('Main inline script not found');
let app = scriptMatch[1];
html = html.replace(scriptMatch[0], '__APP_SCRIPT__');

const inlineNames = ['SIDE_SRC', 'ENV_SRC', 'MSG_SRC', 'DOCK_SRC'];
let inlineIndex = 0;
html = html.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g, uri => {
  const name = inlineNames[inlineIndex++];
  if (!name) throw new Error('More inline HTML images than expected');
  staticAssets.push(`const ${name}=${JSON.stringify(uri)};`);
  return `__ASSET_${name}__`;
});
if (inlineIndex !== inlineNames.length) throw new Error(`Expected ${inlineNames.length} inline HTML images, found ${inlineIndex}`);

html = html
  .replace('src="__ASSET_SIDE_SRC__"', 'data-asset="SIDE_SRC" src=""')
  .replace("style=\"--setbg:url('__ASSET_ENV_SRC__')\"", 'data-asset-bg="ENV_SRC"')
  .replace('src="__ASSET_MSG_SRC__"', 'data-asset="MSG_SRC" src=""')
  .replace('src="__ASSET_DOCK_SRC__"', 'data-asset="DOCK_SRC" src=""');
if (html.includes('__ASSET_')) throw new Error('An HTML asset placeholder was not replaced');

function takeConst(source, name) {
  const marker = `const ${name}=`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`${name} declaration not found`);
  let quote = null;
  let escape = false;
  let depth = 0;
  for (let i = start + marker.length; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{' || ch === '[' || ch === '(') depth++;
    else if (ch === '}' || ch === ']' || ch === ')') depth--;
    else if (ch === ';' && depth === 0) {
      return { declaration: source.slice(start, i + 1), start, end: i + 1 };
    }
  }
  throw new Error(`End of ${name} declaration not found`);
}

const jsAssetNames = ['CHARS', 'AVATARS', 'WIN_SRC', 'EB_SRC', 'BOT_SRC', 'TODO_SRC', 'START_SRC', 'MAP_SRC'];
const extracted = jsAssetNames.map(name => ({ name, ...takeConst(app, name) })).sort((a, b) => b.start - a.start);
for (const item of extracted) {
  staticAssets.push(item.declaration);
  app = app.slice(0, item.start) + app.slice(item.end);
}
app = app.replace(/\n{3,}/g, '\n\n');

const assetBootstrap = `
const ASSET_VALUES={BG,SIDE_SRC,ENV_SRC,MSG_SRC,DOCK_SRC};
document.documentElement.style.setProperty('--bg-src', 'url("'+BG+'")');
document.querySelectorAll('[data-asset]').forEach(el=>{ el.src=ASSET_VALUES[el.dataset.asset]||''; });
document.querySelectorAll('[data-asset-bg]').forEach(el=>{ const src=ASSET_VALUES[el.dataset.assetBg]; if(src) el.style.setProperty('--setbg','url("'+src+'")'); });`;

const assets = `"use strict";\n\n${staticAssets.join('\n')}\n${assetBootstrap}\n`;
html = html.replace('__APP_SCRIPT__', '<script src="js/assets.js"></script>\n<script src="js/app.js"></script>');

for (const dir of ['css', 'js']) fs.mkdirSync(path.join(root, dir), { recursive: true });
fs.writeFileSync(path.join(root, 'css/fonts.css'), fontFaces.join('\n') + '\n');
fs.writeFileSync(path.join(root, 'css/style.css'), css.replace(/\n{3,}/g, '\n\n').trim() + '\n');
fs.writeFileSync(path.join(root, 'js/assets.js'), assets);
fs.writeFileSync(path.join(root, 'js/app.js'), app.trim() + '\n');
fs.writeFileSync(indexPath, html);

console.log(JSON.stringify({
  fontFaces: fontFaces.length,
  jsAssets: jsAssetNames,
  files: Object.fromEntries(['index.html','css/fonts.css','css/style.css','js/assets.js','js/app.js'].map(file => [file, fs.statSync(path.join(root,file)).size]))
}, null, 2));
