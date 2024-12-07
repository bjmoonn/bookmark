import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Tag } from '@/types/bookmark';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

async function getDB() {
  const db = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(db);
}

async function saveDB(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// GET /api/tags
export async function GET() {
  const db = await getDB();
  return NextResponse.json(db.tags);
}

// POST /api/tags
export async function POST(request: Request) {
  const tag: Tag = await request.json();
  const db = await getDB();
  
  db.tags.push(tag);
  await saveDB(db);
  
  return NextResponse.json(tag);
} 