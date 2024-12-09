'use client';

import { useState, useEffect } from 'react';
import styles from './folders.module.css';
import type { Folder } from '@/types/bookmark';
import LinkField from '@/components/LinkField/LinkField';
import ListItem from '@/components/ListItem/ListItem';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Folders - Bookmarks';
    }, []);

    useEffect(() => {
        fetch('/api/folders')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFolders(data);
                } else {
                    console.error('Expected array of folders but got:', data);
                    setFolders([]);
                }
            })
            .catch(error => {
                console.error('Failed to fetch folders:', error);
                setFolders([]);
            });
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
            const savedFolder = await response.json();
            setFolders(prev => [...prev, savedFolder]);
            toast.success('Folder created successfully');
        } catch (error) {
            console.error('Failed to add folder:', error);
            toast.error('Failed to create folder');
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
            const updatedFolder = await response.json();
            setFolders(prev => prev.map(folder => 
                folder.id === id ? updatedFolder : folder
            ));
            toast.success('Folder updated successfully');
        } catch (error) {
            console.error('Failed to update folder:', error);
            toast.error('Failed to update folder');
        }
    }

    async function handleDeleteFolder(id: number) {
        try {
            const response = await fetch(`/api/folders/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete folder');
            setFolders(prev => prev.filter(folder => folder.id !== id));
            toast.success('Folder deleted successfully');
        } catch (error) {
            console.error('Failed to delete folder:', error);
            toast.error('Failed to delete folder');
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
                {Array.isArray(folders) && folders.map(folder => (
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