import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const port = Number(process.env['BRAIDER_PORT'] ?? 4420);
const root = resolve('../frontend/dist/braider/browser');
const types = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', `http://localhost:${port}`).pathname;
  if (pathname === '/__e2e/health') {
    response.writeHead(200).end('ready');
    return;
  }
  if (!pathname.startsWith('/manage/')) {
    response.writeHead(404).end();
    return;
  }
  const relative = pathname.slice('/manage/'.length);
  const file = resolve(root, relative || 'index.html');
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(file);
    response
      .writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
      .end(body);
  } catch {
    if (extname(relative)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const body = await readFile(resolve(root, 'index.html'));
      response.writeHead(200, { 'content-type': types['.html'] }).end(body);
    } catch {
      response.writeHead(503).end('Braider build unavailable');
    }
  }
}).listen(port);
