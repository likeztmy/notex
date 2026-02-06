import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import type { Content } from "~/types/content";
import { useContentStore } from "~/store/contentStore";

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
  const allContent = useContentStore((state) => state.content);
  const isLoaded = useContentStore((state) => state.isLoaded);
  const createContent = useContentStore((state) => state.createContent);
  const updateLastViewed = useContentStore((state) => state.updateLastViewed);
  const lastViewedUpdatedRef = React.useRef<string | null>(null);

  const existingContent = React.useMemo(
    () => (id ? allContent.find((item) => item.id === id) : undefined),
    [allContent, id]
  );

  // Load or create content
  React.useEffect(() => {
    if (!isLoaded) return;
    if (id) {
      if (existingContent) {
        setContent(existingContent);
        if (lastViewedUpdatedRef.current !== id) {
          updateLastViewed(id);
          lastViewedUpdatedRef.current = id;
        }
      } else {
        navigate({ to: "/content" });
      }
      return;
    }

    if (isCreating) {
      const newContent = createContent("");
      setContent(newContent);
      navigate({
        to: "/editor",
        search: { id: newContent.id },
        replace: true,
      });
      return;
    }

    navigate({ to: "/content" });
  }, [
    id,
    isCreating,
    navigate,
    isLoaded,
    existingContent,
    updateLastViewed,
    createContent,
  ]);

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
      <DocEditor documentId={content.id} />
    </React.Suspense>
  );
}
