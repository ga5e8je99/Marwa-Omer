const puppeteer = require('puppeteer-core');

const devices = [
  { name: 'android-360x740', width: 360, height: 740 },
  { name: 'iphone-390x844', width: 390, height: 844 },
  { name: 'iphone-max-430x932', width: 430, height: 932 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  for (const dev of devices) {
    const page = await browser.newPage();
    await page.setViewport({ width: dev.width, height: dev.height, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

    await page.screenshot({ path: `/tmp/envelope-${dev.name}.png` });

    // Check no horizontal scrollbar or overflow
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    console.log(`${dev.name}: overflow check =`, overflow);
    await page.close();
  }

  await browser.close();
  console.log('All devices tested successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
