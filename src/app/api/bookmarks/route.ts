import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Bookmark, Tag, Folder } from '@/types/bookmark';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

async function getDB() {
  const db = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(db);
}

async function saveDB(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// GET /api/bookmarks
export async function GET() {
  const db = await getDB();
  return NextResponse.json(db.bookmarks);
}

// POST /api/bookmarks
export async function POST(request: Request) {
  const bookmark: Bookmark = await request.json();
  const db = await getDB();
  
  db.bookmarks.unshift(bookmark);
  await saveDB(db);
  
  return NextResponse.json(bookmark);
}

// DELETE /api/bookmarks
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const db = await getDB();
  
  // remove bookmark from bookmarks array
  db.bookmarks = db.bookmarks.filter((b: Bookmark) => b.id !== id);
  
  // remove bookmark reference from all tags
  db.tags = db.tags.map((tag: Tag) => ({
    ...tag,
    bookmarks: tag.bookmarks.filter((bookmarkId: number) => bookmarkId !== id)
  }));
  
  // remove bookmark reference from all folders
  db.folders = db.folders.map((folder: Folder) => ({
    ...folder,
    bookmarks: folder.bookmarks.filter((bookmarkId: number) => bookmarkId !== id)
  }));
  
  await saveDB(db);
  
  return NextResponse.json({ success: true });
} 