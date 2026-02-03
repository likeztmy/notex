import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import {
  getContentById,
  createNewContent,
  updateLastViewed,
} from "~/utils/contentStorage";
import type { Content } from "~/types/content";

// Import editor component
const DocEditor = React.lazy(() =>
  import("~/components/Editor").then((mod) => ({ default: mod.Editor }))
);

export const Route = createFileRoute("/editor")({
  component: EditorPage,
  validateSearch: (
    search: Record<string, unknown>
  ): {
    id?: string;
    create?: string;
  } => {
    return {
      id: typeof search.id === "string" ? search.id : undefined,
      create:
        search.create === "true" || search.create === true ? "true" : undefined,
    };
  },
});

function EditorPage() {
  const { id, create } = Route.useSearch();
  const navigate = useNavigate();
  const isCreating = create === "true";
  const [content, setContent] = React.useState<Content | null>(null);

  // Load or create content
  React.useEffect(() => {
    if (id) {
      // Load existing content
      const existingContent = getContentById(id);
      if (existingContent) {
        setContent(existingContent);
        updateLastViewed(id);
      } else {
        // Content not found, redirect to content list
        navigate({ to: "/content" });
      }
    } else if (isCreating) {
      // Create new document
      const newContent = createNewContent("");
      setContent(newContent);
      // Update URL with new content ID
      navigate({
        to: "/editor",
        search: { id: newContent.id },
        replace: true,
      });
    } else {
      // No ID and not creating, redirect
      navigate({ to: "/content" });
    }
  }, [id, isCreating, navigate]);

  // Show loading while content is being prepared
  if (!content) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-linear-bg-secondary)" }}
      >
        <div
          className="font-light animate-pulse"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  // Render editor
  return (
    <React.Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--color-linear-bg-secondary)" }}
        >
          <div
            className="font-light animate-pulse"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            Loading editor...
          </div>
        </div>
      }
    >
      <DocEditor documentId={content.id} createNew={false} />
    </React.Suspense>
  );
}
