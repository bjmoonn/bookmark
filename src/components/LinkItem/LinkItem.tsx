'use client';

import Image from 'next/image';
import styles from './LinkItem.module.css'
import { useState } from 'react';

export interface LinkItemProps {
    id: number;
    title: string;
    subtitle?: string;
    icon?: string;
    color?: string;
    createdAt: string;
    handleDelete?: (id: number) => void;
    handleEdit?: (id: number, data: Partial<LinkItemProps>) => void;
}

const LinkItem = ({
    id,
    title,
    subtitle,
    icon,
    color,
    createdAt,
    handleDelete,
    handleEdit
}: LinkItemProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState(title);

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (handleEdit && editTitle.trim()) {
            handleEdit(id, { title: editTitle.trim() });
        }
        setIsEditing(false);
        setShowMenu(false);
    }

    if (isEditing) {
        return (
            <div className={`${styles.item} ${styles.editing}`}>
                <form onSubmit={handleEditSubmit} className={styles.editForm}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                    />
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