const fs = require('fs');
const puppeteer = require('puppeteer-core');

// Construct the wax seal path points around (195, 560) with radius 52
function generateSealPath() {
  const cx = 195;
  const cy = 560;
  const rBase = 52;
  const numPts = 64;
  const pts = [];

  for (let i = 0; i < numPts; i++) {
    const angle = (i / numPts) * Math.PI * 2;
    let r = rBase + Math.sin(angle * 7) * 2.2 + Math.cos(angle * 9) * 1.8 + Math.sin(angle * 4) * 1.5;

    // Bottom drips around angle ~ PI/2 (1.57 rad)
    const angleDiffCenter = Math.abs(angle - Math.PI / 2);
    if (angleDiffCenter < 0.22) {
      r += (1 - angleDiffCenter / 0.22) * 8.5; // center drip
    }
    const angleDiffLeft = Math.abs(angle - (Math.PI / 2 - 0.28));
    if (angleDiffLeft < 0.25) {
      r += (1 - angleDiffLeft / 0.25) * 6.5; // left drip
    }
    const angleDiffRight = Math.abs(angle - (Math.PI / 2 + 0.3));
    if (angleDiffRight < 0.24) {
      r += (1 - angleDiffRight / 0.24) * 6.0; // right drip
    }

    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    pts.push([x, y]);
  }

  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} `;
  for (let i = 0; i < numPts; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % numPts];
    const mx = (p1[0] + p2[0]) / 2;
    const my = (p1[1] + p2[1]) / 2;
    d += `Q ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)} `;
  }
  return d + 'Z';
}

// Generate dense, lush baroque floral scrolls along the lace band
// Band width is 62 units (from v = -31 inner edge to v = +31 outer edge)
// Length is ~586 units.
function generateDenseLaceMotifs() {
  const numUnits = 10;
  let s = '';

  for (let i = 0; i < numUnits; i++) {
    const t = (i + 0.5) / numUnits;
    const x = t * 530 + 30; // Position along band length

    s += `
      <g transform="translate(${x.toFixed(1)}, 0)">
        <!-- 1. BIG LUSH SCALLOPED OUTER ARCH (curves out to y = +36) -->
        <path d="M -28,15 C -25,32 -14,38 0,38 C 14,38 25,32 28,15" 
              fill="#FFFFFF" fill-opacity="0.98" stroke="#EFE5E0" stroke-width="1.8" />
        
        <!-- Scallop picot pearl rim -->
        <circle cx="-22" cy="27" r="2.2" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />
        <circle cx="-12" cy="35" r="2.6" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />
        <circle cx="0" cy="38" r="3.2" fill="#FFFFFF" stroke="#CFB6AC" stroke-width="1.2" />
        <circle cx="12" cy="35" r="2.6" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />
        <circle cx="22" cy="27" r="2.2" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />

        <!-- Double picot dots on outer fringe -->
        <circle cx="-26" cy="20" r="1.3" fill="#EAD9D2" />
        <circle cx="-17" cy="32" r="1.4" fill="#EAD9D2" />
        <circle cx="-6" cy="37" r="1.4" fill="#EAD9D2" />
        <circle cx="6" cy="37" r="1.4" fill="#EAD9D2" />
        <circle cx="17" cy="32" r="1.4" fill="#EAD9D2" />
        <circle cx="26" cy="20" r="1.3" fill="#EAD9D2" />

        <!-- 2. INWARD SCALLOPED EMBROIDERY (curves to y = -31) -->
        <path d="M -26,-15 C -22,-28 -12,-33 0,-33 C 12,-33 22,-28 26,-15" 
              fill="#FFFFFF" fill-opacity="0.95" stroke="#EFE5E0" stroke-width="1.4" />
        <circle cx="-15" cy="-28" r="1.6" fill="#FFFFFF" stroke="#DECBC3" stroke-width="0.8" />
        <circle cx="0" cy="-32" r="2.0" fill="#FFFFFF" stroke="#DECBC3" stroke-width="0.8" />
        <circle cx="15" cy="-28" r="1.6" fill="#FFFFFF" stroke="#DECBC3" stroke-width="0.8" />

        <!-- 3. CENTRAL BLOOMING BAROQUE FLOWER ROSETTE -->
        <!-- Layered 5-Petal Flower in White/Ivory -->
        <path d="M 0,16 C -8,10 -10,2 0,-4 C 10,2 8,10 0,16 Z" fill="#FDFBF9" stroke="#DBBEB2" stroke-width="1.2" />
        <path d="M -16,6 C -10,0 -4,5 0,-4 C -6,-10 -12,-6 -16,6 Z" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />
        <path d="M 16,6 C 10,0 4,5 0,-4 C 6,-10 12,-6 16,6 Z" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />
        <path d="M -12,-14 C -6,-9 -3,-4 0,-4 C -4,2 -9,1 -12,-14 Z" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />
        <path d="M 12,-14 C 6,-9 3,-4 0,-4 C 4,2 9,1 12,-14 Z" fill="#FFFFFF" stroke="#DECBC3" stroke-width="1.0" />

        <!-- Center Raised Floral Pearl -->
        <circle cx="0" cy="0" r="5.0" fill="#FFFFFF" stroke="#C9A89A" stroke-width="1.4" />
        <circle cx="0" cy="0" r="2.8" fill="#F8EFEA" stroke="#B89486" stroke-width="1.0" />
        <circle cx="-1.0" cy="-1.0" r="1.2" fill="#FFFFFF" />

        <!-- 4. ORNATE BAROQUE ACANTHUS SCROLLS & VOLUTES -->
        <!-- Flowing C-scroll linking adjacent motifs -->
        <path d="M -26,-2 C -32,16 -16,24 -8,14 C 0,4 -14,-2 -26,-2 Z" 
              fill="#FFFFFF" fill-opacity="0.9" stroke="#E5D1C9" stroke-width="1.2" />
        <path d="M 26,-2 C 32,16 16,24 8,14 C 0,4 14,-2 26,-2 Z" 
              fill="#FFFFFF" fill-opacity="0.9" stroke="#E5D1C9" stroke-width="1.2" />

        <!-- Swirling leafy tendrils curving into the center -->
        <path d="M -18,-18 C -22,-6 -6,-6 -2,-14 C -4,-18 -12,-20 -18,-18 Z" 
              fill="#FDFBFA" stroke="#E0C6BC" stroke-width="0.9" />
        <path d="M 18,-18 C 22,-6 6,-6 2,-14 C 4,-18 12,-20 18,-18 Z" 
              fill="#FDFBFA" stroke="#E0C6BC" stroke-width="0.9" />

        <!-- 5. TULLE NET MESH (Delicate Openwork Eyelets) -->
        <circle cx="-12" cy="18" r="1.4" fill="#DEC7BD" />
        <circle cx="12" cy="18" r="1.4" fill="#DEC7BD" />
        <circle cx="-6" cy="26" r="1.4" fill="#DEC7BD" />
        <circle cx="6" cy="26" r="1.4" fill="#DEC7BD" />
        <circle cx="-18" cy="-8" r="1.3" fill="#DEC7BD" />
        <circle cx="18" cy="-8" r="1.3" fill="#DEC7BD" />
        <circle cx="-8" cy="-22" r="1.2" fill="#DEC7BD" />
        <circle cx="8" cy="-22" r="1.2" fill="#DEC7BD" />

        <!-- Continuous embroidered stitch rails -->
        <path d="M -28,12 Q 0,8 28,12" fill="none" stroke="#FFFFFF" stroke-width="2.2" />
        <path d="M -28,-6 Q 0,-10 28,-6" fill="none" stroke="#FFFFFF" stroke-width="2.0" />
        <path d="M -28,-22 Q 0,-26 28,-22" fill="none" stroke="#F4EAE4" stroke-width="1.4" stroke-dasharray="2.5 2" />
      </g>
    `;
  }
  return s;
}

function buildFullSvgString() {
  const sealPathD = generateSealPath();
  const denseLaceMotifs = generateDenseLaceMotifs();

  return `
