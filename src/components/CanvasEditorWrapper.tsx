import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { getContentById, updateContent } from "~/utils/contentStorage";
import type { Content } from "~/types/content";
import type { Block } from "~/types/block";
import { CanvasEditor } from "./blocks";
import { ArrowLeft, FileText } from "lucide-react";

interface CanvasEditorWrapperProps {
  documentId: string;
}

export function CanvasEditorWrapper({ documentId }: CanvasEditorWrapperProps) {
  const [currentDoc, setCurrentDoc] = React.useState<Content | null>(null);
  const [title, setTitle] = React.useState("");
  const navigate = useNavigate();

  // Load document
  React.useEffect(() => {
    const doc = getContentById(documentId);
    if (doc) {
      setCurrentDoc(doc);
      setTitle(doc.title || "");
    } else {
      navigate({ to: "/content" });
    }
  }, [documentId, navigate]);

  // Auto-save title
  React.useEffect(() => {
    if (!currentDoc) return;

    const timeoutId = setTimeout(() => {
      if (title !== currentDoc.title) {
        updateContent(documentId, { title });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [title, currentDoc, documentId]);

  // Handle blocks change
  const handleBlocksChange = React.useCallback(
    (blocks: Block[]) => {
      updateContent(documentId, { canvasBlocks: blocks });
      setCurrentDoc((prev) =>
        prev ? { ...prev, canvasBlocks: blocks, updatedAt: Date.now() } : null,
      );
    },
    [documentId],
  );

  if (!currentDoc) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "white" }}
      >
        <div
          className="text-sm animate-pulse"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          background: "white",
          borderColor: "var(--color-linear-border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate({ to: "/content" })}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Back to documents"
          >
            <ArrowLeft
              className="w-5 h-5"
              style={{ color: "var(--color-linear-text-secondary)" }}
            />
          </button>

          {/* Icon */}
          <div
            className="p-2 rounded"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            <FileText
              className="w-5 h-5"
              style={{ color: "var(--color-linear-accent-primary)" }}
            />
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Canvas"
            className="flex-1 text-xl font-semibold border-none outline-none bg-transparent"
            style={{ color: "var(--color-linear-text-primary)" }}
          />

          {/* Mode Badge */}
          <div
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "var(--color-linear-bg-secondary)",
              color: "var(--color-linear-text-tertiary)",
            }}
          >
            Canvas Mode
          </div>
        </div>
      </div>

      {/* Canvas Editor */}
      <CanvasEditor
        blocks={currentDoc.canvasBlocks || []}
        onChange={handleBlocksChange}
      />
    </div>
  );
}
