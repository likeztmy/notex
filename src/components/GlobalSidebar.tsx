import * as React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Clock,
  Star,
  Folder,
  FolderPlus,
  Tag,
  Share2,
  Globe,
  User,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  Search,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useContentStore } from "~/store/contentStore";
import { getAllTagsFromContent } from "~/utils/contentQuery";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  useSidebar,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { useTheme } from "~/components/ThemeProvider";
import { useSearchModalContext } from "~/routes/__root";
import styles from "./GlobalSidebar.module.css";

export function GlobalSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const searchModal = useSearchModalContext();
  const { theme, setTheme } = useTheme();
  const content = useContentStore((state) => state.content);
  const folders = useContentStore((state) => state.folders);
  const createFolder = useContentStore((state) => state.createFolder);
  const [foldersExpanded, setFoldersExpanded] = React.useState(true);
  const [tagsExpanded, setTagsExpanded] = React.useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const newFolderInputRef = React.useRef<HTMLInputElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isFolderActive = (folderId: string) =>
    location.pathname === `/folders/${folderId}`;
  const isTagActive = (tagName: string) =>
    location.pathname === `/tags/${encodeURIComponent(tagName)}`;

  const folderCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    content.forEach((item) => {
      const folderId = item.folderId || "unsorted";
      counts.set(folderId, (counts.get(folderId) || 0) + 1);
    });
    return counts;
  }, [content]);

  const tagCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    content.forEach((item) => {
      item.tags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return counts;
  }, [content]);

  const tags = React.useMemo(() => getAllTagsFromContent(content), [content]);
  const starredCount = React.useMemo(
    () => content.filter((item) => item.starred).length,
    [content]
  );

  const handleNewDocument = () => {
    navigate({
      to: "/editor",
      search: { create: "true" },
    });
  };

  React.useEffect(() => {
    if (isCreatingFolder) {
      setTimeout(() => newFolderInputRef.current?.focus(), 50);
    }
  }, [isCreatingFolder]);

  const handleCreateFolder = React.useCallback(() => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return;
    createFolder(trimmedName);
    setNewFolderName("");
    setIsCreatingFolder(false);
  }, [createFolder, newFolderName]);

  return (
    <Sidebar className={styles.sidebar}>
      <SidebarHeader className={styles.header}>
        {/* Header with close button */}
        <div className={styles.headerTop}>
          <motion.div
            className={styles.spaceHeader}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.spaceIcon}>Ms</div>
            <span className={styles.spaceTitle}>My Space</span>
          </motion.div>

          <button
            onClick={toggleSidebar}
            className={styles.closeButton}
            title="Close sidebar (⌘B)"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* New Document Button */}
        <motion.button
          onClick={handleNewDocument}
          className={styles.newDocButton}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus />
          <span>New Document</span>
        </motion.button>

        {/* Search - Added back based on user request */}
        <div
          className={styles.searchContainer}
          style={{ display: "block", marginTop: "0.5rem" }}
        >
          <button
            onClick={() => searchModal?.open()}
            className={styles.searchButton}
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className={styles.content}>
        <SidebarMenu className={styles.menu}>
          {/* All Docs */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/content")}>
              <Link to="/content">
                <FileText className="h-4 w-4" />
                <span>All Docs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Recent */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/recent")}>
              <Link to="/recent">
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Starred */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/starred")}>
              <Link to="/starred">
                <Star className="h-4 w-4" />
                <span>Starred</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Shared with Me */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/shared")}>
              <Link to="/shared">
                <Share2 className="h-4 w-4" />
                <span>Shared with Me</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Public Library */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/public")}>
              <Link to="/public">
                <Globe className="h-4 w-4" />
                <span>Public Library</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Public Profile */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/profile")}>
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span>Public Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Folders Section */}
        <div>
          <motion.button
            onClick={() => setFoldersExpanded(!foldersExpanded)}
            className={cn(
              styles.sectionHeader,
              foldersExpanded && styles.expanded
            )}
            whileHover={{ x: 2 }}
          >
            <span>Folders</span>
            {foldersExpanded ? <ChevronDown /> : <ChevronRight />}
          </motion.button>

          <AnimatePresence>
            {foldersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  styles.sectionContent,
                  styles.folderSectionContent
                )}
              >
                {folders.length === 0 ? (
                  <div className={styles.hintText}>
                    Create folders to organize your docs
                  </div>
                ) : (
                  <SidebarMenu className={styles.menu}>
                    {folders.map((folder) => (
                      <SidebarMenuItem key={folder.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isFolderActive(folder.id)}
                          className={styles.secondaryItem}
                        >
                          <Link
                            to="/folders/$folderId"
                            params={{ folderId: folder.id }}
                          >
                            {folder.emoji ? (
                              <span className="text-sm ml-0.5">
                                {folder.emoji}
                              </span>
                            ) : (
                              <Folder className="h-4 w-4" />
                            )}
                            <span>{folder.name}</span>
                            <span className={styles.itemMeta}>
                              {folderCounts.get(folder.id) || 0}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}

                {isCreatingFolder ? (
                  <div className={styles.newFolderRow}>
                    <input
                      ref={newFolderInputRef}
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onBlur={() => {
                        if (newFolderName.trim()) handleCreateFolder();
                        else setIsCreatingFolder(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder();
                        if (e.key === "Escape") {
                          setIsCreatingFolder(false);
                          setNewFolderName("");
                        }
                      }}
                      placeholder="Folder name..."
                      className={styles.newFolderInput}
                    />
                  </div>
                ) : (
                  <button
                    className={styles.newFolderButton}
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    <FolderPlus className="h-4 w-4" />
                    <span>New folder</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Starred Section */}
        <div>
          <div className={styles.sectionHeader}>
            <span>Starred</span>
          </div>
          <div className={styles.hintText}>
            {starredCount > 0
              ? `${starredCount} starred document${starredCount > 1 ? "s" : ""}`
              : "Star Docs to keep them close"}
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <motion.button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className={cn(
              styles.sectionHeader,
              tagsExpanded && styles.expanded
            )}
            whileHover={{ x: 2 }}
          >
            <span>Tags</span>
            {tagsExpanded ? <ChevronDown /> : <ChevronRight />}
          </motion.button>

          <AnimatePresence>
            {tagsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={styles.sectionContent}
              >
                {tags.length === 0 ? (
                  <div className={styles.hintText}>
                    Add tags to your docs for quick access
                  </div>
                ) : (
                  <>
                    <SidebarMenu className={styles.menu}>
                      {tags.slice(0, 8).map((tag) => (
                        <SidebarMenuItem key={tag}>
                          <SidebarMenuButton
                            asChild
                            isActive={isTagActive(tag)}
                            className={styles.secondaryItem}
                          >
                            <Link to="/tags/$tagName" params={{ tagName: tag }}>
                              <Tag className="h-4 w-4" />
                              <span>#{tag}</span>
                              <span className={styles.itemMeta}>
                                {tagCounts.get(tag) || 0}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                    {tags.length > 8 && (
                      <div className={styles.hintText}>
                        +{tags.length - 8} more tags
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>

      <SidebarFooter className={styles.footer}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                if (theme === "light") setTheme("dark");
                else if (theme === "dark") setTheme("system");
                else setTheme("light");
              }}
              tooltip="Toggle theme"
            >
              {theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Laptop className="h-4 w-4" />
              )}
              <span>
                {theme === "light"
                  ? "Light Mode"
                  : theme === "dark"
                  ? "Dark Mode"
                  : "System Theme"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
