import * as React from "react";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import type {
  EmbedBlock as EmbedBlockType,
  EmbedProvider,
} from "~/types/block";

interface EmbedBlockProps {
  block: EmbedBlockType;
  onChange: (updates: Partial<EmbedBlockType>) => void;
}

const PROVIDERS: { value: EmbedProvider; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "figma", label: "Figma" },
  { value: "link", label: "Link Preview" },
  { value: "custom", label: "Custom iframe" },
];

export function EmbedBlock({ block, onChange }: EmbedBlockProps) {
  const getEmbedUrl = (url: string, provider: EmbedProvider): string => {
    if (provider === "youtube") {
      // Convert YouTube watch URL to embed URL
      const videoId = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
      )?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (provider === "figma") {
      // Figma embed URL
      if (url.includes("figma.com")) {
        return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
          url
        )}`;
      }
    }
    return url;
  };

  const getAspectRatioPadding = () => {
    switch (block.aspectRatio) {
      case "16:9":
        return "56.25%";
      case "4:3":
        return "75%";
      case "1:1":
        return "100%";
      default:
        return "56.25%";
    }
  };

  const embedUrl = getEmbedUrl(block.url, block.provider);
  const hasValidUrl = block.url.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={block.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Embed title"
            className="w-full text-sm font-semibold border-none outline-none bg-transparent"
            style={{ color: "var(--color-linear-text-primary)" }}
          />
          <div className="block-label">Embed</div>
        </div>
        <div
          className="flex gap-1 rounded-full p-1"
          style={{ background: "var(--color-linear-bg-tertiary)" }}
        >
          {PROVIDERS.map((provider) => (
            <button
              key={provider.value}
              onClick={() => onChange({ provider: provider.value })}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background:
                  block.provider === provider.value
                    ? "var(--color-linear-bg-elevated)"
                    : "transparent",
                color: "var(--color-linear-text-secondary)",
                boxShadow:
                  block.provider === provider.value
                    ? "var(--shadow-linear-sm)"
                    : "none",
              }}
            >
              {provider.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex gap-1 rounded-full p-1 w-fit"
        style={{ background: "var(--color-linear-bg-tertiary)" }}
      >
        {(["16:9", "4:3", "1:1"] as const).map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange({ aspectRatio: ratio })}
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background:
                (block.aspectRatio || "16:9") === ratio
                  ? "var(--color-linear-bg-elevated)"
                  : "transparent",
              color: "var(--color-linear-text-secondary)",
              boxShadow:
                (block.aspectRatio || "16:9") === ratio
                  ? "var(--shadow-linear-sm)"
                  : "none",
            }}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* URL Input */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border"
        style={{ borderColor: "var(--color-linear-border-primary)" }}
      >
        <LinkIcon
          className="w-4 h-4"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        />
        <input
          type="text"
          value={block.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder={
            block.provider === "youtube"
              ? "Paste YouTube URL..."
              : block.provider === "figma"
              ? "Paste Figma URL..."
              : "Paste URL..."
          }
          className="w-full text-sm border-none outline-none bg-transparent"
          style={{ color: "var(--color-linear-text-primary)" }}
        />
      </div>

      {/* Embed Preview */}
      {hasValidUrl ? (
        block.provider === "link" ? (
          // Link preview (simplified)
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border transition-colors"
            style={{ borderColor: "var(--color-linear-border-primary)" }}
          >
            <div className="flex items-start gap-3">
              <ExternalLink
                className="w-5 h-5 flex-shrink-0 mt-1"
                style={{ color: "var(--color-linear-text-tertiary)" }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium truncate"
                  style={{ color: "var(--color-linear-text-primary)" }}
                >
                  {block.title || "Link"}
                </p>
                <p
                  className="text-xs truncate mt-1"
                  style={{ color: "var(--color-linear-text-tertiary)" }}
                >
                  {block.url}
                </p>
              </div>
            </div>
          </a>
        ) : (
          // iframe embed
          <div
            className="relative overflow-hidden rounded-xl border"
            style={{
              paddingTop: getAspectRatioPadding(),
              borderColor: "var(--color-linear-border-primary)",
            }}
          >
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        )
      ) : (
        <div
          className="h-48 flex items-center justify-center border-2 border-dashed rounded-xl"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            Enter a URL to embed content
          </p>
        </div>
      )}

      {/* Help Text */}
      {block.provider === "youtube" && (
        <p
          className="text-xs"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Paste a YouTube URL like: https://www.youtube.com/watch?v=VIDEO_ID
        </p>
      )}
      {block.provider === "figma" && (
        <p
          className="text-xs"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Paste a Figma file URL. Make sure the file is publicly accessible.
        </p>
      )}
    </div>
  );
}
