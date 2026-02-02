import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentTable } from "~/components/ContentTable";
import { getContentByFolder } from "~/utils/contentStorage";
import {
  FolderIcon,
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
  StarIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react";

export const Route = createFileRoute("/folders/$folderId")({
  component: FolderPage,
});

function FolderPage() {
  const { folderId } = Route.useParams();
  const [content, setContent] = React.useState(() =>
    getContentByFolder(folderId),
  );
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  // Map folder IDs to display names and emojis
  const folderConfig: Record<string, { name: string; emoji?: string }> = {
    unsorted: { name: "Unsorted" },
    work: { name: "How to use Craft", emoji: "📁" },
    videos: { name: "How To Videos", emoji: "🎬" },
    handbook: { name: "Craft Handbook", emoji: "📖" },
    "getting-started": { name: "Getting Started", emoji: "🚀" },
  };

  const config = folderConfig[folderId] || { name: folderId };

  React.useEffect(() => {
    setContent(getContentByFolder(folderId));
  }, [folderId]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{
          background: "var(--color-linear-bg-elevated)",
          borderColor: "var(--color-linear-border-primary)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            {config.emoji ? (
              <div className="w-7 h-7 flex items-center justify-center text-lg">
                {config.emoji}
              </div>
            ) : (
              <div
                className="w-7 h-7 rounded flex items-center justify-center"
                style={{
                  background: "var(--color-linear-bg-tertiary)",
                }}
              >
                <FolderIcon
                  className="h-4 w-4"
                  style={{ color: "var(--color-linear-text-secondary)" }}
                />
              </div>
            )}
            <h1
              className="text-base font-medium"
              style={{ color: "var(--color-linear-text-primary)" }}
            >
              {config.name}
            </h1>
          </div>

          {/* Right: View Controls */}
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{
                border: "1px solid var(--color-linear-border-primary)",
              }}
            >
              <button
                onClick={() => setViewMode("grid")}
                className="px-2 py-1.5 transition-colors"
                style={{
                  background:
                    viewMode === "grid"
                      ? "var(--color-linear-bg-tertiary)"
                      : "transparent",
                  color: "var(--color-linear-text-secondary)",
                }}
              >
                <LayoutGridIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="px-2 py-1.5 transition-colors"
                style={{
                  background:
                    viewMode === "list"
                      ? "var(--color-linear-bg-tertiary)"
                      : "transparent",
                  color: "var(--color-linear-text-secondary)",
                }}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Button */}
            <button
              className="px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--color-linear-border-primary)",
                color: "var(--color-linear-text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--color-linear-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <ArrowUpDownIcon className="h-4 w-4" />
            </button>

            {/* Star Button */}
            <button
              className="px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--color-linear-border-primary)",
                color: "var(--color-linear-text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--color-linear-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <StarIcon className="h-4 w-4" />
            </button>

            {/* Recent Button */}
            <button
              className="px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--color-linear-border-primary)",
                color: "var(--color-linear-text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--color-linear-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <ClockIcon className="h-4 w-4" />
            </button>

            {/* Search Button */}
            <button
              className="px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid var(--color-linear-border-primary)",
                color: "var(--color-linear-text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--color-linear-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="px-6 py-4">
        <p
          className="text-xs text-center"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Any documents you haven't moved into a specific folder will appear
          here.
        </p>
      </div>

      {/* Content Table */}
      <div className="px-6 pb-8">
        <ContentTable
          content={content}
          emptyMessage={`No content in ${config.name} yet`}
        />
      </div>
    </div>
  );
}
