// Generates static HTML for each route so link previews (LinkedIn, Slack, etc.)
// see the right title, description, image and content without running JavaScript.
// Run after editing portfolio-src/index.html:
//   BASE=http://127.0.0.1:8766 CHROMIUM=/path/to/chromium node scripts/prerender.js
// The root index.html stays the client-side template; it already sets its own meta.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = process.env.BASE || 'http://127.0.0.1:8766';
const out = path.join(__dirname, '..', 'portfolio-src');
const routes = ['/work', '/contact', '/hi/smile', '/hi/minerva', '/hi/compuvision', '/hi/clutch', '/hi/linkedin', '/hi/ct', '/work/inoxar', '/work/kitlab-fs', '/work/matchup', '/work/commerceflow'];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'load' });
    await page.waitForTimeout(route.startsWith('/hi/') ? 500 : 300);
    // Remove scripts injected at runtime (analytics) so they are not baked into the static HTML
    await page.evaluate(() => document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(n => n.remove()));
    // Reset the /hi/ greeting overlay: the real page rebuilds and plays it on load
    await page.evaluate(() => {
      const el = document.getElementById('hi-intro');
      if (el) { el.innerHTML = ''; el.className = ''; }
      document.documentElement.removeAttribute('data-hi');
    });
    const html = await page.content();
    const dest = path.join(out, route.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, '<!doctype html>\n' + html + '\n');
    console.log('wrote', path.relative(path.join(__dirname, '..'), dest));
  }
  await browser.close();
  if (errors.length) { console.error('Page errors:', errors); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
