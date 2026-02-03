import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentTable } from "~/components/ContentTable";
import { ContentGrid } from "~/components/ContentGrid";
import { getContentByFolder, getFolderById } from "~/utils/contentStorage";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
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
    getContentByFolder(folderId)
  );
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  // Get folder info from storage
  const folder = getFolderById(folderId);
  const folderName = folder?.name || folderId;
  const folderEmoji = folder?.emoji;

  React.useEffect(() => {
    setContent(getContentByFolder(folderId));
  }, [folderId]);

  const titleWithEmoji = folderEmoji ? (
    <span className="flex items-center gap-2">
      <span className="text-lg">{folderEmoji}</span>
      {folderName}
    </span>
  ) : (
    folderName
  );

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar title={titleWithEmoji}>
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
        {viewMode === "grid" ? (
          <ContentGrid
            content={content}
            emptyMessage={`No content in ${folderName} yet`}
          />
        ) : (
          <ContentTable
            content={content}
            emptyMessage={`No content in ${folderName} yet`}
          />
        )}
      </div>
    </div>
  );
}
