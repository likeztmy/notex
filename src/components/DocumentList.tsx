import * as React from "react";
import { AnimatePresence } from "framer-motion";
import {
  LayoutGridIcon,
  LayoutListIcon,
  ArrowUpDownIcon,
  SearchIcon,
  SmileIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import type { Content } from "~/types/content";
import { useContentStore } from "~/store/contentStore";
import { getContentPreview } from "~/utils/contentText";
import {
  formatRelativeTimeCompact,
  formatRelativeDateShort,
} from "~/utils/dateFormat";

interface DocumentListProps {
  onSelectDoc: (id: string) => void;
}

export function DocumentList({ onSelectDoc }: DocumentListProps) {
  const content = useContentStore((state) => state.content);
  const deleteContent = useContentStore((state) => state.deleteContent);

  const unsortedDocs = React.useMemo(
    () =>
      content.filter((item) => !item.folderId || item.folderId === "unsorted"),
    [content]
  );

  const sortedDocs = React.useMemo(() => {
    return [...unsortedDocs].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [unsortedDocs]);

  // Group documents by date
  const groupedDocs = React.useMemo(() => {
    const groups: { [key: string]: Content[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    sortedDocs.forEach((doc) => {
      const docDate = new Date(doc.updatedAt);
      docDate.setHours(0, 0, 0, 0);

      let groupKey = "Older";
      if (docDate.getTime() === today.getTime()) {
        groupKey = "Today";
      } else if (docDate.getTime() === yesterday.getTime()) {
        groupKey = "Yesterday";
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(doc);
    });

    return groups;
  }, [sortedDocs]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      {/* Header with toolbar */}
      <PageToolbar title="Unsorted">
        <ToolbarButton active title="List view">
          <LayoutListIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Grid view">
          <LayoutGridIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Sort">
          <ArrowUpDownIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Reactions">
          <SmileIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Search">
          <SearchIcon className="h-4 w-4" />
        </ToolbarButton>
      </PageToolbar>

      {/* Content */}
      <div className="px-6">
        {sortedDocs.length === 0 ? (
          <div className="text-center py-16">
            <p
              className="text-sm"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            >
              Any documents you haven't moved into a specific folder will appear
              here.
            </p>
          </div>
        ) : (
          <>
            <div
              className="text-xs mb-4 text-center"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            >
              Any documents you haven't moved into a specific folder will appear
              here.
            </div>

            {/* Table Header */}
            <div
              className="grid grid-cols-12 gap-4 px-4 py-2 text-xs border-t border-b"
              style={{
                color: "var(--color-linear-text-tertiary)",
                borderColor: "var(--color-linear-border-primary)",
              }}
            >
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Last Viewed</div>
              <div className="col-span-2">Updated ↓</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1"></div>
            </div>

            {/* Grouped Documents */}
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedDocs).map(([groupName, docs]) => (
                <div key={groupName}>
                  <div
                    className="px-4 py-2 text-xs font-medium"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    {groupName}
                  </div>
                  {docs.map((doc) => (
                    <DocumentRow
                      key={doc.id}
                      document={doc}
                      onSelect={() => onSelectDoc(doc.id)}
                      onDelete={() => {
                        if (
                          window.confirm(`Delete "${doc.title || "Untitled"}"?`)
                        ) {
                          deleteContent(doc.id);
                        }
                      }}
                    />
                  ))}
                </div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

function DocumentRow({
  document,
  onSelect,
  onDelete,
}: {
  document: Content;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full grid grid-cols-12 gap-4 px-4 py-2.5 text-sm text-left cursor-pointer rounded transition-colors"
      style={{
        background: isHovered ? "var(--color-linear-bg-hover)" : "transparent",
      }}
    >
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 w-8 h-8 rounded bg-white flex items-center justify-center text-base">
          📄
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="truncate"
            style={{ color: "var(--color-linear-text-primary)" }}
          >
            {document.title || "Untitled"}
          </div>
          <div
            className="text-xs truncate mt-0.5"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            {getContentPreview(document, 120, "Empty Document")}
          </div>
        </div>
      </div>
      <div
        className="col-span-2 flex items-center text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {formatRelativeTimeCompact(document.lastViewed || document.updatedAt)}
      </div>
      <div
        className="col-span-2 flex items-center text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {formatRelativeTimeCompact(document.updatedAt)}
      </div>
      <div
        className="col-span-2 flex items-center text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {formatRelativeDateShort(document.createdAt)}
      </div>
      <div className="col-span-1 flex items-center justify-end">
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-opacity-80 transition-colors"
            style={{
              background: "var(--color-linear-bg-tertiary)",
              color: "var(--color-linear-text-secondary)",
            }}
            title="More"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </button>
  );
}
