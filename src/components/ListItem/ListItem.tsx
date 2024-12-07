// listItem for main route pages

'use client';

import Image from 'next/image';
import styles from './ListItem.module.css'
import { useState } from 'react';

// props interface for list item component
export interface ListItemProps {
    id: number;
    title: string;
    subtitle?: string;
    icon?: string;
    color?: string;
    createdAt: string;
    handleDelete?: (id: number) => void;
    handleEdit?: (id: number, data: { title: string }) => void;
}

const ListItem = ({
    id,
    title,
    subtitle,
    icon,
    color,
    createdAt,
    handleDelete,
    handleEdit
}: ListItemProps) => {
    // state for menu visibility and edit mode
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editTitle, setEditTitle] = useState(title);

    // handle form submission for editing
    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (handleEdit && editTitle.trim()) {
            handleEdit(id, { title: editTitle.trim() });
            setIsEditing(false);
            setShowMenu(false);
        }
    }

    // handle menu button click
    function handleMenuClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setShowMenu(!showMenu);
    }

    // handle edit button click
    function handleEditClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);
        setShowMenu(false);
    }

    // handle delete button click
    function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (handleDelete) {
            handleDelete(id);
        }
        setShowMenu(false);
    }

    // render edit form when editing
    if (isEditing) {
        return (
            <div className={`${styles.item} ${styles.editing}`} onClick={e => e.stopPropagation()}>
                <form onSubmit={handleEditSubmit} className={styles.editForm}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                    />
                    <div className={styles.buttons}>
                        <button 
                            type="button" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        );
    }

    // render normal list item view
    return (
        <div className={styles.item} onClick={e => e.stopPropagation()}>
            <div className={styles.left}>
                <div className={styles.faviconContainer}>
                    {icon ? (
                        // show favicon if available
                        <Image 
                            src={icon} 
                            alt={title} 
                            width={24}
                            height={24}
                            className={styles.favicon}
                            unoptimized 
                        />
                    ) : color ? (
                        // show color circle if color is provided
                        <div 
                            className={styles.colorCircle}
                            style={{ backgroundColor: color }}
                        />
                    ) : (
                        // show first letter as fallback
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
                        onClick={handleMenuClick}
                        className={styles.moreButton}
                    >
                        More
                    </button>
                    {showMenu && (
                        <div 
                            className={styles.menu}
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={handleEditClick}>
                                Edit
                            </button>
                            <button onClick={handleDeleteClick}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListItem; 