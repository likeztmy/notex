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
  Plus,
} from "lucide-react";
import type { Content } from "~/types/content";
import { useContentStore } from "~/store/contentStore";
import {
  getAllTagsFromContent,
  getRecentContentFromList,
  getStarredContentFromList,
  searchContentFromList,
} from "~/utils/contentQuery";
import { getContentPreview } from "~/utils/contentText";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const content = useContentStore((state) => state.content);
  const createContent = useContentStore((state) => state.createContent);
  const [query, setQuery] = React.useState("");
  const [filterTag, setFilterTag] = React.useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Get recent documents when no query
  const recentDocs = React.useMemo(
    () => getRecentContentFromList(content, 5),
    [content]
  );
  const allTags = React.useMemo(
    () => getAllTagsFromContent(content),
    [content]
  );
  const filterByTag = React.useCallback(
    (items: Content[]) => {
      if (!filterTag) return items;
      return items.filter((item) => item.tags?.includes(filterTag));
    },
    [filterTag]
  );

  const starredDocs = React.useMemo(() => {
    const recentIds = new Set(recentDocs.map((item) => item.id));
    return filterByTag(
      getStarredContentFromList(content)
        .filter((item) => !recentIds.has(item.id))
        .slice(0, 5)
    );
  }, [content, recentDocs, filterByTag]);

  const filteredRecentDocs = React.useMemo(() => {
    return filterByTag(recentDocs);
  }, [recentDocs, filterByTag]);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    return filterByTag(searchContentFromList(content, query));
  }, [content, query, filterByTag]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, results.length, filteredRecentDocs.length, starredDocs.length]);

  React.useEffect(() => {
    if (filterTag && !allTags.includes(filterTag)) {
      setFilterTag(null);
    }
  }, [filterTag, allTags]);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const displayItems = query.trim()
    ? results
    : [...filteredRecentDocs, ...starredDocs];
  const showRecent = !query.trim() && filteredRecentDocs.length > 0;
  const showStarred = !query.trim() && starredDocs.length > 0;
  const showCreate = Boolean(query.trim());
  const isCreateSelected = showCreate && selectedIndex === 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = displayItems;
    const hasCreate = Boolean(query.trim());
    const totalItems = items.length + (hasCreate ? 1 : 0);
    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hasCreate && selectedIndex === 0) {
        handleCreateNew();
        return;
      }
      const targetIndex = hasCreate ? selectedIndex - 1 : selectedIndex;
      const selectedItem = items[targetIndex];
      if (selectedItem) handleSelect(selectedItem);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (content: Content) => {
    navigate({ to: "/editor", search: { id: content.id } });
    onClose();
  };

  const handleCreateNew = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const newContent = createContent(trimmed);
    navigate({ to: "/editor", search: { id: newContent.id } });
    onClose();
  };

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
              {allTags.length > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-2 text-xs overflow-x-auto"
                  style={{
                    borderBottom:
                      "1px solid var(--color-linear-border-primary)",
                    color: "var(--color-linear-text-tertiary)",
                  }}
                >
                  <button
                    onClick={() => setFilterTag(null)}
                    className="px-2 py-1 rounded-full border transition-colors"
                    style={{
                      borderColor: "var(--color-linear-border-primary)",
                      background: filterTag
                        ? "transparent"
                        : "var(--color-linear-bg-tertiary)",
                      color: "var(--color-linear-text-secondary)",
                    }}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFilterTag(tag)}
                      className="px-2 py-1 rounded-full border transition-colors"
                      style={{
                        borderColor: "var(--color-linear-border-primary)",
                        background:
                          filterTag === tag
                            ? "var(--color-linear-bg-tertiary)"
                            : "transparent",
                        color: "var(--color-linear-text-secondary)",
                      }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {showCreate && (
                  <button
                    onClick={handleCreateNew}
                    onMouseEnter={() => setSelectedIndex(0)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{
                      background: isCreateSelected
                        ? "var(--color-linear-bg-hover)"
                        : "transparent",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--color-linear-bg-tertiary)" }}
                    >
                      <Plus
                        className="h-4 w-4"
                        style={{ color: "var(--color-linear-text-secondary)" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--color-linear-text-primary)" }}
                      >
                        Create "{query.trim()}"
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: "var(--color-linear-text-tertiary)" }}
                      >
                        New document
                      </div>
                    </div>
                    <CornerDownLeft
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "var(--color-linear-text-tertiary)" }}
                    />
                  </button>
                )}
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

                {query.trim() && results.length > 0 && (
                  <div
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    Results
                  </div>
                )}

                {query.trim() &&
                  results.map((item, index) => (
                    <SearchResultItem
                      key={item.id}
                      content={item}
                      query={query}
                      isSelected={
                        showCreate
                          ? index + 1 === selectedIndex
                          : index === selectedIndex
                      }
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() =>
                        setSelectedIndex(showCreate ? index + 1 : index)
                      }
                    />
                  ))}

                {showRecent &&
                  filteredRecentDocs.map((item, index) => (
                    <SearchResultItem
                      key={item.id}
                      content={item}
                      query={query}
                      isSelected={
                        showCreate
                          ? index + 1 === selectedIndex
                          : index === selectedIndex
                      }
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() =>
                        setSelectedIndex(showCreate ? index + 1 : index)
                      }
                    />
                  ))}

                {showStarred && (
                  <div
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    <Star className="inline-block h-3 w-3 mr-1.5 -mt-0.5" />
                    Starred
                  </div>
                )}

                {showStarred &&
                  starredDocs.map((item, index) => {
                    const offset = filteredRecentDocs.length;
                    const position = offset + index;
                    return (
                      <SearchResultItem
                        key={item.id}
                        content={item}
                        query={query}
                        isSelected={
                          showCreate
                            ? position + 1 === selectedIndex
                            : position === selectedIndex
                        }
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() =>
                          setSelectedIndex(showCreate ? position + 1 : position)
                        }
                      />
                    );
                  })}

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
                    <span className="ml-1">
                      {showCreate ? "create" : "open"}
                    </span>
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

function highlightText(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [{ text, match: false }];
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  const parts: { text: string; match: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), match: false });
    }
    parts.push({ text: match[0], match: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), match: false });
  }
  return parts.length > 0 ? parts : [{ text, match: false }];
}

interface SearchResultItemProps {
  content: Content;
  query: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function SearchResultItem({
  content,
  query,
  isSelected,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) {
  const preview = getContentPreview(content, 80, "Empty document");
  const titleParts = highlightText(content.title || "Untitled", query);
  const previewParts = highlightText(preview, query);

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
          {titleParts.map((part, index) =>
            part.match ? (
              <mark
                key={`${part.text}-${index}`}
                style={{
                  background: "rgba(255, 220, 100, 0.35)",
                  color: "inherit",
                  borderRadius: "2px",
                  padding: "0 2px",
                }}
              >
                {part.text}
              </mark>
            ) : (
              <span key={`${part.text}-${index}`}>{part.text}</span>
            )
          )}
        </div>
        <div
          className="text-xs truncate"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          {previewParts.map((part, index) =>
            part.match ? (
              <mark
                key={`${part.text}-${index}`}
                style={{
                  background: "rgba(255, 220, 100, 0.25)",
                  color: "inherit",
                  borderRadius: "2px",
                  padding: "0 2px",
                }}
              >
                {part.text}
              </mark>
            ) : (
              <span key={`${part.text}-${index}`}>{part.text}</span>
            )
          )}
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
