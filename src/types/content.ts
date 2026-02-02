// Document Content Type System
import type { Block } from "./block";

export type ContentMode = "doc" | "canvas";

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

export interface Content {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastViewed?: number;

  // Primary editing mode
  mode: ContentMode;

  // Doc content (TipTap JSON) - for "doc" mode
  docContent?: any;

  // Canvas content (Block array) - for "canvas" mode
  canvasBlocks?: Block[];

  // Style configuration
  styleConfig?: StyleConfig;

  // Metadata
  starred?: boolean;
  folderId?: string;
  tags?: string[];
  sharedWith?: string[];
}

// Helper function to create new content
export function createContent(
  title: string = "",
  mode: ContentMode = "doc",
): Content {
  const now = Date.now();
  const id = `content_${now}_${Math.random().toString(36).substr(2, 9)}`;

  const baseContent = {
    id,
    title,
    mode,
    createdAt: now,
    updatedAt: now,
    lastViewed: now,
  };

  if (mode === "canvas") {
    return {
      ...baseContent,
      canvasBlocks: [],
    };
  }

  return {
    ...baseContent,
    docContent: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
  };
}
