// Document Content Type System

export type ContentMode = "doc";

// Style Configuration Types
export type FontFamily = "sans" | "serif" | "mono";
export type FontSize = "small" | "medium" | "large";
export type ContentWidth = "narrow" | "medium" | "wide" | "full";
export type LineHeight = "compact" | "normal" | "relaxed";
export type TextAlign = "left" | "justify";

export interface StyleConfig {
  fontFamily: FontFamily;
  fontSize: FontSize;
  contentWidth: ContentWidth;
  lineHeight: LineHeight;
  textAlign: TextAlign;
}

// Default style configuration
export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  fontFamily: "sans",
  fontSize: "medium",
  contentWidth: "medium",
  lineHeight: "normal",
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
    docContent: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
  };
}
