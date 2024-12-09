import { NextResponse } from 'next/server';
import type { Bookmark } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/bookmarks
export async function GET() {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/bookmarks`);
    const bookmarks = await response.json();
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to get bookmarks' },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks
export async function POST(request: Request) {
  try {
    const bookmark = await request.json();
    
    const response = await fetch(`${JSON_SERVER_URL}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark)
    });
    
    const savedBookmark = await response.json();
    return NextResponse.json(savedBookmark);
  } catch (error) {
    console.error('Failed to create bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    // Delete bookmark
    await fetch(`${JSON_SERVER_URL}/bookmarks/${id}`, {
      method: 'DELETE'
    });

    // Update tags to remove bookmark reference
    const tagsResponse = await fetch(`${JSON_SERVER_URL}/tags`);
    const tags = await tagsResponse.json();
    
    for (const tag of tags) {
      if (tag.bookmarks.includes(id)) {
        await fetch(`${JSON_SERVER_URL}/tags/${tag.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookmarks: tag.bookmarks.filter((bookmarkId: number) => bookmarkId !== id)
          })
        });
      }
    }

    // Update folders to remove bookmark reference
    const foldersResponse = await fetch(`${JSON_SERVER_URL}/folders`);
    const folders = await foldersResponse.json();
    
    for (const folder of folders) {
      if (folder.bookmarks.includes(id)) {
        await fetch(`${JSON_SERVER_URL}/folders/${folder.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookmarks: folder.bookmarks.filter((bookmarkId: number) => bookmarkId !== id)
          })
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
} 