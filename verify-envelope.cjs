const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testEnvelope() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  console.log('1. Checking rebuilt envelope visually...');
  await page.screenshot({ path: '/tmp/envelope-redesigned-390.png' });

  // Check text content on envelope
  const textContent = await page.evaluate(() => {
    const el = document.getElementById('envelope-intro-overlay');
    return el ? el.innerText.trim() : '';
  });
  console.log('Text found on envelope overlay:', JSON.stringify(textContent));

  // Check element dimensions and edge-to-edge coverage
  const box = await page.evaluate(() => {
    const el = document.getElementById('envelope-intro-overlay');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
  });
  console.log('Envelope dimensions check:', box);

  // Check tap to open interaction
  console.log('2. Tapping envelope...');
  await page.click('#envelope-intro-overlay [role="button"]');
  
  // Wait 600ms to see opening flap
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: '/tmp/envelope-opening-600ms.png' });

  // Wait 1200ms more (total 1800ms) to see slide down transition
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: '/tmp/envelope-opening-1800ms.png' });

  // Wait for unmount
  await new Promise((r) => setTimeout(r, 1000));
  const isUnmounted = await page.evaluate(() => {
    return document.getElementById('envelope-intro-overlay') === null;
  });
  console.log('Is envelope unmounted after sequence?', isUnmounted);

  // Hero revealed
  await page.screenshot({ path: '/tmp/envelope-revealed-hero.png' });

  await browser.close();
  console.log('Verification completed successfully!');
}

testEnvelope().catch((err) => {
  console.error(err);
  process.exit(1);
});
