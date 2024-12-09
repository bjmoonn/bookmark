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
        Bookmarks
      </Link>
      <Link 
        href="/folders" 
        className={pathname.startsWith('/folders') ? styles.active : ''}
      >
        Folders
      </Link>
      <Link 
        href="/tags" 
        className={pathname.startsWith('/tags') ? styles.active : ''}
      >
        Tags
      </Link>
      <Link 
        href="/settings" 
        className={pathname === '/settings' ? styles.active : ''}
      >
        Settings
      </Link>
    </nav>
  );
};

export default Navigation; 