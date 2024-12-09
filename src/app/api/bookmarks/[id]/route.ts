import { NextResponse } from 'next/server';
import type { Bookmark } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// PATCH /api/bookmarks/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const updates = await request.json();

    // Get current bookmark to preserve favicon
    const bookmarkResponse = await fetch(`${JSON_SERVER_URL}/bookmarks/${id}`);
    if (!bookmarkResponse.ok) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }
    const currentBookmark = await bookmarkResponse.json();

    // Update bookmark while preserving favicon
    const response = await fetch(`${JSON_SERVER_URL}/bookmarks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        favicon: currentBookmark.favicon
      })
    });

    const updatedBookmark = await response.json();
    return NextResponse.json(updatedBookmark);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}