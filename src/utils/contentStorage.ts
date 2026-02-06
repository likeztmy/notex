import {
  Content,
  AuthorProfile,
  createContent,
  Folder,
  createFolder,
  DEFAULT_FOLDERS,
  Series,
  createSeries,
} from "~/types/content";
import { extractPlainText } from "~/utils/contentText";

const CONTENT_KEY = "notex-content";
const FOLDERS_KEY = "notex-folders";
const SERIES_KEY = "notex-series";
const PROFILE_KEY = "notex-profile";
const LEGACY_DOCS_KEY = "notex-documents";

// Legacy document type for migration
interface LegacyDocument {
  id: string;
  title: string;
  content: any;
  createdAt: number;
  updatedAt: number;
  lastViewed?: number;
}

// Load all content from localStorage
export function loadContent(): Content[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(CONTENT_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Content[];
      return mergeLegacyDocuments(parsed).map(normalizeContent);
    } catch (e) {
      console.error("Failed to parse saved content:", e);
      return [];
    }
  }

  // Try to migrate legacy documents
  return migrateLegacyDocuments().map(normalizeContent);
}

// Save all content to localStorage
export function saveContent(content: Content[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    return true;
  } catch (e) {
    console.error("Failed to save content:", e);
    return false;
  }
}

export function loadProfile(): AuthorProfile {
  if (typeof window === "undefined") {
    return getDefaultProfile();
  }
  const saved = localStorage.getItem(PROFILE_KEY);
  if (saved) {
    try {
      return normalizeProfile(JSON.parse(saved) as AuthorProfile);
    } catch (e) {
      console.error("Failed to parse saved profile:", e);
    }
  }
  const fallback = getDefaultProfile();
  saveProfile(fallback);
  return fallback;
}

export function saveProfile(profile: AuthorProfile): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (e) {
    console.error("Failed to save profile:", e);
    return false;
  }
}

export function updateProfile(updates: Partial<AuthorProfile>): AuthorProfile {
  const current = loadProfile();
  const next = normalizeProfile({ ...current, ...updates });
  saveProfile(next);
  return next;
}

// Get single content item by ID
export function getContentById(id: string): Content | undefined {
  return loadContent().find((c) => c.id === id);
}

// Create new content
export function createNewContent(title: string = ""): Content {
  const content = createContent(title);
  const allContent = loadContent();
  const next = [...allContent, normalizeContent(content)];
  saveContent(next);
  return content;
}

// Update content
export function updateContent(id: string, updates: Partial<Content>): boolean {
  const allContent = loadContent();
  const updated = allContent.map((c) =>
    c.id === id
      ? normalizeContent({ ...c, ...updates, updatedAt: Date.now() })
      : c
  );
  return saveContent(updated);
}

export function updatePublicStats(
  id: string,
  updates: Partial<Content["publicStats"]>
) {
  const allContent = loadContent();
  const updated = allContent.map((c) => {
    if (c.id !== id) return c;
    const existingStats = c.publicStats || { views: 0 };
    const nextViews = updates.views ?? existingStats.views ?? 0;
    const previousViews = existingStats.views ?? 0;
    const deltaViews = Math.max(0, nextViews - previousViews);
    const timestamp = updates.lastViewedAt || Date.now();
    const dayKey = getDayKey(timestamp);
    const dailyViews = {
      ...(existingStats.dailyViews || {}),
    };
    if (deltaViews > 0) {
      dailyViews[dayKey] = (dailyViews[dayKey] || 0) + deltaViews;
    }

    const nextStats = {
      ...existingStats,
      ...updates,
      views: nextViews,
      dailyViews,
      reads7d: calculateReads7d(dailyViews, timestamp),
    };

    return normalizeContent({
      ...c,
      publicStats: nextStats,
    });
  });
  return saveContent(updated);
}

// Delete content
export function deleteContent(id: string) {
  const allContent = loadContent();
  const filtered = allContent.filter((c) => c.id !== id);
  saveContent(filtered);
  const allSeries = loadSeries();
  if (allSeries.length > 0) {
    const updatedSeries = allSeries.map((s) => ({
      ...s,
      contentIds: s.contentIds.filter((contentId) => contentId !== id),
    }));
    saveSeries(updatedSeries);
  }
}

// Toggle starred
export function toggleStarred(id: string) {
  const allContent = loadContent();
  const updated = allContent.map((c) =>
    c.id === id ? { ...c, starred: !c.starred, updatedAt: Date.now() } : c
  );
  saveContent(updated);
}

// Update last viewed
export function updateLastViewed(id: string) {
  updateContent(id, { lastViewed: Date.now() });
}

// Filter functions
export function getStarredContent(): Content[] {
  return loadContent().filter((c) => c.starred);
}

export function getContentByFolder(folderId: string): Content[] {
  return loadContent().filter((c) => c.folderId === folderId);
}

export function getContentByTag(tag: string): Content[] {
  return loadContent().filter((c) => c.tags?.includes(tag));
}

