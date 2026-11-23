const puppeteer = require('puppeteer-core');

const VIEWPORTS = [
  { name: 'mobile-small', width: 360, height: 740 },
  { name: 'mobile-standard', width: 390, height: 844 },
  { name: 'mobile-large', width: 430, height: 932 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function runTests() {
  console.log('🚀 Starting Comprehensive Viewport & Interactive Verification...');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Listen for console logs & errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });
  page.on('pageerror', (err) => {
    console.error('Uncaught page error:', err.message);
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

    // 1. Check Envelope Visible
    const envelope = await page.$('#envelope-intro-overlay');
    if (!envelope) {
      console.error(`❌ Envelope overlay missing at ${vp.name}`);
    } else {
      console.log(`✅ Envelope overlay visible at ${vp.name}`);
    }

    // 2. Click Envelope
    await page.click('#envelope-intro-overlay [role="button"]');
    console.log('  → Tapped envelope, awaiting opening sequence...');
    await page.evaluate(() => new Promise((r) => setTimeout(r, 3200)));

    // 3. Confirm Envelope Unmounted
    const envelopeAfter = await page.$('#envelope-intro-overlay');
    if (envelopeAfter) {
      console.error(`❌ Envelope overlay did not unmount at ${vp.name}`);
    } else {
      console.log(`✅ Envelope successfully unmounted & scroll unlocked at ${vp.name}`);
    }

    // 4. Check for Horizontal Scroll / Overflow across page
    const overflowReport = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const elementsWithOverflow = [];

      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1) {
          elementsWithOverflow.push({
            tagName: el.tagName,
            id: el.id,
            className: (el.className || '').toString().slice(0, 50),
            right: rect.right,
            docWidth,
          });
        }
      }

      return {
        hasPageOverflow: scrollWidth > docWidth,
        docWidth,
        scrollWidth,
        elementsCount: elementsWithOverflow.length,
        samples: elementsWithOverflow.slice(0, 3),
      };
    });

    if (overflowReport.hasPageOverflow) {
      console.error(`❌ Horizontal overflow detected on ${vp.name}: scrollWidth=${overflowReport.scrollWidth} > clientWidth=${overflowReport.docWidth}`);
      console.error('Samples:', overflowReport.samples);
    } else {
      console.log(`✅ Zero horizontal overflow on ${vp.name} (scrollWidth = clientWidth = ${overflowReport.docWidth}px)`);
    }

    // 5. Scroll through whole page to test scroll triggers
    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      for (let y = 0; y < scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });

    // 6. Verify Key Interactive Components Exist
    const results = await page.evaluate(() => {
      return {
        hero: !!document.getElementById('section-hero'),
        saveTheDate: !!document.getElementById('section-save-the-date'),
        scratchCanvases: document.querySelectorAll('#section-save-the-date canvas').length,
        invitationCard: !!document.getElementById('section-invitation-card'),
        timeline: !!document.getElementById('section-timeline'),
        eventCards: !!document.getElementById('section-event-cards'),
        countdown: !!document.getElementById('section-countdown'),
        rsvp: !!document.getElementById('section-rsvp'),
        ourStory: !!document.getElementById('section-our-story'),
        gallery: !!document.getElementById('section-gallery'),
        compliments: !!document.getElementById('section-compliments'),
        closing: !!document.getElementById('section-closing'),
      };
    });

    console.log('  → Section elements verification:', results);
  }

  await browser.close();
  console.log('\n🎉 All Viewport Tests & Interactive Verifications Completed!');
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
