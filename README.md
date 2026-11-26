# Marwa & omar — Interactive Digital Wedding Invitation 💍✨

A luxurious, mobile-first single-page interactive digital wedding invitation website built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Designed for a 390×844 phone viewport first, with smooth responsive scaling to desktop inside a centered gold-bordered frame with ambient blurred background glows.

---

## 🌟 Key Highlights & Features

1. **Section 1: Interactive Envelope Intro**
   - Full-screen blush paper envelope with white embossed lace on a 3D V-flap.
   - Authentic gold wax seal stamped with Arabic calligraphy *"بسم الله الرحمن الرحيم"* and breathing animation.
   - On tap: the seal pops, the V-flap opens in 3D perspective (`rotateX: 180°`), the gilded invitation card peeks out, the envelope glides away, and Lenis smooth scrolling unlocks.
   - Royalty-free ambient music starts upon opening, accompanied by a floating bottom-right glassmorphic volume control.
   - Strict body & HTML touch-action lock prevents background scrolling on mobile & iOS Safari.

2. **Section 2: Hero Scene (100vh)**
   - Dreamy watercolor landscape with sky, clouds, sunburst rays, mountains, lake, and floral wedding gazebo.
   - Letter-by-letter reveal for *"Amaani & Rayyan"* with blur-to-sharp animation.
   - Looping flying white doves, 12 floating rose petal and sparkle particles, and optical parallax depth.

3. **Section 3: "Save the Date" Scratch-to-Reveal**
   - 3 circular HTML5 canvas cards for **DAY (12)**, **MONTH (OCT)**, and **YEAR (2026)**.
   - Metallic gold foil scratched with a round brush (`globalCompositeOperation = 'destination-out'`).
   - Automatically uncovers when ≥55% cleared, triggering gold sparkle confetti and haptic feedback (`navigator.vibrate(15)`).
   - Preserves state in `sessionStorage` and includes an **"Add to Calendar"** button that downloads an `.ics` calendar event.

4. **Section 4: Invitation Text Card**
   - Watercolor framing with pastel roses and green eucalyptus leaves.
   - Arabic Bismillah in gold with translation, parents' honours, floating fluttering butterflies, and staggered scroll reveals.

5. **Section 5: Celebration Journey Timeline**
   - Vertical gold timeline that dynamically draws itself downward as the user scrolls (`useScroll` + `scaleY`).
   - Symmetrical gold spring nodes that pop into view when reached.

6. **Section 6: Illustrated Event Cards**
   - Landscape cards with rounded corners (`28px`), hanging swaying Moroccan lanterns (`±3°`), structured time/venue details, 3D mouse tilt parallax, and **"View Map"** Google Maps links.

7. **Section 7: Live Countdown Timer**
   - Enclosed between dual gold lace bands over a faint landscape underlay.
   - 4 scalloped (cloud-edged) circles for DAYS, HOURS, MINUTES, SECONDS updating in real time.
   - Numbers flip and slide vertically using `<AnimatePresence mode="popLayout">`.
   - Automatically displays *"Alhamdulillah, We Are Married"* once the date arrives.

8. **Section 8: RSVP Form & LocalStorage Guestbook**
   - Translucent frosted blush card with minimalist underline-style inputs.
   - Attendance pills (*Joyfully Accept* / *Regretfully Decline*) and event multi-select pills (*Mehendi*, *Nikkah*, *Walima*).
   - Animated SVG checkmark that draws itself on submit.
   - Saves submissions to `localStorage` under `"rsvps"` and provides a plug-and-play utility to sync with Google Sheets or Formspree.

9. **Section 9: Our Story (3 Chapters)**
   - Huge faded gold script numerals (**01**, **02**, **03**) that draw into view first.
   - Alternating reading rhythm and romantic closing blessing.

10. **Section 10: Our Moments (Arch Carousel)**
    - Swipeable photo carousel inside an arched frame (`border-radius: 999px 999px 24px 24px`) with double gold outline.
    - 5 watercolor photo moments with cross-fade zoom transitions, overlaid arrow buttons, and autoplay every 4s with touch pause.

11. **Section 11: With Best Compliments**
    - Symmetrical gold filigree flourishes framing frosted cards for each family (*The Khan Family*, *The Malik Family*, *The Rahman Family*).

12. **Section 12: Closing Blessing & Studio Footer**
    - Script blessing, couple signature, date capsule, and studio credits.

---

## 🛠️ Project Structure

