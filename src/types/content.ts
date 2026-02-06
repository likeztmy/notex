// Document Content Type System

export type ContentMode = "doc";

// Style Configuration Types
export type FontFamily = "sans" | "serif" | "mono";
export type FontSize = "small" | "medium" | "large";
export type ContentWidth = "narrow" | "medium" | "wide" | "full";
export type LineHeight = "compact" | "normal" | "relaxed";
export type TextAlign = "left" | "justify";
export type PublicTheme = "minimal" | "editorial" | "noir";

export interface StyleConfig {
  fontFamily: FontFamily;
  fontSize: FontSize;
  contentWidth: ContentWidth;
  lineHeight: LineHeight;
  textAlign: TextAlign;
}

export interface PublishSettings {
  isPublic: boolean;
  theme: PublicTheme;
  slug?: string;
  description?: string;
  ogImage?: string;
}

export interface PublicStats {
  views: number;
  lastViewedAt?: number;
  firstPublishedAt?: number;
  lastPublishedAt?: number;
  reads7d?: number;
  dailyViews?: Record<string, number>;
}

export interface AuthorProfile {
  displayName: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  featuredContentIds?: string[];
  featuredSeriesIds?: string[];
}

// Default style configuration
export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  fontFamily: "serif",
  fontSize: "medium",
  contentWidth: "medium",
  lineHeight: "relaxed",
  textAlign: "left",
};

// Folder type
export interface Folder {
  id: string;
  name: string;
  emoji?: string;
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean; // For "Unsorted" folder that cannot be deleted
}

export interface Series {
  id: string;
  title: string;
  description?: string;
  contentIds: string[];
  createdAt: number;
  updatedAt: number;
}

// Helper function to create a new folder
export function createFolder(name: string, emoji?: string): Folder {
  const now = Date.now();
  const id = `folder_${now}_${Math.random().toString(36).substr(2, 9)}`;
  return {
    id,
    name,
    emoji,
    createdAt: now,
    updatedAt: now,
  };
}

// Default folders
export const DEFAULT_FOLDERS: Folder[] = [
  {
    id: "unsorted",
    name: "Unsorted",
    createdAt: 0,
    updatedAt: 0,
    isDefault: true,
  },
];

export interface Content {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastViewed?: number;

  // Content mode (always "doc" for now)
  mode: ContentMode;

  // Doc content (TipTap JSON)
  docContent?: any;

  // Style configuration
  styleConfig?: StyleConfig;

  // Metadata
  starred?: boolean;
  folderId?: string;
  tags?: string[];
  sharedWith?: string[];
  seriesId?: string;
  publish?: PublishSettings;
  publicStats?: PublicStats;
}

// Helper function to create new content
export function createContent(title: string = ""): Content {
  const now = Date.now();
  const id = `content_${now}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    title,
    mode: "doc",
    createdAt: now,
    updatedAt: now,
    lastViewed: now,
    publish: {
      isPublic: false,
      theme: "minimal",
    },
    publicStats: {
      views: 0,
      reads7d: 0,
      dailyViews: {},
    },
    docContent: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
  };
}

export function createSeries(title: string, description?: string): Series {
  const now = Date.now();
  const id = `series_${now}_${Math.random().toString(36).substr(2, 9)}`;
  return {
    id,
    title,
    description,
    contentIds: [],
    createdAt: now,
    updatedAt: now,
  };
}
