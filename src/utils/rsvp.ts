export interface RsvpPayload {
  name: string;
  guests: number;
  attending: 'yes' | 'no';
  events?: string[];
  message?: string;
  submittedAt?: string;
}

export interface StoredRsvpItem extends RsvpPayload {
  id: string;
  submittedAt: string;
}

export const EXTERNAL_RSVP_CONFIG = {
  // Option A: Google Sheets Apps Script Web App URL
  googleSheetsEndpoint: '',
  // Option B: Formspree endpoint
  formspreeEndpoint: '',
};

/**
 * Submits the RSVP payload:
 * 1. Sends to server API (/api/rsvp) for persistent dashboard storage.
 * 2. Saves to localStorage as a client-side offline backup.
 * 3. Asynchronously forwards to configured external endpoint (Google Sheets/Formspree) if provided.
 */
export async function submitRsvp(
  payload: RsvpPayload
): Promise<{ success: boolean; error?: string }> {
  // 1. Send to server API
  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[RSVP] Server API returned non-OK status:', res.status);
    }
  } catch (apiErr) {
    console.warn('[RSVP] Could not reach server /api/rsvp:', apiErr);
  }

  // 2. Client-side localStorage backup
  try {
    const existing = localStorage.getItem('rsvps');
    const list: RsvpPayload[] = existing ? JSON.parse(existing) : [];
    list.unshift({
      ...payload,
      submittedAt: payload.submittedAt || new Date().toISOString(),
    });
    localStorage.setItem('rsvps', JSON.stringify(list));
  } catch (err) {
    console.warn('[RSVP] localStorage access error:', err);
  }

  // 3. Forward to external endpoint if configured
  const endpoint =
    EXTERNAL_RSVP_CONFIG.googleSheetsEndpoint ||
    EXTERNAL_RSVP_CONFIG.formspreeEndpoint;

  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (networkError) {
      console.warn('[RSVP] External endpoint network dispatch failed:', networkError);
    }
  }

  return { success: true };
}

/**
 * Fetch all RSVPs from server (used by Dashboard)
 */
export async function fetchRsvps(): Promise<StoredRsvpItem[]> {
  try {
    const res = await fetch('/api/rsvp', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.rsvps)) {
        return data.rsvps;
      }
    }
  } catch (err) {
    console.warn('[RSVP] fetchRsvps network error:', err);
  }

  // Fallback to local storage if server unreachable
  try {
    const local = localStorage.getItem('rsvps');
    if (local) {
      const parsed = JSON.parse(local);
      return parsed.map((item: any, idx: number) => ({
        id: item.id || `local-${idx}`,
        name: item.name || 'ضيف',
        attending: item.attending || 'yes',
        guests: item.guests || 1,
        message: item.message || '',
        submittedAt: item.submittedAt || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('[RSVP] localStorage read error:', err);
  }

  return [];
}

/**
 * Delete an RSVP from server
 */
export async function deleteRsvpApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/rsvp?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('[RSVP] deleteRsvpApi error:', err);
    return false;
  }
}
