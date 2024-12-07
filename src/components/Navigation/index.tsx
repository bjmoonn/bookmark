'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

// navigation component that shows active state
const Navigation = () => {
  // get current path to determine active link
  const pathname = usePathname();
  
  return (
    <nav className={styles.nav}>
      <Link 
        href="/" 
        className={pathname === '/' ? styles.active : ''}
      >
        bookmarks
      </Link>
      <Link 
        href="/folders" 
        className={pathname.startsWith('/folders') ? styles.active : ''}
      >
        folders
      </Link>
      <Link 
        href="/tags" 
        className={pathname.startsWith('/tags') ? styles.active : ''}
      >
        tags
      </Link>
      <Link 
        href="/settings" 
        className={pathname === '/settings' ? styles.active : ''}
      >
        settings
      </Link>
    </nav>
  );
};

export default Navigation; 