export interface MusicConfig {
  src: string;
  title: string;
  startTime: number; // in seconds: 99 (1:39)
  endTime: number; // in seconds: 139 (2:19)
  volume: number;
}

export const MUSIC_CONFIG: MusicConfig = {
  src: '/music.mp3',
  title: 'زفة موسيقى طلت عروس',
  startTime: 99, // يبدأ من الدقيقة 1:39 (الثانية 99)
  endTime: 139, // ينتهي عند الدقيقة 2:19 (الثانية 139) ويتكرر
  volume: 0.45,
};

export const MUSIC_PRESETS = [
  { label: 'المقطع المختار (1:39 إلى 2:19)', seconds: 99, endSeconds: 139, timeStr: '1:39 - 2:19' },
  { label: 'اللحن الأساسي والإيقاع', seconds: 60, endSeconds: 139, timeStr: '1:00' },
  { label: 'بداية تصاعد اللحن', seconds: 45, endSeconds: 139, timeStr: '0:45' },
  { label: 'قمة الزفة والحماس', seconds: 105, endSeconds: 139, timeStr: '1:45' },
  { label: 'البداية الهادئة', seconds: 0, endSeconds: 139, timeStr: '0:00' },
];

let cachedStartTime: number = MUSIC_CONFIG.startTime;
let cachedEndTime: number = MUSIC_CONFIG.endTime;

export function getEffectiveMusicStartTime(): number {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('wedding_music_start_time');
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0) {
          cachedStartTime = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return cachedStartTime;
}

export function getEffectiveMusicEndTime(): number {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('wedding_music_end_time');
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) {
          cachedEndTime = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return cachedEndTime;
}

export async function fetchServerMusicConfig(): Promise<{ startTime: number; endTime: number }> {
  try {
    const res = await fetch('/api/config', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && typeof data.config?.musicStartTime === 'number') {
        cachedStartTime = data.config.musicStartTime;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('wedding_music_start_time', String(cachedStartTime));
          } catch { }
        }
      }
      if (data.success && typeof data.config?.musicEndTime === 'number') {
        cachedEndTime = data.config.musicEndTime;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('wedding_music_end_time', String(cachedEndTime));
          } catch { }
        }
      }
      return { startTime: cachedStartTime, endTime: cachedEndTime };
    }
  } catch (err) {
    console.warn('[Audio] Could not fetch /api/config:', err);
  }
  return { startTime: getEffectiveMusicStartTime(), endTime: getEffectiveMusicEndTime() };
}

export async function updateMusicStartTime(seconds: number): Promise<boolean> {
  cachedStartTime = seconds;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wedding_music_start_time', String(seconds));
    } catch { }
  }

  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ musicStartTime: seconds }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Audio] Failed to persist music config to server:', err);
    return false;
  }
}

export async function updateMusicLoopRange(startTime: number, endTime: number): Promise<boolean> {
  cachedStartTime = startTime;
  cachedEndTime = endTime;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wedding_music_start_time', String(startTime));
      localStorage.setItem('wedding_music_end_time', String(endTime));
    } catch { }
  }

  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ musicStartTime: startTime, musicEndTime: endTime }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Audio] Failed to persist music loop range to server:', err);
    return false;
  }
}