export function getSharedContent(): Content[] {
  return loadContent().filter((c) => c.sharedWith && c.sharedWith.length > 0);
}

export function getRecentContent(limit: number = 10): Content[] {
  return loadContent()
    .filter((c) => c.lastViewed)
    .sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))
    .slice(0, limit);
}

// Search content
export function searchContent(query: string): Content[] {
  const lowerQuery = query.toLowerCase();
  return loadContent().filter((c) =>
    c.title.toLowerCase().includes(lowerQuery)
  );
}

// Migration from legacy documents
function migrateLegacyDocuments(): Content[] {
  if (typeof window === "undefined") return [];

  const legacyData = localStorage.getItem(LEGACY_DOCS_KEY);
  if (!legacyData) return [];

  try {
    const legacyDocs: LegacyDocument[] = JSON.parse(legacyData);

    // Convert to new Content format
    const migratedContent: Content[] = legacyDocs.map(convertLegacyDocument);

    // Save migrated content
    saveContent(migratedContent);

    // Clean up legacy data after successful migration
    localStorage.removeItem(LEGACY_DOCS_KEY);
    console.log(`Migrated ${migratedContent.length} documents to new format`);

    return migratedContent;
  } catch (e) {
    console.error("Failed to migrate legacy documents:", e);
    return [];
  }
}

function mergeLegacyDocuments(currentContent: Content[]): Content[] {
  if (typeof window === "undefined") return currentContent;

  const legacyData = localStorage.getItem(LEGACY_DOCS_KEY);
  if (!legacyData) return currentContent;

  try {
    const legacyDocs: LegacyDocument[] = JSON.parse(legacyData);
    const existingIds = new Set(currentContent.map((doc) => doc.id));
    const newDocs = legacyDocs
      .filter((doc) => !existingIds.has(doc.id))
      .map(convertLegacyDocument);

    if (newDocs.length === 0) {
      localStorage.removeItem(LEGACY_DOCS_KEY);
      return currentContent;
    }

    const merged = [...currentContent, ...newDocs];
    saveContent(merged);
    localStorage.removeItem(LEGACY_DOCS_KEY);
    console.log(`Migrated ${newDocs.length} legacy documents`);
    return merged;
  } catch (e) {
    console.error("Failed to merge legacy documents:", e);
    return currentContent;
  }
}

function convertLegacyDocument(doc: LegacyDocument): Content {
  return {
    id: doc.id,
    title: doc.title,
    mode: "doc",
    docContent: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    lastViewed: doc.lastViewed,
    publish: {
      isPublic: false,
      theme: "minimal",
    },
    publicStats: {
      views: 0,
      reads7d: 0,
      dailyViews: {},
    },
  };
}

function normalizeContent(content: Content): Content {
  return {
    ...content,
    publish: {
      isPublic: content.publish?.isPublic ?? false,
      theme: content.publish?.theme ?? "minimal",
      slug: content.publish?.slug,
      description: content.publish?.description,
      ogImage: content.publish?.ogImage,
    },
    publicStats: {
      views: content.publicStats?.views ?? 0,
      lastViewedAt: content.publicStats?.lastViewedAt,
      firstPublishedAt: content.publicStats?.firstPublishedAt,
      lastPublishedAt: content.publicStats?.lastPublishedAt,
      reads7d: content.publicStats?.reads7d ?? 0,
      dailyViews: content.publicStats?.dailyViews || {},
    },
  };
}

function getDefaultProfile(): AuthorProfile {
  return {
    displayName: "Notex Author",
    headline: "Design-first publishing notebook",
    bio: "",
    avatarUrl: "",
    website: "",
    featuredContentIds: [],
    featuredSeriesIds: [],
  };
}

function normalizeProfile(profile: AuthorProfile): AuthorProfile {
  return {
    displayName: profile.displayName || "Notex Author",
    headline: profile.headline || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    website: profile.website || "",
    featuredContentIds: profile.featuredContentIds || [],
    featuredSeriesIds: profile.featuredSeriesIds || [],
  };
}

function getDayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function calculateReads7d(
  dailyViews: Record<string, number>,
  timestamp: number
): number {
  const current = new Date(timestamp);
  let total = 0;
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(current);
    date.setUTCDate(current.getUTCDate() - i);
    const key = date.toISOString().slice(0, 10);
    total += dailyViews[key] || 0;
  }
  return total;
}

// Export for manual migration trigger
export function triggerMigration() {
  return migrateLegacyDocuments();
}

// ============================================
// FOLDER MANAGEMENT
// ============================================

// Load all folders from localStorage
export function loadFolders(): Folder[] {
  if (typeof window === "undefined") return DEFAULT_FOLDERS;

  const saved = localStorage.getItem(FOLDERS_KEY);
  if (saved) {
    try {
      const folders = JSON.parse(saved) as Folder[];
      // Ensure default folders exist
      const hasUnsorted = folders.some((f) => f.id === "unsorted");
      if (!hasUnsorted) {
        return [...DEFAULT_FOLDERS, ...folders];
      }
      return folders;
    } catch (e) {
      console.error("Failed to parse saved folders:", e);
      return DEFAULT_FOLDERS;
    }
  }

  // Initialize with default folders
  saveFolders(DEFAULT_FOLDERS);
  return DEFAULT_FOLDERS;
}

