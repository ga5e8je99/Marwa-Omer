import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface RsvpItem {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guests: number;
  message?: string;
  events?: string[];
  submittedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'rsvps.json');

// In-memory fallback if file system write is not permitted
let memoryCache: RsvpItem[] = [
  {
    id: 'rsvp-1',
    name: 'أحمد ومي',
    attending: 'yes',
    guests: 2,
    message: 'ألف مليون مبروك لأحلى عريس وعروسة، ربنا يتمملكم على ألف خير ويسعد قلوبكم ويجعل كل أيامكم هنا وسرور.',
    submittedAt: '2026-11-24T18:30:00.000Z',
  },
  {
    id: 'rsvp-2',
    name: 'سارة إبراهيم',
    attending: 'yes',
    guests: 1,
    message: 'ما شاء الله تبارك الله، قمرين ونورتم دنيانا. ألف مبروك يا رحمة وعقبال كل الأيام الحلوة يا رب.',
    submittedAt: '2026-11-24T19:00:00.000Z',
  },
];

function readRsvpsFromFile(): RsvpItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[API /api/rsvp] Error reading rsvps.json:', err);
  }
  return memoryCache;
}

function writeRsvpsToFile(list: RsvpItem[]): void {
  memoryCache = list;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[API /api/rsvp] Error writing rsvps.json:', err);
  }
}

export async function GET() {
  const rsvps = readRsvpsFromFile();
  return NextResponse.json({
    success: true,
    count: rsvps.length,
    rsvps,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'الاسم مطلوب' },
        { status: 400 }
      );
    }

    const attending: 'yes' | 'no' = body.attending === 'no' ? 'no' : 'yes';
    const guests = Math.max(1, parseInt(body.guests, 10) || 1);
    const message = String(body.message || '').trim();
    const events = Array.isArray(body.events) ? body.events : ['الفرح'];

    const newEntry: RsvpItem = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      attending,
      guests,
      message,
      events,
      submittedAt: new Date().toISOString(),
    };

    const currentList = readRsvpsFromFile();
    // Prepend so the newest shows first
    const updatedList = [newEntry, ...currentList];
    writeRsvpsToFile(updatedList);

    return NextResponse.json({
      success: true,
      entry: newEntry,
    });
  } catch (err) {
    console.error('[API /api/rsvp POST] Error:', err);
    return NextResponse.json(
      { success: false, error: 'فشل حفظ التهنئة' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف التهنئة مطلوب' },
        { status: 400 }
      );
    }

    const currentList = readRsvpsFromFile();
    const updatedList = currentList.filter((item) => item.id !== id);
    writeRsvpsToFile(updatedList);

    return NextResponse.json({
      success: true,
      remaining: updatedList.length,
    });
  } catch (err) {
    console.error('[API /api/rsvp DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: 'فشل حذف التهنئة' },
      { status: 500 }
    );
  }
}
