import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentTable } from "~/components/ContentTable";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { loadContent } from "~/utils/contentStorage";
import {
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
  StarIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react";

export const Route = createFileRoute("/content")({
  component: ContentPage,
});

function ContentPage() {
  const [content, setContent] = React.useState(() => loadContent());
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"updated" | "created" | "title">(
    "updated",
  );

  // Refresh content when component mounts
  React.useEffect(() => {
    setContent(loadContent());
  }, []);

  // Filter and sort content
  const filteredContent = React.useMemo(() => {
    let filtered = content;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        // Search in title
        if (item.title.toLowerCase().includes(query)) return true;

        // Search in tags
        if (item.tags?.some((tag) => tag.toLowerCase().includes(query)))
          return true;

        // Search in document content
        if (item.docContent) {
          try {
            const extractText = (node: any): string => {
              if (node.text) return node.text;
              if (node.content) {
                return node.content.map(extractText).join(" ");
              }
              return "";
            };
            const text = extractText(item.docContent).toLowerCase();
            if (text.includes(query)) return true;
          } catch {
            // Ignore parsing errors
          }
        }

        return false;
      });
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
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
  }, [content, searchQuery, sortBy]);

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar title="All Documents">
        <ToolbarButton
          active={viewMode === "grid"}
          onClick={() => setViewMode("grid")}
          title="Grid view"
        >
          <LayoutGridIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={viewMode === "list"}
          onClick={() => setViewMode("list")}
          title="List view"
        >
          <ListIcon className="h-4 w-4" />
        </ToolbarButton>
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
        <ToolbarButton title="Starred">
          <StarIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Recent">
          <ClockIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Search">
          <SearchIcon className="h-4 w-4" />
        </ToolbarButton>
      </PageToolbar>

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <ContentTable
          content={filteredContent}
          emptyMessage={
            searchQuery
              ? "No documents match your search"
              : "Your documents will appear here"
          }
        />
      </div>
    </div>
  );
}
