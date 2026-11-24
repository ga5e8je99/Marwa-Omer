export interface MusicConfig {
  src: string;
  title: string;
  startTime: number; // in seconds
  volume: number;
}

export const MUSIC_CONFIG: MusicConfig = {
  src: '/music.mp3',
  title: 'زفة موسيقى طلت عروس',
  startTime: 99, // يبدأ من الدقيقة 1:39 (الثانية 99)
  volume: 0.45,
};

export const MUSIC_PRESETS = [
  { label: 'الدقيقة 1:39 (المقطع المختار)', seconds: 99, timeStr: '1:39' },
  { label: 'اللحن الأساسي والإيقاع', seconds: 60, timeStr: '1:00' },
  { label: 'بداية تصاعد اللحن', seconds: 45, timeStr: '0:45' },
  { label: 'قمة الزفة والحماس', seconds: 105, timeStr: '1:45' },
  { label: 'البداية الهادئة', seconds: 0, timeStr: '0:00' },
];

let cachedStartTime: number = MUSIC_CONFIG.startTime;

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

export async function fetchServerMusicConfig(): Promise<number> {
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
        return cachedStartTime;
      }
    }
  } catch (err) {
    console.warn('[Audio] Could not fetch /api/config:', err);
  }
  return getEffectiveMusicStartTime();
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
