const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// 1. Generate lace-v.svg
// Flap has width 1080, height 868 (representing the 62% flap height)
// Left edge goes from (0, 0) to (540, 868).
// Right edge goes from (1080, 0) to (540, 868).
// Meeting point is at (540, 868).
function generateLaceSVG() {
  const width = 1080;
  const height = 868;
  const tipX = 540;
  const tipY = 868;

  // Length of slanted edge:
  const L = Math.hypot(tipX, tipY); // sqrt(540^2 + 868^2) ≈ 1022.26px
  const angleDeg = (Math.atan2(tipY, tipX) * 180) / Math.PI; // 58.113 deg

  // We place rich baroque lace motifs along the left edge
  // Local coordinate along the edge: x is along edge (0 to L), y is perpendicular (-100 to +100)
  // Negative y is outward (over the lower envelope), positive y is inward (over the pink flap)
  let motifs = '';
  const numUnits = 10;
  
  for (let i = 0; i < numUnits; i++) {
    const t = (i + 0.5) / numUnits;
    const x = t * (L - 100) + 40; // Spacing along the edge

    motifs += `
      <g transform="translate(${x.toFixed(1)}, 0)">
        <!-- Outer deep scalloped lace arch with picot fringe -->
        <path d="M -50,0 C -45,-45 -20,-75 0,-75 C 20,-75 45,-45 50,0" 
              fill="#FFFFFF" fill-opacity="0.95" stroke="#EFE5E1" stroke-width="2" />
        
        <!-- Picot eyelet loops around the scallop -->
        <circle cx="-38" cy="-50" r="3.5" fill="#FFFFFF" stroke="#E2D0C8" stroke-width="1.2" />
        <circle cx="-20" cy="-68" r="4" fill="#FFFFFF" stroke="#E2D0C8" stroke-width="1.2" />
        <circle cx="0" cy="-75" r="5" fill="#FFFFFF" stroke="#D8C2B8" stroke-width="1.5" />
        <circle cx="20" cy="-68" r="4" fill="#FFFFFF" stroke="#E2D0C8" stroke-width="1.2" />
        <circle cx="38" cy="-50" r="3.5" fill="#FFFFFF" stroke="#E2D0C8" stroke-width="1.2" />

        <!-- Miniature picot dots on the outer perimeter -->
        <circle cx="-46" cy="-35" r="2" fill="#E8D8D2" />
        <circle cx="-29" cy="-62" r="2.2" fill="#E8D8D2" />
        <circle cx="-10" cy="-73" r="2.2" fill="#E8D8D2" />
        <circle cx="10" cy="-73" r="2.2" fill="#E8D8D2" />
        <circle cx="29" cy="-62" r="2.2" fill="#E8D8D2" />
        <circle cx="46" cy="-35" r="2" fill="#E8D8D2" />

        <!-- Inner floral rosette with openwork petals -->
        <path d="M 0,-50 C -12,-35 -15,-20 0,-10 C 15,-20 12,-35 0,-50 Z" 
              fill="#FDFBF9" stroke="#DCBEB2" stroke-width="1.5" />
        <path d="M -25,-25 C -15,-15 -5,-25 0,-10 C -10,0 -20,5 -30,-5 Z" 
              fill="#FFFFFF" stroke="#E5CEB5" stroke-width="1.2" />
        <path d="M 25,-25 C 15,-15 5,-25 0,-10 C 10,0 20,5 30,-5 Z" 
              fill="#FFFFFF" stroke="#E5CEB5" stroke-width="1.2" />
        
        <!-- Central pearl bead in rosette -->
        <circle cx="0" cy="-15" r="7" fill="#FFFFFF" stroke="#D1B3A5" stroke-width="1.8" />
        <circle cx="0" cy="-15" r="3.5" fill="#F7ECE8" stroke="#B89688" stroke-width="1.2" />
        <circle cx="-1" cy="-16" r="1.5" fill="#FFFFFF" />

        <!-- Inward baroque scrolls (flourishes curving onto the pink paper) -->
        <path d="M -40,10 C -45,45 -15,55 0,35 C 15,55 45,45 40,10 C 25,25 -25,25 -40,10 Z" 
              fill="#FFFFFF" fill-opacity="0.9" stroke="#EAD9D2" stroke-width="1.5" />
        
        <!-- Dotted needlepoint lace mesh -->
        <circle cx="-18" cy="28" r="2.2" fill="#E2CCC3" />
        <circle cx="0" cy="22" r="2.5" fill="#E2CCC3" />
        <circle cx="18" cy="28" r="2.2" fill="#E2CCC3" />
        <circle cx="-8" cy="38" r="1.8" fill="#E2CCC3" />
        <circle cx="8" cy="38" r="1.8" fill="#E2CCC3" />

        <!-- Connecting woven lace ribbon threads -->
        <path d="M -50,-5 Q 0,-12 50,-5" fill="none" stroke="#FFFFFF" stroke-width="3" />
        <path d="M -50,15 Q 0,8 50,15" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
        <path d="M -50,30 Q 0,22 50,30" fill="none" stroke="#F5ECE8" stroke-width="1.5" stroke-dasharray="3 3" />
      </g>
    `;
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Soft 3D drop shadow so lace appears stitched and raised -->
    <filter id="laceShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#552C2C" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#401818" flood-opacity="0.16" />
    </filter>
  </defs>

  <!-- Left slanted lace appliqué band (from 0,0 to 540,868) -->
  <g id="laceBandLeft" filter="url(#laceShadow)">
    <g transform="translate(0, 0) rotate(${angleDeg})">
      <!-- Continuous embroidered guide lines -->
      <path d="M 0,-40 L ${L},-40" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <path d="M 0,-20 L ${L},-20" stroke="#F5ECE8" stroke-width="1.5" stroke-dasharray="4 3" />
      <path d="M 0,20 L ${L},-20" stroke="#F5ECE8" stroke-width="1.5" stroke-dasharray="4 3" />
      <path d="M 0,45 L ${L},45" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      
      <!-- Repeating baroque floral motifs -->
      ${motifs}
    </g>
  </g>

  <!-- Right slanted lace appliqué band (mirrored across center line x = 540) -->
  <use href="#laceBandLeft" transform="translate(1080, 0) scale(-1, 1)" />

  <!-- Pointed Leaf-Shaped Lace Ornament at the V tip (540, 868) -->
  <g id="tipOrnateLeaf" transform="translate(${tipX}, ${tipY})" filter="url(#laceShadow)">
    <!-- Ornate baroque palmette / leaf framing the tip -->
    <path d="M 0,-80 
             C 55,-60 110,-30 130,20
             C 145,65 110,120 65,160
             C 40,185 20,215 0,250
             C -20,215 -40,185 -65,160
             C -110,120 -145,65 -130,20
             C -110,-30 -55,-60 0,-80 Z" 
          fill="#FFFFFF" stroke="#E6D3CB" stroke-width="2.5" />
    
    <!-- Inner layered filigree leaf -->
    <path d="M 0,-50 
             C 40,-35 80,-10 95,30
             C 105,65 75,110 45,145
             C 25,170 12,195 0,225
             C -12,195 -25,170 -45,145
             C -75,110 -105,65 -95,30
             C -80,-10 -40,-35 0,-50 Z" 
          fill="#FDFBFA" stroke="#DBC3B8" stroke-width="2" />

    <!-- Openwork acanthus scroll lines inside the leaf -->
    <path d="M 0,-25 C 30,10 60,35 45,75 C 30,110 -15,130 0,180 C 15,130 -30,110 -45,75 C -60,35 -30,10 0,-25 Z" 
          fill="#FFFFFF" stroke="#CDB1A4" stroke-width="1.8" />

    <!-- Central jeweled lace rosette -->
    <circle cx="0" cy="55" r="22" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="2.2" />
    <circle cx="0" cy="55" r="14" fill="#F8F0EC" stroke="#BA9584" stroke-width="1.8" />
    <circle cx="0" cy="55" r="6" fill="#FFFFFF" stroke="#9E7664" stroke-width="1.2" />

    <!-- Dainty picot pearl beads along the leaf tip -->
    <circle cx="0" cy="260" r="5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.5" />
    <circle cx="0" cy="275" r="3.5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
    <circle cx="0" cy="287" r="2.5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1" />

    <!-- Lateral pearl dots -->
    <circle cx="-105" cy="40" r="4.5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
    <circle cx="105" cy="40" r="4.5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
    <circle cx="-80" cy="115" r="4" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
    <circle cx="80" cy="115" r="4" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
    <circle cx="-45" cy="180" r="3.5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
    <circle cx="45" cy="180" r="3.5" fill="#FFFFFF" stroke="#D1B2A3" stroke-width="1.2" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(__dirname, 'src/assets/lace-v.svg'), svgContent.trim());
  console.log('Regenerated src/assets/lace-v.svg (1080x868)');
}

