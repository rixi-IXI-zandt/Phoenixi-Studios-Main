import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';
const project = path.dirname(fileURLToPath(import.meta.url));
const production = process.argv.includes('--production');
const root = production ? path.join(project, 'dist') : project;
const base = production ? (process.env.BASE_PATH || '/').replace(/\/$/, '') + '/' : '/';
const pages = new Set(['/', '/index', '/index.html', '/about', '/about.html', '/worlds', '/worlds.html', '/contact', '/contact.html']);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.svg':'image/svg+xml', '.otf':'font/otf', '.ttf':'font/ttf' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end(); return; }
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end('Not found'); return; }
  pathname = '/' + pathname.slice(base.length);
  const originalPath = pathname;
  if (!production && pathname !== '/') pathname = pathname.replace(/\/+$/, '').replace(/\/index\.html$/, '');
  const isPage = pages.has(pathname);
  if (!production && !isPage && !/^\/(css|js|assets)\/[a-zA-Z0-9_./-]+$/.test(pathname)) { res.writeHead(404); res.end('Not found'); return; }
  let filename = path.resolve(root, !production && isPage ? 'index.html' : `.${pathname}`);
  const relative = path.relative(root, filename);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(segment => segment.startsWith('.'))) { res.writeHead(404); res.end('Not found'); return; }
  try {
    if (production && (await stat(filename)).isDirectory()) {
      if (!originalPath.endsWith('/')) { res.writeHead(301, {Location:base + originalPath.slice(1) + '/' + new URL(req.url, 'http://localhost').search}); res.end(); return; }
      filename = path.join(filename, 'index.html');
    }
    const body = await readFile(filename); res.writeHead(200, {'Content-Type':types[path.extname(filename)] || 'application/octet-stream','Content-Length':body.length,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'}); res.end(req.method === 'HEAD' ? undefined : body);
  }
  catch { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); res.end(req.method === 'HEAD' ? undefined : production ? await readFile(path.join(root, '404.html')).catch(()=>'Not found') : 'Not found'); }
});
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => console.log(`IXI studio: http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`));
