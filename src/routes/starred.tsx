import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentTable } from "~/components/ContentTable";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { getStarredContent } from "~/utils/contentStorage";
import {
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
  ClockIcon,
  SearchIcon,
} from "lucide-react";

export const Route = createFileRoute("/starred")({
  component: StarredPage,
});

function StarredPage() {
  const [content, setContent] = React.useState(() => getStarredContent());
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  React.useEffect(() => {
    setContent(getStarredContent());
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar title="Starred">
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
        <ToolbarButton title="Sort">
          <ArrowUpDownIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Recent">
          <ClockIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Search">
          <SearchIcon className="h-4 w-4" />
        </ToolbarButton>
      </PageToolbar>

      <div className="px-6 py-4">
        <p
          className="text-xs text-center"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Star docs to keep them close
        </p>
      </div>

      {/* Content Table */}
      <div className="px-6 pb-8">
        <ContentTable
          content={content}
          emptyMessage="No starred content yet. Star items to access them quickly!"
        />
      </div>
    </div>
  );
}
