import { Content, createContent, ContentMode } from "~/types/content";

const CONTENT_KEY = "notex-content";
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
export function createNewContent(
  title: string = "",
  mode: ContentMode = "doc",
): Content {
  const content = createContent(title, mode);
  const allContent = loadContent();
  allContent.push(content);
  saveContent(allContent);
  return content;
}

// Update content
export function updateContent(id: string, updates: Partial<Content>) {
  const allContent = loadContent();
  const updated = allContent.map((c) =>
    c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c,
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
    c.id === id ? { ...c, starred: !c.starred, updatedAt: Date.now() } : c,
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
    c.title.toLowerCase().includes(lowerQuery),
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
      `✅ Migrated ${migratedContent.length} documents to new format`,
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
