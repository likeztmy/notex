import type { Content } from "~/types/content";
import { getPublicDocPath } from "~/utils/publicLink";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildSitemapXml(content: Content[], baseUrl: string): string {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const urls = [
    {
      loc: `${normalizedBase}/public`,
      lastmod: new Date().toISOString(),
    },
    ...content.map((doc) => ({
      loc: `${normalizedBase}${getPublicDocPath(doc)}`,
      lastmod: new Date(doc.updatedAt).toISOString(),
    })),
  ];
  const urlEntries = urls
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${
          entry.lastmod
        }</lastmod>\n  </url>`
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries || "  <!-- No public documents available -->",
    "</urlset>",
  ].join("\n");
}
