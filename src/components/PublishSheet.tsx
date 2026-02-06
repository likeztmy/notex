import * as React from "react";
import { Copy, Download, ExternalLink } from "lucide-react";
import type { Content, PublishSettings, PublicTheme } from "~/types/content";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { useContentStore } from "~/store/contentStore";
import { getPublicContentFromList } from "~/utils/contentQuery";
import { formatRelativeTimeLong } from "~/utils/dateFormat";
import { buildSitemapXml } from "~/utils/sitemap";

const THEME_OPTIONS: { id: PublicTheme; label: string; description: string }[] =
  [
    { id: "minimal", label: "Minimal", description: "Clean and airy" },
    { id: "editorial", label: "Editorial", description: "Warm and literary" },
    { id: "noir", label: "Noir", description: "High contrast, dark mode" },
  ];

interface PublishSheetProps {
  document: Content;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateDoc: (id: string, updates: Partial<Content>) => void;
}

const DEFAULT_PUBLISH: PublishSettings = {
  isPublic: false,
  theme: "minimal",
};

export function PublishSheet({
  document,
  open,
  onOpenChange,
  onUpdateDoc,
}: PublishSheetProps) {
  const [publish, setPublish] = React.useState<PublishSettings>(
    document.publish || DEFAULT_PUBLISH
  );
  const [slug, setSlug] = React.useState(publish.slug || "");
  const [description, setDescription] = React.useState(
    publish.description || ""
  );
  const [ogImage, setOgImage] = React.useState(publish.ogImage || "");
  const allContent = useContentStore((state) => state.content);
  const publicContent = React.useMemo(
    () => getPublicContentFromList(allContent),
    [allContent]
  );
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const sitemapXml = React.useMemo(
    () => (baseUrl ? buildSitemapXml(publicContent, baseUrl) : ""),
    [baseUrl, publicContent]
  );
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  React.useEffect(() => {
    setPublish(document.publish || DEFAULT_PUBLISH);
    setSlug(document.publish?.slug || "");
    setDescription(document.publish?.description || "");
    setOgImage(document.publish?.ogImage || "");
  }, [document.id, document.publish]);

  const schedulePublishUpdate = React.useCallback(
    (next: PublishSettings, statsUpdates?: Partial<Content["publicStats"]>) => {
      setPublish(next);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        const updates: Partial<Content> = { publish: next };
        if (statsUpdates) {
          updates.publicStats = {
            ...document.publicStats,
            ...statsUpdates,
          };
        }
        onUpdateDoc(document.id, updates);
      }, 300);
    },
    [document.id, document.publicStats, onUpdateDoc]
  );

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const publishSlug = publish.slug?.trim();
  const publicPath = publishSlug
    ? `/public/${encodeURIComponent(publishSlug)}`
    : `/public/${document.id}`;
  const publicUrl = baseUrl ? `${baseUrl}${publicPath}` : publicPath;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleTogglePublic = () => {
    const nextPublic = !publish.isPublic;
    const now = Date.now();
    const statsUpdates = nextPublic
      ? {
          firstPublishedAt: document.publicStats?.firstPublishedAt ?? now,
          lastPublishedAt: now,
        }
      : undefined;
    schedulePublishUpdate(
      {
        ...publish,
        isPublic: nextPublic,
      },
      statsUpdates
    );
  };

  const handleCopySitemap = async () => {
    if (!sitemapXml) return;
    try {
      await navigator.clipboard.writeText(sitemapXml);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownloadSitemap = () => {
    if (!sitemapXml) return;
    const blob = new Blob([sitemapXml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(url);
  };

  const lastViewedLabel = document.publicStats?.lastViewedAt
    ? formatRelativeTimeLong(document.publicStats.lastViewedAt)
    : "Not yet";
  const firstPublishedLabel = document.publicStats?.firstPublishedAt
    ? formatRelativeTimeLong(document.publicStats.firstPublishedAt)
    : "Not published";
  const lastPublishedLabel = document.publicStats?.lastPublishedAt
    ? formatRelativeTimeLong(document.publicStats.lastPublishedAt)
    : "Not published";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="p-0"
        style={{ background: "var(--color-linear-bg-primary)" }}
      >
        <SheetHeader
          className="border-b"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
        >
          <SheetTitle>Publish</SheetTitle>
        </SheetHeader>
        <div className="px-5 py-4 space-y-6 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="font-medium"
                style={{ color: "var(--color-linear-text-primary)" }}
              >
                Public access
              </div>
              <div style={{ color: "var(--color-linear-text-tertiary)" }}>
                Share a read-only page with anyone.
              </div>
            </div>
            <button
              onClick={handleTogglePublic}
              className="px-3 py-1.5 rounded-full border text-xs"
              style={{
                borderColor: publish.isPublic
                  ? "var(--color-linear-accent-primary)"
                  : "var(--color-linear-border-primary)",
                color: publish.isPublic
                  ? "var(--color-linear-accent-primary)"
                  : "var(--color-linear-text-secondary)",
                background: publish.isPublic
                  ? "var(--color-linear-bg-tertiary)"
                  : "transparent",
              }}
            >
              {publish.isPublic ? "Public" : "Private"}
            </button>
          </div>

          {publish.isPublic && (
            <div
              className="rounded-xl border p-4 space-y-3"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                background: "var(--color-linear-bg-secondary)",
              }}
            >
              <div
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                Share link
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={publicUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg border bg-transparent text-xs"
                  style={{
                    borderColor: "var(--color-linear-border-primary)",
                    color: "var(--color-linear-text-secondary)",
                  }}
                />
                <Button size="icon-sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon-sm" variant="outline" asChild>
                  <a href={publicUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                Views: {document.publicStats?.views || 0}
              </div>
            </div>
          )}

          <div>
            <div
              className="text-xs font-semibold tracking-wider mb-3"
              style={{ color: "var(--color-linear-text-tertiary)" }}
            >
              PUBLIC THEME
            </div>
            <div className="grid gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    schedulePublishUpdate({ ...publish, theme: option.id })
                  }
                  className="text-left rounded-xl border px-3 py-3 transition-colors"
                  style={{
                    borderColor:
                      publish.theme === option.id
                        ? "var(--color-linear-accent-primary)"
                        : "var(--color-linear-border-primary)",
                    background:
                      publish.theme === option.id
                        ? "var(--color-linear-bg-tertiary)"
                        : "var(--color-linear-bg-elevated)",
                  }}
                >
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--color-linear-text-primary)" }}
                  >
                    {option.label}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em]">
              Slug (optional)
            </label>
            <input
              value={slug}
              onChange={(e) => {
                const value = e.target.value;
                setSlug(value);
                schedulePublishUpdate({ ...publish, slug: value });
              }}
              placeholder="example-post"
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                color: "var(--color-linear-text-primary)",
              }}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
                schedulePublishUpdate({ ...publish, description: value });
              }}
              rows={3}
              placeholder="Short summary for readers and SEO."
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm resize-none"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                color: "var(--color-linear-text-primary)",
              }}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em]">
              OG image URL
            </label>
            <input
              value={ogImage}
              onChange={(e) => {
                const value = e.target.value;
                setOgImage(value);
                schedulePublishUpdate({ ...publish, ogImage: value });
              }}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                color: "var(--color-linear-text-primary)",
              }}
            />
          </div>

          {publish.isPublic && (
            <div
              className="rounded-xl border p-4 space-y-4"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                background: "var(--color-linear-bg-secondary)",
              }}
            >
              <div className="text-xs uppercase tracking-[0.2em]">
                Analytics snapshot
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    Total views
                  </div>
                  <div className="text-lg font-medium">
                    {document.publicStats?.views || 0}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    Reads (7d)
                  </div>
                  <div className="text-lg font-medium">
                    {document.publicStats?.reads7d || 0}
                  </div>
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    First published
                  </div>
                  <div>{firstPublishedLabel}</div>
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    Last published
                  </div>
                  <div>{lastPublishedLabel}</div>
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    Last viewed
                  </div>
                  <div>{lastViewedLabel}</div>
                </div>
              </div>
            </div>
          )}

          {publish.isPublic && (
            <div
              className="rounded-xl border p-4 space-y-3"
              style={{
                borderColor: "var(--color-linear-border-primary)",
                background: "var(--color-linear-bg-secondary)",
              }}
            >
              <div className="text-xs uppercase tracking-[0.2em]">
                Sitemap export
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                Generate a local sitemap.xml for all public documents.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={handleCopySitemap}>
                  <Copy className="h-4 w-4" />
                  Copy XML
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadSitemap}
                >
                  <Download className="h-4 w-4" />
                  Download sitemap.xml
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
