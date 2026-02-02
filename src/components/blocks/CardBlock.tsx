import * as React from "react";
import type { CardBlock as CardBlockType, CardStyle } from "~/types/block";

interface CardBlockProps {
  block: CardBlockType;
  onChange: (updates: Partial<CardBlockType>) => void;
}

const CARD_STYLES: { value: CardStyle; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "gradient", label: "Gradient" },
  { value: "minimal", label: "Minimal" },
  { value: "bordered", label: "Bordered" },
];

const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

export function CardBlock({ block, onChange }: CardBlockProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const getCardStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: "24px",
      borderRadius: "12px",
      minHeight: "120px",
    };

    switch (block.cardStyle) {
      case "gradient":
        return {
          ...baseStyle,
          background: block.bgColor || GRADIENT_PRESETS[0],
          color: "white",
          border: "none",
        };
      case "minimal":
        return {
          ...baseStyle,
          background: "var(--color-linear-bg-secondary)",
          border: "none",
        };
      case "bordered":
        return {
          ...baseStyle,
          background: "white",
          border: "2px solid var(--color-linear-border-primary)",
        };
      default:
        return {
          ...baseStyle,
          background: block.bgColor || "var(--color-linear-bg-secondary)",
          border: "1px solid var(--color-linear-border-primary)",
        };
    }
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Title Input */}
        <input
          type="text"
          value={block.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Card title (optional)"
          className="flex-1 text-sm font-medium border-none outline-none bg-transparent"
          style={{ color: "var(--color-linear-text-primary)" }}
        />

        {/* Style Selector */}
        <select
          value={block.cardStyle || "default"}
          onChange={(e) => onChange({ cardStyle: e.target.value as CardStyle })}
          className="text-xs px-2 py-1 rounded border"
          style={{
            borderColor: "var(--color-linear-border-primary)",
            color: "var(--color-linear-text-secondary)",
          }}
        >
          {CARD_STYLES.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gradient Presets (only for gradient style) */}
      {block.cardStyle === "gradient" && (
        <div className="flex gap-2 flex-wrap">
          {GRADIENT_PRESETS.map((gradient, index) => (
            <button
              key={index}
              onClick={() => onChange({ bgColor: gradient })}
              className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
              style={{
                background: gradient,
                borderColor:
                  block.bgColor === gradient ? "black" : "transparent",
              }}
              title="Select gradient"
            />
          ))}
        </div>
      )}

      {/* Card Content */}
      <div
        style={getCardStyle()}
        onClick={() => !isEditing && setIsEditing(true)}
        className="cursor-text transition-all"
      >
        {/* Emoji */}
        {block.emoji && <div className="text-4xl mb-3">{block.emoji}</div>}

        {/* Title */}
        {block.title && (
          <h4
            className="text-lg font-semibold mb-2"
            style={block.cardStyle === "gradient" ? { color: "white" } : {}}
          >
            {block.title}
          </h4>
        )}

        {/* Content */}
        {isEditing ? (
          <textarea
            value={block.content}
            onChange={(e) => onChange({ content: e.target.value })}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="w-full min-h-[80px] bg-transparent border-none outline-none resize-none"
            style={
              block.cardStyle === "gradient"
                ? { color: "white" }
                : { color: "var(--color-linear-text-primary)" }
            }
            placeholder="Write your note or inspiration..."
          />
        ) : (
          <p
            className="whitespace-pre-wrap"
            style={
              block.cardStyle === "gradient"
                ? { color: "rgba(255,255,255,0.9)" }
                : { color: "var(--color-linear-text-secondary)" }
            }
          >
            {block.content || "Click to add content..."}
          </p>
        )}
      </div>

      {/* Emoji Picker */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={block.emoji || ""}
          onChange={(e) => onChange({ emoji: e.target.value.slice(0, 2) })}
          placeholder="Add emoji (e.g., 💡)"
          className="w-32 text-xs px-2 py-1 border rounded"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
          maxLength={2}
        />
        <span
          className="text-xs"
          style={{ color: "var(--color-linear-text-tertiary)" }}
        >
          Quick: 💡 📝 ⭐ 🎯 ✨ 🚀
        </span>
      </div>
    </div>
  );
}
