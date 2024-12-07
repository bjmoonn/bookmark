import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Folder } from '@/types/bookmark';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

async function getDB() {
  const db = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(db);
}

async function saveDB(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// GET /api/folders
export async function GET() {
  const db = await getDB();
  return NextResponse.json(db.folders);
}

// POST /api/folders
export async function POST(request: Request) {
  const folder: Folder = await request.json();
  const db = await getDB();
  
  db.folders.push(folder);
  await saveDB(db);
  
  return NextResponse.json(folder);
}

// PATCH /api/folders
export async function PATCH(request: Request) {
  const { id, bookmarks }: Folder = await request.json();
  const db = await getDB();
  
  const folderIndex = db.folders.findIndex((f: Folder) => f.id === id);
  if (folderIndex !== -1) {
    db.folders[folderIndex].bookmarks = bookmarks;
    await saveDB(db);
    return NextResponse.json(db.folders[folderIndex]);
  }
  
  return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
} 