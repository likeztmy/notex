import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import type { Content, PublicTheme } from "~/types/content";
import { DEFAULT_STYLE_CONFIG } from "~/types/content";
import { useContentStore } from "~/store/contentStore";
import { getContentPreview, getReadingTimeMinutes } from "~/utils/contentText";
import { getStyleVars, getContentWidthClass } from "~/utils/styleConfig";
import { Copy, Linkedin, Twitter } from "lucide-react";
import { applySeoTags, seo } from "~/utils/seo";
import {
  getPublicDocPath,
  getPublicDocUrl,
  resolvePublicDocFromParam,
} from "~/utils/publicLink";
import {
  getEditorExtensions,
  EDITOR_CONTENT_CLASS,
} from "~/components/editor/editorExtensions";

type HeadingEntry = {
  id: string;
  text: string;
  level: number;
};

function getNodeText(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(getNodeText).join("");
  }
  return "";
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildHeadingEntries(docContent: any): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  const counts = new Map<string, number>();

  const visit = (node: any) => {
    if (!node) return;
    if (node.type === "heading") {
      const text = getNodeText(node).trim();
      if (text) {
        const base = slugifyHeading(text) || "section";
        const count = (counts.get(base) || 0) + 1;
        counts.set(base, count);
        const id = count > 1 ? `${base}-${count}` : base;
        entries.push({
          id,
          text,
          level: node.attrs?.level || 2,
        });
      }
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(visit);
    }
  };

  visit(docContent);
  return entries;
}

export const Route = createFileRoute("/public/$contentId")({
  component: PublicDocPage,
});

