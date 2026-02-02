import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileTextIcon,
  StarIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import type { Content } from "~/types/content";
import { cn } from "~/lib/utils";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-10">
          <div
            className="absolute inset-0 blur-3xl opacity-5 animate-softPulse"
            style={{
              background: "radial-gradient(circle, var(--color-linear-accent-primary) 0%, transparent 70%)",
            }}
          />
          <SparklesIcon
            className="h-24 w-24 relative animate-float"
            style={{
              strokeWidth: 1,
              color: "var(--color-linear-text-tertiary)",
            }}
          />
        </div>
        <h3
          className="text-3xl font-serif font-normal mb-4 tracking-tight"
          style={{ color: "var(--color-linear-text-primary)" }}
        >
          No content yet
        </h3>
        <p
          className="text-base font-light leading-relaxed"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          {emptyMessage}
        </p>
      </div>
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

  const formattedDate = content.lastViewed
    ? formatRelativeTime(content.lastViewed)
    : formatRelativeTime(content.updatedAt);

  const preview = getContentPreview(content);

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
        <div className="flex items-center gap-6 mb-4">
          {showMode && (
            <div className="flex items-center gap-2.5">
              <ModeIcon
                className="h-3.5 w-3.5"
                strokeWidth={1.5}
                style={{ color: "var(--color-linear-text-tertiary)" }}
              />
              <span
                className="text-[11px] font-light tracking-[0.12em] uppercase"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                {modeLabel}
              </span>
            </div>
          )}

          <time
            className="text-[11px] font-light tracking-wide"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            {formattedDate}
          </time>

          {content.starred && (
            <StarIcon
              className="h-3.5 w-3.5 fill-current ml-auto"
              style={{ color: "var(--color-linear-text-primary)" }}
            />
          )}
        </div>

        {/* Title */}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal mb-5 leading-[1.15] tracking-[-0.025em] transition-all duration-400"
          style={{
            color: "var(--color-linear-text-primary)",
            transform: isHovered ? "translateX(8px)" : "translateX(0)",
          }}
        >
          {content.title || "Untitled"}
        </h2>

        {/* Preview */}
        <p
          className="text-base md:text-lg font-light leading-relaxed max-w-3xl"
          style={{
            color: "var(--color-linear-text-secondary)",
            lineHeight: "1.75",
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

// Helper: Get content preview text
function getContentPreview(content: Content): string {
  if (content.docContent) {
    // Extract text from TipTap JSON
    try {
      const extractText = (node: any): string => {
        if (node.text) return node.text;
        if (node.content) {
          return node.content.map(extractText).join(" ");
        }
        return "";
      };
      const text = extractText(content.docContent).trim();
      return text || "Empty document";
    } catch {
      return "Empty document";
    }
  }

  return "No content";
}

// Helper: Format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
