import * as React from "react";
import { FileIcon, MoreVerticalIcon, StarIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export interface DocumentItem {
  id: string;
  title: string;
  preview?: string;
  icon?: React.ReactNode;
  lastViewed?: string;
  updated?: string;
  created?: string;
  starred?: boolean;
}

interface DocumentListProps {
  documents: DocumentItem[];
  onDocumentClick?: (document: DocumentItem) => void;
  onStarToggle?: (documentId: string) => void;
  className?: string;
}

export function DocumentList({
  documents,
  onDocumentClick,
  onStarToggle,
  className,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <FileIcon className="h-12 w-12 text-[--color-linear-text-placeholder] mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
        <p className="text-sm text-[--color-linear-text-tertiary] max-w-sm">
          Any documents you haven't moved into a specific folder will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Column Headers */}
      <div className="flex items-center gap-4 px-6 py-2 border-b border-[--color-linear-border-primary]">
        <div className="flex-1 text-xs font-medium text-[--color-linear-text-tertiary] uppercase tracking-wide">
          Name
        </div>
        <div className="hidden md:block w-32 text-xs font-medium text-[--color-linear-text-tertiary] uppercase tracking-wide">
          Last Viewed
        </div>
        <div className="hidden lg:block w-32 text-xs font-medium text-[--color-linear-text-tertiary] uppercase tracking-wide">
          Updated
        </div>
        <div className="hidden xl:block w-32 text-xs font-medium text-[--color-linear-text-tertiary] uppercase tracking-wide">
          Created
        </div>
        <div className="w-8" /> {/* Space for actions */}
      </div>

      {/* Document Rows */}
      <div>
        {documents.map((doc) => (
          <DocumentRow
            key={doc.id}
            document={doc}
            onClick={() => onDocumentClick?.(doc)}
            onStarToggle={() => onStarToggle?.(doc.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface DocumentRowProps {
  document: DocumentItem;
  onClick?: () => void;
  onStarToggle?: () => void;
}

function DocumentRow({ document, onClick, onStarToggle }: DocumentRowProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-3",
        "border-b border-[--color-linear-border-secondary]",
        "transition-colors duration-150",
        "hover:bg-[--color-linear-bg-hover]",
        "cursor-pointer group"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Document Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {document.icon || (
            <FileIcon className="h-4 w-4 text-[--color-linear-text-tertiary] flex-shrink-0" />
          )}
          <h3 className="text-sm font-medium text-[--color-linear-text-primary] truncate">
            {document.title}
          </h3>
        </div>
        {document.preview && (
          <p className="text-xs text-[--color-linear-text-tertiary] line-clamp-2 leading-relaxed">
            {document.preview}
          </p>
        )}
      </div>

      {/* Last Viewed */}
      <div className="hidden md:block w-32 text-xs text-[--color-linear-text-tertiary]">
        {document.lastViewed || "—"}
      </div>

      {/* Updated */}
      <div className="hidden lg:block w-32 text-xs text-[--color-linear-text-tertiary]">
        {document.updated || "—"}
      </div>

      {/* Created */}
      <div className="hidden xl:block w-32 text-xs text-[--color-linear-text-tertiary]">
        {document.created || "—"}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 w-8">
        {/* Star Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStarToggle?.();
          }}
          className={cn(
            "p-1 rounded transition-opacity",
            document.starred
              ? "text-[--color-linear-text-primary]"
              : "text-[--color-linear-text-tertiary] opacity-0 group-hover:opacity-100",
            "hover:bg-[--color-linear-bg-active]"
          )}
          aria-label={document.starred ? "Unstar" : "Star"}
        >
          <StarIcon
            className={cn(
              "h-4 w-4",
              document.starred && "fill-current"
            )}
          />
        </button>

        {/* More Options */}
        {isHovered && (
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-[--color-linear-bg-active] text-[--color-linear-text-tertiary]"
            aria-label="More options"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
