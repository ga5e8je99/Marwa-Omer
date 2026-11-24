import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'src', 'data', 'config.json');

const defaultConfig = {
  musicStartTime: 60,
  musicTitle: 'زفة موسيقى طلت عروس',
  volume: 0.5,
};

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...defaultConfig, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('[API /api/config] Error reading config.json:', err);
  }
  return defaultConfig;
}

function writeConfig(data: any) {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[API /api/config] Error writing config.json:', err);
  }
}

export async function GET() {
  const config = readConfig();
  return NextResponse.json({ success: true, config });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readConfig();
    const updated = {
      ...current,
      musicStartTime:
        typeof body.musicStartTime === 'number'
          ? Math.max(0, Math.min(364, body.musicStartTime))
          : current.musicStartTime,
      volume: typeof body.volume === 'number' ? body.volume : current.volume,
    };

    writeConfig(updated);
    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error('[API /api/config POST] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
