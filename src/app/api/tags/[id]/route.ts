import { NextResponse } from 'next/server';
import type { Tag } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/tags/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const response = await fetch(`${JSON_SERVER_URL}/tags/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    const tag = await response.json();
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Failed to get tag:', error);
    return NextResponse.json(
      { error: 'Failed to get tag' },
      { status: 500 }
    );
  }
}

// PATCH /api/tags/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const updates = await request.json();
    
    // Handle special case for appending to bookmarks array
    if (updates.bookmarks && Array.isArray(updates.bookmarks) && updates.bookmarks[0] === 'append') {
      const response = await fetch(`${JSON_SERVER_URL}/tags/${id}`);
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Tag not found' },
          { status: 404 }
        );
      }
      const tag = await response.json();
      
      updates.bookmarks = [...(tag.bookmarks || []), updates.bookmarks[1]];
    }
    
    const updateResponse = await fetch(`${JSON_SERVER_URL}/tags/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to update tag' },
        { status: 404 }
      );
    }
    
    const updatedTag = await updateResponse.json();
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Failed to update tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    
    // Delete tag
    const deleteResponse = await fetch(`${JSON_SERVER_URL}/tags/${id}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to delete tag' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Failed to delete tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
} 