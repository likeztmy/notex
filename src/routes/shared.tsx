import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentList } from "~/components/ContentList";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { getSharedContent } from "~/utils/contentStorage";
import {
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
  SearchIcon,
} from "lucide-react";

export const Route = createFileRoute("/shared")({
  component: SharedPage,
});

function SharedPage() {
  const [content, setContent] = React.useState(() => getSharedContent());

  React.useEffect(() => {
    setContent(getSharedContent());
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar title="Shared with Me">
        <ToolbarButton title="Grid view">
          <LayoutGridIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active title="List view">
          <ListIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Sort">
          <ArrowUpDownIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Search">
          <SearchIcon className="h-4 w-4" />
        </ToolbarButton>
      </PageToolbar>

      <div className="p-8">
        <ContentList
          content={content}
          emptyMessage="No shared content yet. When others share with you, it'll appear here."
          showMode={true}
        />
      </div>
    </div>
  );
}
