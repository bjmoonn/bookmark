import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = await Promise.resolve(parseInt(params.id));
    try {
        const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        const tag = data.tags.find((t: any) => t.id === id);
        
        if (!tag) {
            return NextResponse.json(
                { error: 'Tag not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(tag);
    } catch (error) {
        console.error('Failed to get tag:', error);
        return NextResponse.json(
            { error: 'Failed to get tag' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = await Promise.resolve(parseInt(params.id));
    try {
        const updates = await request.json();
        
        const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        
        data.tags = data.tags.map((tag: any) => {
            if (tag.id === id) {
                // Handle special case for appending to bookmarks array
                if (updates.bookmarks && Array.isArray(updates.bookmarks) && updates.bookmarks[0] === 'append') {
                    return {
                        ...tag,
                        bookmarks: [...(tag.bookmarks || []), updates.bookmarks[1]]
                    };
                }
                // Handle normal updates (like name changes)
                return { ...tag, ...updates };
            }
            return tag;
        });
        
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ message: 'Tag updated successfully' });
    } catch (error) {
        console.error('Failed to update tag:', error);
        return NextResponse.json(
            { error: 'Failed to update tag' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = await Promise.resolve(parseInt(params.id));
    try {
        const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        
        data.tags = data.tags.filter((tag: any) => tag.id !== id);
        
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Failed to delete tag:', error);
        return NextResponse.json(
            { error: 'Failed to delete tag' },
            { status: 500 }
        );
    }
} 