import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function POST(request: Request) {
  try {
    const { option } = await request.json();
    const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

    switch (option) {
      case 'all':
        data.bookmarks = [];
        data.folders = [];
        data.tags = [];
        break;
      case 'bookmarks':
        data.bookmarks = [];
        // clear bookmark references from folders and tags too
        data.folders = data.folders.map((folder: any) => ({ ...folder, bookmarks: [] }));
        data.tags = data.tags.map((tag: any) => ({ ...tag, bookmarks: [] }));
        break;
      case 'folders':
        data.folders = [];
        break;
      case 'tags':
        data.tags = [];
        break;
      default:
        throw new Error('Invalid wipe option');
    }

    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ message: `${option} wiped successfully` });
  } catch (error) {
    console.error('Failed to wipe database:', error);
    return NextResponse.json(
      { error: 'Failed to wipe database' },
      { status: 500 }
    );
  }
} 