<svg id="envelope-svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMax slice" 
     xmlns="http://www.w3.org/2000/svg" class="w-full h-full select-none">
  <defs>
    <!-- Paper texture gradient -->
    <linearGradient id="blushPaper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7DED7" />
      <stop offset="100%" stop-color="#F4D3CB" />
    </linearGradient>

    <!-- Metallic Gold Gradients for Wax Seal -->
    <linearGradient id="goldMelt" x1="140" y1="510" x2="250" y2="615" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F5DE88" />
      <stop offset="20%" stop-color="#E2B344" />
      <stop offset="46%" stop-color="#FAF0B4" />
      <stop offset="74%" stop-color="#BA882A" />
      <stop offset="100%" stop-color="#6E4407" />
    </linearGradient>

    <linearGradient id="goldRim" x1="160" y1="525" x2="230" y2="595" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF9D6" />
      <stop offset="35%" stop-color="#DFAC37" />
      <stop offset="70%" stop-color="#FFECA1" />
      <stop offset="100%" stop-color="#7A4C07" />
    </linearGradient>

    <radialGradient id="sealMatrix" cx="190" cy="554" r="44" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#D4A73B" />
      <stop offset="65%" stop-color="#B88624" />
      <stop offset="88%" stop-color="#8F6212" />
      <stop offset="100%" stop-color="#5E3C05" />
    </radialGradient>

    <linearGradient id="calligraphyGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF6C2" />
      <stop offset="100%" stop-color="#D4A028" />
    </linearGradient>

    <!-- Soft pink drop shadow for 3D embossed lace: (0 4px 8px rgba(180,120,110,0.35)) -->
    <filter id="laceShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#B4786E" flood-opacity="0.35" />
    </filter>

    <!-- Wax Seal 3D Shadow -->
    <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#461E08" flood-opacity="0.4" />
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#260D04" flood-opacity="0.3" />
    </filter>

    <!-- Paper Grain & Emboss Texture Filter -->
    <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.95   0 0 0 0 0.86   0 0 0 0 0.83  0 0 0 0.08 0" result="coloredNoise" />
      <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
    </filter>

    <!-- Gold Filigree Border Patterns -->
    <pattern id="goldFiligreeV" width="14" height="28" patternUnits="userSpaceOnUse">
      <path d="M 7,0 Q 1,7 7,14 Q 13,21 7,28" fill="none" stroke="#D4AE6A" stroke-width="1.2" stroke-opacity="0.8" />
      <circle cx="7" cy="7" r="1.4" fill="#D4AE6A" fill-opacity="0.85" />
      <circle cx="7" cy="21" r="1.4" fill="#D4AE6A" fill-opacity="0.85" />
      <path d="M 2,0 L 2,28" stroke="#D4AE6A" stroke-width="0.8" stroke-opacity="0.7" stroke-dasharray="2 3" />
      <path d="M 12,0 L 12,28" stroke="#D4AE6A" stroke-width="0.8" stroke-opacity="0.7" />
    </pattern>

    <pattern id="goldFiligreeH" width="28" height="14" patternUnits="userSpaceOnUse">
      <path d="M 0,7 Q 7,1 14,7 Q 21,13 28,7" fill="none" stroke="#D4AE6A" stroke-width="1.2" stroke-opacity="0.8" />
      <circle cx="7" cy="7" r="1.4" fill="#D4AE6A" fill-opacity="0.85" />
      <circle cx="21" cy="7" r="1.4" fill="#D4AE6A" fill-opacity="0.85" />
      <path d="M 0,2 L 28,2" stroke="#D4AE6A" stroke-width="0.8" stroke-opacity="0.7" />
      <path d="M 0,12 L 28,12" stroke="#D4AE6A" stroke-width="0.8" stroke-opacity="0.7" stroke-dasharray="2 3" />
    </pattern>
  </defs>

  <!-- 1. BASE PAPER: Blush gradient (#F7DED7 -> #F4D3CB) with grain texture -->
  <rect x="0" y="0" width="390" height="844" fill="url(#blushPaper)" filter="url(#paperGrain)" />

  <!-- 2. PLAIN PINK PAPER INSIDE THE V (from top down to (195, 560)) -->
  <polygon points="-20,-20 410,-20 195,560" fill="#F7E4E1" />

  <!-- 3. LOWER FLAP FOLD LINES: (0, 844) -> (195, 560) and (390, 844) -> (195, 560) -->
  <g id="foldLinesGroup">
    <!-- Left crease -->
    <line x1="0" y1="844" x2="195" y2="560" stroke="#E3B9B0" stroke-width="1.2" />
    <line x1="0" y1="843" x2="195" y2="559" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.6" />

    <!-- Right crease -->
    <line x1="390" y1="844" x2="195" y2="560" stroke="#E3B9B0" stroke-width="1.2" />
    <line x1="390" y1="843" x2="195" y2="559" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.6" />
  </g>

  <!-- 4. GOLD LACE BORDER: 14 units wide, inset 4 units, running along left, right, and bottom. NO top border -->
  <g id="goldBorderGroup">
    <!-- Left border: x = 4 to 18, y = 0 to 844 -->
    <rect x="4" y="0" width="14" height="844" fill="url(#goldFiligreeV)" />

    <!-- Right border: x = 372 to 386, y = 0 to 844 -->
    <rect x="372" y="0" width="14" height="844" fill="url(#goldFiligreeV)" />

    <!-- Bottom border: y = 826 to 840, x = 4 to 386 -->
    <rect x="4" y="826" width="382" height="14" fill="url(#goldFiligreeH)" />
  </g>

  <!-- 5. LACE BANDS (~62 units wide, from (28, -10) & (362, -10) down to (195, 552)) -->
  <g id="laceBandsGroup" filter="url(#laceShadow)">
    <!-- Left Lace Band (rotated along centerline from (28, -10) to (195, 552), angle = 73.447 deg) -->
    <g id="singleLaceBand" transform="translate(28, -10) rotate(73.447)">
      <!-- Embroidered edge rails -->
      <path d="M 0,31 L 587,31" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" />
      <path d="M 0,16 L 587,16" stroke="#F4EAE5" stroke-width="1.3" stroke-dasharray="3 2.5" />
      <path d="M 0,-16 L 587,-16" stroke="#F4EAE5" stroke-width="1.3" stroke-dasharray="3 2.5" />
      <path d="M 0,-31 L 587,-31" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" />
      
      <!-- Repeated rich baroque floral units -->
      ${denseLaceMotifs}
    </g>

    <!-- Right Lace Band: Symmetric reflection across x = 195 -->
    <use href="#singleLaceBand" transform="translate(390, 0) scale(-1, 1)" />

    <!-- Joint Pointed Leaf-Shaped Lace Ornament (70 units wide x 60 units tall, sitting directly above the seal) -->
    <g id="tipLeafOrnament" transform="translate(195, 492)">
      <!-- Outer baroque palmette leaf framing the seal -->
      <path d="M 0,-30 
               C 24,-24 35,-10 35,12
               C 35,32 22,50 12,58
               C 6,63 2,66 0,70
               C -2,66 -6,63 -12,58
               C -22,50 -35,32 -35,12
               C -35,-10 -24,-24 0,-30 Z" 
            fill="#FFFFFF" stroke="#E6D3CB" stroke-width="2.0" />
      
      <!-- Inner openwork leaf with picot loops -->
      <path d="M 0,-16 
               C 16,-10 24,-2 24,14
               C 24,28 15,40 8,48
               C 4,52 1,55 0,58
               C -1,55 -4,52 -8,48
               C -15,40 -24,28 -24,14
               C -24,-2 -16,-10 0,-16 Z" 
            fill="#FDFBFA" stroke="#DBBEB2" stroke-width="1.4" />

      <!-- Central floral jewel / rosette -->
      <circle cx="0" cy="14" r="10" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.6" />
      <circle cx="0" cy="14" r="6" fill="#F8EFEA" stroke="#B89486" stroke-width="1.2" />
      <circle cx="0" cy="14" r="2.5" fill="#FFFFFF" />

      <!-- Petite picot droplets at the bottom tip -->
      <circle cx="0" cy="73" r="2.4" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.0" />
      <circle cx="0" cy="78" r="1.8" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="0.8" />

      <!-- Lateral pearl dots -->
      <circle cx="-28" cy="18" r="2.4" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="0.9" />
      <circle cx="28" cy="18" r="2.4" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="0.9" />
      <circle cx="-18" cy="42" r="2.0" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="0.8" />
      <circle cx="18" cy="42" r="2.0" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="0.8" />
    </g>
  </g>

  <!-- 6. WAX SEAL: Center exactly (195, 560), diameter 104 units (radius 52) -->
  <g id="waxSealGroup" filter="url(#sealShadow)">
    <!-- Organic melted gold wax puddle with drips at bottom -->
    <path d="${sealPathD}" fill="url(#goldMelt)" />

    <!-- Outer lip highlight ridge -->
    <path d="${sealPathD}" fill="none" stroke="url(#goldRim)" stroke-width="3" opacity="0.9" />

    <!-- Recessed circular moat cavity (r ≈ 43) -->
    <circle cx="195" cy="560" r="43" fill="url(#sealMatrix)" />
    <circle cx="195" cy="560" r="43" fill="none" stroke="#523204" stroke-width="2.2" opacity="0.8" />
    <circle cx="195" cy="560" r="41.5" fill="none" stroke="#FFEAA1" stroke-width="1.2" opacity="0.5" />

    <!-- Raised inner circular rim (r ≈ 37.5) -->
    <circle cx="195" cy="560" r="37.5" fill="none" stroke="url(#goldRim)" stroke-width="3.2" />
    <circle cx="195" cy="560" r="34" fill="none" stroke="#5C3805" stroke-width="1.4" opacity="0.9" />
    <circle cx="195" cy="560" r="32" fill="none" stroke="#FFF2B8" stroke-width="1.0" opacity="0.9" />

    <!-- Beaded inner perimeter ring (r ≈ 30) -->
    <circle cx="195" cy="560" r="30" fill="none" stroke="#FFEDB8" stroke-width="1.8" stroke-dasharray="2 3.5" opacity="0.8" />

    <!-- Full Calligraphy inside: "بسم الله الرحمن الرحيم" in 3 lines, clearly legible -->
    <!-- Pass 1: Embossed shadow offset (+1.2px down) -->
    <g transform="translate(0, 1.2)" fill="#4A2903" opacity="0.95" text-anchor="middle"
       font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" font-weight="bold">
      <text x="195" y="548" font-size="12">بِسْمِ اللَّهِ</text>
      <text x="195" y="563" font-size="13">الرَّحْمَٰنِ</text>
      <text x="195" y="578" font-size="13">الرَّحِيمِ</text>
    </g>

    <!-- Pass 2: Gold metallic face pass -->
    <g fill="url(#calligraphyGold)" text-anchor="middle"
       font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" font-weight="bold">
      <text x="195" y="547" font-size="12">بِسْمِ اللَّهِ</text>
      <text x="195" y="562" font-size="13">الرَّحْمَٰنِ</text>
      <text x="195" y="577" font-size="13">الرَّحِيمِ</text>
    </g>

    <!-- Glossy reflection sheen arc -->
    <path d="M 166,532 C 182,520 208,520 224,532 C 210,524 180,524 166,532 Z" fill="#FFFFFF" opacity="0.45" />
  </g>

  <!-- 7. "TAP TO OPEN": Center x = 195, baseline y = 640, font-size 11, letter-spacing 0.4em -->
  <text id="tapToOpenText" x="195" y="640" text-anchor="middle"
        font-family="'Cinzel', 'Cormorant Garamond', serif" font-size="11" font-weight="500"
        letter-spacing="0.4em" fill="#B9A38F">
    TAP TO OPEN
  </text>
</svg>
  `.trim();
}

const fullSvg = buildFullSvgString();
fs.writeFileSync('/tmp/envelope-test.svg', fullSvg);

// Render at all 4 viewports
const viewports = [
  { name: '390x844', width: 390, height: 844 },
  { name: '360x740', width: 360, height: 740 },
  { name: '430x932', width: 430, height: 932 },
  { name: '412x915', width: 412, height: 915 },
];

async function testAll() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Cinzel:wght@500;600&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 0;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
              background: #F7DED7;
            }
            #envelope-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            svg {
              width: 100%;
              height: 100%;
              display: block;
            }
          </style>
        </head>
        <body>
          <div id="envelope-container">
            ${fullSvg}
          </div>
        </body>
      </html>
    `);

    await new Promise((r) => setTimeout(r, 600));

    // Measure V tip and seal visual position on screen
    const metrics = await page.evaluate(() => {
      const seal = document.getElementById('waxSealGroup');
      const rect = seal ? seal.getBoundingClientRect() : null;
      return {
        screenW: window.innerWidth,
        screenH: window.innerHeight,
        sealYCenter: rect ? rect.top + rect.height / 2 : null,
        sealWidth: rect ? rect.width : null,
        sealHeight: rect ? rect.height : null,
        sealYPercent: rect ? ((rect.top + rect.height / 2) / window.innerHeight) * 100 : null,
        sealWidthPercent: rect ? (rect.width / window.innerWidth) * 100 : null,
      };
    });

    console.log(`Viewport ${vp.name}:`, metrics);
    await page.screenshot({ path: `/tmp/envelope-viewbox-${vp.name}.png` });
    await page.close();
  }

  await browser.close();
  console.log('All viewports captured successfully!');
}

testAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
