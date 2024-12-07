'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import LinkField from '@/components/LinkField/LinkField'
import LinkItem from '@/components/LinkItem/LinkItem';
import type { Bookmark } from '@/types/bookmark';
import BookmarkForm from '@/components/BookmarkForm/BookmarkForm';

const API_KEY_TO_USE = process.env.NEXT_PUBLIC_LINK_API

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [links, setLinks] = useState<Bookmark[]>([])
  const [pendingBookmark, setPendingBookmark] = useState<any>(null);

  // fetch bookmarks on mount
  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(setLinks)
      .catch(console.error);
  }, [])

  async function handleAddLink(link: string) {
    if(loading) return
    if(!link) return
    setLoading(true)

    const formattedLink = link.startsWith('http') ? link : `https://${link}`

    let linkPreview: any = {}
    
    try {
      const response = await fetch(`https://api.linkpreview.net/?key=${API_KEY_TO_USE}&q=${encodeURI(formattedLink)}`);
      linkPreview = await response.json();
    } catch (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (!linkPreview?.title) {
      setLoading(false)
      return
    }

    // instead of saving immediately, set as pending
    setPendingBookmark({
      id: Date.now(),
      favicon: linkPreview.image,
      title: linkPreview.title,
      url: linkPreview.url,
      summary: linkPreview.description || '',
      createdAt: new Date().toISOString()
    });
    
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
        
        setLinks(prev => [pendingBookmark, ...prev]);

        // Update folder if selected
        if (data.folderId) {
            const folderResponse = await fetch(`/api/folders/${data.folderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookmarks: ['append', pendingBookmark.id]
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
                    bookmarks: ['append', pendingBookmark.id]
                })
            });

            if (!tagResponse.ok) throw new Error('Failed to update tag');
        }
    } catch (error) {
        console.error('Failed to save bookmark:', error);
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
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
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
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    }
  }

  return (
    <div className={styles.container}>
      <LinkField handleAdd={handleAddLink} loading={loading} />
      <div className={styles.links}>
        {links?.map(link => (
          <LinkItem 
            key={link.id}
            id={link.id}
            title={link.title}
            subtitle={new URL(link.url).hostname}
            icon={link.favicon}
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
