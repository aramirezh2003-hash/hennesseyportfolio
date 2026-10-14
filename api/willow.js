// Optional live answers for Willow. Deploys as a Vercel serverless function.
// Needs the environment variable ANTHROPIC_API_KEY set in the Vercel project.
// Without it (or on static hosting), the site falls back to Willow's local answers.
const fs = require('fs');
const path = require('path');

const MODEL = 'claude-haiku-5-5';

function loadKnowledge() {
  const file = path.join(__dirname, '..', 'portfolio-src', 'willow-knowledge.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function buildSystemPrompt(kb) {
  const facts = kb.entries.map(e => `- ${e.answer}`).join('\n');
  return [
    kb.persona,
    'Answer in two or three short sentences unless the visitor asks for detail.',
    'Use only these facts:',
    facts,
  ].join('\n\n');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'Live answers are not configured' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const message = String((body && body.message) || '').slice(0, 300).trim();
  if (!message) {
    res.status(400).json({ error: 'Empty message' });
    return;
  }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system: buildSystemPrompt(loadKnowledge()),
        messages: [{ role: 'user', content: message }],
      }),
    });
    if (!r.ok) { res.status(502).json({ error: 'Upstream error' }); return; }
    const data = await r.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    res.status(200).json({ answer: text || null });
  } catch (e) {
    res.status(502).json({ error: 'Request failed' });
  }
};
