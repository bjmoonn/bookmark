import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Bookmark } from '@/types/bookmark';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

async function getDB() {
  const db = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(db);
}

async function saveDB(db: any) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// PATCH /api/bookmarks/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const data = await request.json();
    const db = await getDB();
    
    const bookmarkIndex = db.bookmarks.findIndex(
      (b: Bookmark) => b.id === id
    );
    
    if (bookmarkIndex === -1) {
      return NextResponse.json(
        { error: 'Bookmark not found' }, 
        { status: 404 }
      );
    }
    
    // update bookmark while preserving id and favicon
    db.bookmarks[bookmarkIndex] = {
      ...db.bookmarks[bookmarkIndex],
      ...data,
      id: db.bookmarks[bookmarkIndex].id,
      favicon: db.bookmarks[bookmarkIndex].favicon,
    };
    
    await saveDB(db);
    
    return NextResponse.json(db.bookmarks[bookmarkIndex]);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to update bookmark' }, 
      { status: 500 }
    );
  }
}