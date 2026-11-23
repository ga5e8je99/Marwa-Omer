const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function fullVerification() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  // 1. Initial Envelope State
  console.log('1. Checking Envelope Intro Screen...');
  await page.screenshot({ path: '/tmp/invitation-1-envelope.png' });

  // 2. Click Wax Seal
  console.log('2. Tapping Wax Seal to Open...');
  await page.click('#envelope-intro-overlay [role="button"]');
  await new Promise((r) => setTimeout(r, 3200));

  // 3. Hero Section
  console.log('3. Checking Hero Section...');
  await page.screenshot({ path: '/tmp/invitation-2-hero.png' });

  // 4. Scratch Cards Section
  console.log('4. Testing Scratch Cards interaction...');
  await page.evaluate(() => {
    const el = document.getElementById('section-save-the-date');
    if (el) el.scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Scratch each canvas
  const canvases = await page.$$('#section-save-the-date canvas');
  console.log(`  Found ${canvases.length} scratch canvases`);
  for (let i = 0; i < canvases.length; i++) {
    const box = await canvases[i].boundingBox();
    if (box) {
      // Simulate circular scratching
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx - 20, cy - 20);
      await page.mouse.down();
      for (let angle = 0; angle < Math.PI * 6; angle += 0.4) {
        const r = 5 + (angle * 2);
        await page.mouse.move(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        await new Promise((r) => setTimeout(r, 15));
      }
      await page.mouse.up();
    }
  }

  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/invitation-3-scratch.png' });

  // 5. Scroll through entire page to verify all sections
  console.log('5. Scrolling through the entire page...');
  const sections = [
    'section-invitation-card',
    'section-timeline',
    'section-event-cards',
    'section-countdown',
    'section-rsvp',
    'section-our-story',
    'section-gallery',
    'section-compliments',
    'section-closing',
  ];

  for (const s of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, s);
    await new Promise((r) => setTimeout(r, 400));
  }

  await new Promise((r) => setTimeout(r, 1200));

  // Capture Full Page Screenshot
  await page.screenshot({ path: '/tmp/invitation-full-page.png', fullPage: true });
  const stats = fs.statSync('/tmp/invitation-full-page.png');
  console.log(`Full page screenshot saved (${(stats.size / 1024).toFixed(1)} KB)`);

  await browser.close();
  console.log('✅ Full page verification completed successfully!');
}

fullVerification().catch((err) => {
  console.error(err);
  process.exit(1);
});
