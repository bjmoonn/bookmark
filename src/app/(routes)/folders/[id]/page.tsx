'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './folder.module.css';
import type { Folder, Bookmark } from '@/types/bookmark';
import LinkItem from '@/components/LinkItem/LinkItem';
import { toast } from 'sonner';

/**
 * Displays a single folder and its bookmarks
 */
export default function FolderDetailPage() {
  const { id } = useParams();
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderBookmarks, setFolderBookmarks] = useState<Bookmark[]>([]);

  // fetch folder data and its bookmarks
  useEffect(() => {
    async function fetchFolderData() {
      try {
        const [folderResponse, bookmarksResponse] = await Promise.all([
          fetch(`/api/folders/${id}`),
          fetch('/api/bookmarks')
        ]);

        const folderData = await folderResponse.json();
        const allBookmarks = await bookmarksResponse.json();

        setCurrentFolder(folderData);

        // get bookmarks that belong to this folder
        const bookmarksInFolder = allBookmarks.filter((bookmark: Bookmark) =>
          folderData.bookmarks.includes(bookmark.id)
        );
        setFolderBookmarks(bookmarksInFolder);
      } catch (error) {
        console.error('Failed to fetch folder data:', error);
        toast.error('Failed to load folder');
      }
    }

    fetchFolderData();
  }, [id]);

  // update page title when folder name changes
  useEffect(() => {
    if (currentFolder?.name) {
      document.title = `${currentFolder.name} - Bookmarks`;
    }
  }, [currentFolder?.name]);

  async function removeBookmarkFromFolder(bookmarkId: number) {
    if (!currentFolder) return;

    try {
      const updatedBookmarks = currentFolder.bookmarks.filter(id => id !== bookmarkId);
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: updatedBookmarks
        })
      });

      if (!response.ok) throw new Error('Failed to remove bookmark from folder');

      // update local state
      setFolderBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
      setCurrentFolder(prev => prev ? {
        ...prev,
        bookmarks: updatedBookmarks
      } : null);

      toast.success('Bookmark removed from folder');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('Failed to remove bookmark from folder');
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
      setFolderBookmarks(prev => prev.map(bookmark =>
        bookmark.id === bookmarkId ? { ...bookmark, ...updates } : bookmark
      ));

      toast.success('Bookmark updated successfully');
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  }

  if (!currentFolder) {
    return <div>Loading folder...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/folders" className={styles.backLink}>
          ← Back to Folders
        </Link>
        <h1>{currentFolder.name}</h1>
      </div>
      <div className={styles.bookmarkList}>
        {folderBookmarks.map(bookmark => (
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
            handleDelete={removeBookmarkFromFolder}
            handleEdit={updateBookmarkDetails}
          />
        ))}
        {folderBookmarks.length === 0 && (
          <div className={styles.emptyState}>
            No bookmarks in this folder yet
          </div>
        )}
      </div>
    </div>
  );
} 