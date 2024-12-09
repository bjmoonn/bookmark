import { NextResponse } from 'next/server';
import type { Tag } from '@/types/bookmark';

const JSON_SERVER_URL = 'http://localhost:3001';

// GET /api/tags
export async function GET() {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/tags`);
    const tags = await response.json();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to get tags:', error);
    return NextResponse.json(
      { error: 'Failed to get tags' },
      { status: 500 }
    );
  }
}

// POST /api/tags
export async function POST(request: Request) {
  try {
    const tag = await request.json();
    
    const response = await fetch(`${JSON_SERVER_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag)
    });
    
    const savedTag = await response.json();
    return NextResponse.json(savedTag);
  } catch (error) {
    console.error('Failed to create tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
} 