import { NextResponse } from 'next/server';
import type { Collection } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/collections/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const response = await fetch(`${JSON_SERVER_URL}/collections/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }
    
    const collection = await response.json();
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Failed to get collection:', error);
    return NextResponse.json(
      { error: 'Failed to get collection' },
      { status: 500 }
    );
  }
}

// PATCH /api/collections/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    const updates = await request.json();
    
    // Handle special case for appending to bookmarks array
    if (updates.bookmarks && Array.isArray(updates.bookmarks) && updates.bookmarks[0] === 'append') {
      const response = await fetch(`${JSON_SERVER_URL}/collections/${id}`);
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
      const collection = await response.json();
      
      updates.bookmarks = [...(collection.bookmarks || []), updates.bookmarks[1]];
    }
    
    const updateResponse = await fetch(`${JSON_SERVER_URL}/collections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to update collection' },
        { status: 404 }
      );
    }
    
    const updatedCollection = await updateResponse.json();
    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error('Failed to update collection:', error);
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

// DELETE /api/collections/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(parseInt(params.id));
    
    // Delete collection
    const deleteResponse = await fetch(`${JSON_SERVER_URL}/collections/${id}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to delete collection' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Failed to delete collection:', error);
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
} 