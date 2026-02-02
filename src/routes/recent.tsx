import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { motion } from "framer-motion";
import { ContentTable } from "~/components/ContentTable";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { getRecentContent } from "~/utils/contentStorage";
import {
  LayoutGridIcon,
  ListIcon,
  ArrowUpDownIcon,
  StarIcon,
  SearchIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";
import styles from "./recent.module.css";

export const Route = createFileRoute("/recent")({
  component: RecentPage,
});

function RecentPage() {
  const [content, setContent] = React.useState(() => getRecentContent(20));
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  React.useEffect(() => {
    setContent(getRecentContent(20));
  }, []);

  return (
    <div className={styles.container}>
      {/* Header with toolbar */}
      <PageToolbar title="Recent">
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
        <ToolbarButton title="Search">
          <SearchIcon className="h-4 w-4" />
        </ToolbarButton>
      </PageToolbar>

      {/* Helper Text */}
      <div className={styles.helperText}>
        <p>Your recently viewed documents</p>
      </div>

      {/* Content Table */}
      <div className={styles.contentSection}>
        <ContentTable content={content} emptyMessage="No recent content" />
      </div>
    </div>
  );
}
