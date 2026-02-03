import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { CardBlock as CardBlockType, CardStyle } from "~/types/block";

// Lazy load the component
const CardBlockComponent = React.lazy(() =>
  import("~/components/blocks/CardBlock").then((m) => ({
    default: m.CardBlock,
  }))
);

// NodeView component
function CardBlockView({ node, updateAttributes }: NodeViewProps) {
  const block: CardBlockType = {
    id: "",
    type: "card",
    title: node.attrs.title || "",
    content: node.attrs.content || "",
    emoji: node.attrs.emoji || "",
    cardStyle: node.attrs.cardStyle || "default",
    bgColor: node.attrs.bgColor || "",
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<CardBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper className="tiptap-block-wrapper" data-type="card-block">
      <React.Suspense
        fallback={
          <div
            className="p-4 rounded-lg animate-pulse h-32 flex items-center justify-center"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            Loading card...
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
          <CardBlockComponent block={block} onChange={handleChange} />
        </div>
      </React.Suspense>
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cardBlock: {
      insertCardBlock: () => ReturnType;
    };
  }
}

export const CardBlockExtension = Node.create({
  name: "cardBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") || "",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
      content: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-content") || "",
        renderHTML: (attributes) => ({
          "data-content": attributes.content,
        }),
      },
      emoji: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-emoji") || "",
        renderHTML: (attributes) => ({
          "data-emoji": attributes.emoji,
        }),
      },
      cardStyle: {
        default: "default" as CardStyle,
        parseHTML: (element) =>
          (element.getAttribute("data-card-style") as CardStyle) || "default",
        renderHTML: (attributes) => ({
          "data-card-style": attributes.cardStyle,
        }),
      },
      bgColor: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-bg-color") || "",
        renderHTML: (attributes) => ({
          "data-bg-color": attributes.bgColor,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="card-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "card-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardBlockView);
  },

  addCommands() {
    return {
      insertCardBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              title: "",
              content: "",
              emoji: "",
              cardStyle: "default",
              bgColor: "",
            },
          });
        },
    };
  },
});
