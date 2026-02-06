import * as React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { MermaidBlock as MermaidBlockType } from "~/types/block";
import { BlockToolbar } from "~/components/editor/BlockToolbar";

// Lazy load the component (Mermaid is heavy)
const MermaidBlockComponent = React.lazy(() =>
  import("~/components/blocks/MermaidBlock").then((m) => ({
    default: m.MermaidBlock,
  }))
);

const DEFAULT_DIAGRAM = `graph TD
  A[Start] --> B[End]`;

// NodeView component
function MermaidBlockView({
  node,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) {
  // Generate a unique ID for this block instance
  const blockId = React.useRef(
    `mermaid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const block: MermaidBlockType = {
    id: blockId.current,
    type: "mermaid",
    title: node.attrs.title || "",
    diagram: node.attrs.diagram || DEFAULT_DIAGRAM,
    createdAt: 0,
    updatedAt: 0,
    order: 0,
  };

  const handleChange = React.useCallback(
    (updates: Partial<MermaidBlockType>) => {
      updateAttributes(updates);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper
      className="tiptap-block-wrapper"
      data-type="mermaid-block"
      data-label="Mermaid"
    >
      <BlockToolbar editor={editor} node={node} getPos={getPos} />
      <React.Suspense
        fallback={
          <div
            className="p-4 rounded-lg animate-pulse h-48 flex items-center justify-center"
            style={{ background: "var(--color-linear-bg-secondary)" }}
          >
            Loading diagram...
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
          <MermaidBlockComponent block={block} onChange={handleChange} />
        </div>
      </React.Suspense>
    </NodeViewWrapper>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mermaidBlock: {
      insertMermaidBlock: () => ReturnType;
    };
  }
}

export const MermaidBlockExtension = Node.create({
  name: "mermaidBlock",
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
      diagram: {
        default: DEFAULT_DIAGRAM,
        parseHTML: (element) =>
          element.getAttribute("data-diagram") || DEFAULT_DIAGRAM,
        renderHTML: (attributes) => ({
          "data-diagram": attributes.diagram,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="mermaid-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "mermaid-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidBlockView);
  },

  addCommands() {
    return {
      insertMermaidBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              title: "",
              diagram: DEFAULT_DIAGRAM,
            },
          });
        },
    };
  },
});
