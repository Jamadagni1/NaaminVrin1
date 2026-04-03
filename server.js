'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

// ── Load .env ────────────────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.trim().split('=');
    if (k && v.length && !process.env[k]) process.env[k] = v.join('=').trim();
  });
}

// ── Gemini Config ────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL     = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;

// ── Server Config ────────────────────────────────────────────────────────────
const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT) || 3000;
const ROOT = process.cwd();

// ── MIME Types ───────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; if (data.length > 1e6) reject(new Error('Too large')); });
    req.on('end',  () => { try { resolve(data ? JSON.parse(data) : {}); } catch(e){ reject(e); } });
    req.on('error', reject);
  });
}

function parseNames(text, want) {
  // Aggressively strip ALL markdown code fences (```json, ```, etc.)
  let clean = (text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // Helper: parse JSON string and extract names array
  const extractArr = s => {
    try {
      const p = JSON.parse(s);
      const arr = Array.isArray(p) ? p : (Array.isArray(p.names) ? p.names : null);
      if (!arr) return [];
      return arr
        .map(x => ({ name: String(x.name || '').trim(), meaning: String(x.meaning || '').trim() }))
        .filter(x => x.name.length >= 2)
        .slice(0, want);
    } catch (_) { return []; }
  };

  // 1. Try parsing the cleaned text directly
  let r = extractArr(clean);
  if (r.length) return r;

  // 2. Extract outermost { } or [ ] block and try again
  const objMatch = clean.match(/\{[\s\S]*\}/);
  if (objMatch) { r = extractArr(objMatch[0]); if (r.length) return r; }

  const arrMatch = clean.match(/\[[\s\S]*\]/);
  if (arrMatch) { r = extractArr(arrMatch[0]); if (r.length) return r; }

  // 3. Last resort: regex-scrape every complete name+meaning pair
  //    Works even if JSON is truncated or malformed
  const items = [];
  const pairRx = /"name"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"meaning"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = pairRx.exec(clean)) !== null && items.length < want) {
    const name    = m[1].trim();
    const meaning = m[2].trim();
    if (name.length >= 2) items.push({ name, meaning });
  }
  return items;
}

// ── Name Generator Handler ────────────────────────────────────────────────────
async function nameGenerator(req, res) {
  const body     = await readBody(req);
  const gender   = String(body.gender  || 'Boy').trim();
  const theme    = String(body.theme   || '').trim();
  const count    = Math.min(Math.max(Number(body.count) || 10, 3), 200);
  const language = String(body.language|| 'en').toLowerCase();

  if (!theme) { sendJson(res, 400, { error: 'Theme is required.' }); return; }

  // For large counts, split into multiple lines to ensure complete JSON
  const prompt =
    `You are a JSON-only baby name generator. Respond with NOTHING except a single valid JSON object.\n` +
    `Generate exactly ${count} unique Indian baby names for a ${gender}.\n` +
    `Theme/style: ${theme}.\n` +
    (language === 'hi' ? 'Write meanings in Hindi Devanagari script.\n' : 'Write meanings in concise English.\n') +
    `Output format — ONLY this, no markdown, no code blocks, no explanation:\n` +
    `{"names":[{"name":"Aarav","meaning":"Peaceful"},{"name":"Vihaan","meaning":"Dawn"}]}`;

  // Use higher token budget for large counts
  const maxTokens = count <= 20 ? 2048 : count <= 50 ? 4096 : count <= 100 ? 8192 : 16384;

  const resp = await fetch(GEMINI_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents:           [{ parts: [{ text: prompt }] }],
      generationConfig:   { temperature: 0.85, maxOutputTokens: maxTokens }
    })
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => '');
    sendJson(res, resp.status, { error: 'Gemini request failed.', details: err.slice(0, 400) });
    return;
  }

  const json    = await resp.json();
  const content = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const names   = parseNames(content, count);

  if (!names.length) {
    sendJson(res, 502, { error: 'Could not parse names.', raw: content.slice(0, 300) });
    return;
  }

  sendJson(res, 200, { count: names.length, names });
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204; res.end(); return;
  }

  // API route
  if (req.method === 'POST' && url === '/api/name-generator') {
    try { await nameGenerator(req, res); }
    catch(e) { sendJson(res, 500, { error: e.message || 'Server error' }); }
    return;
  }

  // Static file serving
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405; res.end('Method not allowed'); return;
  }

  const filePath = path.resolve(ROOT, '.' + (url === '/' ? '/index.html' : decodeURIComponent(url)));

  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403; res.end('Forbidden'); return;
  }

  const tryPaths = [filePath, filePath + '.html', path.join(filePath, 'index.html')];

  for (const p of tryPaths) {
    if (!p.startsWith(ROOT)) continue;
    try {
      const stat = fs.statSync(p);
      if (!stat.isFile()) continue;
      res.setHeader('Content-Type', MIME[path.extname(p).toLowerCase()] || 'application/octet-stream');
      fs.createReadStream(p).pipe(res);
      return;
    } catch(_) { continue; }
  }

  res.statusCode = 404; res.end('Not found');
});

server.listen(PORT, HOST, () => {
  console.log(`Naamin server running on http://localhost:${PORT}`);
  console.log(`Gemini model: gemini-2.5-flash`);
});
