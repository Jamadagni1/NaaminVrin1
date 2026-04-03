'use strict';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' +
  GEMINI_API_KEY;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, payload) {
  setCors(res);
  res.status(status).json(payload);
}

function parseNames(text, want) {
  let clean = (text || '').replace(/```json/gi, '').replace(/```/g, '').trim();

  const extractArr = (s) => {
    try {
      const parsed = JSON.parse(s);
      const arr = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.names)
          ? parsed.names
          : null;
      if (!arr) return [];
      return arr
        .map((x) => ({
          name: String(x.name || '').trim(),
          meaning: String(x.meaning || '').trim(),
        }))
        .filter((x) => x.name.length >= 2)
        .slice(0, want);
    } catch (_) {
      return [];
    }
  };

  let names = extractArr(clean);
  if (names.length) return names;

  const objMatch = clean.match(/\{[\s\S]*\}/);
  if (objMatch) {
    names = extractArr(objMatch[0]);
    if (names.length) return names;
  }

  const arrMatch = clean.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    names = extractArr(arrMatch[0]);
    if (names.length) return names;
  }

  const items = [];
  const pairRx = /"name"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"meaning"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = pairRx.exec(clean)) !== null && items.length < want) {
    const name = match[1].trim();
    const meaning = match[2].trim();
    if (name.length >= 2) items.push({ name, meaning });
  }
  return items;
}

function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch (_) {
      return {};
    }
  }
  return {};
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!GEMINI_API_KEY) {
    sendJson(res, 500, { error: 'Missing GEMINI_API_KEY in Vercel environment variables.' });
    return;
  }

  const body = parseRequestBody(req);
  const gender = String(body.gender || 'Boy').trim();
  const theme = String(body.theme || '').trim();
  const count = Math.min(Math.max(Number(body.count) || 10, 3), 200);
  const language = String(body.language || 'en').toLowerCase();

  if (!theme) {
    sendJson(res, 400, { error: 'Theme is required.' });
    return;
  }

  const prompt =
    `You are a JSON-only baby name generator. Respond with NOTHING except a single valid JSON object.\n` +
    `Generate exactly ${count} unique Indian baby names for a ${gender}.\n` +
    `Theme/style: ${theme}.\n` +
    (language === 'hi' ? 'Write meanings in Hindi Devanagari script.\n' : 'Write meanings in concise English.\n') +
    `Output format - ONLY this, no markdown, no code blocks, no explanation:\n` +
    `{"names":[{"name":"Aarav","meaning":"Peaceful"},{"name":"Vihaan","meaning":"Dawn"}]}`;

  const maxTokens = count <= 20 ? 2048 : count <= 50 ? 4096 : count <= 100 ? 8192 : 16384;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: maxTokens },
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => '');
      sendJson(res, response.status, {
        error: 'Gemini request failed.',
        details: details.slice(0, 400),
      });
      return;
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const names = parseNames(content, count);

    if (!names.length) {
      sendJson(res, 502, { error: 'Could not parse names.', raw: content.slice(0, 300) });
      return;
    }

    sendJson(res, 200, { count: names.length, names });
  } catch (err) {
    sendJson(res, 500, { error: err?.message || 'Server error' });
  }
};
