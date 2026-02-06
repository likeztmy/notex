import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { applySeoTags, seo } from "~/utils/seo";
import { useContentStore } from "~/store/contentStore";
import { getPublicDocSlug } from "~/utils/publicLink";

export const Route = createFileRoute("/public/profile")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const profile = useContentStore((state) => state.profile);
  const content = useContentStore((state) => state.content);
  const series = useContentStore((state) => state.series);

  const featuredDocs = React.useMemo(() => {
    const ids = new Set(profile.featuredContentIds || []);
    return content.filter((doc) => doc.publish?.isPublic && ids.has(doc.id));
  }, [content, profile.featuredContentIds]);

  const featuredSeries = React.useMemo(() => {
    const ids = new Set(profile.featuredSeriesIds || []);
    return series.filter((entry) => ids.has(entry.id));
  }, [profile.featuredSeriesIds, series]);

  React.useEffect(() => {
    const tags = seo({
      title: `${profile.displayName} — Notex`,
      description:
        profile.headline || profile.bio || "Public profile on Notex.",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });
    applySeoTags(tags);
  }, [profile]);

  return (
    <div
      className="min-h-screen public-theme-minimal public-profile"
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="public-profile-hero">
          <div className="public-profile-avatar">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} />
            ) : (
              <span>{profile.displayName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Public profile
            </div>
            <h1 className="public-profile-title">{profile.displayName}</h1>
            {profile.headline && (
              <div className="public-profile-headline">{profile.headline}</div>
            )}
            {profile.bio && <p className="public-profile-bio">{profile.bio}</p>}
            {profile.website && (
              <a
                className="public-profile-link"
                href={profile.website}
                target="_blank"
                rel="noreferrer"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>

        {featuredDocs.length > 0 && (
          <div className="mt-14">
            <div className="public-profile-section-title">
              Featured documents
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {featuredDocs.map((doc) => (
                <Link
                  key={doc.id}
                  to="/public/$contentId"
                  params={{ contentId: getPublicDocSlug(doc) }}
                  className="public-profile-card"
                >
                  <div className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                    Document
                  </div>
                  <div className="public-profile-card-title">
                    {doc.title || "Untitled"}
                  </div>
                  <div className="public-profile-card-body">
                    {doc.publish?.description || "Read the public note"}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {featuredSeries.length > 0 && (
          <div className="mt-14">
            <div className="public-profile-section-title">Featured series</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {featuredSeries.map((entry) => (
                <Link
                  key={entry.id}
                  to="/series/$seriesId"
                  search={{ view: "public" }}
                  params={{ seriesId: entry.id }}
                  className="public-profile-series"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Series
                  </div>
                  <div className="text-lg font-semibold">{entry.title}</div>
                  <div className="text-xs text-neutral-500">
                    {entry.description || "Series collection"}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="public-profile-cta">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Explore more
            </div>
            <div className="text-lg font-medium">
              Browse the public library for more notes.
            </div>
          </div>
          <Link to="/public" className="public-profile-button">
            Explore the library
          </Link>
        </div>
      </div>
    </div>
  );
}
