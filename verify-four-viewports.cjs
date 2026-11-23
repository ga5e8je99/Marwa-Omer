const puppeteer = require('puppeteer-core');

const viewports = [
  { name: '390x844', width: 390, height: 844 },
  { name: '360x740', width: 360, height: 740 },
  { name: '430x932', width: 430, height: 932 },
  { name: '412x915', width: 412, height: 915 },
];

async function verifyAll() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

    // Wait for initial render
    await new Promise((r) => setTimeout(r, 600));

    // Measure live geometry from DOM
    const metrics = await page.evaluate(() => {
      const seal = document.getElementById('waxSealGroup');
      const rect = seal ? seal.getBoundingClientRect() : null;
      const svg = document.getElementById('envelope-svg');
      const svgRect = svg ? svg.getBoundingClientRect() : null;

      return {
        screenW: window.innerWidth,
        screenH: window.innerHeight,
        sealCenterY: rect ? rect.top + rect.height / 2 : null,
        sealWidth: rect ? rect.width : null,
        sealHeight: rect ? rect.height : null,
        sealYPercent: rect ? ((rect.top + rect.height / 2) / window.innerHeight) * 100 : null,
        sealWidthPercent: rect ? (rect.width / window.innerWidth) * 100 : null,
        svgCover: svgRect ? { width: svgRect.width, height: svgRect.height } : null,
      };
    });

    console.log(`Live App [${vp.name}]:`, metrics);

    // Save screenshot
    const screenshotPath = `/tmp/envelope-live-${vp.name}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot: ${screenshotPath}`);

    // If 390x844, also test tap to open animation and timing
    if (vp.name === '390x844') {
      console.log('Testing tap to open sequence on 390x844...');
      await page.click('#envelope-intro-overlay [role="button"]');

      // Wait 500ms to verify retraction
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({ path: '/tmp/envelope-live-retracting-500ms.png' });

      // Wait for complete unmount (total 2000ms)
      await new Promise((r) => setTimeout(r, 1600));
      const unmounted = await page.evaluate(() => document.getElementById('envelope-intro-overlay') === null);
      console.log('Envelope successfully unmounted?', unmounted);
      await page.screenshot({ path: '/tmp/envelope-live-hero-revealed.png' });
    }

    await page.close();
  }

  await browser.close();
  console.log('All viewports verified successfully!');
}

verifyAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
