'use client';

import { useState, useEffect } from 'react';
import styles from './folders.module.css';
import type { Folder } from '@/types/bookmark';
import LinkField from '@/components/LinkField/LinkField';
import ListItem from '@/components/ListItem/ListItem';
import Link from 'next/link';

export default function FoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/folders')
            .then(res => res.json())
            .then(setFolders)
            .catch(console.error);
    }, []);

    async function handleAddFolder(name: string) {
        setLoading(true);
        const newFolder = {
            id: Date.now(),
            name: name.trim(),
            bookmarks: [],
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFolder)
            });

            if (!response.ok) throw new Error('Failed to add folder');

            setFolders(prev => [...prev, newFolder]);
        } catch (error) {
            console.error('Failed to add folder:', error);
        }
        setLoading(false);
    }

    async function handleEditFolder(id: number, data: { title: string }) {
        try {
            const response = await fetch(`/api/folders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.title })
            });

            if (!response.ok) throw new Error('Failed to update folder');

            setFolders(prev => prev.map(folder => 
                folder.id === id ? { ...folder, name: data.title } : folder
            ));
        } catch (error) {
            console.error('Failed to update folder:', error);
        }
    }

    async function handleDeleteFolder(id: number) {
        try {
            const response = await fetch(`/api/folders/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete folder');

            setFolders(prev => prev.filter(folder => folder.id !== id));
        } catch (error) {
            console.error('Failed to delete folder:', error);
        }
    }

    return (
        <div className={styles.container}>
            <LinkField 
                handleAdd={handleAddFolder}
                loading={loading}
                placeholder="Type to create folder"
            />
            <div className={styles.list}>
                {folders.map(folder => (
                    <Link 
                        key={folder.id} 
                        href={`/folders/${folder.id}`}
                        className={styles.folderLink}
                    >
                        <ListItem
                            id={folder.id}
                            title={folder.name}
                            subtitle={`${folder.bookmarks?.length || 0} bookmarks`}
                            createdAt={folder.createdAt}
                            handleDelete={handleDeleteFolder}
                            handleEdit={(id, data) => handleEditFolder(id, data)}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
} 