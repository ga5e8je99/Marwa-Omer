const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173/');
  await page.click('#envelope-intro-overlay [role="button"]');
  await new Promise(r => setTimeout(r, 2600));

  await page.evaluate(() => {
    const el = document.getElementById('section-location');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 900));

  const locationEl = await page.$('#section-location');
  if (locationEl) {
    await locationEl.screenshot({ path: '/tmp/section-location-final.png' });
  }

  await page.evaluate(() => {
    const el = document.getElementById('section-invitation-card');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  const cardEl = await page.$('#section-invitation-card');
  if (cardEl) {
    await cardEl.screenshot({ path: '/tmp/invitation-card-final.png' });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
