import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentTable } from "~/components/ContentTable";
import { ContentGrid } from "~/components/ContentGrid";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { useContentStore } from "~/store/contentStore";
import {
  getContentByFolderFromList,
  getFolderByIdFromList,
} from "~/utils/contentQuery";
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
  const content = useContentStore((state) => state.content);
  const folders = useContentStore((state) => state.folders);
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  // Get folder info from storage
  const folder = React.useMemo(
    () => getFolderByIdFromList(folders, folderId),
    [folders, folderId]
  );
  const folderName = folder?.name || folderId;
  const folderEmoji = folder?.emoji;
  const folderContent = React.useMemo(
    () => getContentByFolderFromList(content, folderId),
    [content, folderId]
  );

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
            content={folderContent}
            emptyMessage={`No content in ${folderName} yet`}
          />
        ) : (
          <ContentTable
            content={folderContent}
            emptyMessage={`No content in ${folderName} yet`}
          />
        )}
      </div>
    </div>
  );
}
