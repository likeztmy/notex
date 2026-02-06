export const seo = ({
  title,
  description,
  keywords,
  image,
  url,
  author,
  canonicalUrl,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
  author?: string;
  canonicalUrl?: string;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: author },
    { name: "twitter:site", content: author },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    ...(canonicalUrl ? [{ rel: "canonical", href: canonicalUrl }] : []),
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};

export function applySeoTags(
  tags: {
    title?: string;
    name?: string;
    property?: string;
    content?: string;
    rel?: string;
    href?: string;
  }[]
) {
  if (typeof document === "undefined") return;
  const head = document.head;
  tags.forEach((tag) => {
    if (tag.title) {
      document.title = tag.title;
      return;
    }
    if (tag.rel && tag.href) {
      const selector = `link[rel="${tag.rel}"]`;
      let link = document.querySelector<HTMLLinkElement>(selector);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", tag.rel);
        head.appendChild(link);
      }
      link.setAttribute("href", tag.href);
      return;
    }
    const metaKey = tag.name ? "name" : "property";
    const metaValue = tag.name || tag.property;
    if (!metaValue) return;
    const selector = `meta[${metaKey}="${metaValue}"]`;
    let meta = document.querySelector<HTMLMetaElement>(selector);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(metaKey, metaValue);
      head.appendChild(meta);
    }
    if (typeof tag.content === "string") {
      meta.setAttribute("content", tag.content);
    }
  });
}
