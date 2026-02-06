import * as React from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontalIcon,
  StarIcon,
  TrashIcon,
  CopyIcon,
  TagIcon,
  FolderIcon,
  ArrowDownIcon,
} from "lucide-react";
import type { Content } from "~/types/content";
import { useContentStore } from "~/store/contentStore";
import { getContentPreview } from "~/utils/contentText";
import { formatRelativeTimeLong } from "~/utils/dateFormat";
import { MoveToFolderDialog } from "./MoveToFolderDialog";
import { TagDialog } from "./TagInput";
import { cn } from "~/lib/utils";
import styles from "./ContentTable.module.css";

interface ContentTableProps {
  content: Content[];
  emptyMessage?: string;
}

export function ContentTable({
  content,
  emptyMessage = "Any documents you haven't moved into a specific folder will appear here.",
}: ContentTableProps) {
  if (content.length === 0) {
    return (
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className={styles.emptyText}>{emptyMessage}</p>
      </motion.div>
    );
  }

  // Use content directly as it is already sorted by the parent
  const sortedContent = content;

  return (
    <div className={styles.tableWrapper}>
      {/* Table Header */}
      <motion.div
        className={styles.tableHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.colName}>Name</div>
        <div className={styles.colLastViewed}>Last Viewed</div>
        <div className={styles.colUpdated}>
          Updated <ArrowDownIcon className="h-3 w-3" />
        </div>
        <div className={styles.colCreated}>Created</div>
        <div className={styles.colActions}></div>
      </motion.div>

      {/* Table Rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {sortedContent.map((item, index) => (
          <ContentTableRow key={item.id} content={item} index={index} />
        ))}
      </motion.div>
    </div>
  );
}

interface ContentTableRowProps {
  content: Content;
  index: number;
}

function ContentTableRow({ content, index }: ContentTableRowProps) {
  const navigate = useNavigate();
  const toggleStarred = useContentStore((state) => state.toggleStarred);
  const deleteContent = useContentStore((state) => state.deleteContent);
  const duplicateContent = useContentStore((state) => state.duplicateContent);
  const [showActions, setShowActions] = React.useState(false);
  const [showMoveDialog, setShowMoveDialog] = React.useState(false);
  const [showTagDialog, setShowTagDialog] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const preview = getContentPreview(content, 100, "No additional text");
  const lastViewedDate = content.lastViewed
    ? formatRelativeTimeLong(content.lastViewed)
    : "-";
  const updatedDate = formatRelativeTimeLong(content.updatedAt);
  const createdDate = formatRelativeTimeLong(content.createdAt);

  const handleToggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStarred(content.id);
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteContent(content.id);
      setShowActions(false);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const duplicate = duplicateContent(content.id);
    if (duplicate) {
      navigate({ to: "/editor", search: { id: duplicate.id } });
    }
    setShowActions(false);
  };

  const handleMoveToFolder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoveDialog(true);
    setShowActions(false);
  };

  const handleManageTags = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTagDialog(true);
    setShowActions(false);
  };

  const updateMenuPosition = React.useCallback(() => {
    const button = menuButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 160;
    const left = Math.max(16, rect.right - menuWidth);
    const top = rect.bottom + 6;
    setMenuPosition({ top, left });
  }, []);

  React.useEffect(() => {
    if (!showActions) return;
    updateMenuPosition();
    const handleScroll = () => updateMenuPosition();
    const handleResize = () => updateMenuPosition();
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [showActions, updateMenuPosition]);

  React.useEffect(() => {
    if (!showActions) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setShowActions(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [showActions]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ position: "relative", zIndex: showActions ? 60 : 0 }}
      >
        <Link
          to="/editor"
          search={{ id: content.id }}
          className={cn(styles.tableRow, showActions && styles.tableRowActive)}
          onMouseLeave={() => {
            if (!showMoveDialog && !showTagDialog) {
              setShowActions(false);
            }
          }}
        >
          <div className={styles.nameColumn}>
            <div className={styles.fileIcon}>
              {/* <FileTextIcon className="h-4 w-4" /> - Removed in favor of CSS styling */}
            </div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>
                {content.title || "Untitled"}
              </div>
              <div className={styles.filePreview}>{preview}</div>
            </div>
          </div>

          {/* Last Viewed Column */}
          <div className={cn(styles.dateColumn, styles.colLastViewed)}>
            {lastViewedDate}
          </div>

          {/* Updated Column */}
          <div className={cn(styles.dateColumn, styles.colUpdated)}>
            {updatedDate}
          </div>

          {/* Created Column */}
          <div className={cn(styles.dateColumn, styles.colCreated)}>
            {createdDate}
          </div>

          {/* Actions Column */}
          <div className={styles.actionsColumn}>
            <motion.button
              onClick={handleToggleStar}
              className={cn(
                styles.starButton,
                content.starred && styles.starred
              )}
              title={content.starred ? "Unstar" : "Star"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <StarIcon className="h-4 w-4" />
            </motion.button>
            <div style={{ position: "relative" }}>
              <motion.button
                className={styles.moreButton}
                ref={menuButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </motion.button>
              {showActions &&
                menuPosition &&
                createPortal(
                  <AnimatePresence>
                    <motion.div
                      ref={menuRef}
                      className={styles.actionsMenu}
                      initial={{ opacity: 0, scale: 0.98, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -6 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "fixed",
                        top: menuPosition.top,
                        left: menuPosition.left,
                        zIndex: 9999,
                      }}
                    >
                      <motion.button
                        onClick={handleToggleStar}
                        className={styles.menuButton}
                        whileHover={{ x: 2 }}
                      >
                        <StarIcon />
                        {content.starred ? "Unstar" : "Star"}
                      </motion.button>
                      <motion.button
                        onClick={handleDuplicate}
                        className={styles.menuButton}
                        whileHover={{ x: 2 }}
                      >
                        <CopyIcon />
                        Duplicate
                      </motion.button>
                      <motion.button
                        onClick={handleMoveToFolder}
                        className={styles.menuButton}
                        whileHover={{ x: 2 }}
                      >
                        <FolderIcon />
                        Move to Folder
                      </motion.button>
                      <motion.button
                        onClick={handleManageTags}
                        className={styles.menuButton}
                        whileHover={{ x: 2 }}
                      >
                        <TagIcon />
                        Manage Tags
                      </motion.button>
                      <motion.button
                        onClick={handleDelete}
                        className={cn(styles.menuButton, styles.delete)}
                        whileHover={{ x: 2 }}
                      >
                        <TrashIcon />
                        Delete
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>,
                  document.body
                )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Dialogs */}
      <MoveToFolderDialog
        isOpen={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        contentId={content.id}
        currentFolderId={content.folderId}
      />

      <TagDialog
        isOpen={showTagDialog}
        onClose={() => setShowTagDialog(false)}
        contentId={content.id}
        currentTags={content.tags}
      />
    </>
  );
}
