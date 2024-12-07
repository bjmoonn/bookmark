'use client';

import { useState } from 'react';
import styles from './settings.module.css';

export default function Settings() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWipeDB() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/wipe-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to wipe database');
      
      // Reset confirmation state
      setIsConfirming(false);
      
      // Optional: Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to wipe database:', error);
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
        {!isConfirming ? (
          <button 
            onClick={() => setIsConfirming(true)}
            className={styles.dangerButton}
          >
            Wipe Database
          </button>
        ) : (
          <div className={styles.confirmationBox}>
            <p>Are you sure? This will delete all bookmarks, folders, and tags.</p>
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
                {loading ? 'Wiping...' : 'Yes, wipe everything'}
              </button>
            </div>
          </div>
        )}
    </div>
  );
} 