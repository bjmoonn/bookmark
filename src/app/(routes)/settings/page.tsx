'use client';

import { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { toast } from 'sonner';

type WipeOption = 'all' | 'bookmarks' | 'folders' | 'tags';

export default function Settings() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wipeOption, setWipeOption] = useState<WipeOption>('all');

  // set page title
  useEffect(() => {
    document.title = 'Settings - Bookmarks';
  }, []);

  async function handleWipeDB() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/wipe-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: wipeOption })
      });

      if (!response.ok) throw new Error('Failed to wipe database');
      
      // Reset confirmation state
      setIsConfirming(false);
      toast.success(`Successfully wiped ${wipeOption === 'all' ? 'all data' : wipeOption}`);
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Failed to wipe database:', error);
      toast.error('Failed to wipe database');
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.radioGroup}>
          <label className={styles.radio}>
            <input
              type="radio"
              name="wipeOption"
              value="all"
              checked={wipeOption === 'all'}
              onChange={(e) => setWipeOption(e.target.value as WipeOption)}
            />
            <span>All Data</span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="wipeOption"
              value="bookmarks"
              checked={wipeOption === 'bookmarks'}
              onChange={(e) => setWipeOption(e.target.value as WipeOption)}
            />
            <span>Bookmarks Only</span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="wipeOption"
              value="folders"
              checked={wipeOption === 'folders'}
              onChange={(e) => setWipeOption(e.target.value as WipeOption)}
            />
            <span>Folders Only</span>
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="wipeOption"
              value="tags"
              checked={wipeOption === 'tags'}
              onChange={(e) => setWipeOption(e.target.value as WipeOption)}
            />
            <span>Tags Only</span>
          </label>
        </div>

        {!isConfirming ? (
          <button 
            onClick={() => setIsConfirming(true)}
            className={styles.dangerButton}
          >
            Wipe Selected Data
          </button>
        ) : (
          <div className={styles.confirmationBox}>
            <p>Are you sure? This will delete all {wipeOption === 'all' ? 'data' : wipeOption}.</p>
            <div className={styles.buttonGroup}>
              <button 
                onClick={() => setIsConfirming(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleWipeDB}
                className={styles.dangerButton}
                disabled={loading}
              >
                {loading ? 'Wiping...' : 'Yes, wipe selected data'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 