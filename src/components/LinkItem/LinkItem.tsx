'use client';

import Image from 'next/image';
import styles from './LinkItem.module.css'
import { useState, useEffect } from 'react';
import type { Tag } from '@/types/bookmark';

export interface LinkItemProps {
    id: number;
    title: string;
    url: string;
    summary?: string;
    subtitle?: string;
    icon?: string;
    color?: string;
    createdAt: string;
    tags?: number[];
    handleDelete?: (id: number) => void;
    handleEdit?: (id: number, data: Partial<LinkItemProps>) => void;
}

const LinkItem = ({
    id,
    title,
    url,
    summary = '',
    subtitle,
    icon,
    color,
    createdAt,
    tags = [],
    handleDelete,
    handleEdit
}: LinkItemProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editUrl, setEditUrl] = useState(url);
    const [editSummary, setEditSummary] = useState(summary);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>(tags);

    // Reset form data when isEditing changes
    useEffect(() => {
        if (isEditing) {
            setEditTitle(title);
            setEditUrl(url);
            setEditSummary(summary);
            setSelectedTags(tags);
            // Fetch tags
            fetch('/api/tags')
                .then(res => res.json())
                .then(setAllTags)
                .catch(console.error);
        }
    }, [isEditing, title, url, summary, tags]);

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (handleEdit && editTitle.trim() && editUrl.trim()) {
            handleEdit(id, {
                title: editTitle.trim(),
                url: editUrl.trim(),
                summary: editSummary.trim(),
                tags: selectedTags
            });
        }
        setIsEditing(false);
        setShowMenu(false);
    }

    if (isEditing) {
        return (
            <div className={`${styles.item} ${styles.editing}`}>
                <form onSubmit={handleEditSubmit} className={styles.editForm}>
                    <div className={styles.field}>
                        <label>Title</label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>URL</label>
                        <input
                            type="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Summary</label>
                        <textarea
                            value={editSummary}
                            onChange={(e) => setEditSummary(e.target.value)}
                            placeholder="Add a description..."
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Tags</label>
                        <div className={styles.tags}>
                            {allTags.map(tag => (
                                <label key={tag.id} className={styles.tag}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTags(prev => [...prev, tag.id]);
                                            } else {
                                                setSelectedTags(prev => prev.filter(id => id !== tag.id));
                                            }
                                        }}
                                    />
                                    <span>{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.item}>
            <div className={styles.left}>
                <div className={styles.faviconContainer}>
                    {icon ? (
                        <Image 
                            src={icon} 
                            alt={title} 
                            width={24}
                            height={24}
                            className={styles.favicon}
                            unoptimized 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : color ? (
                        <div 
                            className={styles.colorCircle}
                            style={{ backgroundColor: color }}
                        />
                    ) : (
                        <div className={styles.faviconPlaceholder}>
                            {title?.substring(0, 1) || ''}
                        </div>
                    )}
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>{title}</div>
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.dateAdded}>
                    {new Date(createdAt).toLocaleDateString()}
                </div>
                <div className={styles.menuContainer}>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className={styles.moreButton}
                    >
                        More
                    </button>
                    {showMenu && (
                        <div className={styles.menu}>
                            <button onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                            }}>
                                Edit
                            </button>
                            <button onClick={() => {
                                handleDelete?.(id);
                                setShowMenu(false);
                            }}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinkItem;