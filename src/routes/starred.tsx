import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentTable } from "~/components/ContentTable";
import { ContentGrid } from "~/components/ContentGrid";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { useContentStore } from "~/store/contentStore";
import { getStarredContentFromList } from "~/utils/contentQuery";
import {
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
  Crown,
  MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/starred")({
  component: StarredPage,
});

function StarredPage() {
  const content = useContentStore((state) => state.content);
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = React.useState<"updated" | "created" | "title">(
    "updated"
  );
  const starredContent = React.useMemo(
    () => getStarredContentFromList(content),
    [content]
  );

  // Sort content
  const sortedContent = React.useMemo(() => {
    return [...starredContent].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "updated":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });
  }, [content, sortBy]);

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar
        title={<div className="flex items-center gap-3">Starred</div>}
      >
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
            style={{
              background: "var(--color-linear-bg-elevated)",
              border: "1px solid var(--color-linear-border-primary)",
              color: "var(--color-linear-text-primary)",
              boxShadow: "var(--shadow-linear-sm)",
            }}
          >
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Get Craft Plus</span>
          </button>

          <div
            className="h-6 w-px mx-1"
            style={{ background: "var(--color-linear-border-primary)" }}
          />

          <div
            className="flex items-center rounded-lg p-0.5"
            style={{ background: "var(--color-linear-bg-tertiary)" }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className="p-1.5 rounded-md transition-all"
              style={{
                background:
                  viewMode === "grid"
                    ? "var(--color-linear-bg-elevated)"
                    : "transparent",
                boxShadow:
                  viewMode === "grid" ? "var(--shadow-linear-sm)" : "none",
                color:
                  viewMode === "grid"
                    ? "var(--color-linear-text-primary)"
                    : "var(--color-linear-text-tertiary)",
              }}
              title="Grid view"
            >
              <LayoutGridIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="p-1.5 rounded-md transition-all"
              style={{
                background:
                  viewMode === "list"
                    ? "var(--color-linear-bg-elevated)"
                    : "transparent",
                boxShadow:
                  viewMode === "list" ? "var(--shadow-linear-sm)" : "none",
                color:
                  viewMode === "list"
                    ? "var(--color-linear-text-primary)"
                    : "var(--color-linear-text-tertiary)",
              }}
              title="List view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>

          <ToolbarButton
            onClick={() => {
              const nextSort =
                sortBy === "updated"
                  ? "created"
                  : sortBy === "created"
                  ? "title"
                  : "updated";
              setSortBy(nextSort);
            }}
            title={`Sort by: ${sortBy}`}
          >
            <ArrowUpDownIcon className="h-4 w-4" />
          </ToolbarButton>

          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </PageToolbar>

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        {viewMode === "grid" ? (
          <ContentGrid
            content={sortedContent}
            emptyMessage="No starred content yet. Star items to access them quickly!"
          />
        ) : (
          <ContentTable
            content={sortedContent}
            emptyMessage="No starred content yet. Star items to access them quickly!"
          />
        )}
      </div>
    </div>
  );
}
