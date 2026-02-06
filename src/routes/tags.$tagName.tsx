import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { TagIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { ContentTable } from "~/components/ContentTable";
import { ContentGrid } from "~/components/ContentGrid";
import { PageToolbar } from "~/components/PageToolbar";
import { ToolbarButton } from "~/components/ToolbarButton";
import { useContentStore } from "~/store/contentStore";
import {
  getAllTagsFromContent,
  getContentByTagFromList,
} from "~/utils/contentQuery";

export const Route = createFileRoute("/tags/$tagName")({
  component: TagPage,
});

function TagPage() {
  const { tagName } = Route.useParams();
  const displayTagName = decodeURIComponent(tagName);

  const content = useContentStore((state) => state.content);
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");

  const taggedContent = React.useMemo(
    () => getContentByTagFromList(content, displayTagName),
    [content, displayTagName]
  );
  const allTags = React.useMemo(
    () => getAllTagsFromContent(content).filter((t) => t !== displayTagName),
    [content, displayTagName]
  );

  // Get related tags (tags that appear in documents with this tag)
  const relatedTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    taggedContent.forEach((doc) => {
      doc.tags?.forEach((tag) => {
        if (tag !== displayTagName) tagSet.add(tag);
      });
    });
    return Array.from(tagSet).slice(0, 8);
  }, [taggedContent, displayTagName]);

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar
        title={
          <span className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />#{displayTagName}
          </span>
        }
      >
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
      </PageToolbar>

      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Tag info */}
        <div className="mb-6">
          <p
            className="text-sm"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            {taggedContent.length} document
            {taggedContent.length !== 1 ? "s" : ""} with this tag
          </p>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          <ContentGrid
            content={taggedContent}
            emptyMessage={`No documents tagged with #${displayTagName}`}
          />
        ) : (
          <ContentTable
            content={taggedContent}
            emptyMessage={`No documents tagged with #${displayTagName}`}
          />
        )}

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div
            className="mt-12 pt-8 border-t"
            style={{ borderColor: "var(--color-linear-border-primary)" }}
          >
            <h3
              className="text-sm font-medium mb-4"
              style={{ color: "var(--color-linear-text-primary)" }}
            >
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Link
                  key={tag}
                  to="/tags/$tagName"
                  params={{ tagName: tag }}
                  className="px-3 py-2 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
                  style={{
                    background: "var(--color-linear-bg-primary)",
                    color: "var(--color-linear-text-primary)",
                    border: "1px solid var(--color-linear-border-primary)",
                  }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All tags */}
        {allTags.length > 0 && (
          <div className="mt-8">
            <h3
              className="text-sm font-medium mb-4"
              style={{ color: "var(--color-linear-text-primary)" }}
            >
              All Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map((tag) => (
                <Link
                  key={tag}
                  to="/tags/$tagName"
                  params={{ tagName: tag }}
                  className="px-3 py-1.5 rounded text-sm transition-all duration-150 hover:bg-black/5"
                  style={{
                    color: "var(--color-linear-text-secondary)",
                  }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
