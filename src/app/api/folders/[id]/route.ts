import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        const folder = data.folders.find((f: any) => f.id === id);
        
        if (!folder) {
            return NextResponse.json(
                { error: 'Folder not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(folder);
    } catch (error) {
        console.error('Failed to get folder:', error);
        return NextResponse.json(
            { error: 'Failed to get folder' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const updates = await request.json();
        
        const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        
        data.folders = data.folders.map((folder: any) => {
            if (folder.id === id) {
                // Handle special case for appending to bookmarks array
                if (updates.bookmarks && Array.isArray(updates.bookmarks) && updates.bookmarks[0] === 'append') {
                    return {
                        ...folder,
                        bookmarks: [...(folder.bookmarks || []), updates.bookmarks[1]]
                    };
                }
                // Handle normal updates
                return { ...folder, ...updates };
            }
            return folder;
        });
        
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ message: 'Folder updated successfully' });
    } catch (error) {
        console.error('Failed to update folder:', error);
        return NextResponse.json(
            { error: 'Failed to update folder' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        
        const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
        
        data.folders = data.folders.filter((folder: any) => folder.id !== id);
        
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
        
        return NextResponse.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Failed to delete folder:', error);
        return NextResponse.json(
            { error: 'Failed to delete folder' },
            { status: 500 }
        );
    }
} 