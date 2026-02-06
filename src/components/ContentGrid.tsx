import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileTextIcon, StarIcon, TagIcon } from "lucide-react";
import type { Content } from "~/types/content";
import { getContentPreview } from "~/utils/contentText";
import { formatRelativeDateShort } from "~/utils/dateFormat";

interface ContentGridProps {
  content: Content[];
  emptyMessage?: string;
}

export function ContentGrid({
  content,
  emptyMessage = "No content yet",
}: ContentGridProps) {
  if (content.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          {emptyMessage}
        </p>
      </motion.div>
    );
  }

  const sortedContent = React.useMemo(() => {
    // Sort by last viewed, then by updated date
    return [...content].sort((a, b) => {
      if (a.lastViewed && b.lastViewed) {
        return b.lastViewed - a.lastViewed;
      }
      if (a.lastViewed) return -1;
      if (b.lastViewed) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [content]);

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedContent.map((item, index) => (
          <ContentGridCard key={item.id} content={item} index={index} />
        ))}
      </div>
    </div>
  );
}

interface ContentGridCardProps {
  content: Content;
  index: number;
}

function ContentGridCard({ content, index }: ContentGridCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const preview = React.useMemo(
    () => getContentPreview(content, 120, "Empty document"),
    [content]
  );
  const updatedDate = React.useMemo(
    () => formatRelativeDateShort(content.updatedAt),
    [content.updatedAt]
  );

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
        className="block p-5 transition-all duration-200 content-grid-card"
        style={{
          background: isHovered
            ? "var(--color-linear-bg-elevated)"
            : "var(--color-linear-bg-primary)",
          border: "1px solid var(--view-border)",
          borderRadius: "var(--view-radius)",
          boxShadow: isHovered ? "var(--shadow-linear-md)" : "none",
          transform: isHovered ? "translateY(-2px)" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: "var(--view-icon-size)",
              height: "var(--view-icon-size)",
              borderRadius: "var(--view-icon-radius)",
              background: "var(--view-icon-bg)",
            }}
          >
            <FileTextIcon
              className="h-4 w-4"
              style={{ color: "var(--color-linear-text-secondary)" }}
            />
          </div>
          {content.starred && (
            <StarIcon
              className="h-4 w-4 fill-current"
              style={{ color: "var(--color-linear-warning)" }}
            />
          )}
        </div>

        {/* Title */}
        <h3
          className="mb-2 line-clamp-2"
          style={{
            color: "var(--color-linear-text-primary)",
            fontSize: "var(--view-title-size)",
            fontWeight: "var(--view-title-weight)",
          }}
        >
          {content.title || "Untitled"}
        </h3>

        {/* Preview */}
        <p
          className="mb-3 line-clamp-3"
          style={{
            color: "var(--view-preview-color)",
            fontSize: "var(--view-preview-size)",
            lineHeight: 1.5,
          }}
        >
          {preview}
        </p>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {content.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                style={{
                  background: "var(--view-icon-bg)",
                  color: "var(--color-linear-text-secondary)",
                }}
              >
                <TagIcon className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span
                className="text-xs"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                +{content.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            color: "var(--view-meta-color)",
            fontSize: "var(--view-meta-size)",
          }}
        >
          {updatedDate}
        </div>
      </Link>
    </motion.div>
  );
}
