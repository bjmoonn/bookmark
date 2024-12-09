import { NextResponse } from 'next/server';
import type { Collection } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/collections
export async function GET() {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/collections`);
    const collections = await response.json();
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Failed to get collections:', error);
    return NextResponse.json(
      { error: 'Failed to get collections' },
      { status: 500 }
    );
  }
}

// POST /api/collections
export async function POST(request: Request) {
  try {
    const collection = await request.json();
    
    const response = await fetch(`${JSON_SERVER_URL}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection)
    });
    
    const savedCollection = await response.json();
    return NextResponse.json(savedCollection);
  } catch (error) {
    console.error('Failed to create collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
} 