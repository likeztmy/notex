import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type {
  EmbedBlock as EmbedBlockType,
  EmbedProvider,
} from "~/types/block";

// Lazy load the component
const EmbedBlockComponent = React.lazy(() =>
  import("~/components/blocks/EmbedBlock").then((m) => ({
    default: m.EmbedBlock,
  }))
);

// NodeView component
function EmbedBlockView({ node, updateAttributes }: NodeViewProps) {
  const block: EmbedBlockType = {
    id: "",
    type: "embed",
    provider: node.attrs.provider || "youtube",
    url: node.attrs.url || "",
    title: node.attrs.title || "",
    aspectRatio: node.attrs.aspectRatio || "16:9",
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<EmbedBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper className="tiptap-block-wrapper" data-type="embed-block">
      <React.Suspense
        fallback={
          <div
            className="p-4 rounded-lg animate-pulse h-48 flex items-center justify-center"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            Loading embed...
          </div>
        }
      >
        <div
          className="p-4 rounded-lg border"
          style={{
            background: "var(--color-linear-bg-secondary)",
            borderColor: "var(--color-linear-border-primary)",
          }}
        >
          <EmbedBlockComponent block={block} onChange={handleChange} />
        </div>
      </React.Suspense>
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embedBlock: {
      insertEmbedBlock: () => ReturnType;
    };
  }
}

export const EmbedBlockExtension = Node.create({
  name: "embedBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      provider: {
        default: "youtube" as EmbedProvider,
        parseHTML: (element) =>
          (element.getAttribute("data-provider") as EmbedProvider) || "youtube",
        renderHTML: (attributes) => ({
          "data-provider": attributes.provider,
        }),
      },
      url: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-url") || "",
        renderHTML: (attributes) => ({
          "data-url": attributes.url,
        }),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
      aspectRatio: {
        default: "16:9" as "16:9" | "4:3" | "1:1",
        parseHTML: (element) =>
          (element.getAttribute("data-aspect-ratio") as
            | "16:9"
            | "4:3"
            | "1:1") || "16:9",
        renderHTML: (attributes) => ({
          "data-aspect-ratio": attributes.aspectRatio,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="embed-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "embed-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedBlockView);
  },

  addCommands() {
    return {
      insertEmbedBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              provider: "youtube",
              url: "",
              title: "",
              aspectRatio: "16:9",
            },
          });
        },
    };
  },
});
