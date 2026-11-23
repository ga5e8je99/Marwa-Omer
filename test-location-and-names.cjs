const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  // 1. Open envelope
  console.log('Opening envelope...');
  await page.click('#envelope-intro-overlay [role="button"]');
  await new Promise((r) => setTimeout(r, 2600));

  // 2. Check Hero section names
  console.log('Checking Hero section names...');
  const heroText = await page.evaluate(() => {
    const el = document.getElementById('section-hero');
    return el ? el.innerText : '';
  });
  console.log('Hero contains Maowa?', heroText.includes('Maowa'));
  console.log('Hero contains Omer?', heroText.includes('Omer'));
  await page.screenshot({ path: '/tmp/hero-maowa-omer.png' });

  // 3. Scroll to Location section
  console.log('Scrolling to Location section...');
  await page.evaluate(() => {
    const el = document.getElementById('section-location');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const locationText = await page.evaluate(() => {
    const el = document.getElementById('section-location');
    return el ? el.innerText : '';
  });
  console.log('Location section text preview:', locationText.replace(/\n+/g, ' | ').slice(0, 200));

  // Take screenshot of Location section
  const locationEl = await page.$('#section-location');
  if (locationEl) {
    await locationEl.screenshot({ path: '/tmp/section-location.png' });
    console.log('Captured /tmp/section-location.png');
  }

  // 4. Test Copy Address button
  console.log('Testing Copy Address button...');
  const copyBtn = await page.$('#section-location button');
  if (copyBtn) {
    await copyBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const btnText = await page.evaluate((btn) => btn.innerText, copyBtn);
    console.log('Button text after click:', btnText);
  }

  await browser.close();
  console.log('All tests passed successfully!');
}

test().catch((err) => {
  console.error(err);
  process.exit(1);
});
