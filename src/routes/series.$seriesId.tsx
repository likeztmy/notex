import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContentList } from "~/components/ContentList";
import { PageToolbar } from "~/components/PageToolbar";
import { useContentStore } from "~/store/contentStore";
import { getSeriesContentFromList } from "~/utils/contentQuery";

export const Route = createFileRoute("/series/$seriesId")({
  component: SeriesPage,
});

function SeriesPage() {
  const { seriesId } = Route.useParams();
  const { view } = Route.useSearch<{ view?: string }>();
  const content = useContentStore((state) => state.content);
  const series = useContentStore((state) => state.series);

  const currentSeries = React.useMemo(
    () => series.find((item) => item.id === seriesId),
    [series, seriesId]
  );
  const seriesContent = React.useMemo(
    () =>
      getSeriesContentFromList(content, seriesId).filter((item) =>
        view === "public" ? item.publish?.isPublic : true
      ),
    [content, seriesId, view]
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <PageToolbar title={currentSeries?.title || "Series"}>
        <div
          className="text-xs"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          {seriesContent.length} posts
        </div>
      </PageToolbar>
      <div className="px-8 pb-8">
        {currentSeries?.description && (
          <div
            className="max-w-3xl mb-6 text-sm"
            style={{ color: "var(--color-linear-text-secondary)" }}
          >
            {currentSeries.description}
          </div>
        )}
        <ContentList
          content={seriesContent}
          emptyMessage="No documents in this series yet."
          showMode={true}
        />
      </div>
    </div>
  );
}
