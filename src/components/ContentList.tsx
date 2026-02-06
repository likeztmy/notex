import * as React from "react";
import { Link } from "@tanstack/react-router";
import { FileTextIcon, StarIcon, SparklesIcon } from "lucide-react";
import type { Content } from "~/types/content";
import { getContentPreview } from "~/utils/contentText";
import { formatRelativeTimeCompact } from "~/utils/dateFormat";

interface ContentListProps {
  content: Content[];
  emptyMessage?: string;
  showMode?: boolean;
}

export function ContentList({
  content,
  emptyMessage = "No content yet",
  showMode = true,
}: ContentListProps) {
  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative mb-6">
          <SparklesIcon
            className="h-12 w-12 relative"
            style={{
              strokeWidth: 1,
              color: "var(--color-linear-text-tertiary)",
            }}
          />
        </div>
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: "var(--color-linear-text-primary)" }}
        >
          No content yet
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--view-preview-color)" }}
        >
          {emptyMessage}
        </p>
      </div>
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
    <div className="content-list-container">
      {sortedContent.map((item, index) => (
        <ContentCard
          key={item.id}
          content={item}
          showMode={showMode}
          index={index}
        />
      ))}
    </div>
  );
}

interface ContentCardProps {
  content: Content;
  showMode: boolean;
  index: number;
}

function ContentCard({ content, showMode, index }: ContentCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const ModeIcon = FileTextIcon;
  const modeLabel = "Document";

  const formattedDate = React.useMemo(
    () =>
      content.lastViewed
        ? formatRelativeTimeCompact(content.lastViewed)
        : formatRelativeTimeCompact(content.updatedAt),
    [content.lastViewed, content.updatedAt]
  );

  const preview = React.useMemo(
    () => getContentPreview(content, 120, "Empty document"),
    [content]
  );

  return (
    <Link
      to="/editor"
      search={{ id: content.id }}
      className="content-list-item group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      <article className="content-list-item-inner">
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4">
          {showMode && (
            <div className="flex items-center gap-2.5">
              <ModeIcon
                className="h-3.5 w-3.5"
                strokeWidth={1.5}
                style={{ color: "var(--color-linear-text-tertiary)" }}
              />
              <span
                className="text-[10px] tracking-[0.12em] uppercase"
                style={{ color: "var(--view-meta-color)" }}
              >
                {modeLabel}
              </span>
            </div>
          )}

          <time
            className="text-[10px] tracking-wide"
            style={{ color: "var(--view-meta-color)" }}
          >
            {formattedDate}
          </time>

          {content.starred && (
            <StarIcon
              className="h-3.5 w-3.5 fill-current ml-auto"
              style={{ color: "var(--color-linear-warning)" }}
            />
          )}
        </div>

        {/* Title */}
        <h2
          className="mb-4 leading-[1.2] tracking-[-0.02em] transition-all duration-400"
          style={{
            color: "var(--color-linear-text-primary)",
            fontSize: "clamp(1.5rem, 2vw, 2.25rem)",
            fontWeight: "var(--view-title-weight)",
            transform: isHovered ? "translateX(6px)" : "translateX(0)",
          }}
        >
          {content.title || "Untitled"}
        </h2>

        {/* Preview */}
        <p
          className="leading-relaxed max-w-3xl"
          style={{
            color: "var(--view-preview-color)",
            fontSize: "var(--view-preview-size)",
            lineHeight: "1.7",
          }}
        >
          {preview}
        </p>

        {/* Hover indicator */}
        <div
          className="h-px mt-8 transition-all duration-500"
          style={{
            background: "var(--color-linear-text-primary)",
            width: isHovered ? "64px" : "32px",
          }}
        />
      </article>
    </Link>
  );
}
