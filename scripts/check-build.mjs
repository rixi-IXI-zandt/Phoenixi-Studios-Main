import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const build = base => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('build.mjs', root))], {env:{...process.env, BASE_PATH:base}, encoding:'utf8'});
  assert.equal(result.status, 0, result.stderr);
};
try {
  for (const base of ['/', '/studio/', '/ixi/studio/']) {
    build(base);
    for (const page of ['index.html','about.html','worlds.html','contact.html','about/index.html','worlds/index.html','contact/index.html','404.html']) {
      const html = await readFile(new URL(page, output), 'utf8');
      for (const [,url] of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g)) {
        assert.ok(url.startsWith(base), `${page}: outside base: ${url}`);
        const relative = url.slice(base.length);
        const file = new URL(relative === '' ? 'index.html' : /\.[a-z]+$/i.test(relative) ? relative : relative.replace(/\/$/,'')+'/index.html', output);
        assert.ok((await stat(file)).isFile(), `${page}: missing ${url}`);
      }
    }
    const css = await readFile(new URL('css/global.css',output),'utf8');
    assert.ok(css.includes(`url('${base}assets/IronickNF.otf')`));
    assert.deepEqual((await readdir(new URL('assets/',output))).sort(), ['IXI-Crest.png','IXI_Gem_Iceblue_512x296px.png','IronickNF.otf','rixi-ixi.png'].sort());
    assert.ok((await stat(new URL('.nojekyll',output))).isFile());
    console.log(`PASS: static routes, assets and public file boundary at ${base}`);
  }
} finally { build(process.env.BASE_PATH || '/'); }
