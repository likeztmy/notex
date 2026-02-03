import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileTextIcon,
  MoreHorizontalIcon,
  StarIcon,
  TrashIcon,
  CopyIcon,
  TagIcon,
  FolderIcon,
  ArrowDownIcon,
} from "lucide-react";
import type { Content } from "~/types/content";
import {
  deleteContent,
  toggleStarred,
  duplicateContent,
} from "~/utils/contentStorage";
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
  const [showMoveDialog, setShowMoveDialog] = React.useState(false);
  const [showTagDialog, setShowTagDialog] = React.useState(false);

  const preview = getContentPreview(content);
  const lastViewedDate = content.lastViewed
    ? formatRelativeTime(content.lastViewed)
    : "-";
  const updatedDate = formatRelativeTime(content.updatedAt);
  const createdDate = formatRelativeTime(content.createdAt);

  const handleToggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStarred(content.id);
    window.location.reload();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteContent(content.id);
      window.location.reload();
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
      >
        <Link
          to="/editor"
          search={{ id: content.id }}
          className={styles.tableRow}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
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
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    className={styles.actionsMenu}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
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
                )}
              </AnimatePresence>
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
        onMoved={() => window.location.reload()}
      />

      <TagDialog
        isOpen={showTagDialog}
        onClose={() => setShowTagDialog(false)}
        contentId={content.id}
        currentTags={content.tags}
        onTagsChange={() => window.location.reload()}
      />
    </>
  );
}

// Helper: Get content preview text
function getContentPreview(content: Content): string {
  if (content.docContent) {
    try {
      const extractText = (node: any): string => {
        if (node.text) return node.text;
        if (node.content) {
          return node.content.map(extractText).join(" ");
        }
        return "";
      };
      const text = extractText(content.docContent).trim();
      const preview = text.slice(0, 100);
      return preview || "No additional text";
    } catch {
      return "No additional text";
    }
  }

  return "No additional text";
}

// Helper: Format relative time
function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just Now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}
