import {
  Content,
  createContent,
  Folder,
  createFolder,
  DEFAULT_FOLDERS,
} from "~/types/content";

const CONTENT_KEY = "notex-content";
const FOLDERS_KEY = "notex-folders";
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
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved content:", e);
      return [];
    }
  }

  // Try to migrate legacy documents
  return migrateLegacyDocuments();
}

// Save all content to localStorage
export function saveContent(content: Content[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

// Get single content item by ID
export function getContentById(id: string): Content | undefined {
  return loadContent().find((c) => c.id === id);
}

// Create new content
export function createNewContent(title: string = ""): Content {
  const content = createContent(title);
  const allContent = loadContent();
  allContent.push(content);
  saveContent(allContent);
  return content;
}

// Update content
export function updateContent(id: string, updates: Partial<Content>) {
  const allContent = loadContent();
  const updated = allContent.map((c) =>
    c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
  );
  saveContent(updated);
}

// Delete content
export function deleteContent(id: string) {
  const allContent = loadContent();
  const filtered = allContent.filter((c) => c.id !== id);
  saveContent(filtered);
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
    const migratedContent: Content[] = legacyDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      mode: "doc",
      docContent: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastViewed: doc.lastViewed,
    }));

    // Save migrated content
    saveContent(migratedContent);

    // Keep legacy data for safety (don't delete yet)
    console.log(
      `✅ Migrated ${migratedContent.length} documents to new format`
    );

    return migratedContent;
  } catch (e) {
    console.error("Failed to migrate legacy documents:", e);
    return [];
  }
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
    if (c.docContent) {
      try {
        const extractText = (node: any): string => {
          if (node.text) return node.text;
          if (node.content) {
            return node.content.map(extractText).join(" ");
          }
          return "";
        };
        const text = extractText(c.docContent).toLowerCase();
        if (text.includes(lowerQuery)) return true;
      } catch {
        // Ignore parsing errors
      }
    }

    return false;
  });
}
