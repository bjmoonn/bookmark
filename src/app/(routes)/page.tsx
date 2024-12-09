'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import LinkField from '@/components/LinkField/LinkField'
import LinkItem from '@/components/LinkItem/LinkItem';
import type { Bookmark } from '@/types/bookmark';
import BookmarkForm from '@/components/BookmarkForm/BookmarkForm';
import { toast } from 'sonner';

const API_KEY_TO_USE = process.env.NEXT_PUBLIC_LINK_API

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [links, setLinks] = useState<Bookmark[]>([])
  const [pendingBookmark, setPendingBookmark] = useState<Bookmark | null>(null);

  // set page title
  useEffect(() => {
    document.title = 'Home - Bookmarks';
  }, []);

  // fetch bookmarks on mount
  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setLinks(data);
        } else {
          console.error('Expected array of bookmarks but got:', data);
          setLinks([]);
        }
      })
      .catch(error => {
        console.error('Failed to fetch bookmarks:', error);
        setLinks([]);
      });
  }, [])

  async function handleAddLink(link: string) {
    if(loading) return;
    if(!link) return;
    setLoading(true);

    try {
      // Format URL if needed
      const formattedLink = link.startsWith('http') ? link : `https://${link}`;

      // Fetch link preview
      const response = await fetch(`https://api.linkpreview.net/?key=${API_KEY_TO_USE}&q=${encodeURI(formattedLink)}`);
      const linkPreview = await response.json();

      if (!linkPreview?.title) {
        toast.error('Could not fetch link preview');
        setLoading(false);
        return;
      }

      // Set pending bookmark to show BookmarkForm
      setPendingBookmark({
        id: Date.now(),
        favicon: linkPreview.image,
        title: linkPreview.title,
        url: linkPreview.url || formattedLink,
        summary: linkPreview.description || '',
        tags: [],
        collections: [],
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch link preview:', error);
      toast.error('Failed to fetch link preview');
    }

    setLoading(false);
  }

  async function handleSaveBookmark(data: { tags: number[], folderId?: number }) {
    if (!pendingBookmark) return;
    
    try {
      // First save the bookmark
      const bookmarkResponse = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingBookmark,
          tags: data.tags
        })
      });
      
      if (!bookmarkResponse.ok) throw new Error('Failed to save bookmark');
      
      const savedBookmark = await bookmarkResponse.json();
      setLinks(prev => [savedBookmark, ...prev]);

      // Update folder if selected
      if (data.folderId) {
        const folderResponse = await fetch(`/api/folders/${data.folderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookmarks: ['append', savedBookmark.id]
          })
        });

        if (!folderResponse.ok) throw new Error('Failed to update folder');
      }

      // Update all selected tags
      for (const tagId of data.tags) {
        const tagResponse = await fetch(`/api/tags/${tagId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookmarks: ['append', savedBookmark.id]
          })
        });

        if (!tagResponse.ok) throw new Error('Failed to update tag');
      }

      toast.success('Bookmark added successfully');
    } catch (error) {
      console.error('Failed to save bookmark:', error);
      toast.error('Failed to save bookmark');
    }

    setPendingBookmark(null);
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to delete bookmark');

      // update local state
      setLinks(prev => prev.filter(link => link.id !== id));
      toast.success('Bookmark deleted successfully');
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
      toast.error('Failed to delete bookmark');
    }
  }

  async function handleEdit(id: number, data: Partial<Bookmark>) {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update bookmark');

      // update local state
      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...data } : link
      ));
      toast.success('Bookmark updated successfully');
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  }

  return (
    <div className={styles.container}>
      <LinkField handleAdd={handleAddLink} loading={loading} validateUrl />
      <div className={styles.links}>
        {Array.isArray(links) && links.map(link => (
          <LinkItem 
            key={link.id}
            id={link.id}
            title={link.title}
            url={link.url}
            summary={link.summary}
            subtitle={new URL(link.url).hostname}
            icon={link.favicon}
            tags={link.tags}
            createdAt={link.createdAt}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
      {pendingBookmark && (
        <BookmarkForm
          title={pendingBookmark.title}
          onSave={handleSaveBookmark}
          onCancel={() => setPendingBookmark(null)}
        />
      )}
    </div>
  )
}
