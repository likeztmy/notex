import * as React from "react";
import { X } from "lucide-react";
import type {
  StyleConfig,
  FontFamily,
  FontSize,
  ContentWidth,
  LineHeight,
  TextAlign,
  PublicTheme,
} from "~/types/content";

interface StylePanelProps {
  styleConfig: StyleConfig;
  publicTheme?: PublicTheme;
  onPublicThemeChange?: (theme: PublicTheme) => void;
  onStyleChange: (config: Partial<StyleConfig>) => void;
  onClose: () => void;
}

export function StylePanel({
  styleConfig,
  publicTheme,
  onPublicThemeChange,
  onStyleChange,
  onClose,
}: StylePanelProps) {
  return (
    <>
      {/* Sidebar Panel */}
      <div
        className="fixed top-0 right-0 z-50 shadow-2xl w-80 h-full overflow-y-auto"
        style={{
          animation: "slideInRight 0.3s ease-out",
          borderLeft: "1px solid var(--color-linear-border-primary)",
          background: "var(--color-linear-bg-secondary)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
          style={{
            background: "var(--color-linear-bg-secondary)",
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--color-linear-text-primary)" }}
          >
            Format
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{
              color: "var(--color-linear-text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--color-linear-bg-active)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-6">
          {/* FONT */}
          <StyleGroup label="FONT">
            <div className="flex gap-2">
              <FontButton
                active={styleConfig.fontFamily === "sans"}
                onClick={() => onStyleChange({ fontFamily: "sans" })}
                label="Aa"
                sublabel="System"
              />
              <FontButton
                active={styleConfig.fontFamily === "serif"}
                onClick={() => onStyleChange({ fontFamily: "serif" })}
                label="Ss"
                sublabel="Serif"
              />
              <FontButton
                active={styleConfig.fontFamily === "mono"}
                onClick={() => onStyleChange({ fontFamily: "mono" })}
                label="ØØ"
                sublabel="Mono"
              />
            </div>
          </StyleGroup>

          {/* CONTENT */}
          <StyleGroup label="CONTENT">
            <SegmentedControl
              value={styleConfig.fontSize}
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Body" },
                { value: "large", label: "Large" },
              ]}
              onChange={(value) =>
                onStyleChange({ fontSize: value as FontSize })
              }
            />
          </StyleGroup>

          {/* LAYOUT */}
          <StyleGroup label="LAYOUT">
            <div className="space-y-3">
              <div>
                <label
                  className="text-xs mb-2 block font-medium"
                  style={{ color: "var(--color-linear-text-secondary)" }}
                >
                  Width
                </label>
                <SegmentedControl
                  value={styleConfig.contentWidth}
                  options={[
                    { value: "narrow", label: "Narrow" },
                    { value: "medium", label: "Medium" },
                    { value: "wide", label: "Wide" },
                    { value: "full", label: "Full" },
                  ]}
                  onChange={(value) =>
                    onStyleChange({ contentWidth: value as ContentWidth })
                  }
                />
              </div>
            </div>
          </StyleGroup>

          {/* SPACING */}
          <StyleGroup label="SPACING">
            <div className="space-y-3">
              <div>
                <label
                  className="text-xs mb-2 block font-medium"
                  style={{ color: "var(--color-linear-text-secondary)" }}
                >
                  Line Height
                </label>
                <SegmentedControl
                  value={styleConfig.lineHeight}
                  options={[
                    { value: "compact", label: "Compact" },
                    { value: "normal", label: "Normal" },
                    { value: "relaxed", label: "Relaxed" },
                  ]}
                  onChange={(value) =>
                    onStyleChange({ lineHeight: value as LineHeight })
                  }
                />
              </div>
            </div>
          </StyleGroup>

          {/* ALIGNMENT */}
          <StyleGroup label="ALIGNMENT">
            <SegmentedControl
              value={styleConfig.textAlign}
              options={[
                { value: "left", label: "Left" },
                { value: "justify", label: "Justify" },
              ]}
              onChange={(value) =>
                onStyleChange({ textAlign: value as TextAlign })
              }
            />
          </StyleGroup>

          {onPublicThemeChange && (
            <StyleGroup label="PUBLIC THEME">
              <SegmentedControl
                value={publicTheme || "minimal"}
                options={[
                  { value: "minimal", label: "Minimal" },
                  { value: "editorial", label: "Editorial" },
                  { value: "noir", label: "Noir" },
                ]}
                onChange={(value) => onPublicThemeChange(value as PublicTheme)}
              />
            </StyleGroup>
          )}
        </div>
      </div>
    </>
  );
}

function StyleGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <label
        className="text-xs font-semibold tracking-wider"
        style={{ color: "var(--color-linear-text-secondary)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function FontButton({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all"
      style={{
        background: "var(--color-linear-bg-tertiary)",
        border: active
          ? "2px solid var(--color-linear-accent-primary)"
          : "2px solid transparent",
      }}
    >
      <div
        className="text-2xl font-semibold mb-1"
        style={{
          color: "var(--color-linear-text-primary)",
          fontFamily:
            sublabel === "Serif"
              ? "Georgia, serif"
              : sublabel === "Mono"
              ? "ui-monospace, monospace"
              : "system-ui, -apple-system",
        }}
      >
        {label}
      </div>
      <div
        className="text-xs font-medium"
        style={{
          color: "var(--color-linear-text-secondary)",
        }}
      >
        {sublabel}
      </div>
    </button>
  );
}

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="flex rounded-xl p-1"
      style={{ background: "var(--color-linear-bg-tertiary)" }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg transition-all font-medium"
          style={{
            background:
              value === option.value
                ? "var(--color-linear-bg-elevated)"
                : "transparent",
            color: "var(--color-linear-text-primary)",
            boxShadow:
              value === option.value ? "var(--shadow-linear-sm)" : "none",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
