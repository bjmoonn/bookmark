import { NextResponse } from 'next/server';

const JSON_SERVER_URL = 'http://localhost:3001';

// POST /api/wipe-db
export async function POST(request: Request) {
  try {
    const { option } = await request.json();

    switch (option) {
      case 'all':
        // Wipe all data
        await Promise.all([
          fetch(`${JSON_SERVER_URL}/bookmarks`, { method: 'DELETE' }),
          fetch(`${JSON_SERVER_URL}/folders`, { method: 'DELETE' }),
          fetch(`${JSON_SERVER_URL}/tags`, { method: 'DELETE' }),
          fetch(`${JSON_SERVER_URL}/collections`, { method: 'DELETE' })
        ]);
        
        // Reset with empty arrays
        await Promise.all([
          fetch(`${JSON_SERVER_URL}/bookmarks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
          }),
          fetch(`${JSON_SERVER_URL}/folders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
          }),
          fetch(`${JSON_SERVER_URL}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
          }),
          fetch(`${JSON_SERVER_URL}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
          })
        ]);
        break;

      case 'bookmarks':
        // Delete all bookmarks
        await fetch(`${JSON_SERVER_URL}/bookmarks`, { method: 'DELETE' });
        await fetch(`${JSON_SERVER_URL}/bookmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        });

        // Clear bookmark references from folders and tags
        const [folders, tags] = await Promise.all([
          fetch(`${JSON_SERVER_URL}/folders`).then(res => res.json()),
          fetch(`${JSON_SERVER_URL}/tags`).then(res => res.json())
        ]);

        await Promise.all([
          ...folders.map((folder: any) => 
            fetch(`${JSON_SERVER_URL}/folders/${folder.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookmarks: [] })
            })
          ),
          ...tags.map((tag: any) => 
            fetch(`${JSON_SERVER_URL}/tags/${tag.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookmarks: [] })
            })
          )
        ]);
        break;

      case 'folders':
        // Delete all folders
        await fetch(`${JSON_SERVER_URL}/folders`, { method: 'DELETE' });
        await fetch(`${JSON_SERVER_URL}/folders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        });
        break;

      case 'tags':
        // Delete all tags
        await fetch(`${JSON_SERVER_URL}/tags`, { method: 'DELETE' });
        await fetch(`${JSON_SERVER_URL}/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([])
        });
        break;

      default:
        throw new Error('Invalid wipe option');
    }
    
    return NextResponse.json({ message: `${option} wiped successfully` });
  } catch (error) {
    console.error('Failed to wipe database:', error);
    return NextResponse.json(
      { error: 'Failed to wipe database' },
      { status: 500 }
    );
  }
} 