'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './tags.module.css';
import type { Tag, Bookmark } from '@/types/bookmark';
import LinkItem from '@/components/LinkItem/LinkItem';

export default function TagPage() {
    const { id } = useParams();
    const [tag, setTag] = useState<Tag | null>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
        // Fetch tag and its bookmarks
        Promise.all([
            fetch(`/api/tags/${id}`).then(res => res.json()),
            fetch('/api/bookmarks').then(res => res.json())
        ]).then(([tagData, allBookmarks]) => {
            setTag(tagData);
            // Filter bookmarks that are in this tag's bookmarks array
            const tagBookmarks = allBookmarks.filter((bookmark: Bookmark) => 
                tagData.bookmarks?.includes(bookmark.id)
            );
            setBookmarks(tagBookmarks);
        }).catch(console.error);
    }, [id]);

    async function handleRemoveBookmark(id: number) {
        try {
            // Remove bookmark from tag
            const response = await fetch(`/api/tags/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookmarks: tag?.bookmarks.filter(bookmarkId => bookmarkId !== id)
                })
            });

            if (!response.ok) throw new Error('Failed to remove bookmark from tag');

            // Update local state
            setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
            if (tag) {
                setTag({
                    ...tag,
                    bookmarks: tag.bookmarks.filter(bookmarkId => bookmarkId !== id)
                });
            }
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        }
    }

    if (!tag) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/tags" className={styles.backLink}>
                    ← Tags
                </Link>
                <h1>{tag.name}</h1>
            </div>
            <div className={styles.bookmarkList}>
                {bookmarks.map(bookmark => (
                    <LinkItem
                        key={bookmark.id}
                        id={bookmark.id}
                        title={bookmark.title}
                        subtitle={new URL(bookmark.url).hostname}
                        icon={bookmark.favicon}
                        createdAt={bookmark.createdAt}
                        handleDelete={handleRemoveBookmark}
                    />
                ))}
                {bookmarks.length === 0 && (
                    <div className={styles.emptyState}>
                        No bookmarks with this tag yet
                    </div>
                )}
            </div>
        </div>
    );
} 