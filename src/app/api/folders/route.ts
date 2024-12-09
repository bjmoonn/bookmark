import { NextResponse } from 'next/server';
import type { Folder } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/folders
export async function GET() {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/folders`);
    const folders = await response.json();
    return NextResponse.json(folders);
  } catch (error) {
    console.error('Failed to get folders:', error);
    return NextResponse.json(
      { error: 'Failed to get folders' },
      { status: 500 }
    );
  }
}

// POST /api/folders
export async function POST(request: Request) {
  try {
    const folder = await request.json();
    
    const response = await fetch(`${JSON_SERVER_URL}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folder)
    });
    
    const savedFolder = await response.json();
    return NextResponse.json(savedFolder);
  } catch (error) {
    console.error('Failed to create folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}

// PATCH /api/folders
export async function PATCH(request: Request) {
  try {
    const { id, bookmarks } = await request.json();
    
    const response = await fetch(`${JSON_SERVER_URL}/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarks })
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }
    
    const updatedFolder = await response.json();
    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error('Failed to update folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
} 