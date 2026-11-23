export interface RsvpPayload {
  name: string;
  guests: number;
  attending: 'yes' | 'no';
  events: string[];
  message?: string;
  submittedAt: string;
}

/**
 * TODO: Connect this function to Google Sheets (Google Apps Script Web App) or Formspree.
 *
 * --- GOOGLE APPS SCRIPT SETUP ---
 * 1. Create a Google Sheet with columns: Timestamp, Name, Attending, Guests, Events, Message.
 * 2. Extensions > Apps Script, paste the doPost(e) handler that appends row.
 * 3. Deploy as Web App (Execute as: Me, Who has access: Anyone).
 * 4. Paste the Web App URL below in GOOGLE_SHEETS_ENDPOINT.
 *
 * --- FORMSPREE SETUP ---
 * 1. Create a Form on formspree.io
 * 2. Paste the endpoint below in FORMSPREE_ENDPOINT.
 */

export const EXTERNAL_RSVP_CONFIG = {
  // Option A: Google Sheets Apps Script Web App URL
  googleSheetsEndpoint: '', // e.g. 'https://script.google.com/macros/s/AKfycb.../exec'

  // Option B: Formspree endpoint
  formspreeEndpoint: '', // e.g. 'https://formspree.io/f/your_form_id'
};

/**
 * Submits the RSVP payload:
 * 1. Stores in localStorage under key 'rsvps'.
 * 2. Logs to console.
 * 3. Asynchronously forwards to configured external endpoint if provided.
 */
export async function submitRsvp(
  payload: RsvpPayload
): Promise<{ success: boolean; error?: string }> {
  // 1. Save to localStorage under "rsvps"
  try {
    const existing = localStorage.getItem('rsvps');
    const list: RsvpPayload[] = existing ? JSON.parse(existing) : [];
    list.push(payload);
    localStorage.setItem('rsvps', JSON.stringify(list));
  } catch (err) {
    console.warn('[RSVP] localStorage access error:', err);
  }

  // 2. Console log the payload
  console.log('[RSVP SUBMITTED SUCCESSFULLY]', payload);

  // 3. Forward to external endpoint if configured
  const endpoint =
    EXTERNAL_RSVP_CONFIG.googleSheetsEndpoint ||
    EXTERNAL_RSVP_CONFIG.formspreeEndpoint;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('[RSVP] External endpoint returned non-200 status:', response.status);
      }
    } catch (networkError) {
      console.warn('[RSVP] External endpoint network dispatch failed:', networkError);
      // We don't fail the user submission since it is safely in localStorage
    }
  } else {
    console.info(
      '[RSVP TODO] Point EXTERNAL_RSVP_CONFIG in src/utils/rsvp.ts to your Google Sheets or Formspree endpoint when ready.'
    );
  }

  return { success: true };
}
