import { mkdir, copyFile, readFile, writeFile, rm, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url), output = new URL('./dist/', root);
const requested = process.env.BASE_PATH || '/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]*$/.test(requested)) throw new Error('BASE_PATH must be / or a path such as /studio/');
const base = requested.replace(/\/$/, '') + '/';
// dist is disposable build output, never source or a linked directory.
const target = fileURLToPath(output);
if (path.dirname(target.replace(/[\\/]$/, '')) !== fileURLToPath(root).replace(/[\\/]$/, '')) throw new Error('Unsafe output path');
const existing = await lstat(output).catch(error => { if (error.code !== 'ENOENT') throw error; });
if (existing?.isSymbolicLink()) throw new Error('Refusing to replace a linked dist directory');
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
const localizeHTML = text => text.replace(/\b(href|src)="\/(?!\/)/g, `$1="${base}`);
const shell = localizeHTML(await readFile(new URL('index.html', root), 'utf8'));
for (const dir of ['assets', 'css', 'js']) await mkdir(new URL(`${dir}/`, output));
// Explicit public assets only: no archives, source documents or unused artwork.
for (const file of ['IXI_Gem_Iceblue_512x296px.png', 'IXI-Crest.png', 'rixi-ixi.png', 'IronickNF.otf']) {
  await copyFile(new URL(`assets/${file}`, root), new URL(`assets/${file}`, output));
}
for (const file of ['css/global.css', 'css/experience.css', 'css/transitions.css', 'js/main.js']) {
  let text = await readFile(new URL(file, root), 'utf8');
  if (file.endsWith('.css')) text = text.replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}`);
  await writeFile(new URL(file, output), text);
}
for (const page of ['index', 'about', 'worlds', 'contact']) await writeFile(new URL(`${page}.html`, output), shell);
for (const page of ['about', 'worlds', 'contact']) {
  await mkdir(new URL(`${page}/`, output));
  await writeFile(new URL(`${page}/index.html`, output), shell);
}
await writeFile(new URL('.nojekyll', output), '');
await writeFile(new URL('404.html', output), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found — IXI</title><style>body{background:#090b0e;color:#e2b3ff;font:1.1rem/1.8 system-ui;padding:12vh 8vw}a{color:#6ef0ff}</style><h1>Page not found</h1><p>This address does not lead to a page.</p><a href="${base}">Return to IXI</a></html>`);
console.log(`IXI static build complete. Base path: ${base}`);
