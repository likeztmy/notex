import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  X,
  Clock,
  Star,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { searchContentFull, getRecentContent } from "~/utils/contentStorage";
import type { Content } from "~/types/content";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Content[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Get recent documents when no query
  const recentDocs = React.useMemo(() => getRecentContent(5), []);

  // Search when query changes
  React.useEffect(() => {
    if (query.trim()) {
      const searchResults = searchContentFull(query);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [query]);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? results : recentDocs;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedItem = items[selectedIndex];
      if (selectedItem) {
        handleSelect(selectedItem);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (content: Content) => {
    navigate({ to: "/editor", search: { id: content.id } });
    onClose();
  };

  const displayItems = query.trim() ? results : recentDocs;
  const showRecent = !query.trim() && recentDocs.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="overflow-hidden rounded-xl shadow-2xl"
              style={{
                background: "var(--color-linear-bg-elevated)",
                border: "1px solid var(--color-linear-border-primary)",
              }}
            >
              {/* Search Input */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom: "1px solid var(--color-linear-border-primary)",
                }}
              >
                <Search
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: "var(--color-linear-text-tertiary)" }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search documents..."
                  className="flex-1 bg-transparent text-base outline-none"
                  style={{
                    color: "var(--color-linear-text-primary)",
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded hover:opacity-70 transition-opacity"
                  >
                    <X
                      className="h-4 w-4"
                      style={{ color: "var(--color-linear-text-tertiary)" }}
                    />
                  </button>
                )}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                  style={{
                    background: "var(--color-linear-bg-tertiary)",
                    color: "var(--color-linear-text-tertiary)",
                  }}
                >
                  <span>esc</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {showRecent && (
                  <div
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    <Clock className="inline-block h-3 w-3 mr-1.5 -mt-0.5" />
                    Recent
                  </div>
                )}

                {query.trim() && results.length === 0 && (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    No documents found for "{query}"
                  </div>
                )}

                {displayItems.map((item, index) => (
                  <SearchResultItem
                    key={item.id}
                    content={item}
                    isSelected={index === selectedIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  />
                ))}

                {displayItems.length === 0 && !query.trim() && (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    No recent documents. Create your first document!
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-4 py-2 text-xs"
                style={{
                  background: "var(--color-linear-bg-secondary)",
                  color: "var(--color-linear-text-tertiary)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd
                      className="px-1.5 py-0.5 rounded"
                      style={{ background: "var(--color-linear-bg-tertiary)" }}
                    >
                      ↑
                    </kbd>
                    <kbd
                      className="px-1.5 py-0.5 rounded"
                      style={{ background: "var(--color-linear-bg-tertiary)" }}
                    >
                      ↓
                    </kbd>
                    <span className="ml-1">navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd
                      className="px-1.5 py-0.5 rounded"
                      style={{ background: "var(--color-linear-bg-tertiary)" }}
                    >
                      <CornerDownLeft className="h-3 w-3" />
                    </kbd>
                    <span className="ml-1">open</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SearchResultItemProps {
  content: Content;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function SearchResultItem({
  content,
  isSelected,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) {
  const preview = getContentPreview(content);

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{
        background: isSelected ? "var(--color-linear-bg-hover)" : "transparent",
      }}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "var(--color-linear-bg-tertiary)" }}
      >
        <FileText
          className="h-4 w-4"
          style={{ color: "var(--color-linear-text-secondary)" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium truncate"
          style={{ color: "var(--color-linear-text-primary)" }}
        >
          {content.title || "Untitled"}
        </div>
        <div
          className="text-xs truncate"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          {preview}
        </div>
      </div>
      {content.starred && (
        <Star
          className="h-3.5 w-3.5 flex-shrink-0 fill-current"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        />
      )}
      {isSelected && (
        <ArrowRight
          className="h-4 w-4 flex-shrink-0"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        />
      )}
    </button>
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
      return text.slice(0, 80) || "Empty document";
    } catch {
      return "Empty document";
    }
  }
  return "No content";
}

// Hook for global search shortcut
export function useSearchModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
