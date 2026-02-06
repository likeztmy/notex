import type { Content } from "~/types/content";

export function extractPlainText(docContent: any): string {
  if (!docContent) return "";
  try {
    const extractText = (node: any): string => {
      if (!node) return "";
      if (typeof node.text === "string") return node.text;
      if (Array.isArray(node.content)) {
        return node.content.map(extractText).join(" ");
      }
      return "";
    };
    return extractText(docContent).trim();
  } catch {
    return "";
  }
}

export function getContentPreview(
  content: Content,
  maxLength: number = 100,
  emptyText: string = "No content"
): string {
  const text = extractPlainText(content.docContent);
  if (!text) return emptyText;
  return text.slice(0, maxLength);
}

export function getWordCount(content: Content): number {
  const text = extractPlainText(content.docContent);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function getReadingTimeMinutes(
  content: Content,
  wordsPerMinute: number = 220
): number {
  const words = getWordCount(content);
  if (!words) return 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
