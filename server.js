const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT) || 3000;
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const decodedPath = decodeURIComponent(urlPath);
  const basePath = path.resolve(root, `.${decodedPath}`);

  if (!basePath.startsWith(path.resolve(root))) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const candidates = [basePath];
  if (!path.extname(basePath)) {
    candidates.push(`${basePath}.html`);
    candidates.push(path.join(basePath, 'index.html'));
  }

  const serveCandidate = (index = 0) => {
    if (index >= candidates.length) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const targetPath = candidates[index];
    if (!targetPath.startsWith(path.resolve(root))) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    fs.stat(targetPath, (err, stat) => {
      if (err || !stat.isFile()) {
        serveCandidate(index + 1);
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      fs.createReadStream(targetPath).pipe(res);
    });
  };

  serveCandidate();
});

server.listen(port, host, () => {
  console.log(`Server running on http://localhost:${port}`);
});