function PublicDocPage() {
  const { contentId } = Route.useParams();
  const content = useContentStore((state) => state.content);
  const series = useContentStore((state) => state.series);
  const updatePublicStats = useContentStore((state) => state.updatePublicStats);
  const isLoaded = useContentStore((state) => state.isLoaded);
  const [Editor, setEditor] = React.useState<any>(null);
  const viewTrackedRef = React.useRef(false);

  const doc = React.useMemo(
    () => resolvePublicDocFromParam(content, contentId),
    [content, contentId]
  );
  const styleConfig = doc?.styleConfig || DEFAULT_STYLE_CONFIG;
  const theme: PublicTheme = doc?.publish?.theme || "minimal";
  const themeClass = `public-theme-${theme}`;

  const seriesMeta = React.useMemo(() => {
    if (!doc?.seriesId) return null;
    const entry = series.find((item) => item.id === doc.seriesId);
    if (!entry) return null;
    const items = content.filter((item) => entry.contentIds.includes(item.id));
    return { entry, items };
  }, [doc?.seriesId, series, content]);

  React.useEffect(() => {
    if (!doc || !doc.publish?.isPublic || viewTrackedRef.current) return;
    viewTrackedRef.current = true;
    updatePublicStats(doc.id, {
      views: (doc.publicStats?.views || 0) + 1,
      lastViewedAt: Date.now(),
    });
  }, [doc, updatePublicStats]);

  React.useEffect(() => {
    if (!doc) return;
    const description =
      doc.publish?.description ||
      getContentPreview(doc, 160, "A public note from notex.");
    const canonicalUrl = getPublicDocUrl(doc);
    const tags = seo({
      title: doc.title || "Untitled",
      description,
      image: doc.publish?.ogImage,
      url: canonicalUrl,
      canonicalUrl,
      author: "@notex",
    });
    applySeoTags(tags);
  }, [doc]);

  React.useEffect(() => {
    Promise.all([
      import("@tiptap/react"),
      import("@tiptap/starter-kit"),
      import("@tiptap/extension-typography"),
      import("@tiptap/extension-task-list"),
      import("@tiptap/extension-task-item"),
      import("@tiptap/extension-highlight"),
      import("@tiptap/extension-code-block-lowlight"),
      import("@tiptap/extension-placeholder"),
      import("tiptap-markdown"),
      import("lowlight"),
    ]).then(
      ([
        tiptapReact,
        { default: StarterKit },
        { default: Typography },
        { default: TaskList },
        { default: TaskItem },
        { default: Highlight },
        { default: CodeBlockLowlight },
        { default: Placeholder },
        { Markdown },
        { common, createLowlight },
      ]) => {
        const { useEditor, EditorContent } = tiptapReact as any;
        const lowlight = createLowlight(common);
        setEditor({
          useEditor,
          EditorContent,
          StarterKit,
          Typography,
          TaskList,
          TaskItem,
          Highlight,
          CodeBlockLowlight,
          Placeholder,
          Markdown,
          lowlight,
        });
      }
    );
  }, []);

  if (!isLoaded || !Editor) {
    return (
      <div
        className={`min-h-screen ${themeClass}`}
        style={{ background: "var(--color-linear-bg-primary)" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
          <div
            className="h-10 w-2/3 rounded"
            style={{ background: "var(--color-linear-bg-tertiary)" }}
          />
          <div
            className="mt-6 h-4 w-1/3 rounded"
            style={{ background: "var(--color-linear-bg-tertiary)" }}
          />
          <div className="mt-10 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 w-full rounded"
                style={{ background: "var(--color-linear-bg-tertiary)" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!doc || !doc.publish?.isPublic) {
    return (
      <div
        className={`min-h-screen ${themeClass}`}
        style={{ background: "var(--color-linear-bg-primary)" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            This page is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PublicDocRenderer
      Editor={Editor}
      doc={doc}
      themeClass={themeClass}
      styleConfig={styleConfig}
      seriesMeta={seriesMeta}
    />
  );
}

function PublicDocRenderer({
  Editor: {
    useEditor,
    EditorContent,
    StarterKit,
    Typography,
    Link,
    TaskList,
    TaskItem,
    Highlight,
    CodeBlockLowlight,
    Placeholder,
    Markdown,
    lowlight,
  },
  doc,
  themeClass,
  styleConfig,
  seriesMeta,
}: {
  Editor: any;
  doc: Content;
  themeClass: string;
  styleConfig: Content["styleConfig"];
  seriesMeta: { entry: { title: string }; items: Content[] } | null;
}) {
  const editor = useEditor({
    extensions: getEditorExtensions({
      StarterKit,
      CodeBlockLowlight,
      Typography,
      Link,
      TaskList,
      TaskItem,
      Highlight,
      Markdown,
      Placeholder,
      lowlight,
      enableDragHandle: false,
    }),
    content: doc.docContent,
    editable: false,
    editorProps: {
      attributes: { class: "focus:outline-none" },
    },
  });
  const [progress, setProgress] = React.useState(0);
  const headings = React.useMemo(
    () => buildHeadingEntries(doc.docContent),
    [doc.docContent]
  );
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);
  const readingTime = React.useMemo(() => getReadingTimeMinutes(doc), [doc]);

  const styleVars = getStyleVars(styleConfig || DEFAULT_STYLE_CONFIG);
  const contentWidthClass = getContentWidthClass(
    styleConfig?.contentWidth || "medium"
  );
  const publicUrl = getPublicDocUrl(doc);
  const encodedUrl = encodeURIComponent(publicUrl);
  const encodedTitle = encodeURIComponent(doc.title || "Untitled");
  const shareToTwitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const shareToLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      // ignore clipboard errors
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const max = scrollHeight - clientHeight;
      const next = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0;
      setProgress(next);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (!headings.length) return;
    const nodes = Array.from(
      document.querySelectorAll(
        ".public-reader .ProseMirror h1, .public-reader .ProseMirror h2, .public-reader .ProseMirror h3"
      )
    ) as HTMLElement[];
    headings.forEach((heading, index) => {
      const node = nodes[index];
      if (node) node.id = heading.id;
    });
  }, [headings]);

  React.useEffect(() => {
    if (!headings.length) {
      setActiveHeading(null);
      return;
    }
    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    setActiveHeading(headings[0]?.id || null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) =>
            a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1
          );
        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).id;
          setActiveHeading(id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <div
      className={`min-h-screen ${themeClass} public-reader`}
      style={{ background: "var(--color-linear-bg-primary)" }}
    >
      <div className="public-reader-progress">
        <div style={{ width: `${progress}%` }} />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div
            className="text-xs uppercase tracking-[0.2em] mb-3 flex items-center justify-between"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            <span>Published</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                style={{
                  borderColor: "var(--color-linear-border-primary)",
                  color: "var(--color-linear-text-secondary)",
                }}
              >
                <Copy className="h-3 w-3 inline-block mr-2" />
                Copy link
              </button>
              <a
                href={shareToTwitter}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                style={{
                  borderColor: "var(--color-linear-border-primary)",
                  color: "var(--color-linear-text-secondary)",
                }}
              >
                <Twitter className="h-3 w-3 inline-block mr-2" />
                Share
              </a>
              <a
                href={shareToLinkedIn}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                style={{
                  borderColor: "var(--color-linear-border-primary)",
                  color: "var(--color-linear-text-secondary)",
                }}
              >
                <Linkedin className="h-3 w-3 inline-block mr-2" />
                LinkedIn
              </a>
            </div>
          </div>
          <h1
            className="text-4xl md:text-5xl font-semibold mb-4"
            style={{ color: "var(--color-linear-text-primary)" }}
          >
            {doc.title || "Untitled"}
          </h1>
          <div
            className="flex flex-wrap items-center gap-3 text-xs"
            style={{ color: "var(--color-linear-text-secondary)" }}
          >
            <span>
              Updated{" "}
              {new Date(doc.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{doc.publicStats?.views || 0} views</span>
            {readingTime > 0 && (
              <>
                <span>•</span>
                <span>{readingTime} min read</span>
              </>
            )}
            {doc.publicStats?.reads7d !== undefined && (
              <>
                <span>•</span>
                <span>{doc.publicStats.reads7d} reads (7d)</span>
              </>
            )}
          </div>
          {doc.publish?.description && (
            <p
              className="mt-5 text-base max-w-2xl"
              style={{ color: "var(--color-linear-text-secondary)" }}
            >
              {doc.publish.description}
            </p>
          )}
          {doc.tags && doc.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "var(--color-linear-bg-tertiary)",
                    color: "var(--color-linear-text-secondary)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="public-reader-shell" style={styleVars}>
          <div className={`${contentWidthClass} mx-auto public-reader-article`}>
            {editor ? (
              <EditorContent editor={editor} className={EDITOR_CONTENT_CLASS} />
            ) : (
              <div
                className="text-sm"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              >
                Loading content...
              </div>
            )}
          </div>
          {headings.length > 0 && (
            <aside className="public-reader-toc">
              <div className="public-reader-toc-title">On this page</div>
              <div className="public-reader-toc-list">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className={`public-reader-toc-item level-${heading.level} ${
                      activeHeading === heading.id ? "is-active" : ""
                    }`}
                    onClick={() => {
                      const el = document.getElementById(heading.id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                  >
                    {heading.text}
                  </button>
                ))}
              </div>
            </aside>
          )}
        </div>

        <div
          className="mt-16 rounded-2xl border px-6 py-5 flex flex-wrap items-center justify-between gap-4"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            background: "var(--color-linear-bg-secondary)",
          }}
        >
          <div>
            <div className="text-xs uppercase tracking-[0.2em] mb-2">
              More from this library
            </div>
            <div className="text-lg font-medium">
              Discover more public notes on Notex.
            </div>
          </div>
          <a
            href="/public"
            className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]"
            style={{
              borderColor: "var(--color-linear-border-primary)",
              color: "var(--color-linear-text-secondary)",
            }}
          >
            Explore the hub
          </a>
        </div>

        {seriesMeta && seriesMeta.items.length > 0 && (
          <div
            className="mt-16 border-t pt-10"
            style={{ borderColor: "var(--color-linear-border-primary)" }}
          >
            <div className="text-xs uppercase tracking-[0.2em] mb-4">
              Series
            </div>
            <div className="text-lg font-medium mb-4">
              {seriesMeta.entry.title}
            </div>
            <div className="grid gap-3">
              {seriesMeta.items.map((item) => (
                <a
                  key={item.id}
                  href={getPublicDocPath(item)}
                  className="block rounded-lg border px-4 py-3 transition-colors"
                  style={{
                    borderColor: "var(--color-linear-border-primary)",
                    background: "var(--color-linear-bg-elevated)",
                    color: "var(--color-linear-text-primary)",
                  }}
                >
                  <div className="text-sm font-medium">
                    {item.title || "Untitled"}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--color-linear-text-tertiary)" }}
                  >
                    {getContentPreview(item, 120, "No preview")}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
