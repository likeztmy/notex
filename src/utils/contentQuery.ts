import type { Content, Folder } from "~/types/content";
import { extractPlainText } from "./contentText";

export function getRecentContentFromList(
  content: Content[],
  limit: number = 10
): Content[] {
  return content
    .filter((item) => item.lastViewed)
    .toSorted((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))
    .slice(0, limit);
}

export function getStarredContentFromList(content: Content[]): Content[] {
  return content.filter((item) => item.starred);
}

export function getContentByFolderFromList(
  content: Content[],
  folderId: string
): Content[] {
  return content.filter((item) => item.folderId === folderId);
}

export function getContentByTagFromList(
  content: Content[],
  tag: string
): Content[] {
  return content.filter((item) => item.tags?.includes(tag));
}

export function getSharedContentFromList(content: Content[]): Content[] {
  return content.filter(
    (item) => item.sharedWith && item.sharedWith.length > 0
  );
}

export function getPublicContentFromList(content: Content[]): Content[] {
  return content.filter((item) => item.publish?.isPublic);
}

export function getSeriesContentFromList(
  content: Content[],
  seriesId: string
): Content[] {
  return content.filter((item) => item.seriesId === seriesId);
}

export function getAllTagsFromContent(content: Content[]): string[] {
  const tagSet = new Set<string>();
  content.forEach((item) => {
    item.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getFolderByIdFromList(
  folders: Folder[],
  folderId: string
): Folder | undefined {
  return folders.find((folder) => folder.id === folderId);
}

export function searchContentFromList(
  content: Content[],
  query: string
): Content[] {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return [];

  return content.filter((item) => {
    if (item.title.toLowerCase().includes(lowerQuery)) return true;
    if (item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    const text = extractPlainText(item.docContent).toLowerCase();
    return Boolean(text && text.includes(lowerQuery));
  });
}
