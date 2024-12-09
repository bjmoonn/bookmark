// tag represents a collection of bookmarks with a name
interface Tag {
  id: number;
  name: string;
  bookmarks: number[];
  createdAt: string;
}

// folder represents a collection of bookmarks with a name
interface Folder {
  id: number;
  name: string;
  bookmarks: number[];
  createdAt: string;
}

// collection represents a curated list of bookmarks
interface Collection {
  id: number;
  name: string;
  description: string;
  bookmarks: number[];
  createdAt: string;
  isPublic: boolean;
}

// bookmark represents a saved url with metadata
interface Bookmark {
  id: number;
  favicon?: string;
  title: string;
  url: string;
  tags: number[];
  collections: number[];
  summary: string;
  createdAt: string;
}

export type { Tag, Folder, Collection, Bookmark }; 