import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Plus, Check } from "lucide-react";
import {
  getAllTags,
  addTagToContent,
  removeTagFromContent,
} from "~/utils/contentStorage";

interface TagInputProps {
  contentId: string;
  currentTags?: string[];
  onTagsChange?: () => void;
}

export function TagInput({
  contentId,
  currentTags = [],
  onTagsChange,
}: TagInputProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>(currentTags);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Update local tags when prop changes
  React.useEffect(() => {
    setTags(currentTags);
  }, [currentTags]);

  // Get suggestions when input changes
  React.useEffect(() => {
    if (inputValue.trim()) {
      const allTags = getAllTags();
      const filtered = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(tag)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, tags]);

  // Focus input when adding
  React.useEffect(() => {
    if (isAdding) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      addTagToContent(contentId, trimmedTag);
      setTags([...tags, trimmedTag]);
      onTagsChange?.();
    }
    setInputValue("");
    setIsAdding(false);
  };

  const handleRemoveTag = (tag: string) => {
    removeTagFromContent(contentId, tag);
    setTags(tags.filter((t) => t !== tag));
    onTagsChange?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsAdding(false);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Existing tags */}
      {tags.map((tag) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs group"
          style={{
            background: "var(--color-linear-bg-tertiary)",
            color: "var(--color-linear-text-secondary)",
          }}
        >
          <Tag className="h-2.5 w-2.5" />
          {tag}
          <button
            onClick={() => handleRemoveTag(tag)}
            className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.span>
      ))}

      {/* Add tag input/button */}
      {isAdding ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) handleAddTag(inputValue);
              else setIsAdding(false);
            }}
            placeholder="Add tag..."
            className="px-2 py-0.5 text-xs rounded border outline-none w-24"
            style={{
              background: "white",
              borderColor: "var(--color-linear-border-focus)",
              color: "var(--color-linear-text-primary)",
            }}
          />

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div
              className="absolute left-0 top-full mt-1 w-32 rounded-lg shadow-lg overflow-hidden z-10"
              style={{
                background: "var(--color-linear-bg-elevated)",
                border: "1px solid var(--color-linear-border-primary)",
              }}
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddTag(suggestion);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-black/5 transition-colors text-left"
                  style={{ color: "var(--color-linear-text-primary)" }}
                >
                  <Tag className="h-3 w-3" style={{ color: "#999" }} />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors hover:bg-black/5"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          <Plus className="h-3 w-3" />
          Add tag
        </button>
      )}
    </div>
  );
}

// Tag Dialog for adding tags from a modal
interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  currentTags?: string[];
  onTagsChange?: () => void;
}

export function TagDialog({
  isOpen,
  onClose,
  contentId,
  currentTags = [],
  onTagsChange,
}: TagDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(currentTags);
  const [allTags, setAllTags] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load all tags and focus input
  React.useEffect(() => {
    if (isOpen) {
      setTags(currentTags);
      setAllTags(getAllTags());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, currentTags]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      addTagToContent(contentId, trimmedTag);
      setTags([...tags, trimmedTag]);
      onTagsChange?.();
    }
    setInputValue("");
  };

  const handleRemoveTag = (tag: string) => {
    removeTagFromContent(contentId, tag);
    setTags(tags.filter((t) => t !== tag));
    onTagsChange?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Suggestions - tags that exist but aren't on this doc
  const suggestions = allTags.filter(
    (tag) =>
      !tags.includes(tag) &&
      (inputValue ? tag.toLowerCase().includes(inputValue.toLowerCase()) : true)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0, 0, 0, 0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden"
            style={{
              background: "var(--color-linear-bg-elevated)",
              border: "1px solid var(--color-linear-border-primary)",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--color-linear-border-primary)" }}
            >
              <h2
                className="text-sm font-medium"
                style={{ color: "var(--color-linear-text-primary)" }}
              >
                Manage Tags
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-black/5"
              >
                <X className="h-4 w-4" style={{ color: "#999" }} />
              </button>
            </div>

            {/* Current tags */}
            <div
              className="p-4 border-b"
              style={{ borderColor: "var(--color-linear-border-primary)" }}
            >
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm group"
                      style={{
                        background: "var(--color-linear-bg-tertiary)",
                        color: "var(--color-linear-text-secondary)",
                      }}
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    No tags yet
                  </span>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="p-4">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to add or search tags..."
                className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                style={{
                  background: "white",
                  borderColor: "var(--color-linear-border-primary)",
                  color: "var(--color-linear-text-primary)",
                }}
              />

              {/* Add new tag button */}
              {inputValue.trim() &&
                !tags.includes(inputValue.trim().toLowerCase()) && (
                  <button
                    onClick={() => handleAddTag(inputValue)}
                    className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-black/5"
                    style={{ color: "var(--color-linear-text-primary)" }}
                  >
                    <Plus className="h-4 w-4" />
                    Create tag "{inputValue.trim()}"
                  </button>
                )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-3">
                  <div
                    className="text-xs font-medium uppercase tracking-wide mb-2"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    {inputValue ? "Matching tags" : "All tags"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 10).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors hover:bg-black/5"
                        style={{
                          border:
                            "1px solid var(--color-linear-border-primary)",
                          color: "var(--color-linear-text-secondary)",
                        }}
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        <Plus className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
