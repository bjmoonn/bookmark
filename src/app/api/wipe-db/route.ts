import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function POST() {
  try {
    // Reset the database to empty arrays
    const emptyDB = {
      bookmarks: [],
      folders: [],
      tags: []
    };

    await fs.writeFile(dbPath, JSON.stringify(emptyDB, null, 2));
    
    return NextResponse.json({ message: 'Database wiped successfully' });
  } catch (error) {
    console.error('Failed to wipe database:', error);
    return NextResponse.json(
      { error: 'Failed to wipe database' },
      { status: 500 }
    );
  }
} 