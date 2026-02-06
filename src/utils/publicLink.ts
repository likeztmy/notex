import type { Content } from "~/types/content";

export function getPublicDocSlug(document: Content): string {
  const slug = document.publish?.slug?.trim();
  return slug ? encodeURIComponent(slug) : document.id;
}

export function getPublicDocPath(document: Content): string {
  return `/public/${getPublicDocSlug(document)}`;
}

export function getPublicDocUrl(document: Content): string {
  if (typeof window === "undefined") return getPublicDocPath(document);
  return `${window.location.origin}${getPublicDocPath(document)}`;
}

export function resolvePublicDocFromParam(
  content: Content[],
  param: string
): Content | undefined {
  const decoded = decodeURIComponent(param);
  const directMatch = content.find((item) => item.id === decoded);
  if (directMatch) return directMatch;
  return content.find((item) => item.publish?.slug === decoded);
}
