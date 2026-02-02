import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileTextIcon,
  MoreHorizontalIcon,
  StarIcon,
  TrashIcon,
  CopyIcon,
  TagIcon,
} from "lucide-react";
import type { Content } from "~/types/content";
import { deleteContent, toggleStarred } from "~/utils/contentStorage";
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

  // Sort by last viewed, then by updated date
  const sortedContent = [...content].sort((a, b) => {
    if (a.lastViewed && b.lastViewed) {
      return b.lastViewed - a.lastViewed;
    }
    if (a.lastViewed) return -1;
    if (b.lastViewed) return 1;
    return b.updatedAt - a.updatedAt;
  });

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
        <div className={styles.colUpdated}>Updated</div>
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);

  const preview = getContentPreview(content);
  const lastViewedDate = content.lastViewed
    ? formatDate(content.lastViewed)
    : "-";
  const updatedDate = formatDate(content.updatedAt);
  const createdDate = formatDate(content.createdAt);

  const handleToggleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStarred(content.id);
    window.location.reload(); // Refresh to show updated star status
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteContent(content.id);
      window.location.reload(); // Refresh to show updated list
    }
  };

  return (
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
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Name Column */}
        <div className={styles.nameColumn}>
          <motion.div className={styles.fileIcon} whileHover={{ scale: 1.05 }}>
            <FileTextIcon className="h-4 w-4" />
          </motion.div>
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{content.title || "Untitled"}</div>
            <div className={styles.filePreview}>
              <span className={styles.previewText}>{preview}</span>
              {content.tags && content.tags.length > 0 && (
                <div className={styles.tags}>
                  {content.tags.slice(0, 2).map((tag) => (
                    <motion.span
                      key={tag}
                      className={styles.tag}
                      whileHover={{ scale: 1.05 }}
                    >
                      <TagIcon />
                      {tag}
                    </motion.span>
                  ))}
                  {content.tags.length > 2 && (
                    <span className={styles.tagCount}>
                      +{content.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
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
            className={cn(styles.starButton, content.starred && styles.starred)}
            style={{
              opacity: content.starred || isHovered ? 1 : 0,
            }}
            title={content.starred ? "Unstar" : "Star"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <StarIcon className="h-3.5 w-3.5" />
          </motion.button>
          <div style={{ position: "relative" }}>
            <motion.button
              className={styles.moreButton}
              style={{
                opacity: isHovered ? 1 : 0,
              }}
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
      return preview || "Empty document";
    } catch {
      return "Empty document";
    }
  }

  return "No content";
}

// Helper: Format date to Chinese style
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Show relative time for recent dates
  if (diffInDays === 0) return "今天";
  if (diffInDays === 1) return "昨天";
  if (diffInDays < 7) return `${diffInDays}天前`;

  // Format as Chinese date
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const currentYear = now.getFullYear();

  if (year === currentYear) {
    return `${month}月${day}日`;
  }
  return `${year}年${month}月${day}日`;
}
