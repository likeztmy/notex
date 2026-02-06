import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useContentStore } from "~/store/contentStore";
import { getPublicContentFromList } from "~/utils/contentQuery";

export const Route = createFileRoute("/profile")({
  component: ProfileEditorPage,
});

function ProfileEditorPage() {
  const profile = useContentStore((state) => state.profile);
  const updateProfile = useContentStore((state) => state.updateProfile);
  const content = useContentStore((state) => state.content);
  const series = useContentStore((state) => state.series);
  const publicContent = React.useMemo(
    () => getPublicContentFromList(content),
    [content]
  );

  const [displayName, setDisplayName] = React.useState(profile.displayName);
  const [headline, setHeadline] = React.useState(profile.headline || "");
  const [bio, setBio] = React.useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile.avatarUrl || "");
  const [website, setWebsite] = React.useState(profile.website || "");
  const [featuredContentIds, setFeaturedContentIds] = React.useState<string[]>(
    profile.featuredContentIds || []
  );
  const [featuredSeriesIds, setFeaturedSeriesIds] = React.useState<string[]>(
    profile.featuredSeriesIds || []
  );

  React.useEffect(() => {
    setDisplayName(profile.displayName);
    setHeadline(profile.headline || "");
    setBio(profile.bio || "");
    setAvatarUrl(profile.avatarUrl || "");
    setWebsite(profile.website || "");
    setFeaturedContentIds(profile.featuredContentIds || []);
    setFeaturedSeriesIds(profile.featuredSeriesIds || []);
  }, [profile]);

  const toggleFeaturedContent = (id: string) => {
    setFeaturedContentIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleFeaturedSeries = (id: string) => {
    setFeaturedSeriesIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSave = () => {
    updateProfile({
      displayName: displayName.trim() || "Notex Author",
      headline: headline.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      website: website.trim(),
      featuredContentIds,
      featuredSeriesIds,
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-linear-bg-secondary)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Public Profile
          </div>
          <h1 className="text-3xl font-semibold mt-3">
            Shape your public presence
          </h1>
          <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
            This profile appears at /public/profile. Highlight your story and
            pin your best work.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Display name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Headline
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div className="space-y-4 md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Avatar URL
            </label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Website
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Featured documents
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {publicContent.map((doc) => (
              <button
                key={doc.id}
                onClick={() => toggleFeaturedContent(doc.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  featuredContentIds.includes(doc.id)
                    ? "border-neutral-900 bg-white"
                    : "border-neutral-200 bg-transparent"
                }`}
              >
                <div className="text-sm font-medium">
                  {doc.title || "Untitled"}
                </div>
                <div className="text-xs text-neutral-500">
                  {doc.publish?.description || "Public document"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Featured series
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {series.map((entry) => (
              <button
                key={entry.id}
                onClick={() => toggleFeaturedSeries(entry.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  featuredSeriesIds.includes(entry.id)
                    ? "border-neutral-900 bg-white"
                    : "border-neutral-200 bg-transparent"
                }`}
              >
                <div className="text-sm font-medium">{entry.title}</div>
                <div className="text-xs text-neutral-500">
                  {entry.description || "Series collection"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save profile</Button>
        </div>
      </div>
    </div>
  );
}
