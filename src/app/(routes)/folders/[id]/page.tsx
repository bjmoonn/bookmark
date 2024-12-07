'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './folder.module.css';
import type { Folder, Bookmark } from '@/types/bookmark';
import LinkItem from '@/components/LinkItem/LinkItem';

export default function FolderPage() {
    const { id } = useParams();
    const [folder, setFolder] = useState<Folder | null>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
        // Fetch folder and its bookmarks
        Promise.all([
            fetch(`/api/folders/${id}`).then(res => res.json()),
            fetch('/api/bookmarks').then(res => res.json())
        ]).then(([folderData, allBookmarks]) => {
            setFolder(folderData);
            // Filter bookmarks that belong to this folder
            const folderBookmarks = allBookmarks.filter((bookmark: Bookmark) => 
                folderData.bookmarks.includes(bookmark.id)
            );
            setBookmarks(folderBookmarks);
        }).catch(console.error);
    }, [id]);

    useEffect(() => {
        if (folder?.name) {
            document.title = `${folder.name} - Bookmarks`;
        }
    }, [folder?.name]);

    async function handleDeleteBookmark(id: number) {
        try {
            // Remove bookmark from folder
            const response = await fetch(`/api/folders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookmarks: folder?.bookmarks.filter(bookmarkId => bookmarkId !== id)
                })
            });

            if (!response.ok) throw new Error('Failed to remove bookmark from folder');

            // Update local state
            setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
            if (folder) {
                setFolder({
                    ...folder,
                    bookmarks: folder.bookmarks.filter(bookmarkId => bookmarkId !== id)
                });
            }
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        }
    }

    if (!folder) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/folders" className={styles.backLink}>
                    ← Folders
                </Link>
                <h1>{folder.name}</h1>
            </div>
            <div className={styles.bookmarkList}>
                {bookmarks.map(bookmark => (
                    <LinkItem
                        key={bookmark.id}
                        id={bookmark.id}
                        title={bookmark.title}
                        url={bookmark.url}
                        subtitle={new URL(bookmark.url).hostname}
                        icon={bookmark.favicon}
                        tags={bookmark.tags}
                        createdAt={bookmark.createdAt}
                        handleDelete={handleDeleteBookmark}
                    />
                ))}
                {bookmarks.length === 0 && (
                    <div className={styles.emptyState}>
                        No bookmarks in this folder yet
                    </div>
                )}
            </div>
        </div>
    );
} 