// Save all folders to localStorage
export function saveFolders(folders: Folder[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

// Create a new folder
export function createNewFolder(name: string, emoji?: string): Folder {
  const folder = createFolder(name, emoji);
  const allFolders = loadFolders();
  allFolders.push(folder);
  saveFolders(allFolders);
  return folder;
}

// Update a folder
export function updateFolder(id: string, updates: Partial<Folder>) {
  const allFolders = loadFolders();
  const updated = allFolders.map((f) =>
    f.id === id ? { ...f, ...updates, updatedAt: Date.now() } : f
  );
  saveFolders(updated);
}

// Delete a folder (moves all content to Unsorted)
export function deleteFolder(id: string) {
  // Don't allow deleting default folders
  const folder = loadFolders().find((f) => f.id === id);
  if (folder?.isDefault) return;

  // Move all content from this folder to unsorted
  const allContent = loadContent();
  const updated = allContent.map((c) =>
    c.folderId === id
      ? { ...c, folderId: "unsorted", updatedAt: Date.now() }
      : c
  );
  saveContent(updated);

  // Remove the folder
  const allFolders = loadFolders();
  const filtered = allFolders.filter((f) => f.id !== id);
  saveFolders(filtered);
}

// ============================================
// SERIES MANAGEMENT
// ============================================

export function loadSeries(): Series[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(SERIES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as Series[];
    } catch (e) {
      console.error("Failed to parse saved series:", e);
      return [];
    }
  }
  return [];
}

export function saveSeries(series: Series[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SERIES_KEY, JSON.stringify(series));
}

export function createNewSeries(title: string, description?: string): Series {
  const series = createSeries(title, description);
  const allSeries = loadSeries();
  allSeries.push(series);
  saveSeries(allSeries);
  return series;
}

export function updateSeries(id: string, updates: Partial<Series>) {
  const allSeries = loadSeries();
  const updated = allSeries.map((s) =>
    s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
  );
  saveSeries(updated);
}

export function deleteSeries(id: string) {
  const allSeries = loadSeries();
  const filtered = allSeries.filter((s) => s.id !== id);
  saveSeries(filtered);
  const allContent = loadContent();
  const updated = allContent.map((c) =>
    c.seriesId === id ? { ...c, seriesId: undefined } : c
  );
  saveContent(updated);
}

// Get folder by ID
export function getFolderById(id: string): Folder | undefined {
  return loadFolders().find((f) => f.id === id);
}

// ============================================
// TAG MANAGEMENT
// ============================================

// Get all unique tags from all content
export function getAllTags(): string[] {
  const allContent = loadContent();
  const tagSet = new Set<string>();
  allContent.forEach((c) => {
    c.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Add a tag to content
export function addTagToContent(contentId: string, tag: string) {
  const allContent = loadContent();
  const updated = allContent.map((c) => {
    if (c.id === contentId) {
      const currentTags = c.tags || [];
      if (!currentTags.includes(tag)) {
        return { ...c, tags: [...currentTags, tag], updatedAt: Date.now() };
      }
    }
    return c;
  });
  saveContent(updated);
}

// Remove a tag from content
export function removeTagFromContent(contentId: string, tag: string) {
  const allContent = loadContent();
  const updated = allContent.map((c) => {
    if (c.id === contentId && c.tags) {
      return {
        ...c,
        tags: c.tags.filter((t) => t !== tag),
        updatedAt: Date.now(),
      };
    }
    return c;
  });
  saveContent(updated);
}

// ============================================
// DOCUMENT ACTIONS
// ============================================

// Duplicate content
export function duplicateContent(id: string): Content | undefined {
  const original = getContentById(id);
  if (!original) return undefined;

  const now = Date.now();
  const newId = `content_${now}_${Math.random().toString(36).substr(2, 9)}`;

  const duplicate: Content = {
    ...original,
    id: newId,
    title: `${original.title || "Untitled"} (Copy)`,
    createdAt: now,
    updatedAt: now,
    lastViewed: now,
    starred: false, // Don't copy starred status
    seriesId: undefined,
  };

  const allContent = loadContent();
  allContent.push(duplicate);
  saveContent(allContent);

  return duplicate;
}

// Move content to a folder
export function moveToFolder(contentId: string, folderId: string) {
  updateContent(contentId, { folderId });
}

// ============================================
// ENHANCED SEARCH
// ============================================

// Search content by title and body
export function searchContentFull(query: string): Content[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return loadContent().filter((c) => {
    // Search in title
    if (c.title.toLowerCase().includes(lowerQuery)) return true;

    // Search in tags
    if (c.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
      return true;

    // Search in document content
    const text = extractPlainText(c.docContent).toLowerCase();
    if (text && text.includes(lowerQuery)) return true;

    return false;
  });
}
