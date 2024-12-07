'use client';

import { useState, useEffect } from 'react';
import styles from './BookmarkForm.module.css';
import type { Tag, Folder } from '@/types/bookmark';

interface BookmarkFormProps {
  title: string;
  onSave: (data: { tags: number[], folderId?: number }) => void;
  onCancel: () => void;
}

export default function BookmarkForm({ title, onSave, onCancel }: BookmarkFormProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>();

  // fetch tags and folders
  useEffect(() => {
    Promise.all([
      fetch('/api/tags').then(res => res.json()),
      fetch('/api/folders').then(res => res.json())
    ]).then(([tagsData, foldersData]) => {
      setTags(tagsData);
      setFolders(foldersData);
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      tags: selectedTags,
      folderId: selectedFolder
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.form}>
        <h3>Add bookmark: {title}</h3>
        
        <div className={styles.field}>
          <label>Folder (optional)</label>
          <select 
            value={selectedFolder || ''} 
            onChange={(e) => setSelectedFolder(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Uncategorized</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Tag (optional)</label>
          <div className={styles.tags}>
            {tags.map(tag => (
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
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.saveButton}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 