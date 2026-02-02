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

const DOCUMENTS_KEY = "notex-documents";

interface Document {
  id: string;
  title: string;
  content: any;
  createdAt: number;
  updatedAt: number;
  lastViewed?: number;
}

interface DocumentListProps {
  onSelectDoc: (id: string) => void;
}

// Load all documents from localStorage
const loadDocuments = (): Document[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(DOCUMENTS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved documents:", e);
      return [];
    }
  }
  return [];
};

// Save documents to localStorage
const saveDocuments = (documents: Document[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export function DocumentList({ onSelectDoc }: DocumentListProps) {
  const [documents, setDocuments] = React.useState<Document[]>([]);

  // Load documents on mount
  React.useEffect(() => {
    setDocuments(loadDocuments());
  }, []);

  const handleDeleteDoc = React.useCallback(
    (id: string) => {
      const updatedDocs = documents.filter((d) => d.id !== id);
      setDocuments(updatedDocs);
      saveDocuments(updatedDocs);
    },
    [documents],
  );

  const sortedDocs = React.useMemo(() => {
    return [...documents].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [documents]);

  // Group documents by date
  const groupedDocs = React.useMemo(() => {
    const groups: { [key: string]: Document[] } = {};
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
                          handleDeleteDoc(doc.id);
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
  document: Document;
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
            {getDocumentPreview(document)}
          </div>
        </div>
      </div>
      <div
        className="col-span-2 flex items-center text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {formatRelativeTime(document.lastViewed || document.updatedAt)}
      </div>
      <div
        className="col-span-2 flex items-center text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {formatRelativeTime(document.updatedAt)}
      </div>
      <div
        className="col-span-2 flex items-center text-xs"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {formatAbsoluteDate(document.createdAt)}
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

function getDocumentPreview(document: Document): string {
  if (!document.content || !document.content.content) return "Empty Document";

  // Extract text from Tiptap JSON content
  const extractText = (node: any): string => {
    if (node.type === "text") return node.text || "";
    if (node.content) {
      return node.content.map((child: any) => extractText(child)).join(" ");
    }
    return "";
  };

  const text = extractText(document.content).trim();
  return text || "Empty Document";
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "刚刚";
    return `${minutes}分钟前`;
  }
  if (hours < 24) return `${hours}小时前`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;

  return formatAbsoluteDate(timestamp);
}

function formatAbsoluteDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");
}