// 2. Generate wax-seal.svg (512x512)
function generateWaxSealSVG() {
  const points = [];
  const numPts = 64;
  for (let i = 0; i < numPts; i++) {
    const angle = (i / numPts) * Math.PI * 2;
    // Base radius ~195 with organic undulation
    let r = 195 + Math.sin(angle * 6) * 7 + Math.cos(angle * 8) * 5 + Math.sin(angle * 4) * 6;
    
    // Bottom drips around angle ~ PI/2 (downward)
    const angleDiffCenter = Math.abs(angle - Math.PI / 2);
    if (angleDiffCenter < 0.22) {
      r += (1 - angleDiffCenter / 0.22) * 38; // center drip
    }
    const angleDiffLeft = Math.abs(angle - (Math.PI / 2 - 0.28));
    if (angleDiffLeft < 0.25) {
      r += (1 - angleDiffLeft / 0.25) * 26; // left drip
    }
    const angleDiffRight = Math.abs(angle - (Math.PI / 2 + 0.32));
    if (angleDiffRight < 0.24) {
      r += (1 - angleDiffRight / 0.24) * 24; // right drip
    }

    const x = 256 + Math.cos(angle) * r;
    const y = 256 + Math.sin(angle) * r;
    points.push([x, y]);
  }

  let pathD = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)} `;
  for (let i = 0; i < numPts; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % numPts];
    const mx = (p1[0] + p2[0]) / 2;
    const my = (p1[1] + p2[1]) / 2;
    pathD += `Q ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)} `;
  }
  pathD += 'Z';

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep realistic wax drop shadow -->
    <filter id="sealShadow" x="-25%" y="-25%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#421E0B" flood-opacity="0.45" />
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#240D04" flood-opacity="0.35" />
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#FFEBB3" flood-opacity="0.5" />
    </filter>

    <!-- Metallic gold gradients -->
    <linearGradient id="goldMelt" x1="50" y1="50" x2="460" y2="470" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F5DE88" />
      <stop offset="22%" stop-color="#E5BA4F" />
      <stop offset="48%" stop-color="#FDF2BC" />
      <stop offset="72%" stop-color="#BA882A" />
      <stop offset="100%" stop-color="#6E4407" />
    </linearGradient>

    <linearGradient id="goldLip" x1="100" y1="80" x2="420" y2="430" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF8D4" />
      <stop offset="30%" stop-color="#DFAC37" />
      <stop offset="65%" stop-color="#FFECA1" />
      <stop offset="100%" stop-color="#7A4C07" />
    </linearGradient>

    <radialGradient id="matrixBed" cx="235" cy="235" r="165" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#D4A73B" />
      <stop offset="65%" stop-color="#B88624" />
      <stop offset="88%" stop-color="#8F6212" />
      <stop offset="100%" stop-color="#5E3C05" />
    </radialGradient>

    <linearGradient id="embossDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4F2F04" />
      <stop offset="100%" stop-color="#734B0B" />
    </linearGradient>

    <linearGradient id="embossLight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF5BD" />
      <stop offset="100%" stop-color="#D19E2B" />
    </linearGradient>
  </defs>

  <g filter="url(#sealShadow)">
    <!-- 1. Organic melted outer puddle -->
    <path d="${pathD}" fill="url(#goldMelt)" />

    <!-- 2. Melted outer lip highlight ring -->
    <path d="${pathD}" fill="none" stroke="url(#goldLip)" stroke-width="5" opacity="0.9" />

    <!-- 3. Recessed matrix circular depression -->
    <circle cx="256" cy="256" r="166" fill="url(#matrixBed)" />
    <circle cx="256" cy="256" r="166" fill="none" stroke="#523204" stroke-width="3.5" opacity="0.8" />
    <circle cx="256" cy="256" r="163" fill="none" stroke="#FFEAA1" stroke-width="2" opacity="0.5" />

    <!-- 4. Raised inner circular rim -->
    <circle cx="256" cy="256" r="146" fill="none" stroke="url(#goldLip)" stroke-width="5" />
    <circle cx="256" cy="256" r="141" fill="none" stroke="#5C3805" stroke-width="2" opacity="0.9" />
    <circle cx="256" cy="256" r="138" fill="none" stroke="#FFF2B8" stroke-width="1.5" opacity="0.9" />

    <!-- 5. Beaded inner perimeter ring -->
    <circle cx="256" cy="256" r="130" fill="none" stroke="#FFEDB8" stroke-width="2.5" stroke-dasharray="3 5" opacity="0.8" />

    <!-- 6. Embossed Arabic Calligraphy in 3 prominent lines -->
    <!-- Shadow pass (offset 1.8px down) -->
    <g transform="translate(0, 2)" fill="url(#embossDark)" opacity="0.95">
      <text x="256" y="212" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" 
            font-size="36" font-weight="bold" text-anchor="middle" direction="rtl">
        بِسْمِ اللهِ
      </text>
      <text x="256" y="260" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" 
            font-size="38" font-weight="bold" text-anchor="middle" direction="rtl">
        الرَّحْمَٰنِ
      </text>
      <text x="256" y="308" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" 
            font-size="38" font-weight="bold" text-anchor="middle" direction="rtl">
        الرَّحِيمِ
      </text>
    </g>

    <!-- Highlighted gold face pass -->
    <g fill="url(#embossLight)">
      <text x="256" y="210" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" 
            font-size="36" font-weight="bold" text-anchor="middle" direction="rtl">
        بِسْمِ اللهِ
      </text>
      <text x="256" y="258" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" 
            font-size="38" font-weight="bold" text-anchor="middle" direction="rtl">
        الرَّحْمَٰنِ
      </text>
      <text x="256" y="306" font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif" 
            font-size="38" font-weight="bold" text-anchor="middle" direction="rtl">
        الرَّحِيمِ
      </text>
    </g>

    <!-- Glossy specular reflection sheen on the seal -->
    <path d="M 155,160 C 205,120 305,120 355,160 C 315,135 195,135 155,160 Z" 
          fill="#FFFFFF" opacity="0.4" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(__dirname, 'src/assets/wax-seal.svg'), svgContent.trim());
  console.log('Regenerated src/assets/wax-seal.svg (512x512)');
}

generateLaceSVG();
generateWaxSealSVG();

async function rasterizeToPNG() {
  console.log('Rasterizing SVGs to transparent PNGs via headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Render lace-v.png (1080 x 868)
  const laceSvg = fs.readFileSync(path.join(__dirname, 'src/assets/lace-v.svg'), 'utf8');
  await page.setViewport({ width: 1080, height: 868, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
          svg { width: 1080px; height: 868px; display: block; }
        </style>
      </head>
      <body>${laceSvg}</body>
    </html>
  `);
  await page.screenshot({
    path: path.join(__dirname, 'src/assets/lace-v.png'),
    omitBackground: true,
  });
  console.log('Generated src/assets/lace-v.png (1080x868)');

  // 2. Render wax-seal.png (512 x 512)
  const waxSvg = fs.readFileSync(path.join(__dirname, 'src/assets/wax-seal.svg'), 'utf8');
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
          svg { width: 512px; height: 512px; display: block; }
        </style>
      </head>
      <body>${waxSvg}</body>
    </html>
  `);
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({
    path: path.join(__dirname, 'src/assets/wax-seal.png'),
    omitBackground: true,
  });
  console.log('Generated src/assets/wax-seal.png (512x512)');

  await browser.close();
  console.log('All asset generation complete!');
}

rasterizeToPNG().catch((err) => {
  console.error(err);
  process.exit(1);
});
