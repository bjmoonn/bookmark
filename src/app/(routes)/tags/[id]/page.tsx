'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './tags.module.css';
import type { Tag, Bookmark } from '@/types/bookmark';
import LinkItem from '@/components/LinkItem/LinkItem';
import { toast } from 'sonner';

/**
 * Displays a single tag and its associated bookmarks
 */
export default function TagDetailPage() {
  const { id } = useParams();
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [taggedBookmarks, setTaggedBookmarks] = useState<Bookmark[]>([]);

  // fetch tag data and its bookmarks
  useEffect(() => {
    async function fetchTagData() {
      try {
        const [tagResponse, bookmarksResponse] = await Promise.all([
          fetch(`/api/tags/${id}`),
          fetch('/api/bookmarks')
        ]);

        const tagData = await tagResponse.json();
        const allBookmarks = await bookmarksResponse.json();

        setCurrentTag(tagData);

        // get bookmarks that have this tag
        const bookmarksWithTag = allBookmarks.filter((bookmark: Bookmark) =>
          tagData.bookmarks?.includes(bookmark.id)
        );
        setTaggedBookmarks(bookmarksWithTag);
      } catch (error) {
        console.error('Failed to fetch tag data:', error);
        toast.error('Failed to load tag');
      }
    }

    fetchTagData();
  }, [id]);

  // update page title when tag name changes
  useEffect(() => {
    if (currentTag?.name) {
      document.title = `${currentTag.name} - Bookmarks`;
    }
  }, [currentTag?.name]);

  async function removeBookmarkFromTag(bookmarkId: number) {
    if (!currentTag) return;

    try {
      const updatedBookmarks = currentTag.bookmarks.filter(id => id !== bookmarkId);
      const response = await fetch(`/api/tags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: updatedBookmarks
        })
      });

      if (!response.ok) throw new Error('Failed to remove bookmark from tag');

      // update local state
      setTaggedBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
      setCurrentTag(prev => prev ? {
        ...prev,
        bookmarks: updatedBookmarks
      } : null);

      toast.success('Bookmark removed from tag');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('Failed to remove bookmark from tag');
    }
  }

  async function updateBookmarkDetails(bookmarkId: number, updates: Partial<Bookmark>) {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update bookmark');

      // update local state with new bookmark details
      setTaggedBookmarks(prev => prev.map(bookmark =>
        bookmark.id === bookmarkId ? { ...bookmark, ...updates } : bookmark
      ));

      toast.success('Bookmark updated successfully');
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  }

  if (!currentTag) {
    return <div>Loading tag...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/tags" className={styles.backLink}>
          ← Back to Tags
        </Link>
        <h1>{currentTag.name}</h1>
      </div>
      <div className={styles.bookmarkList}>
        {taggedBookmarks.map(bookmark => (
          <LinkItem
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            url={bookmark.url}
            summary={bookmark.summary}
            subtitle={new URL(bookmark.url).hostname}
            icon={bookmark.favicon}
            tags={bookmark.tags}
            createdAt={bookmark.createdAt}
            handleDelete={removeBookmarkFromTag}
            handleEdit={updateBookmarkDetails}
          />
        ))}
        {taggedBookmarks.length === 0 && (
          <div className={styles.emptyState}>
            No bookmarks with this tag yet
          </div>
        )}
      </div>
    </div>
  );
} 