```
widdeing/
├── public/
│   ├── favicon.svg             # Wax seal SVG favicon
│   └── og-image.svg            # Open Graph social share preview
├── src/
│   ├── assets/                 # Central illustration & watercolor slots
│   │   ├── gallery/            # 5 moment carousel photos (SVG / WebP / JPG)
│   │   ├── bg-invitation-card.svg
│   │   ├── card-mehendi.svg
│   │   ├── card-nikkah.svg
│   │   ├── card-walima.svg
│   │   ├── divider-lace.svg
│   │   ├── envelope-bg.svg
│   │   ├── hero-arch.svg
│   │   ├── hero-bg.svg
│   │   ├── music.mp3           # Ambient background audio loop
│   │   └── strip-landscape.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── AudioPlayer.tsx # Floating music toggle button
│   │   │   ├── GoldFlourish.tsx# Symmetrical gold arabesque filigree
│   │   │   ├── LaceDivider.tsx # Tileable Islamic damask lace band
│   │   │   └── Reveal.tsx      # A11y & reduced-motion aware scroll reveal
│   │   └── sections/           # 12 Independent section components
│   ├── config/
│   │   └── assets.ts           # Unified asset registry for one-click swapping
│   ├── data/
│   │   └── invitation.ts       # ALL wedding copy & data in ONE file
│   ├── utils/
│   │   └── rsvp.ts             # RSVP storage & Google Sheets / Formspree connector
│   ├── App.tsx                 # Main layout & Lenis smooth scroll
│   ├── index.css               # Tailwind CSS & paper noise styling
│   └── main.tsx
├── tailwind.config.js          # Design system colors, fonts & borders
└── package.json
```

---

## ✍️ How to Edit Content (`src/data/invitation.ts`)

All text, dates, venues, story chapters, and family names are stored in **[src/data/invitation.ts](file:///home/gamal-ahmed/Desktop/widdeing/src/data/invitation.ts)**:

```ts
export const INVITATION_DATA = {
  couple: {
    bride: {
      firstName: 'Amaani',
      fullName: 'Amaani Khan',
      parentsTitle: 'D/o Mr. Yusuf Khan & Mrs. Fatima Khan',
    },
    groom: {
      firstName: 'Rayyan',
      fullName: 'Rayyan Malik',
      parentsTitle: 'S/o Mr. Idris Malik & Mrs. Aisha Malik',
    },
  },

  // Wedding Date & Countdown target ISO string
  weddingDate: '12 Oct 2026',
  weddingDateFormatted: 'Saturday, 12th of October 2026',
  targetDateISO: '2026-10-12T16:00:00', // YYYY-MM-DDTHH:mm:ss

  // Events, Venues & Maps Links
  events: [
    {
      id: 'mehendi',
      name: 'Mehendi Soirée',
      date: 'Friday, 11 October 2026',
      time: '5:00 PM onwards',
      venue: 'The Garden Courtyard',
      address: 'Rose Valley Estate, Nowra Hills',
      googleMapsUrl: 'https://maps.google.com/?q=Rose+Valley+Estate',
      // ...
    },
    // ...
  ],
};
```

---

## 🖼️ How to Swap Images & Photos

1. **Replace Carousel Moments**:
   - Place your photos inside `src/assets/gallery/` as `moment-1.jpg`, `moment-2.jpg`, etc.
   - Update the imports in **[src/config/assets.ts](file:///home/gamal-ahmed/Desktop/widdeing/src/config/assets.ts)**.
2. **Replace Watercolor Backgrounds**:
   - Swap any file in `src/assets/` (`hero-bg.svg`, `card-mehendi.svg`, `card-nikkah.svg`, `card-walima.svg`).
   - Because all components import assets from `src/config/assets.ts`, changes reflect everywhere automatically.

---

## 📊 How to Connect the RSVP to Google Sheets

The RSVP form already stores every submission in `localStorage` and logs it to the console. To automatically receive responses in a **Google Sheet**:

### Step 1: Create the Google Sheet & Apps Script
1. Open Google Drive and create a new **Google Sheet** (e.g. *"Wedding RSVP Responses"*).
2. Set row 1 headers: `Timestamp | Name | Attending | Guests | Events | Message`.
3. In the menu, go to **Extensions > Apps Script**.
4. Replace any existing code with this script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name,
      data.attending,
      data.guests,
      Array.isArray(data.events) ? data.events.join(', ') : data.events,
      data.message || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Click **Deploy > New deployment**.
6. Select type: **Web app**.
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
7. Click **Deploy** and copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

### Step 2: Paste the Web App URL into `src/utils/rsvp.ts`
Open **[src/utils/rsvp.ts](file:///home/gamal-ahmed/Desktop/widdeing/src/utils/rsvp.ts)** and set `googleSheetsEndpoint`:

```ts
export const EXTERNAL_RSVP_CONFIG = {
  googleSheetsEndpoint: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec',
  formspreeEndpoint: '',
};
```

*(Alternatively, if you prefer Formspree, create a free form at [formspree.io](https://formspree.io) and paste your endpoint into `formspreeEndpoint`.)*

---

## 🚀 Deployment to Vercel or Netlify

### Deploying to Vercel
1. Install the Vercel CLI (or connect your GitHub repository directly on [vercel.com](https://vercel.com)):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Deploying to Netlify
1. Build the production package locally or connect to Netlify Git:
   ```bash
   npm run build
   ```
2. Drag and drop the `dist/` directory onto [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 🧪 Development & Verification

Run the development server locally:
```bash
npm run dev
```

Build and test production bundle:
```bash
npm run build
npm run preview
```
