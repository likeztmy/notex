import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { useContentStore } from "~/store/contentStore";
import {
  getAllTagsFromContent,
  getPublicContentFromList,
  searchContentFromList,
} from "~/utils/contentQuery";
import { getContentPreview } from "~/utils/contentText";
import { formatRelativeDateShort } from "~/utils/dateFormat";
import { getPublicDocSlug } from "~/utils/publicLink";

type SortOption = "recent" | "popular";

export const Route = createFileRoute("/public")({
  component: PublicHubPage,
});

function PublicHubPage() {
  const location = useLocation();
  const content = useContentStore((state) => state.content);
  const series = useContentStore((state) => state.series);
  const isLoaded = useContentStore((state) => state.isLoaded);
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string>("all");
  const [activeSeries, setActiveSeries] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("recent");

  const publicContent = React.useMemo(
    () => getPublicContentFromList(content),
    [content]
  );
  const tags = React.useMemo(
    () => getAllTagsFromContent(publicContent),
    [publicContent]
  );
  const publicSeries = React.useMemo(
    () =>
      series.filter((entry) =>
        publicContent.some((doc) => doc.seriesId === entry.id)
      ),
    [publicContent, series]
  );

  const filtered = React.useMemo(() => {
    let items = publicContent;

    if (query.trim()) {
      items = searchContentFromList(items, query);
    }

    if (activeTag !== "all") {
      items = items.filter((doc) => doc.tags?.includes(activeTag));
    }

    if (activeSeries !== "all") {
      items = items.filter((doc) => doc.seriesId === activeSeries);
    }

    return items.toSorted((a, b) => {
      if (sortBy === "popular") {
        return (b.publicStats?.views || 0) - (a.publicStats?.views || 0);
      }
      return b.updatedAt - a.updatedAt;
    });
  }, [activeSeries, activeTag, publicContent, query, sortBy]);

  if (location.pathname !== "/public") {
    return <Outlet />;
  }

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen public-theme-minimal public-hub"
        style={{ background: "var(--color-linear-bg-primary)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-10 w-1/2 rounded bg-[var(--color-linear-bg-tertiary)]" />
          <div className="mt-4 h-4 w-2/3 rounded bg-[var(--color-linear-bg-tertiary)]" />
          <div className="mt-10 h-12 w-full rounded bg-[var(--color-linear-bg-tertiary)]" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl bg-[var(--color-linear-bg-tertiary)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen public-theme-minimal public-hub"
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="public-hub-hero">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
            <Sparkles className="h-3 w-3" />
            Publishing
          </div>
          <h1 className="public-hub-title">Notex Public Library</h1>
          <p className="public-hub-subtitle">
            A curated stream of public notebooks, series, and essays designed
            for focused reading.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/public/profile" className="public-profile-button">
              View author profile
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="public-hub-stat">
              {publicContent.length} public documents
            </span>
            <span className="public-hub-stat">
              {publicSeries.length} series collections
            </span>
            <span className="public-hub-stat">{tags.length} active tags</span>
          </div>
        </div>

        <div className="public-hub-toolbar">
          <div className="public-hub-search">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search public documents, tags, or phrases..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="public-hub-filters">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="public-hub-select"
            >
              <option value="recent">Most recent</option>
              <option value="popular">Most read</option>
            </select>
            <select
              value={activeSeries}
              onChange={(event) => setActiveSeries(event.target.value)}
              className="public-hub-select"
            >
              <option value="all">All series</option>
              {publicSeries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag("all")}
              className={`public-hub-chip ${
                activeTag === "all" ? "is-active" : ""
              }`}
            >
              All tags
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`public-hub-chip ${
                  activeTag === tag ? "is-active" : ""
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {publicSeries.length > 0 && (
          <div className="mt-12">
            <div className="public-hub-section-title">Featured series</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {publicSeries.map((entry) => (
                <Link
                  key={entry.id}
                  to="/series/$seriesId"
                  search={{ view: "public" }}
                  params={{ seriesId: entry.id }}
                  className="public-hub-series-card"
                >
                  <div className="text-xs uppercase tracking-[0.2em] opacity-70">
                    Series
                  </div>
                  <div className="text-lg font-semibold">{entry.title}</div>
                  {entry.description && (
                    <div className="text-xs opacity-70 line-clamp-2">
                      {entry.description}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="public-hub-section-title">Latest reads</div>
          {filtered.length === 0 ? (
            <div className="mt-8 text-sm public-hub-empty">
              No public documents match your filters yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {filtered.map((doc) => (
                <Link
                  key={doc.id}
                  to="/public/$contentId"
                  params={{ contentId: getPublicDocSlug(doc) }}
                  className="public-hub-card"
                >
                  <div className="public-hub-card-meta">
                    <span>{formatRelativeDateShort(doc.updatedAt)}</span>
                    <span>•</span>
                    <span>{doc.publicStats?.views || 0} views</span>
                    {doc.seriesId && <span>• Series</span>}
                  </div>
                  <div className="public-hub-card-title">
                    {doc.title || "Untitled"}
                  </div>
                  <div className="public-hub-card-preview">
                    {getContentPreview(doc, 180, "No preview available.")}
                  </div>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="public-hub-card-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
