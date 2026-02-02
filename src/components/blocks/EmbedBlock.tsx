import * as React from "react";
import { ExternalLink } from "lucide-react";
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
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      )?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (provider === "figma") {
      // Figma embed URL
      if (url.includes("figma.com")) {
        return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
          url,
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
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <select
          value={block.provider}
          onChange={(e) =>
            onChange({ provider: e.target.value as EmbedProvider })
          }
          className="text-xs px-2 py-1 rounded border"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            color: "var(--color-linear-text-secondary)",
          }}
        >
          {PROVIDERS.map((provider) => (
            <option key={provider.value} value={provider.value}>
              {provider.label}
            </option>
          ))}
        </select>

        <select
          value={block.aspectRatio || "16:9"}
          onChange={(e) => onChange({ aspectRatio: e.target.value as any })}
          className="text-xs px-2 py-1 rounded border"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            color: "var(--color-linear-text-secondary)",
          }}
        >
          <option value="16:9">16:9</option>
          <option value="4:3">4:3</option>
          <option value="1:1">1:1</option>
        </select>
      </div>

      {/* URL Input */}
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
        className="w-full px-3 py-2 text-sm border rounded"
        style={{
          borderColor: "var(--color-linear-border-primary)",
          color: "var(--color-linear-text-primary)",
        }}
      />

      {/* Title */}
      <input
        type="text"
        value={block.title || ""}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Title (optional)"
        className="w-full text-sm font-medium border-none outline-none bg-transparent"
        style={{ color: "var(--color-linear-text-primary)" }}
      />

      {/* Embed Preview */}
      {hasValidUrl ? (
        block.provider === "link" ? (
          // Link preview (simplified)
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded border hover:border-gray-400 transition-colors"
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
            className="relative overflow-hidden rounded border"
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
          className="h-48 flex items-center justify-center border-2 border-dashed rounded"
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
