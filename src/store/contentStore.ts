import { create } from "zustand";
import type { Content, Folder, Series, AuthorProfile } from "~/types/content";
import {
  loadContent,
  createNewContent,
  updateContent as persistContentUpdate,
  updatePublicStats as persistUpdatePublicStats,
  deleteContent as persistDeleteContent,
  toggleStarred as persistToggleStarred,
  duplicateContent as persistDuplicateContent,
  moveToFolder as persistMoveToFolder,
  addTagToContent as persistAddTagToContent,
  removeTagFromContent as persistRemoveTagFromContent,
  updateLastViewed as persistUpdateLastViewed,
  loadFolders,
  createNewFolder,
  updateFolder as persistUpdateFolder,
  deleteFolder as persistDeleteFolder,
  loadSeries,
  createNewSeries,
  updateSeries as persistUpdateSeries,
  deleteSeries as persistDeleteSeries,
  loadProfile,
  updateProfile as persistUpdateProfile,
} from "~/utils/contentStorage";

interface ContentStore {
  content: Content[];
  folders: Folder[];
  series: Series[];
  profile: AuthorProfile;
  isLoaded: boolean;
  load: (force?: boolean) => void;
  refreshContent: () => void;
  refreshFolders: () => void;
  refreshSeries: () => void;
  refreshProfile: () => void;
  updateProfile: (updates: Partial<AuthorProfile>) => void;
  createContent: (title?: string) => Content;
  updateContent: (id: string, updates: Partial<Content>) => boolean;
  deleteContent: (id: string) => void;
  toggleStarred: (id: string) => void;
  duplicateContent: (id: string) => Content | undefined;
  moveToFolder: (contentId: string, folderId: string) => void;
  addTagToContent: (contentId: string, tag: string) => void;
  removeTagFromContent: (contentId: string, tag: string) => void;
  updateLastViewed: (id: string) => void;
  updatePublicStats: (
    id: string,
    updates: Partial<Content["publicStats"]>
  ) => void;
  createFolder: (name: string, emoji?: string) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  createSeries: (title: string, description?: string) => Series;
  updateSeries: (id: string, updates: Partial<Series>) => void;
  deleteSeries: (id: string) => void;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  content: [],
  folders: [],
  series: [],
  profile: loadProfile(),
  isLoaded: false,
  load: (force = false) => {
    if (typeof window === "undefined") return;
    if (get().isLoaded && !force) return;
    set({
      content: loadContent(),
      folders: loadFolders(),
      series: loadSeries(),
      profile: loadProfile(),
      isLoaded: true,
    });
  },
  refreshContent: () => {
    if (typeof window === "undefined") return;
    set({ content: loadContent() });
  },
  refreshFolders: () => {
    if (typeof window === "undefined") return;
    set({ folders: loadFolders() });
  },
  refreshSeries: () => {
    if (typeof window === "undefined") return;
    set({ series: loadSeries() });
  },
  refreshProfile: () => {
    if (typeof window === "undefined") return;
    set({ profile: loadProfile() });
  },
  createContent: (title = "") => {
    const created = createNewContent(title);
    set({ content: loadContent() });
    return created;
  },
  updateContent: (id, updates) => {
    const saved = persistContentUpdate(id, updates);
    if (saved) {
      set({ content: loadContent() });
    }
    return saved;
  },
  deleteContent: (id) => {
    persistDeleteContent(id);
    set({ content: loadContent() });
  },
  toggleStarred: (id) => {
    persistToggleStarred(id);
    set({ content: loadContent() });
  },
  duplicateContent: (id) => {
    const duplicate = persistDuplicateContent(id);
    set({ content: loadContent() });
    return duplicate;
  },
  moveToFolder: (contentId, folderId) => {
    persistMoveToFolder(contentId, folderId);
    set({ content: loadContent() });
  },
  addTagToContent: (contentId, tag) => {
    persistAddTagToContent(contentId, tag);
    set({ content: loadContent() });
  },
  removeTagFromContent: (contentId, tag) => {
    persistRemoveTagFromContent(contentId, tag);
    set({ content: loadContent() });
  },
  updateLastViewed: (id) => {
    persistUpdateLastViewed(id);
    set({ content: loadContent() });
  },
  updatePublicStats: (id, updates) => {
    persistUpdatePublicStats(id, updates);
    set({ content: loadContent() });
  },
  createFolder: (name, emoji) => {
    const folder = createNewFolder(name, emoji);
    set({ folders: loadFolders() });
    return folder;
  },
  updateFolder: (id, updates) => {
    persistUpdateFolder(id, updates);
    set({ folders: loadFolders() });
  },
  deleteFolder: (id) => {
    persistDeleteFolder(id);
    set({ folders: loadFolders(), content: loadContent() });
  },
  createSeries: (title, description) => {
    const series = createNewSeries(title, description);
    set({ series: loadSeries() });
    return series;
  },
  updateSeries: (id, updates) => {
    persistUpdateSeries(id, updates);
    set({ series: loadSeries() });
  },
  deleteSeries: (id) => {
    persistDeleteSeries(id);
    set({ series: loadSeries(), content: loadContent() });
  },
  updateProfile: (updates) => {
    persistUpdateProfile(updates);
    set({ profile: loadProfile() });
  },
}));
