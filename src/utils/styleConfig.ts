import type { StyleConfig } from "~/types/content";

// Map style config to CSS variables
export function getStyleVars(config: StyleConfig): React.CSSProperties {
  const vars: Record<string, string> = {};

  // Font Family
  const fontFamilyMap = {
    sans: "var(--editor-font-sans)",
    serif: "var(--editor-font-serif)",
    mono: "var(--editor-font-mono)",
  };
  vars["--editor-font-family"] = fontFamilyMap[config.fontFamily];

  // Font Size
  const fontSizeMap = {
    small: "var(--editor-font-size-small)",
    medium: "var(--editor-font-size-medium)",
    large: "var(--editor-font-size-large)",
  };
  vars["--editor-font-size"] = fontSizeMap[config.fontSize];

  // Line Height
  const lineHeightMap = {
    compact: "var(--editor-line-height-compact)",
    normal: "var(--editor-line-height-normal)",
    relaxed: "var(--editor-line-height-relaxed)",
  };
  vars["--editor-line-height"] = lineHeightMap[config.lineHeight];

  // Text Align
  const textAlignMap = {
    left: "left",
    justify: "justify",
  };
  vars["--editor-text-align"] = textAlignMap[config.textAlign];

  return vars as React.CSSProperties;
}

// Map content width to Tailwind class
export function getContentWidthClass(
  width: StyleConfig["contentWidth"],
): string {
  const widthMap = {
    narrow: "max-w-2xl", // 672px
    medium: "max-w-3xl", // 768px
    wide: "max-w-4xl", // 896px
    full: "max-w-full", // 100%
  };
  return widthMap[width];
}
