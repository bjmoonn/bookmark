'use client';

import { useState, useEffect } from 'react';
import styles from './tags.module.css';
import type { Tag } from '@/types/bookmark';
import LinkField from '@/components/LinkField/LinkField';
import ListItem from '@/components/ListItem/ListItem';
import Link from 'next/link';
import { toast } from 'sonner';

// generate a consistent color based on tag name
function generateTagColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 65%)`;
}

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);

    // set page title
    useEffect(() => {
        document.title = 'Tags - Bookmarks';
    }, []);

    // fetch tags on component mount
    useEffect(() => {
        fetch('/api/tags')
            .then(res => res.json())
            .then(data => {
                // Ensure data is an array before setting it
                if (Array.isArray(data)) {
                    setTags(data);
                } else {
                    console.error('Expected array of tags but got:', data);
                    setTags([]);
                }
            })
            .catch(error => {
                console.error('Failed to fetch tags:', error);
                setTags([]);
            });
    }, []);

    async function handleAddTag(name: string) {
        setLoading(true);
        const newTag = {
            id: Date.now(),
            name: name.trim(),
            bookmarks: [],
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTag)
            });

            if (!response.ok) throw new Error('Failed to add tag');
            const savedTag = await response.json();
            setTags(prev => [...prev, savedTag]);
            toast.success('Tag created successfully');
        } catch (error) {
            console.error('Failed to add tag:', error);
            toast.error('Failed to create tag');
        }
        setLoading(false);
    }

    async function handleEditTag(id: number, data: { title: string }) {
        try {
            const response = await fetch(`/api/tags/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.title })
            });

            if (!response.ok) throw new Error('Failed to update tag');
            const updatedTag = await response.json();
            setTags(prev => prev.map(tag => 
                tag.id === id ? updatedTag : tag
            ));
            toast.success('Tag updated successfully');
        } catch (error) {
            console.error('Failed to update tag:', error);
            toast.error('Failed to update tag');
        }
    }

    async function handleDeleteTag(id: number) {
        try {
            const response = await fetch(`/api/tags/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete tag');
            setTags(prev => prev.filter(tag => tag.id !== id));
            toast.success('Tag deleted successfully');
        } catch (error) {
            console.error('Failed to delete tag:', error);
            toast.error('Failed to delete tag');
        }
    }

    return (
        <div className={styles.container}>
            <LinkField 
                handleAdd={handleAddTag}
                loading={loading}
                placeholder="Type to create tag"
            />
            <div className={styles.list}>
                {Array.isArray(tags) && tags.map(tag => (
                    <Link 
                        key={tag.id} 
                        href={`/tags/${tag.id}`}
                        className={styles.tagLink}
                    >
                        <ListItem
                            id={tag.id}
                            title={tag.name}
                            color={generateTagColor(tag.name)}
                            subtitle={`${tag.bookmarks?.length || 0} bookmarks`}
                            createdAt={tag.createdAt}
                            handleDelete={handleDeleteTag}
                            handleEdit={(id, data) => handleEditTag(id, data)}
                        />
                    </Link>
                ))}

            </div>
        </div>
    );
} 