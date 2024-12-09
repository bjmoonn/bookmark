import { NextResponse } from 'next/server';
import type { Folder } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/folders/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const response = await fetch(`${JSON_SERVER_URL}/folders/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }
    
    const folder = await response.json();
    return NextResponse.json(folder);
  } catch (error) {
    console.error('Failed to get folder:', error);
    return NextResponse.json(
      { error: 'Failed to get folder' },
      { status: 500 }
    );
  }
}

// PATCH /api/folders/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const updates = await request.json();
    
    // Handle special case for appending to bookmarks array
    if (updates.bookmarks && Array.isArray(updates.bookmarks) && updates.bookmarks[0] === 'append') {
      const response = await fetch(`${JSON_SERVER_URL}/folders/${id}`);
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        );
      }
      const folder = await response.json();
      
      updates.bookmarks = [...(folder.bookmarks || []), updates.bookmarks[1]];
    }
    
    const updateResponse = await fetch(`${JSON_SERVER_URL}/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to update folder' },
        { status: 404 }
      );
    }
    
    const updatedFolder = await updateResponse.json();
    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error('Failed to update folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

// DELETE /api/folders/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    
    // Delete folder
    const deleteResponse = await fetch(`${JSON_SERVER_URL}/folders/${id}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to delete folder' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Failed to delete folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
} 