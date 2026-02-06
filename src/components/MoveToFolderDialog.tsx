import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FolderPlus, Check, X } from "lucide-react";
import { useContentStore } from "~/store/contentStore";

interface MoveToFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  currentFolderId?: string;
  onMoved?: () => void;
}

export function MoveToFolderDialog({
  isOpen,
  onClose,
  contentId,
  currentFolderId,
  onMoved,
}: MoveToFolderDialogProps) {
  const folders = useContentStore((state) => state.folders);
  const load = useContentStore((state) => state.load);
  const createFolder = useContentStore((state) => state.createFolder);
  const moveToFolder = useContentStore((state) => state.moveToFolder);
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(
    currentFolderId || null
  );
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const newFolderInputRef = React.useRef<HTMLInputElement>(null);

  // Load folders
  React.useEffect(() => {
    if (isOpen) {
      load();
      setSelectedFolderId(currentFolderId || null);
    }
  }, [isOpen, currentFolderId, load]);

  // Focus new folder input
  React.useEffect(() => {
    if (isCreatingFolder) {
      setTimeout(() => newFolderInputRef.current?.focus(), 50);
    }
  }, [isCreatingFolder]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folder = createFolder(newFolderName.trim());
      setSelectedFolderId(folder.id);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleMove = () => {
    if (selectedFolderId) {
      moveToFolder(contentId, selectedFolderId);
      onMoved?.();
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

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

          {/* Dialog */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden"
            style={{
              background: "var(--color-linear-bg-elevated)",
              border: "1px solid var(--color-linear-border-primary)",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
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
                Move to Folder
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded transition-colors"
                style={{ background: "transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-linear-bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <X
                  className="h-4 w-4"
                  style={{ color: "var(--color-linear-text-tertiary)" }}
                />
              </button>
            </div>

            {/* Folder List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    background:
                      selectedFolderId === folder.id
                        ? "var(--color-linear-bg-tertiary)"
                        : "transparent",
                  }}
                >
                  {folder.emoji ? (
                    <span className="text-base">{folder.emoji}</span>
                  ) : (
                    <Folder
                      className="h-4 w-4"
                      style={{ color: "var(--color-linear-text-secondary)" }}
                    />
                  )}
                  <span
                    className="flex-1 text-left text-sm"
                    style={{ color: "var(--color-linear-text-primary)" }}
                  >
                    {folder.name}
                  </span>
                  {selectedFolderId === folder.id && (
                    <Check
                      className="h-4 w-4"
                      style={{ color: "var(--color-linear-accent-primary)" }}
                    />
                  )}
                </button>
              ))}

              {/* New folder input */}
              {isCreatingFolder ? (
                <div className="flex items-center gap-2 px-3 py-2">
                  <FolderPlus
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  />
                  <input
                    ref={newFolderInputRef}
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onBlur={() => {
                      if (newFolderName.trim()) handleCreateFolder();
                      else setIsCreatingFolder(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                      if (e.key === "Escape") {
                        setIsCreatingFolder(false);
                        setNewFolderName("");
                      }
                    }}
                    placeholder="Folder name..."
                    className="flex-1 px-2 py-1 text-sm rounded border outline-none"
                    style={{
                      borderColor: "var(--color-linear-border-focus)",
                      background: "var(--color-linear-bg-primary)",
                      color: "var(--color-linear-text-primary)",
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                  style={{ background: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-linear-bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FolderPlus
                    className="h-4 w-4"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    New folder...
                  </span>
                </button>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-end gap-2 px-4 py-3 border-t"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                background: "var(--color-linear-bg-secondary)",
              }}
            >
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg transition-colors"
                style={{
                  color: "var(--color-linear-text-secondary)",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-linear-bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                disabled={
                  !selectedFolderId || selectedFolderId === currentFolderId
                }
                className="px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
                style={{
                  background: "var(--color-linear-accent-primary)",
                  color: "white",
                }}
              >
                Move
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
